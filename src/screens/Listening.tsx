import { useEffect, useRef, useState } from 'react'
import { P2_QUESTIONS } from '../data/listening'
import type { P2 } from '../data/listening'
import { recordStat, addXp } from '../lib/store'
import { sfx, speak, stopSpeaking, ttsSupported } from '../lib/audio'
import FlagButton from './FlagButton'
import AskButton from './AskButton'

const RUN = 8
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

type Item = { q: P2; order: number[] } // order[pos] = chỉ số gốc của lời đáp

const build = (): Item[] =>
  shuffle(P2_QUESTIONS)
    .slice(0, RUN)
    .map((q) => ({ q, order: shuffle([0, 1, 2]) }))

export default function Listening({ goBack }: { goBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'play' | 'over'>('ready')
  const [items, setItems] = useState<Item[]>(build)
  const [i, setI] = useState(0)
  const [rate, setRate] = useState(0.95)
  const [picked, setPicked] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const [lit, setLit] = useState(-1) // lời đáp đang được đọc
  const token = useRef(0)

  const cur = items[i]

  async function playAll(r = rate) {
    token.current += 1
    const t = token.current
    stopSpeaking()
    setLit(-1)
    await speak(cur.q.q, 'en', r)
    for (let pos = 0; pos < 3; pos++) {
      if (token.current !== t) return
      await wait(700)
      if (token.current !== t) return
      setLit(pos)
      await speak(cur.q.r[cur.order[pos]], 'en', r)
    }
    if (token.current === t) setLit(-1)
  }

  useEffect(() => {
    if (phase !== 'play') return
    const t = setTimeout(() => void playAll(), 300)
    return () => {
      clearTimeout(t)
      token.current += 1
      stopSpeaking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, i])

  function start() {
    setItems(build())
    setI(0)
    setPicked(null)
    setRight(0)
    setPhase('play')
  }

  function pick(pos: number) {
    if (picked !== null) return
    token.current += 1
    stopSpeaking()
    setLit(-1)
    setPicked(pos)
    const ok = cur.order[pos] === 0
    recordStat('l-p2', ok, ok ? 4 : 0)
    if (ok) {
      sfx.good()
      setRight((n) => n + 1)
    } else sfx.bad()
  }

  function next() {
    if (i + 1 >= items.length) {
      const bonus = right / items.length >= 0.8 ? 10 : 0
      if (bonus) addXp(bonus)
      sfx.win()
      setPhase('over')
      return
    }
    setI(i + 1)
    setPicked(null)
  }

  if (!ttsSupported()) {
    return <div className="rounded-3xl bg-white p-6 shadow">Trình duyệt không hỗ trợ giọng đọc. Hãy dùng Chrome hoặc Edge.</div>
  }

  if (phase === 'ready') {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">👂</div>
        <h2 className="mt-3 text-xl font-extrabold">Part 2: Hỏi – Đáp</h2>
        <p className="mt-2 text-slate-600">
          Bạn nghe một câu hỏi (hoặc câu nói) rồi ba lời đáp A, B, C. Chọn lời đáp phù hợp nhất. Nội dung chữ chỉ hiện sau khi bạn trả lời, giống đề thật.
        </p>
        <p className="mt-2 text-xs text-slate-400">Giọng đọc là giọng máy của trình duyệt, chưa giống hoàn toàn giọng đề thi.</p>
        <div className="mt-4 flex justify-center gap-2 text-sm">
          {[0.8, 0.95, 1.1].map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`rounded-full px-3 py-1 ${rate === r ? 'bg-indigo-100 font-bold text-indigo-700' : 'bg-slate-100 text-slate-500'}`}
            >
              {r === 0.8 ? 'Chậm' : r === 0.95 ? 'Vừa' : 'Nhanh'}
            </button>
          ))}
        </div>
        <button onClick={start} className="mt-5 rounded-2xl bg-indigo-600 px-8 py-3 font-bold text-white">
          Bắt đầu ({RUN} câu)
        </button>
      </div>
    )
  }

  if (phase === 'over') {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">{right === items.length ? '🏆' : '🎧'}</div>
        <h2 className="mt-3 text-xl font-extrabold">Hoàn thành!</h2>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600">
          {right}/{items.length}
        </p>
        <p className="text-slate-600">+{right * 4 + (right / items.length >= 0.8 ? 10 : 0)} XP</p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">
            Chơi lại
          </button>
          <button onClick={goBack} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const answered = picked !== null
  const correctPos = cur.order.indexOf(0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-indigo-700">
          Câu {i + 1}/{items.length}
        </span>
        <span className="font-bold">✔ {right}</span>
      </div>

      <div className="rounded-3xl bg-white p-5 text-center shadow-lg">
        <button onClick={() => void playAll()} className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow">
          🔊 Nghe lại cả câu
        </button>
        <p className="mt-3 text-sm text-slate-400">
          {answered ? 'Xem lại nội dung bên dưới' : 'Chỉ nghe, chưa có chữ — chọn A, B hoặc C'}
        </p>
      </div>

      <div className="space-y-2">
        {cur.order.map((orig, pos) => {
          let cls = lit === pos ? 'border-indigo-400 bg-indigo-50' : 'border-transparent bg-white'
          if (answered && pos === correctPos) cls = 'border-emerald-500 bg-emerald-50'
          else if (answered && pos === picked) cls = 'border-rose-500 bg-rose-50'
          return (
            <button
              key={pos}
              onClick={() => pick(pos)}
              disabled={answered}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left font-semibold shadow-sm ${cls}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">{'ABC'[pos]}</span>
              {answered ? cur.q.r[orig] : lit === pos ? '🔊 …' : ''}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="pop space-y-2 rounded-2xl bg-indigo-50 p-4 text-sm">
          <p>
            <b>{cur.order[picked] === 0 ? '✅ Chính xác! ' : '❌ Chưa đúng. '}</b>
            {cur.q.why}
          </p>
          <p className="text-slate-600">
            <b>Câu hỏi:</b> {cur.q.q} — {cur.q.viQ}
          </p>
          <p className="text-slate-600">
            <b>Đáp án đúng:</b> {cur.q.r[0]} — {cur.q.viA}
          </p>
          <div className="flex items-center gap-2">
            <FlagButton id={`l:${cur.q.id}`} />
            <AskButton
              ctx={{
                mode: 'explain',
                context: {
                  question: cur.q.q,
                  options: cur.order.map((o, k) => `${'ABC'[k]}. ${cur.q.r[o]}`).join(' | '),
                  picked: `${'ABC'[picked]}. ${cur.q.r[cur.order[picked]]}`,
                  correct: `${'ABC'[correctPos]}. ${cur.q.r[0]}`,
                  note: cur.q.why,
                },
                prompt: 'Đây là câu Part 2 (nghe hỏi–đáp). Hãy giải thích giúp tôi.',
              }}
            />
          </div>
          <button onClick={next} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white">
            {i + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </div>
  )
}
