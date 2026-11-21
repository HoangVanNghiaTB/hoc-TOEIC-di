import { useRef, useState } from 'react'
import { WORDS } from '../data/words'
import { addXp, getState, recordBest } from '../lib/store'
import { isLearned } from '../lib/srs'
import { sfx, speak } from '../lib/audio'

const ROUND = 8

type Chip = { id: number; text: string }

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

type Item = { en: string; vi: string; chips: Chip[] }

function build(): Item[] {
  const s = getState()
  const learned = WORDS.filter((w) => isLearned(s.cards[w.id]))
  const pool = (learned.length >= 12 ? learned : WORDS).filter((w) => {
    const n = w.ex.split(' ').length
    return n >= 5 && n <= 11
  })
  return shuffle(pool)
    .slice(0, ROUND)
    .map((w) => {
      const words = w.ex.split(' ')
      return {
        en: w.ex,
        vi: w.exVi,
        chips: shuffle(words.map((text, id) => ({ id, text }))),
      }
    })
}

export default function Order({ goHome }: { goHome: () => void }) {
  const [items, setItems] = useState<Item[]>(build)
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState<Chip[]>([])
  const [result, setResult] = useState<'ok' | 'bad' | null>(null)
  const [good, setGood] = useState(0)
  const [over, setOver] = useState(false)
  const tries = useRef(0)

  const cur = items[i]
  const left = cur ? cur.chips.filter((c) => !chosen.some((x) => x.id === c.id)) : []

  function restart() {
    setItems(build())
    setI(0)
    setChosen([])
    setResult(null)
    setGood(0)
    setOver(false)
    tries.current = 0
  }

  function check() {
    const text = chosen.map((c) => c.text).join(' ')
    if (text === cur.en) {
      sfx.good()
      setResult('ok')
      void speak(cur.en)
      if (tries.current === 0) setGood((g) => g + 1)
    } else {
      sfx.bad()
      setResult('bad')
      tries.current += 1
      setTimeout(() => setResult(null), 600)
    }
  }

  function next() {
    tries.current = 0
    if (i + 1 >= items.length) {
      const xp = good * 4 + 5
      addXp(xp)
      recordBest('order', good)
      sfx.win()
      setOver(true)
      return
    }
    setI(i + 1)
    setChosen([])
    setResult(null)
  }

  if (over) {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">🧱</div>
        <h2 className="mt-3 text-xl font-extrabold">Xong rồi!</h2>
        <p className="mt-2 text-3xl font-extrabold text-violet-600">
          {good}/{items.length}
        </p>
        <p className="text-slate-600">đúng ngay lần đầu · +{good * 4 + 5} XP</p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={restart} className="rounded-2xl bg-violet-500 px-6 py-3 font-bold text-white">
            Chơi lại
          </button>
          <button onClick={goHome} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-violet-700">
          Câu {i + 1}/{items.length}
        </span>
        <span className="font-bold">✔ {good}</span>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-lg">
        <div className="text-sm text-slate-400">Sắp xếp thành câu đúng:</div>
        <div className="mt-1 font-semibold text-emerald-600">{cur.vi}</div>

        <div
          className={`mt-4 flex min-h-[64px] flex-wrap gap-2 rounded-2xl border-2 border-dashed p-3 ${result === 'ok' ? 'border-emerald-400 bg-emerald-50' : result === 'bad' ? 'shake border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        >
          {chosen.map((c) => (
            <button
              key={c.id}
              onClick={() => result !== 'ok' && setChosen(chosen.filter((x) => x.id !== c.id))}
              className="rounded-xl bg-violet-100 px-3 py-2 font-semibold text-violet-800"
            >
              {c.text}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {left.map((c) => (
            <button
              key={c.id}
              onClick={() => result !== 'ok' && setChosen([...chosen, c])}
              className="rounded-xl bg-slate-100 px-3 py-2 font-semibold active:scale-95"
            >
              {c.text}
            </button>
          ))}
        </div>
      </div>

      {result === 'ok' ? (
        <button onClick={next} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white shadow">
          {i + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp theo'}
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setChosen([])}
            className="rounded-2xl bg-slate-200 px-4 py-3 font-bold"
          >
            Làm lại
          </button>
          <button
            onClick={check}
            disabled={left.length > 0}
            className="flex-1 rounded-2xl bg-violet-500 py-3 font-bold text-white shadow disabled:bg-slate-300"
          >
            Kiểm tra
          </button>
        </div>
      )}
    </div>
  )
}
