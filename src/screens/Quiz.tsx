import { useMemo, useState } from 'react'
import { QUESTIONS, TAGS } from '../data/questions'
import type { Question, Tag } from '../data/questions'
import { addXp, getState, recordAnswer } from '../lib/store'
import { sfx } from '../lib/audio'
import FlagButton from './FlagButton'
import AskButton from './AskButton'

const HEARTS = 5
const RUN_LEN = 10

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

type Item = { q: Question; order: number[] } // order: thứ tự hiển thị các đáp án

const makeItem = (q: Question): Item => ({ q, order: shuffle([0, 1, 2, 3]) })

export default function Quiz({
  mode,
  initialTag,
  goBack,
}: {
  mode: 'run' | 'review'
  initialTag?: Tag | 'all'
  goBack: () => void
}) {
  const [tag, setTag] = useState<Tag | 'all'>(initialTag ?? 'all')
  const [started, setStarted] = useState(mode === 'review' || !!initialTag)
  const [items, setItems] = useState<Item[]>(() => build(mode, initialTag ?? 'all'))
  const [i, setI] = useState(0)
  const [hearts, setHearts] = useState(HEARTS)
  const [picked, setPicked] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [over, setOver] = useState(false)
  const [bonus, setBonus] = useState(0)

  function build(m: 'run' | 'review', t: Tag | 'all'): Item[] {
    const s = getState()
    if (m === 'review') {
      return shuffle(QUESTIONS.filter((q) => s.mistakes[q.id])).slice(0, 15).map(makeItem)
    }
    const pool = t === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.tag === t)
    return shuffle(pool).slice(0, RUN_LEN).map(makeItem)
  }

  function start() {
    setItems(build(mode, tag))
    setI(0)
    setHearts(HEARTS)
    setPicked(null)
    setRight(0)
    setWrongCount(0)
    setOver(false)
    setBonus(0)
    setStarted(true)
  }

  const cur = items[i]
  const isRun = mode === 'run'

  function pick(pos: number) {
    if (picked !== null || !cur) return
    const orig = cur.order[pos]
    const ok = orig === cur.q.a
    setPicked(pos)
    recordAnswer(cur.q.id, cur.q.tag, ok, ok ? 4 : 0)
    if (ok) {
      sfx.good()
      setRight((n) => n + 1)
    } else {
      sfx.bad()
      setWrongCount((n) => n + 1)
      if (isRun) setHearts((h) => h - 1)
    }
  }

  function next() {
    const outOfHearts = isRun && hearts <= 0
    if (outOfHearts || i + 1 >= items.length) {
      const total = items.length
      const b = !outOfHearts && total > 0 && right / total >= 0.8 ? 10 : 0
      if (b) addXp(b)
      setBonus(b)
      setOver(true)
      if (!outOfHearts) sfx.win()
      return
    }
    setI(i + 1)
    setPicked(null)
  }

  const tagName = useMemo(() => TAGS.find((t) => t.id === tag)?.name ?? 'Tất cả chủ đề', [tag])

  // ---- Màn chọn chủ đề ----
  if (!started) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-lg font-extrabold">✍️ Luyện Part 5</h2>
          <p className="mt-1 text-sm text-slate-500">
            {RUN_LEN} câu, có {HEARTS} ❤️. Sai một câu mất một tim; hết tim là kết thúc. Mỗi câu có giải thích ngay sau khi trả lời.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{ id: 'all' as const, name: 'Tất cả chủ đề', icon: '🎲' }, ...TAGS].map((t) => (
            <button
              key={t.id}
              onClick={() => setTag(t.id)}
              className={`rounded-2xl border-2 px-3 py-3 text-left text-sm font-semibold ${tag === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-white'}`}
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>
        <button onClick={start} className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow">
          Bắt đầu
        </button>
      </div>
    )
  }

  // ---- Không có câu nào (review rỗng) ----
  if (items.length === 0) {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 text-xl font-extrabold">Sổ lỗi sai đang trống!</h2>
        <p className="mt-2 text-slate-500">Hãy làm thêm bài Part 5, câu nào sai sẽ vào sổ này để ôn lại.</p>
        <button onClick={goBack} className="mt-5 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">
          Quay lại
        </button>
      </div>
    )
  }

  // ---- Kết thúc ----
  if (over) {
    const dead = isRun && hearts <= 0
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">{dead ? '💔' : right === items.length ? '🏆' : '🎉'}</div>
        <h2 className="mt-3 text-xl font-extrabold">{dead ? 'Hết tim!' : 'Hoàn thành!'}</h2>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600">
          {right}/{items.length}
        </p>
        <p className="text-slate-600">
          {wrongCount} câu sai · +{right * 4 + bonus} XP{bonus ? ' (thưởng ≥80%)' : ''}
        </p>
        {wrongCount > 0 && <p className="mt-2 text-sm text-slate-500">Các câu sai đã vào Sổ lỗi sai để ôn lại.</p>}
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">
            {isRun ? 'Chơi lại' : 'Ôn tiếp'}
          </button>
          <button onClick={goBack} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  // ---- Đang làm bài ----
  const [before, after] = cur.q.q.split('___')
  const answered = picked !== null
  const correctPos = cur.order.indexOf(cur.q.a)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-indigo-700">
          Câu {i + 1}/{items.length}
        </span>
        <span className="text-slate-400">{mode === 'review' ? 'Sổ lỗi sai' : tagName}</span>
        {isRun && <span className="font-bold">{'❤️'.repeat(Math.max(0, hearts)) + '🤍'.repeat(HEARTS - Math.max(0, hearts))}</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>

      <div key={cur.q.id} className="pop rounded-3xl bg-white p-5 shadow-lg">
        <p className="text-lg leading-relaxed">
          {before}
          <span className="mx-1 inline-block min-w-[70px] border-b-2 border-indigo-400 text-center font-bold text-indigo-700">
            {answered ? cur.q.opts[cur.q.a] : ' '}
          </span>
          {after}
        </p>
      </div>

      <div className="space-y-2">
        {cur.order.map((orig, pos) => {
          const isCorrect = pos === correctPos
          const isPicked = pos === picked
          let cls = 'border-transparent bg-white'
          if (answered && isCorrect) cls = 'border-emerald-500 bg-emerald-50'
          else if (answered && isPicked) cls = 'border-rose-500 bg-rose-50'
          return (
            <button
              key={pos}
              onClick={() => pick(pos)}
              disabled={answered}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold shadow-sm ${cls}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs">{'ABCD'[pos]}</span>
              {cur.q.opts[orig]}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="pop space-y-3 rounded-2xl bg-indigo-50 p-4 text-sm">
          <p>
            <b>{cur.order[picked] === cur.q.a ? '✅ Chính xác! ' : '❌ Chưa đúng. '}</b>
            {cur.q.why}
          </p>
          <div className="flex items-center gap-2">
            <FlagButton id={`q:${cur.q.id}`} />
            <AskButton
              ctx={{
                mode: 'explain',
                context: {
                  question: cur.q.q,
                  options: cur.q.opts.join(' | '),
                  picked: cur.q.opts[cur.order[picked]],
                  correct: cur.q.opts[cur.q.a],
                  note: cur.q.why,
                },
                prompt: 'Hãy giải thích câu này giúp tôi.',
              }}
            />
          </div>
          <button onClick={next} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white">
            {i + 1 >= items.length || (isRun && hearts <= 0) ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </div>
  )
}
