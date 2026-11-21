import { useEffect, useRef, useState } from 'react'
import UnitView from './UnitView'
import AskButton from './AskButton'
import { buildMockUnits, podcastAvailable, estimateScaled, PART_NAME, recordUnit, sectionOf } from '../lib/units'
import type { Unit } from '../lib/units'
import { recordTest } from '../lib/store'
import { dayStr } from '../lib/store'
import { sfx, stopSpeaking } from '../lib/audio'

const LIMIT = 35 * 60 // 35 phút cho 35 câu rút gọn

type Result = {
  units: Unit[]
  picks: (number | null)[][]
}

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Mock({ goBack }: { goBack: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro')
  const [units, setUnits] = useState<Unit[]>([])
  const [i, setI] = useState(0)
  const [left, setLeft] = useState(LIMIT)
  const [res, setRes] = useState<Result | null>(null)
  const picksRef = useRef<(number | null)[][]>([])
  const saved = useRef(false)
  const [withPod, setWithPod] = useState(false)

  function start() {
    const u = buildMockUnits(withPod)
    setUnits(u)
    picksRef.current = u.map((x) => x.qs.map(() => null))
    setI(0)
    setLeft(LIMIT)
    saved.current = false
    setPhase('run')
  }

  function finish(us: Unit[]) {
    stopSpeaking()
    sfx.win()
    setRes({ units: us, picks: picksRef.current })
    setPhase('done')
  }

  useEffect(() => {
    if (phase !== 'run') return
    const t = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'run' && left <= 0) finish(units)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase])

  // Lưu kết quả một lần khi xong bài
  useEffect(() => {
    if (phase !== 'done' || !res || saved.current) return
    saved.current = true
    const tally = (sec: 'listening' | 'reading') => {
      let ok = 0
      let total = 0
      res.units.forEach((u, ui) => {
        if (sectionOf(u.part) !== sec) return
        u.qs.forEach((q, qi) => {
          total += 1
          if (res.picks[ui][qi] === q.a) ok += 1
        })
      })
      return { ok, total }
    }
    const l = tally('listening')
    const r = tally('reading')
    res.units.forEach((u, ui) => recordUnit(u, res.picks[ui]))
    recordTest({
      date: dayStr(),
      correct: l.ok + r.ok,
      total: l.total + r.total,
      listening: l,
      reading: r,
      score: estimateScaled(l.ok / l.total) + estimateScaled(r.ok / r.total),
      seconds: LIMIT - Math.max(0, left),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, res])

  if (phase === 'intro') {
    return (
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-lg font-extrabold">📝 Thi thử rút gọn</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Khoảng 35–37 câu: Nghe (Part 2, 3, 4) rồi Đọc (Part 5, 6, 7), tự rút ngẫu nhiên.</li>
            <li>Thời gian 35 phút, đồng hồ chạy suốt bài. Mỗi đoạn nghe được phát một lần, được nghe lại một lần.</li>
            <li>Không có đáp án trong lúc làm; xem kết quả và giải thích khi nộp xong.</li>
          </ul>
          <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
            Điểm quy đổi chỉ là <b>ước tính rất thô</b>: bài chỉ có 35 câu, đề do tôi tự viết (không phải đề thật), giọng đọc là giọng máy, và cách quy đổi tuyến tính không giống bảng quy đổi chính thức. Hãy dùng để theo dõi xu hướng, không dùng để đoán điểm thi thật.
          </div>
        </div>
        {podcastAvailable() && (
          <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm shadow">
            <input type="checkbox" checked={withPod} onChange={(e) => setWithPod(e.target.checked)} />
            Chèn bài nghe từ podcast của tôi (giọng thật, chủ đề đời sống, ít sát đề hơn)
          </label>
        )}
        <button onClick={start} className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow">
          Bắt đầu làm bài
        </button>
      </div>
    )
  }

  if (phase === 'run') {
    const unit = units[i]
    const sec = sectionOf(unit.part)
    return (
      <div className="space-y-3">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl bg-slate-50/95 px-4 py-3 text-sm shadow backdrop-blur">
          <span className="font-bold text-indigo-700">{sec === 'listening' ? '🎧 Phần Nghe' : '📖 Phần Đọc'}</span>
          <span className="text-slate-500">
            Bài {i + 1}/{units.length}
          </span>
          <span className={`font-extrabold tabular-nums ${left < 300 ? 'text-rose-600' : 'text-slate-700'}`}>⏱ {mmss(Math.max(0, left))}</span>
        </div>
        <UnitView
          key={unit.id}
          unit={unit}
          mode="mock"
          rate={0.95}
          nextLabel={i + 1 >= units.length ? 'Nộp bài' : 'Bài tiếp theo →'}
          onSubmit={(p) => {
            picksRef.current[i] = p
          }}
          onNext={() => {
            if (i + 1 >= units.length) finish(units)
            else setI(i + 1)
          }}
        />
      </div>
    )
  }

  // ---- Kết quả ----
  const r = res!
  const sec = (name: 'listening' | 'reading') => {
    let ok = 0
    let total = 0
    r.units.forEach((u, ui) => {
      if (sectionOf(u.part) !== name) return
      u.qs.forEach((q, qi) => {
        total += 1
        if (r.picks[ui][qi] === q.a) ok += 1
      })
    })
    return { ok, total }
  }
  const L = sec('listening')
  const R = sec('reading')
  const Ls = estimateScaled(L.ok / L.total)
  const Rs = estimateScaled(R.ok / R.total)

  const byPart: Record<number, { ok: number; total: number }> = {}
  r.units.forEach((u, ui) =>
    u.qs.forEach((q, qi) => {
      const b = (byPart[u.part] ??= { ok: 0, total: 0 })
      b.total += 1
      if (r.picks[ui][qi] === q.a) b.ok += 1
    }),
  )
  const wrong = r.units.flatMap((u, ui) =>
    u.qs.map((q, qi) => ({ u, q, pick: r.picks[ui][qi] })).filter((x) => x.pick !== x.q.a),
  )

  return (
    <div className="space-y-3">
      <div className="pop rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-6 text-center text-white shadow-lg">
        <div className="text-sm opacity-80">Điểm quy đổi ước tính (rất thô)</div>
        <div className="mt-1 text-5xl font-extrabold">~{Ls + Rs}</div>
        <div className="mt-1 text-sm opacity-90">
          Nghe ~{Ls} · Đọc ~{Rs} · đúng {L.ok + R.ok}/{L.total + R.total}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">Kết quả theo Part</h3>
        <div className="mt-2 space-y-2">
          {Object.entries(byPart).map(([p, b]) => (
            <div key={p}>
              <div className="flex justify-between text-sm">
                <span>{PART_NAME[Number(p)]}</span>
                <span className="font-bold">
                  {b.ok}/{b.total}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(b.ok / b.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">Câu bỏ trống tính là sai. Kết quả đã lưu vào lịch sử thi thử và thống kê.</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow">
        <h3 className="font-bold">Các câu cần xem lại ({wrong.length})</h3>
        {wrong.length === 0 && <p className="mt-2 text-sm text-emerald-600">Tuyệt vời, bạn đúng hết! 🎉</p>}
        <div className="mt-2 space-y-3">
          {wrong.map(({ u, q, pick }, k) => (
            <div key={k} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <div className="text-xs font-bold text-slate-400">{PART_NAME[u.part]}</div>
              {u.passage && u.part === 5 && <p className="mt-1">{u.passage}</p>}
              <p className="mt-1 font-semibold">{q.q}</p>
              <p className="mt-1 text-rose-600">Bạn chọn: {pick === null ? '(bỏ trống)' : `${'ABCD'[pick]}. ${q.opts[pick]}`}</p>
              <p className="text-emerald-700">Đáp án: {'ABCD'[q.a]}. {q.opts[q.a]}</p>
              <p className="mt-1 text-slate-600">{q.why}</p>
              <AskButton
                className="mt-2"
                ctx={{
                  mode: 'explain',
                  context: {
                    question: `${u.passage ?? ''}\n${(u.transcript ?? []).join('\n')}\n${q.q}`,
                    options: q.opts.map((o, x) => `${'ABCD'[x]}. ${o}`).join(' | '),
                    picked: pick === null ? '(bỏ trống)' : `${'ABCD'[pick]}. ${q.opts[pick]}`,
                    correct: `${'ABCD'[q.a]}. ${q.opts[q.a]}`,
                    note: q.why,
                  },
                  prompt: `Giải thích giúp tôi câu này (${PART_NAME[u.part]}).`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={start} className="flex-1 rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow">
          Làm đề khác
        </button>
        <button onClick={goBack} className="flex-1 rounded-2xl bg-slate-200 py-3 font-bold">
          Quay lại
        </button>
      </div>
    </div>
  )
}
