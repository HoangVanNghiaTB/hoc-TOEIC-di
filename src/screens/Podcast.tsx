import { useEffect, useMemo, useRef, useState } from 'react'
import { loadPodcastIndex, fmtTime, playRange, wordCount } from '../lib/podcast'
import type { PChunk, PEpisode, PIndex, PSentence } from '../lib/podcast'
import { WORDS } from '../data/words'
import { diffSentence } from '../lib/diff'
import type { DiffResult } from '../lib/diff'
import { markChunkDone, recordStat, setCard, useStore } from '../lib/store'
import { newCard } from '../lib/srs'
import { draftNote } from '../lib/notesBus'
import { sfx, speak } from '../lib/audio'
import FlagButton from './FlagButton'

const VOCAB = new Map(WORDS.filter((w) => !w.en.includes(' ')).map((w) => [w.en.toLowerCase(), w.vi]))
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** Hiển thị một câu, gạch chân các từ có trong kho từ vựng của bạn (rê chuột / giữ để xem nghĩa). */
function Sentence({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((tok, i) => {
        const w = tok.toLowerCase().replace(/[^a-z']/g, '')
        const vi = w ? VOCAB.get(w) : undefined
        return vi ? (
          <span key={i} title={vi} className="underline decoration-indigo-400 decoration-dotted underline-offset-2">
            {tok}
          </span>
        ) : (
          <span key={i}>{tok}</span>
        )
      })}
    </>
  )
}

export default function Podcast({ goBack }: { goBack: () => void }) {
  const s = useStore()
  const [idx, setIdx] = useState<PIndex | null | undefined>(undefined)
  const [epId, setEpId] = useState<string | null>(null)
  const [chunkId, setChunkId] = useState<string | null>(null)

  useEffect(() => {
    void loadPodcastIndex().then(setIdx)
  }, [])

  if (idx === undefined) return <div className="rounded-3xl bg-white p-6 text-center shadow">Đang tải danh sách podcast…</div>

  if (idx === null) {
    return (
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">🎙️ Podcast của tôi</h2>
        <p className="text-sm text-slate-600">
          Chưa có đoạn podcast nào được cắt sẵn. Các file mp3 cần được xử lý (cắt thành đoạn ngắn và chép lời) rồi đặt vào thư mục <b>public/podcasts</b>.
        </p>
        <button onClick={goBack} className="rounded-2xl bg-slate-200 px-5 py-2 font-bold">Quay lại</button>
      </div>
    )
  }

  const ep = idx.episodes.find((e) => e.id === epId)
  const chunk = ep?.chunks.find((c) => c.id === chunkId)

  if (ep && chunk) {
    const i = ep.chunks.findIndex((c) => c.id === chunk.id)
    return (
      <ChunkView
        key={chunk.id}
        ep={ep}
        chunk={chunk}
        index={i}
        onBack={() => setChunkId(null)}
        onNext={() => setChunkId(ep.chunks[i + 1]?.id ?? null)}
        hasNext={i + 1 < ep.chunks.length}
      />
    )
  }

  if (ep) {
    const done = ep.chunks.filter((c) => s.podcastDone[c.id]).length
    const next = ep.chunks.find((c) => !s.podcastDone[c.id])
    return (
      <div className="space-y-3">
        <button onClick={() => setEpId(null)} className="text-sm text-indigo-600">← Danh sách tập</button>
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-lg font-extrabold">{ep.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Mức {ep.level.toUpperCase() || '—'} · {Math.round(ep.duration / 60)} phút · đã nghe {done}/{ep.chunks.length} đoạn
          </p>
          {next && (
            <button onClick={() => setChunkId(next.id)} className="mt-3 w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow">
              ▶ Nghe tiếp: đoạn {ep.chunks.indexOf(next) + 1}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {ep.chunks.map((c, k) => (
            <button
              key={c.id}
              onClick={() => setChunkId(c.id)}
              className={`rounded-2xl px-3 py-3 text-left shadow-sm ${s.podcastDone[c.id] ? 'bg-emerald-50' : 'bg-white'}`}
            >
              <div className="font-bold">
                {s.podcastDone[c.id] ? '✅' : '🎧'} Đoạn {k + 1}
              </div>
              <div className="text-xs text-slate-400">
                {fmtTime(c.dur)} · {c.sentences.length} câu
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">🎙️ Podcast của tôi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Các tập đã được cắt thành đoạn ngắn (khoảng 1 phút) kèm lời chép tự động. Nghe, chép chính tả từng câu, hoặc nhại theo. Lời chép do máy nhận dạng nên có thể sai vài chữ: hãy bấm “Báo sai” khi thấy.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
      {idx.episodes.map((e) => {
        const done = e.chunks.filter((c) => s.podcastDone[c.id]).length
        return (
          <button key={e.id} onClick={() => setEpId(e.id)} className="block w-full rounded-2xl border border-transparent bg-white px-4 py-4 text-left shadow-sm transition hover:border-indigo-400">
            <div className="font-bold">{e.title}</div>
            <div className="mt-1 text-xs text-slate-400">
              {e.level.toUpperCase() || '—'} · {Math.round(e.duration / 60)} phút · {done}/{e.chunks.length} đoạn
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-indigo-500" style={{ width: `${(done / e.chunks.length) * 100}%` }} />
            </div>
          </button>
        )
      })}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Một đoạn
function ChunkView({ ep, chunk, index, onBack, onNext, hasNext }: { ep: PEpisode; chunk: PChunk; index: number; onBack: () => void; onNext: () => void; hasNext: boolean }) {
  const s = useStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const token = useRef({ v: 0 })
  const [tab, setTab] = useState<'listen' | 'cloze' | 'dict' | 'shadow' | 'study'>('listen')
  const [rate, setRate] = useState(1)
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const a = audioRef.current
    return () => {
      token.current.v += 1
      a?.pause()
    }
  }, [])

  function stopRange() {
    token.current.v += 1
    audioRef.current?.pause()
  }

  const done = !!s.podcastDone[chunk.id]

  return (
    <div className="space-y-3">
      <audio
        ref={audioRef}
        src={`/podcasts/${chunk.file}`}
        preload="auto"
        onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="flex items-center justify-between">
        <button onClick={() => { stopRange(); onBack() }} className="text-sm text-indigo-600">← {ep.title.slice(0, 28)}{ep.title.length > 28 ? '…' : ''}</button>
        <span className="text-sm font-bold text-slate-500">Đoạn {index + 1}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {([['listen', '🎧 Nghe'], ['cloze', '🧩 Điền từ'], ['dict', '✍️ Chép'], ['shadow', '🗣️ Nhại'], ['study', '📚 Học']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => { stopRange(); setTab(id) }}
            className={`min-w-[30%] flex-1 rounded-2xl py-2.5 text-sm font-bold ${tab === id ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'listen' && (
        <ListenPane
          chunk={chunk}
          audio={audioRef}
          token={token}
          rate={rate}
          setRate={setRate}
          pos={pos}
          playing={playing}
          showText={showText}
          setShowText={setShowText}
          epTitle={ep.title}
          done={done}
          hasNext={hasNext}
          onFinish={() => { stopRange(); markChunkDone(chunk.id); sfx.win(); if (hasNext) onNext(); else onBack() }}
        />
      )}
      {tab === 'cloze' && <ClozePane chunk={chunk} audio={audioRef} token={token} rate={rate} setRate={setRate} />}
      {tab === 'study' && <StudyPane chunk={chunk} epTitle={ep.title} />}
      {tab === 'dict' && <DictPane chunk={chunk} audio={audioRef} token={token} rate={rate} setRate={setRate} />}
      {tab === 'shadow' && <ShadowPane chunk={chunk} audio={audioRef} token={token} rate={rate} setRate={setRate} epTitle={ep.title} />}
    </div>
  )
}

type PaneAudio = { audio: React.RefObject<HTMLAudioElement | null>; token: React.RefObject<{ v: number }>; rate: number; setRate: (r: number) => void }

const RATES = [0.75, 0.9, 1, 1.15]
function RateChips({ rate, setRate }: { rate: number; setRate: (r: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      {RATES.map((r) => (
        <button key={r} onClick={() => setRate(r)} className={`rounded-full px-3 py-1 ${rate === r ? 'bg-indigo-100 font-bold text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
          {r}x
        </button>
      ))}
    </div>
  )
}

function ListenPane(p: PaneAudio & { chunk: PChunk; pos: number; playing: boolean; showText: boolean; setShowText: (v: boolean) => void; epTitle: string; done: boolean; hasNext: boolean; onFinish: () => void }) {
  const a = () => p.audio.current
  const active = p.chunk.sentences.findIndex((x) => p.pos >= x.s && p.pos < x.e)

  function toggle() {
    const el = a()
    if (!el) return
    p.token.current.v += 1
    el.playbackRate = p.rate
    if (el.paused) void el.play()
    else el.pause()
  }
  function seek(d: number) {
    const el = a()
    if (el) el.currentTime = Math.min(Math.max(0, el.currentTime + d), p.chunk.dur)
  }
  function playSentence(x: PSentence) {
    const el = a()
    if (el) void playRange(el, x.s, x.e, p.rate, p.token.current)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 shadow">
        <input
          type="range"
          min={0}
          max={p.chunk.dur}
          step={0.1}
          value={Math.min(p.pos, p.chunk.dur)}
          onChange={(e) => { const el = a(); if (el) el.currentTime = Number(e.target.value) }}
          className="w-full"
          aria-label="Vị trí phát"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{fmtTime(p.pos)}</span>
          <span>{fmtTime(p.chunk.dur)}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={() => seek(-5)} className="rounded-2xl bg-slate-100 px-4 py-3">⏪ 5s</button>
          <button onClick={toggle} className="rounded-2xl bg-indigo-600 px-8 py-3 text-lg font-bold text-white shadow">
            {p.playing ? '⏸ Dừng' : '▶ Phát'}
          </button>
          <button onClick={() => seek(5)} className="rounded-2xl bg-slate-100 px-4 py-3">5s ⏩</button>
        </div>
        <div className="mt-3"><RateChips rate={p.rate} setRate={(r) => { p.setRate(r); const el = a(); if (el) el.playbackRate = r }} /></div>
      </div>

      <button onClick={() => p.setShowText(!p.showText)} className="w-full rounded-2xl bg-white py-3 font-bold text-slate-600 shadow-sm">
        {p.showText ? '🙈 Ẩn lời chép (nghe thuần)' : '👁️ Hiện lời chép'}
      </button>

      {p.showText && (
        <div className="space-y-2 rounded-3xl bg-white p-4 shadow">
          <p className="text-xs text-slate-400">Chạm một câu để nghe lại riêng câu đó. Từ gạch chấm là từ có trong kho từ vựng của bạn.</p>
          {p.chunk.sentences.map((x, i) => (
            <div key={i} className={`rounded-2xl p-3 text-[15px] leading-relaxed ${i === active ? 'bg-indigo-50' : 'bg-slate-50'}`}>
              <button onClick={() => playSentence(x)} className="mr-2 text-indigo-600">🔊</button>
              <Sentence text={x.t} />
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => draftNote({ title: `Podcast: ${p.epTitle}`, body: `"${x.t}"\n\n--- Dán giải thích từ AI vào dưới đây. Đặt từ khóa trong [[ ]] để web ẩn đi khi ôn ---\n`, tags: ['podcast'] })}
                  className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                >
                  📝 Ghi chú
                </button>
                <FlagButton id={`p:${p.chunk.id}#${i}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={p.onFinish} className="w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white shadow">
        {p.done ? '✔ Đã nghe xong — ' : ''}
        {p.hasNext ? 'Hoàn thành & sang đoạn sau' : 'Hoàn thành đoạn cuối'}{p.done ? '' : ' (+8 XP)'}
      </button>
    </div>
  )
}

function DictPane(p: PaneAudio & { chunk: PChunk }) {
  const items = useMemo(() => p.chunk.sentences.filter((x) => { const n = wordCount(x.t); return n >= 4 && n <= 22 && x.e - x.s <= 12 }), [p.chunk])
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [res, setRes] = useState<DiffResult | null>(null)
  const [scores, setScores] = useState<number[]>([])

  const cur = items[i]

  function play() {
    const el = p.audio.current
    if (el && cur) void playRange(el, cur.s - 0.1, cur.e + 0.15, p.rate, p.token.current)
  }

  useEffect(() => {
    if (!cur) return
    const t = setTimeout(play, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  if (items.length === 0) return <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow">Đoạn này không có câu phù hợp để chép. Hãy chọn đoạn khác.</div>

  if (!cur) {
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0
    return (
      <div className="pop rounded-3xl bg-white p-6 text-center shadow">
        <div className="text-5xl">🎧</div>
        <h3 className="mt-2 text-lg font-extrabold">Xong phần chép!</h3>
        <p className="mt-1 text-2xl font-extrabold text-indigo-600">{avg}% chính xác</p>
        <button onClick={() => { setI(0); setScores([]); setText(''); setRes(null) }} className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">Làm lại</button>
      </div>
    )
  }

  function check() {
    const r = diffSentence(cur.t, text)
    setRes(r)
    const ok = r.accuracy >= 0.85
    recordStat('l-pod', ok, ok ? 3 : 1)
    setScores((s) => [...s, r.accuracy])
    if (ok) sfx.good(); else sfx.bad()
  }

  function next() {
    setI((k) => k + 1)
    setText('')
    setRes(null)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 text-center shadow">
        <div className="text-xs text-slate-400">Câu {i + 1}/{items.length} · gõ lại câu bạn nghe được</div>
        <button onClick={play} className="mt-3 rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow">🔊 Nghe câu</button>
        <div className="mt-3"><RateChips rate={p.rate} setRate={p.setRate} /></div>
      </div>
      {!res ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Gõ câu bạn nghe được…"
            className="w-full rounded-2xl border-2 border-indigo-200 bg-white p-4 text-lg outline-none focus:border-indigo-500"
          />
          <button onClick={check} disabled={!text.trim()} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300">Kiểm tra</button>
        </>
      ) : (
        <div className="pop space-y-3 rounded-3xl bg-white p-5 shadow">
          <div className="text-center text-2xl font-extrabold">{res.accuracy >= 0.85 ? '✅' : res.accuracy >= 0.6 ? '🟡' : '❌'} {Math.round(res.accuracy * 100)}%</div>
          <p className="text-lg leading-relaxed">
            {res.ref.map((w, k) => (
              <span key={k} className={`mr-1 ${w.ok ? 'text-emerald-600' : 'rounded bg-rose-100 px-1 font-bold text-rose-600'}`}>{w.word}</span>
            ))}
          </p>
          {res.extra.length > 0 && <p className="text-sm text-slate-500">Từ bạn gõ không khớp: <span className="text-rose-500">{res.extra.join(' ')}</span></p>}
          <div className="flex items-center justify-between">
            <FlagButton id={`p:${p.chunk.id}#${p.chunk.sentences.indexOf(cur)}`} />
            <button onClick={play} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">🔊 Nghe lại</button>
          </div>
          <button onClick={next} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white">{i + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp theo'}</button>
        </div>
      )}
    </div>
  )
}

function ShadowPane(p: PaneAudio & { chunk: PChunk; epTitle: string }) {
  const [sel, setSel] = useState(0)
  const [hide, setHide] = useState(false)
  const [busy, setBusy] = useState('')
  const run = useRef(0)

  const sentences = p.chunk.sentences
  const cur = sentences[sel]

  useEffect(() => () => { run.current += 1 }, [])

  async function shadow(times = 3) {
    if (!cur) return
    const my = ++run.current
    const el = p.audio.current
    if (!el) return
    for (let k = 1; k <= times; k++) {
      if (run.current !== my) return
      setBusy(`Nghe lần ${k}/${times}…`)
      await playRange(el, cur.s - 0.1, cur.e + 0.15, p.rate, p.token.current)
      if (run.current !== my) return
      setBusy('🗣️ Đến lượt bạn nói theo…')
      await wait(((cur.e - cur.s) / p.rate) * 1000 + 700)
    }
    if (run.current === my) setBusy('')
  }

  function stop() {
    run.current += 1
    p.token.current.v += 1
    p.audio.current?.pause()
    setBusy('')
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-4 shadow">
        <p className="text-sm text-slate-500">
          Chọn một câu rồi bấm <b>Nhại theo</b>: câu được phát, sau đó có một khoảng lặng đúng bằng độ dài câu để bạn nói theo to thành tiếng, lặp 3 lần.
        </p>
        <div className="mt-3"><RateChips rate={p.rate} setRate={p.setRate} /></div>
      </div>

      <div className="max-h-72 space-y-2 overflow-auto rounded-3xl bg-white p-3 shadow">
        {sentences.map((x, i) => (
          <button
            key={i}
            onClick={() => { stop(); setSel(i) }}
            className={`block w-full rounded-2xl px-3 py-2 text-left text-[15px] ${i === sel ? 'bg-indigo-100' : 'bg-slate-50'}`}
          >
            {hide && i === sel ? <span className="text-slate-400">· · · ({wordCount(x.t)} từ) · · ·</span> : <Sentence text={x.t} />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => void shadow(3)} disabled={!!busy} className="flex-1 rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300">🗣️ Nhại theo ×3</button>
        {busy ? (
          <button onClick={stop} className="rounded-2xl bg-rose-100 px-5 font-bold text-rose-600">Dừng</button>
        ) : (
          <button onClick={() => setHide((h) => !h)} className="rounded-2xl bg-slate-200 px-5 font-bold">{hide ? 'Hiện chữ' : 'Ẩn chữ'}</button>
        )}
      </div>
      {busy && <p className="text-center text-sm text-indigo-600">{busy}</p>}
      <p className="text-center text-xs text-slate-400">Mẹo: ẩn chữ để nhại theo bằng tai, rồi hiện chữ để kiểm tra.</p>
    </div>
  )
}

const STOP = new Set('about after again always because before being between could every first great other should their there these thing think those three through today under until where which while would your really still never might maybe often'.split(' '))

function stems(w: string): string[] {
  const r = [w]
  if (w.endsWith('ing') && w.length > 5) r.push(w.slice(0, -3), w.slice(0, -3) + 'e')
  if (w.endsWith('ed') && w.length > 4) r.push(w.slice(0, -2), w.slice(0, -1))
  if (w.endsWith('es')) r.push(w.slice(0, -2))
  if (w.endsWith('s')) r.push(w.slice(0, -1))
  return r
}

/** Điền từ còn thiếu: nghe câu, câu hiển thị bị ẩn 1 từ nội dung, gõ từ đó. */
function ClozePane(p: PaneAudio & { chunk: PChunk }) {
  const items = useMemo(() => {
    const out: { s: PSentence; idx: number; word: string }[] = []
    p.chunk.sentences.forEach((x) => {
      const n = wordCount(x.t)
      if (n < 5 || n > 24 || x.e - x.s > 14) return
      const toks = x.t.split(/\s+/)
      const cand = toks
        .map((t, i) => ({ i, w: t.replace(/[^A-Za-z']/g, '') }))
        .filter((c) => c.w.length >= 5 && !STOP.has(c.w.toLowerCase()))
      if (!cand.length) return
      // ưu tiên từ nằm trong kho từ vựng, sau đó từ dài
      const inVocab = (w: string) => Number(stems(w.toLowerCase()).some((z) => VOCAB.has(z)))
      cand.sort((a, b) => inVocab(b.w) - inVocab(a.w) || b.w.length - a.w.length)
      out.push({ s: x, idx: cand[0].i, word: cand[0].w })
    })
    return out
  }, [p.chunk])
  const [i, setI] = useState(0)
  const [val, setVal] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  const [right, setRight] = useState(0)
  const cur = items[i]

  function play() {
    const el = p.audio.current
    if (el && cur) void playRange(el, cur.s.s - 0.1, cur.s.e + 0.15, p.rate, p.token.current)
  }
  useEffect(() => {
    if (!cur) return
    const t = setTimeout(play, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  if (!items.length) return <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow">Đoạn này không có câu phù hợp. Hãy chọn đoạn khác.</div>
  if (!cur)
    return (
      <div className="pop rounded-3xl bg-white p-6 text-center shadow">
        <div className="text-5xl">🧩</div>
        <h3 className="mt-2 text-lg font-extrabold">Đúng {right}/{items.length} từ</h3>
        <button onClick={() => { setI(0); setRight(0); setVal(''); setOk(null) }} className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">Làm lại</button>
      </div>
    )

  const toks = cur.s.t.split(/\s+/)
  function check() {
    const good = val.trim().toLowerCase() === cur.word.toLowerCase()
    setOk(good)
    if (good) setRight((r) => r + 1)
    recordStat('l-pod', good, good ? 2 : 0)
    if (good) sfx.good(); else sfx.bad()
  }
  function next() { setI((k) => k + 1); setVal(''); setOk(null) }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 text-center shadow">
        <div className="text-xs text-slate-400">Câu {i + 1}/{items.length} · nghe rồi điền từ còn thiếu</div>
        <button onClick={play} className="mt-3 rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow">🔊 Nghe câu</button>
        <div className="mt-3"><RateChips rate={p.rate} setRate={p.setRate} /></div>
        <p className="mt-4 text-left text-lg leading-relaxed">
          {toks.map((t, k) =>
            k === cur.idx ? (
              <span key={k} className={`mx-0.5 rounded px-2 font-bold ${ok === null ? 'bg-indigo-100 text-indigo-700' : ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {ok === null ? '_____' : t}
              </span>
            ) : (
              <span key={k} className="mr-1">{t}</span>
            ),
          )}
        </p>
      </div>
      {ok === null ? (
        <>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && val.trim() && check()}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Từ còn thiếu…"
            className="w-full rounded-2xl border-2 border-indigo-200 bg-white p-4 text-lg outline-none focus:border-indigo-500"
          />
          <button onClick={check} disabled={!val.trim()} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300">Kiểm tra</button>
        </>
      ) : (
        <div className="pop space-y-2 rounded-3xl bg-white p-4 text-center shadow">
          <div className="font-bold">{ok ? '✅ Chính xác!' : <>❌ Đáp án: <span className="text-emerald-600">{cur.word}</span></>}</div>
          {VOCAB.get(cur.word.toLowerCase()) && <div className="text-sm text-slate-500">{cur.word} = {VOCAB.get(cur.word.toLowerCase())}</div>}
          <button onClick={next} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white">{i + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp theo'}</button>
        </div>
      )}
    </div>
  )
}

/** Học sâu: từ vựng có trong đoạn, đưa vào ôn tập, và nhờ AI ngoài dịch/giải thích rồi lưu thành ghi chú. */
function StudyPane({ chunk, epTitle }: { chunk: PChunk; epTitle: string }) {
  const st = useStore()
  const [msg, setMsg] = useState('')
  const full = useMemo(() => chunk.sentences.map((x) => x.t).join(' '), [chunk])
  const found = useMemo(() => {
    const byEn = new Map(WORDS.map((w) => [w.en.toLowerCase(), w]))
    const seen = new Map<string, (typeof WORDS)[number]>()
    full.toLowerCase().split(/[^a-z']+/).forEach((tok) => {
      if (tok.length < 3) return
      for (const z of stems(tok)) {
        const w = byEn.get(z)
        if (w) { seen.set(w.id, w); break }
      }
    })
    return [...seen.values()]
  }, [full])

  function addToReview(id: string) {
    if (st.cards[id]) return
    setCard(id, { ...newCard(), due: Date.now() }, { isNew: true, xp: 0 })
    sfx.good()
  }

  const prompt = [
    'Tôi đang học tiếng Anh để thi TOEIC (mục tiêu 600 điểm, trình độ cơ bản). Dưới đây là một đoạn podcast. Hãy giúp tôi bằng tiếng Việt:',
    '1) Dịch từng câu sang tiếng Việt (giữ số thứ tự).',
    '2) Chọn 8 từ hoặc cụm hữu ích nhất cho TOEIC, ghi: từ/cụm - phiên âm - nghĩa - 1 câu ví dụ ngắn kèm dịch.',
    '3) Nêu 1 điểm ngữ pháp đáng chú ý trong đoạn và giải thích ngắn.',
    '',
    'ĐOẠN VĂN:',
    ...chunk.sentences.map((x, i) => `${i + 1}. ${x.t}`),
  ].join('\n')

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setMsg('Đã sao chép. Dán vào claude.ai, rồi bấm “Tạo ghi chú” để dán câu trả lời vào.')
    } catch {
      setMsg('Không sao chép được, hãy dùng nút Tạo ghi chú rồi chép tay.')
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">📚 Từ vựng của bạn xuất hiện trong đoạn ({found.length})</h3>
        {found.length === 0 && <p className="mt-2 text-sm text-slate-500">Đoạn này không có từ nào trong kho từ vựng hiện tại.</p>}
        <div className="mt-2 space-y-2">
          {found.map((w) => (
            <div key={w.id} className="flex items-start justify-between gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
              <div>
                <button onClick={() => void speak(w.en, 'en', 0.9)} className="font-bold text-indigo-700">🔊 {w.en}</button>
                <span className="ml-1 text-slate-400">{w.ipa} ({w.pos})</span>
                <div>{w.vi}</div>
                <div className="text-xs text-slate-500">{w.ex}</div>
              </div>
              {st.cards[w.id] ? (
                <span className="shrink-0 text-xs text-emerald-600">Đã học</span>
              ) : (
                <button onClick={() => addToReview(w.id)} className="shrink-0 rounded-xl bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">+ Ôn</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">🤖 Dịch và rút từ mới với AI ngoài</h3>
        <p className="text-sm text-slate-500">Web chưa gọi AI, nên sao chép câu lệnh sẵn có, dán vào claude.ai, rồi dán câu trả lời vào ghi chú. Đặt từ khóa trong [[ ]] để web hỏi lại khi ôn.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void copy()} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Sao chép câu lệnh</button>
          <button
            onClick={() => draftNote({ title: `Podcast: ${epTitle.slice(0, 40)}`, body: `${full}\n\n--- Dán bản dịch và từ vựng từ AI vào dưới đây. Đặt từ khóa trong [[ ]] ---\n`, tags: ['podcast'] })}
            className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-bold"
          >
            📝 Tạo ghi chú
          </button>
        </div>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      </div>
    </div>
  )
}
