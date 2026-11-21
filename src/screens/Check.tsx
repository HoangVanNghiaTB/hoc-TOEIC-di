import { useEffect, useMemo, useRef, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { gradeWord } from '../lib/srs'
import { planFor } from '../lib/plan'
import { PASS_RATE, recordCheckResult, recordStat, sessionKey, togglePlanTask, useStore } from '../lib/store'
import { sfx, speak, ttsSupported } from '../lib/audio'

type Kind = 'mean' | 'ipa' | 'spell' | 'use' | 'rev'
type Opt = { text: string; w: Word }
type Q = { w: Word; kind: Kind; prompt: string; sub?: string; opts: Opt[]; a: number; speakIt?: boolean; typed?: boolean }

const KIND_NAME: Record<Kind, string> = {
  mean: 'Nhớ nghĩa',
  ipa: 'Phiên âm',
  spell: 'Nghe & viết',
  use: 'Áp dụng',
  rev: 'Mặt chữ',
}
const KIND_HELP: Record<Kind, string> = {
  mean: 'Chọn nghĩa tiếng Việt đúng',
  ipa: 'Nghe từ rồi chọn phiên âm đúng',
  spell: 'Nghe từ và gõ lại đúng chính tả',
  use: 'Chọn từ điền vào chỗ trống',
  rev: 'Nhìn nghĩa tiếng Việt, gõ từ tiếng Anh',
}

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

function blank(w: Word): string | null {
  const re = new RegExp(`\\b${esc(w.en)}\\w*`, 'i')
  return re.test(w.ex) ? w.ex.replace(re, '_____') : null
}

/** Chọn 3 từ gây nhiễu (ưu tiên cùng loại từ) có giá trị `pick` khác nhau và khác đáp án. */
function choices(w: Word, pick: (x: Word) => string): { opts: Opt[]; a: number } | null {
  const same = WORDS.filter((x) => x.id !== w.id)
  const pool = shuffle(same.filter((x) => x.pos === w.pos)).concat(shuffle(same))
  const seen = new Set([pick(w)])
  const wrong: Word[] = []
  for (const x of pool) {
    const v = pick(x)
    if (!v || seen.has(v)) continue
    seen.add(v)
    wrong.push(x)
    if (wrong.length === 3) break
  }
  if (wrong.length < 3) return null
  const opts = shuffle([w, ...wrong]).map((x) => ({ text: pick(x), w: x }))
  return { opts, a: opts.findIndex((o) => o.w.id === w.id) }
}

function makeQ(w: Word, kind: Kind): Q | null {
  if (kind === 'mean') {
    const c = choices(w, (x) => x.vi)
    return c && { w, kind, prompt: w.en, sub: w.pos, ...c }
  }
  if (kind === 'ipa') {
    if (!ttsSupported()) return null
    const c = choices(w, (x) => x.ipa)
    return c && { w, kind, prompt: '🔊 Nghe và chọn phiên âm', speakIt: true, ...c }
  }
  if (kind === 'use') {
    const sent = blank(w)
    const c = sent && choices(w, (x) => x.en)
    return c && sent ? { w, kind, prompt: sent, sub: w.exVi, ...c } : null
  }
  if (kind === 'spell') {
    return ttsSupported() ? { w, kind, prompt: '🔊 Nghe và gõ từ bạn nghe được', opts: [], a: 0, speakIt: true, typed: true } : null
  }
  return { w, kind, prompt: w.vi, sub: `${w.pos} · ${w.en.length} chữ cái`, opts: [], a: 0, typed: true }
}

const ALL_KINDS: Kind[] = ['mean', 'ipa', 'spell', 'use', 'rev']

/** Tô các chữ cái đúng/thiếu của từ đúng so với chữ bạn gõ (LCS theo ký tự). */
function letterDiff(correct: string, typed: string): { ch: string; ok: boolean }[] {
  const a = correct.toLowerCase()
  const b = typed.toLowerCase()
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const okIdx = new Set<number>()
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      okIdx.add(i)
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return correct.split('').map((ch, k) => ({ ch, ok: okIdx.has(k) }))
}

export default function Check({ mode, goBack }: { mode: 'new' | 'review'; goBack: () => void }) {
  const s = useStore()
  const [round, setRound] = useState(0)

  const pool = useMemo(() => {
    const cards = s.cards
    const learned = (w: Word) => cards[w.id] && cards[w.id].reps > 0
    const byId = new Map(WORDS.map((w) => [w.id, w]))
    if (mode === 'new') {
      const cur = (s.sessionWords[String(s.sessionNo)] ?? []).map((id) => byId.get(id)).filter(Boolean) as Word[]
      if (cur.length >= 3) return cur
      // chưa đủ từ trong buổi này: bổ sung bằng các từ học gần nhất
      const extra = WORDS.filter((w) => learned(w) && !cur.includes(w)).sort((a, b) => (cards[b.id].at ?? 0) - (cards[a.id].at ?? 0))
      return [...cur, ...extra].slice(0, 6)
    }
    // ôn các buổi trước: lấy ngẫu nhiên từ MỌI buổi trước, không chỉ buổi liền kề
    const prev = Object.entries(s.sessionWords)
      .filter(([k]) => Number(k) < s.sessionNo)
      .flatMap(([, ids]) => ids)
      .map((id) => byId.get(id))
      .filter((w): w is Word => !!w && !!learned(w))
    if (prev.length >= 3) return [...new Set(prev)]
    const curIds = new Set(s.sessionWords[String(s.sessionNo)] ?? [])
    return WORDS.filter((w) => learned(w) && !curIds.has(w.id))
    // chốt danh sách khi vào màn hình, không đổi giữa chừng
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, round])

  const qs = useMemo(() => {
    if (mode === 'new') {
      const words = shuffle(pool).slice(0, 6)
      return words.flatMap((w) => {
        const first: Kind = Math.random() < 0.5 ? 'mean' : 'rev'
        return ([first, 'ipa', 'spell', 'use'] as Kind[]).map((k) => makeQ(w, k)).filter((x): x is Q => !!x)
      })
    }
    // ôn lại: mỗi từ 2 hình thức ngẫu nhiên, trộn thứ tự câu
    const n = Math.min(12, 6 + s.sessionNo, pool.length)
    const out: Q[] = []
    for (const w of shuffle(pool).slice(0, n)) {
      let got = 0
      for (const k of shuffle(ALL_KINDS)) {
        const q = makeQ(w, k)
        if (q) {
          out.push(q)
          got++
        }
        if (got === 2) break
      }
    }
    return shuffle(out)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, round])

  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [typedWas, setTypedWas] = useState('')
  const [log, setLog] = useState<{ q: Q; ok: boolean }[]>([])
  const finished = useRef(false)
  const [passed, setPassed] = useState<boolean | null>(null)

  const q = qs[i]
  useEffect(() => {
    if (!q?.speakIt) return
    const t = setTimeout(() => void speak(q.w.en, 'en', 0.9), 300)
    return () => clearTimeout(t)
  }, [q])

  // Khi làm xong: từ sai quay lại hàng ôn; đánh dấu mục kế hoạch tương ứng đã xong.
  useEffect(() => {
    if (q || log.length === 0 || finished.current) return
    finished.current = true
    new Set(log.filter((x) => !x.ok).map((x) => x.q.w.id)).forEach((id) => gradeWord(id, 0))
    const ids = planFor(s.sessionNo, s.settings.newPerDay, s.settings.planMin).tasks.map((t) => t.id)
    const pct = log.filter((x) => x.ok).length / log.length
    setPassed(recordCheckResult(sessionKey(s.sessionNo), mode === 'new' ? 'vcheck' : 'rcheck', pct, ids))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, log.length])

  if (pool.length < 3 || qs.length === 0)
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow">
        <div className="text-4xl">🃏</div>
        <p className="mt-2 font-bold">Chưa đủ từ để kiểm tra</p>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'new' ? 'Hãy học ít nhất 3 từ mới ở bước “Học từ vựng bằng thẻ” rồi quay lại.' : 'Chưa có đủ từ ở các buổi trước để ôn. Hãy học thêm từ mới ở các buổi tới.'}
        </p>
        <button onClick={goBack} className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">Quay lại</button>
        {mode === 'review' && (
          <button
            onClick={() => {
              togglePlanTask(sessionKey(s.sessionNo), 'rcheck', planFor(s.sessionNo, s.settings.newPerDay, s.settings.planMin).tasks.map((t) => t.id), true)
              goBack()
            }}
            className="ml-2 mt-4 rounded-2xl bg-slate-200 px-6 py-3 font-bold"
          >
            Bỏ qua bước này
          </button>
        )}
      </div>
    )

  if (!q) {
    const by = (k: Kind) => ({ ok: log.filter((x) => x.q.kind === k && x.ok).length, total: log.filter((x) => x.q.kind === k).length })
    const missed = [...new Map(log.filter((x) => !x.ok).map((x) => [x.q.w.id, x.q.w])).values()]
    const okAll = log.filter((x) => x.ok).length
    return (
      <div className="space-y-3">
        <div className="pop rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-6 text-white shadow-lg">
          <div className="text-center text-sm opacity-80">{mode === 'new' ? 'Kết quả kiểm tra từ vừa học' : 'Kết quả ôn các buổi trước'}</div>
          <div className="mt-1 text-center text-4xl font-extrabold">{okAll}/{log.length}</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-5">
            {ALL_KINDS.map((k) => {
              const r = by(k)
              return r.total ? (
                <div key={k} className="rounded-2xl bg-white/15 p-2">
                  <div className="text-xl font-extrabold">{r.ok}/{r.total}</div>
                  <div className="text-[11px] opacity-90">{KIND_NAME[k]}</div>
                </div>
              ) : null
            })}
          </div>
          <p className="mt-3 rounded-2xl bg-white/20 px-3 py-2 text-center text-sm font-bold">
            {passed
              ? `✅ Đạt ${Math.round((okAll / log.length) * 100)}% (cần từ ${PASS_RATE * 100}%). Mục kiểm tra đã hoàn thành.`
              : `❌ Mới đạt ${Math.round((okAll / log.length) * 100)}%, cần từ ${PASS_RATE * 100}% mới hoàn thành. Các từ sai đã quay về hàng ôn thẻ: xem lại chúng rồi kiểm tra lượt khác.`}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow">
          <h3 className="font-bold">{missed.length ? `Cần học lại (${missed.length} từ)` : 'Tuyệt vời, nhớ hết! 🎉'}</h3>
          {missed.length > 0 && <p className="text-xs text-slate-400">Các từ này đã được đưa lại vào hàng ôn thẻ.</p>}
          <div className="mt-2 space-y-2">
            {missed.map((w) => (
              <div key={w.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                <button onClick={() => void speak(w.en, 'en', 0.9)} className="font-bold text-indigo-700">🔊 {w.en}</button>
                <span className="ml-1 text-slate-400">{w.ipa} ({w.pos})</span>
                <div>{w.vi}</div>
                <div className="text-xs text-slate-500">{w.ex} — {w.exVi}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              finished.current = false
              setPassed(null)
              setRound((r) => r + 1)
              setI(0)
              setPick(null)
              setTyped('')
              setLog([])
            }}
            className="flex-1 rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow"
          >
            {passed ? 'Kiểm tra thêm lượt khác' : 'Làm lại lượt khác'}
          </button>
          <button onClick={goBack} className="flex-1 rounded-2xl bg-slate-200 py-3 font-bold">Về kế hoạch</button>
        </div>
      </div>
    )
  }

  const say = () => void speak(q.w.en, 'en', 0.9)

  function record(ok: boolean) {
    recordStat(`v-${q.kind}`, ok, ok ? (q.typed ? 3 : 2) : 0)
    if (ok) sfx.good()
    else sfx.bad()
    setLog((l) => [...l, { q, ok }])
  }

  function choose(k: number) {
    if (pick !== null) return
    setPick(k)
    record(k === q.a)
  }

  function submitTyped() {
    if (pick !== null || !typed.trim()) return
    const ok = norm(typed) === norm(q.w.en)
    setTypedWas(typed.trim())
    setPick(ok ? 1 : 0)
    record(ok)
  }

  function next() {
    setI((n) => n + 1)
    setPick(null)
    setTyped('')
  }

  /** Giải thích từng đáp án: nó thuộc từ nào, nghĩa/phiên âm/loại từ ra sao, vì sao đúng hoặc sai. */
  function why(o: Opt, isRight: boolean): string {
    const w = o.w
    if (q.kind === 'mean')
      return isRight
        ? `Đúng: “${w.en}” ${w.ipa} (${w.pos}) nghĩa là “${w.vi}”.`
        : `Sai: “${o.text}” là nghĩa của từ “${w.en}” ${w.ipa} (${w.pos}), không phải của “${q.w.en}”.`
    if (q.kind === 'ipa')
      return isRight
        ? `Đúng: ${o.text} là phiên âm của “${w.en}” (${w.vi}).`
        : `Sai: ${o.text} là phiên âm của “${w.en}” (${w.vi}), cách đọc khác với “${q.w.en}” ${q.w.ipa}.`
    if (isRight) return `Đúng: “${w.en}” ${w.ipa} (${w.pos}) = ${w.vi}, hợp nghĩa của câu.`
    const posNote = w.pos !== q.w.pos ? ` Là ${w.pos}, trong khi chỗ trống cần ${q.w.pos}.` : ''
    return `Sai: “${w.en}” ${w.ipa} (${w.pos}) = ${w.vi}, không hợp nghĩa của câu.${posNote}`
  }

  const typedWrongOther = pick === 0 ? WORDS.find((x) => norm(x.en) === norm(typedWas) && x.id !== q.w.id) : undefined

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <button onClick={goBack} className="text-indigo-600">← Thoát</button>
        <span>{mode === 'new' ? 'Từ vừa học' : '🔁 Ôn các buổi trước'} · Câu {i + 1}/{qs.length}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(i / qs.length) * 100}%` }} />
      </div>

      <div className="rounded-3xl bg-white p-5 text-center shadow">
        <div className="text-xs font-bold text-indigo-600">{KIND_NAME[q.kind]} · {KIND_HELP[q.kind]}</div>
        {q.speakIt ? (
          <button onClick={say} className="mt-3 rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow">{q.prompt}</button>
        ) : (
          <p className="mt-3 text-2xl font-extrabold leading-snug">{q.prompt}</p>
        )}
        {q.sub && q.kind !== 'use' && <p className="mt-1 text-sm text-slate-400">({q.sub})</p>}
        {q.sub && q.kind === 'use' && pick !== null && <p className="mt-2 text-sm text-slate-500">{q.sub}</p>}
      </div>

      {q.typed ? (
        <div className="space-y-2">
          {q.speakIt && (
            <div className="flex gap-2">
              <button onClick={say} className="flex-1 rounded-2xl bg-slate-100 py-2 text-sm font-bold">🔊 Nghe lại</button>
              <button onClick={() => void speak(q.w.en, 'en', 0.6)} className="flex-1 rounded-2xl bg-slate-100 py-2 text-sm font-bold">🐢 Nghe chậm</button>
            </div>
          )}
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitTyped()}
            disabled={pick !== null}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={q.kind === 'rev' ? 'Gõ từ tiếng Anh…' : 'Gõ từ bạn nghe được…'}
            className={`w-full rounded-2xl border-2 bg-white p-4 text-lg outline-none ${pick === null ? 'border-indigo-200 focus:border-indigo-500' : pick === 1 ? 'border-emerald-500' : 'border-rose-500'}`}
          />
          {pick === null && (
            <button onClick={submitTyped} disabled={!typed.trim()} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300">Kiểm tra</button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {q.opts.map((o, k) => {
            const state = pick === null ? '' : k === q.a ? 'border-emerald-500 bg-emerald-50' : k === pick ? 'border-rose-500 bg-rose-50' : 'opacity-70'
            return (
              <button key={k} onClick={() => choose(k)} className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-left font-semibold shadow-sm ${state || 'border-transparent active:scale-95'}`}>
                {'ABCD'[k]}. {o.text}
              </button>
            )
          })}
        </div>
      )}

      {pick !== null && (
        <div className="pop space-y-2 rounded-3xl bg-white p-4 shadow">
          <div className="text-sm">
            <button onClick={say} className="font-bold text-indigo-700">🔊 {q.w.en}</button> <span className="text-slate-400">{q.w.ipa} ({q.w.pos})</span> = {q.w.vi}
          </div>
          <div className="text-xs text-slate-500">{q.w.ex} — {q.w.exVi}</div>

          {q.typed ? (
            <div className="space-y-1 rounded-2xl bg-slate-50 p-3 text-sm">
              <div>
                Mặt chữ đúng:{' '}
                <span className="font-mono text-lg font-bold">
                  {letterDiff(q.w.en, typedWas || q.w.en).map((c, k) => (
                    <span key={k} className={pick === 1 || c.ok ? 'text-emerald-600' : 'rounded bg-rose-100 text-rose-600'}>{c.ch}</span>
                  ))}
                </span>
              </div>
              {pick === 0 && (
                <div>
                  Bạn gõ: <b className="text-rose-600">{typedWas}</b>
                  {typedWrongOther ? ` — đó là từ khác: “${typedWrongOther.en}” ${typedWrongOther.ipa} (${typedWrongOther.pos}) = ${typedWrongOther.vi}.` : ' — chữ đỏ là chữ cái bạn bị thiếu hoặc sai vị trí.'}
                </div>
              )}
              {pick === 1 && <div className="text-emerald-700">Chính xác!</div>}
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-400">Giải thích từng đáp án</div>
              {q.opts.map((o, k) => (
                <div key={k} className={`rounded-xl px-3 py-2 text-xs ${k === q.a ? 'bg-emerald-50 text-emerald-800' : k === pick ? 'bg-rose-50 text-rose-800' : 'bg-slate-50 text-slate-600'}`}>
                  <b>{'ABCD'[k]}.</b> {why(o, k === q.a)}
                </div>
              ))}
            </div>
          )}
          <button onClick={next} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white">{i + 1 >= qs.length ? 'Xem kết quả' : 'Câu tiếp theo'}</button>
        </div>
      )}
    </div>
  )
}
