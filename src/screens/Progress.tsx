import { useEffect, useMemo, useState } from 'react'
import { WORDS } from '../data/words'
import { LESSONS } from '../data/lessons'
import { dayStr, sessionKey, useStore } from '../lib/store'
import { isMastered } from '../lib/srs'
import { loadPodcastIndex } from '../lib/podcast'
import type { PIndex } from '../lib/podcast'

const STAT_NAME: Record<string, string> = {
  'word-form': 'Part 5 · Dạng từ',
  tense: 'Part 5 · Thì',
  preposition: 'Part 5 · Giới từ',
  conjunction: 'Part 5 · Liên từ',
  pronoun: 'Part 5 · Đại từ',
  passive: 'Part 5 · Bị động',
  conditional: 'Part 5 · Câu điều kiện',
  comparison: 'Part 5 · So sánh',
  vocab: 'Part 5 · Từ vựng',
  'l-p1': 'Nghe Part 1 (tranh ảnh)',
  'l-p2': 'Nghe Part 2',
  'l-p3': 'Nghe Part 3',
  'l-p4': 'Nghe Part 4',
  'l-dict': 'Chép chính tả',
  'l-pod': 'Podcast (chép/điền từ)',
  'r-p6': 'Part 6',
  'r-p7': 'Part 7',
  'v-mean': 'Kiểm tra: nhớ nghĩa',
  'v-ipa': 'Kiểm tra: phiên âm',
  'v-spell': 'Kiểm tra: nghe & viết',
  'v-use': 'Kiểm tra: áp dụng',
}

function Bar({ label, ok, total }: { label: string; ok: number; total: number }) {
  const pct = total ? Math.round((ok / total) * 100) : 0
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-bold">{ok}/{total} · {pct}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Progress({ go }: { go: (t: 'plan' | 'review' | 'learn' | 'podcast') => void }) {
  const s = useStore()
  const [pod, setPod] = useState<PIndex | null>(null)
  const [showWords, setShowWords] = useState<'today' | 'week' | 'all' | null>('today')

  useEffect(() => {
    void loadPodcastIndex().then(setPod)
  }, [])

  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)
  const learnedWords = useMemo(
    () => WORDS.filter((w) => s.cards[w.id] && s.cards[w.id].reps > 0).sort((a, b) => (s.cards[b.id].at ?? 0) - (s.cards[a.id].at ?? 0)),
    [s.cards],
  )
  const todayWords = learnedWords.filter((w) => (s.cards[w.id].at ?? 0) >= startToday.getTime())
  const weekWords = learnedWords.filter((w) => (s.cards[w.id].at ?? 0) >= startToday.getTime() - 6 * 86400000)
  const mastered = learnedWords.filter((w) => isMastered(s.cards[w.id])).length
  const shaky = learnedWords.filter((w) => s.cards[w.id].lapses >= 2)
  const listed = showWords === 'today' ? todayWords : showWords === 'week' ? weekWords : showWords === 'all' ? learnedWords : []

  const today = dayStr()
  const planDone = (s.planDone[sessionKey(s.sessionNo)] ?? []).filter((x) => x !== '_bonus').length
  const lessonsLeft = LESSONS.filter((l) => !s.lessons.includes(l.id))
  const mistakes = Object.keys(s.mistakes).length

  const statRows = Object.entries(s.stats).filter(([, v]) => v.total > 0)
  const grammar = statRows.filter(([k]) => !/^[lrv]-/.test(k))
  const listening = statRows.filter(([k]) => k.startsWith('l-'))
  const reading = statRows.filter(([k]) => k.startsWith('r-'))
  const checks = statRows.filter(([k]) => k.startsWith('v-'))

  // Điểm yếu: nhóm có tối thiểu 5 câu và tỉ lệ đúng thấp nhất
  const weak = statRows
    .filter(([, v]) => v.total >= 5)
    .map(([k, v]) => ({ k, pct: v.ok / v.total }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
    .filter((x) => x.pct < 0.7)

  const episodes = pod?.episodes ?? []
  const podTotal = episodes.reduce((a, e) => a + e.chunks.length, 0)
  const podDone = Object.keys(s.podcastDone).length
  const resumeEp = episodes.find((e) => e.chunks.some((c) => !s.podcastDone[c.id]))

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <section className="clip-corner hero-grid rounded-3xl border border-slate-200 bg-gradient-to-br from-[#2a1710] via-[#172131] to-[#101722] p-6 text-white shadow-lg lg:col-span-2">
        <div className="text-xs font-bold tracking-[0.3em] text-indigo-400">PERFORMANCE CENTER</div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Tiến độ của tôi</h1>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/15 p-3"><div className="text-2xl font-extrabold">{learnedWords.length}</div><div className="text-xs">từ đã học</div></div>
          <div className="rounded-2xl bg-white/15 p-3"><div className="text-2xl font-extrabold">{mastered}</div><div className="text-xs">từ đã thuộc</div></div>
          <div className="rounded-2xl bg-white/15 p-3"><div className="text-2xl font-extrabold">{s.lessons.length}/{LESSONS.length}</div><div className="text-xs">bài ngữ pháp</div></div>
        </div>
        <p className="mt-3 text-sm opacity-90">Hôm nay: {todayWords.length} từ mới · {s.daily.date === today ? s.daily.reviewed : 0} thẻ đã ôn · buổi {s.sessionNo}: {planDone} mục xong · đã hoàn thành {Object.keys(s.sessionDone).length} buổi</p>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">▶️ Học tiếp từ đâu?</h3>
        <div className="mt-2 space-y-2 text-sm">
          <button onClick={() => go('plan')} className="w-full rounded-2xl bg-indigo-50 p-3 text-left font-semibold text-indigo-700">📅 Mục tiếp theo trong kế hoạch hôm nay →</button>
          {mistakes > 0 && <button onClick={() => go('review')} className="w-full rounded-2xl bg-rose-50 p-3 text-left font-semibold text-rose-700">🛠️ Còn {mistakes} câu trong sổ lỗi sai cần làm lại →</button>}
          {resumeEp && <button onClick={() => go('podcast')} className="w-full rounded-2xl bg-amber-50 p-3 text-left font-semibold text-amber-700">🎙️ Podcast: “{resumeEp.title.slice(0, 36)}…” còn {resumeEp.chunks.filter((c) => !s.podcastDone[c.id]).length} đoạn →</button>}
          {lessonsLeft.length > 0 && <p className="rounded-2xl bg-slate-50 p-3">📖 Bài ngữ pháp kế tiếp: <b>{lessonsLeft[0].title}</b></p>}
        </div>
        {weak.length > 0 && (
          <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
            <b>Điểm yếu cần chú ý:</b> {weak.map((x) => `${STAT_NAME[x.k] ?? x.k} (${Math.round(x.pct * 100)}%)`).join(', ')}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">🃏 Từ vựng đã học</h3>
        <div className="mt-2 flex gap-2 text-xs font-bold">
          {([['today', `Hôm nay (${todayWords.length})`], ['week', `7 ngày (${weekWords.length})`], ['all', `Tất cả (${learnedWords.length})`]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setShowWords(showWords === id ? null : id)} className={`rounded-full px-3 py-1.5 ${showWords === id ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{label}</button>
          ))}
        </div>
        {shaky.length > 0 && <p className="mt-2 text-xs text-rose-600">Hay quên (sai ≥2 lần): {shaky.slice(0, 8).map((w) => w.en).join(', ')}</p>}
        <div className="mt-2 max-h-72 space-y-1 overflow-auto">
          {listed.length === 0 && showWords && <p className="text-sm text-slate-500">Chưa có từ nào trong mục này.</p>}
          {listed.slice(0, 150).map((w) => (
            <div key={w.id} className="flex justify-between gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-sm">
              <span><b>{w.en}</b> <span className="text-slate-400">{w.ipa}</span></span>
              <span className="text-right text-slate-600">{w.vi}</span>
            </div>
          ))}
        </div>
        <button onClick={() => go('learn')} className="mt-3 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Học thẻ →</button>
      </section>

      {(grammar.length > 0 || listening.length > 0 || reading.length > 0 || checks.length > 0) && (
        <section className="space-y-3 rounded-3xl bg-white p-4 shadow">
          <h3 className="font-bold">🎯 Độ chính xác theo mảng</h3>
          {[['Kiểm tra từ vựng', checks], ['Ngữ pháp / Part 5', grammar], ['Nghe', listening], ['Đọc', reading]].map(([title, rows]) =>
            (rows as [string, { ok: number; total: number }][]).length ? (
              <div key={title as string} className="space-y-2">
                <div className="text-xs font-bold text-slate-400">{title as string}</div>
                {(rows as [string, { ok: number; total: number }][]).map(([k, v]) => <Bar key={k} label={STAT_NAME[k] ?? k} ok={v.ok} total={v.total} />)}
              </div>
            ) : null,
          )}
        </section>
      )}

      <section className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">🎙️ Podcast &amp; 📖 Ngữ pháp</h3>
        <p className="mt-1 text-sm text-slate-600">Podcast: đã hoàn thành {podDone}{podTotal ? `/${podTotal}` : ''} đoạn{!pod && ' (chưa có file podcast)'}.</p>
        <p className="mt-1 text-sm text-slate-600">Bài ngữ pháp đã học: {s.lessons.length ? s.lessons.map((id) => LESSONS.find((l) => l.id === id)?.title ?? id).join(', ') : 'chưa có'}.</p>
      </section>

      {s.tests.length > 0 && (
        <section className="rounded-3xl bg-white p-4 shadow">
          <h3 className="font-bold">⏱️ Lịch sử thi thử</h3>
          <div className="mt-2 space-y-1 text-sm">
            {s.tests.slice(-6).reverse().map((t, i) => (
              <div key={i} className="flex justify-between rounded-xl bg-slate-50 px-3 py-1.5">
                <span>{t.date}</span>
                <span>đúng {t.correct}/{t.total} · ước ~{t.score}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
