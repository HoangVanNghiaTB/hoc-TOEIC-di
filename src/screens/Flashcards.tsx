import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProgressBar } from '../components/ui/Progress'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { dueWords, gradeWord, newWords } from '../lib/srs'
import type { Grade } from '../lib/srs'
import { getState } from '../lib/store'
import { sfx, speak } from '../lib/audio'
import FlagButton from './FlagButton'
import AskButton from './AskButton'

const BTN: { g: Grade; label: string; color: string }[] = [
  { g: 0, label: 'Quên', color: 'bg-rose-500' },
  { g: 1, label: 'Khó', color: 'bg-orange-500' },
  { g: 2, label: 'Nhớ', color: 'bg-emerald-500' },
  { g: 3, label: 'Dễ', color: 'bg-sky-500' },
]

export default function Flashcards({ goHome }: { goHome: () => void }) {
  // Chụp danh sách thẻ một lần khi vào phiên học.
  const initial = useMemo(() => {
    const s = getState()
    return [...dueWords(s, WORDS), ...newWords(s, WORDS)]
  }, [])
  const [queue, setQueue] = useState<Word[]>(initial)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [again, setAgain] = useState(0)

  const cur = queue[0]

  useEffect(() => {
    if (cur) void speak(cur.en)
  }, [cur])

  const grade = useCallback(
    (g: Grade) => {
      if (!cur) return
      gradeWord(cur.id, g)
      if (g === 0) {
        sfx.bad()
        setAgain((n) => n + 1)
      } else {
        sfx.good()
      }
      setDone((n) => n + 1)
      setFlipped(false)
      setQueue((q) => (g === 0 ? [...q.slice(1), q[0]] : q.slice(1)))
    },
    [cur],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        grade((Number(e.key) - 1) as Grade)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, grade])

  useEffect(() => {
    if (!cur && done > 0) sfx.win()
  }, [cur, done])

  if (!cur) {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">{done > 0 ? '🎉' : '✅'}</div>
        <h2 className="mt-3 text-xl font-extrabold">{done > 0 ? 'Hoàn thành phiên học!' : 'Hôm nay không còn thẻ nào'}</h2>
        {done > 0 && (
          <p className="mt-2 text-slate-600">
            {done} lượt chấm · {again} lần quên
          </p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Chơi thêm game hoặc nghe Radio để củng cố, rồi quay lại vào ngày mai.
        </p>
        <button onClick={goHome} className="mt-5 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">
          Về trang chủ
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
          <span>Còn {queue.length} thẻ</span>
          <span>Đã chấm {done}</span>
        </div>
        <ProgressBar value={(done / Math.max(1, done + queue.length)) * 100} label="Tiến độ phiên học" />
      </div>

      <div
        key={cur.id + done}
        onClick={() => setFlipped((f) => !f)}
        className="pop flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border-t-4 border-indigo-500 bg-white p-6 text-center shadow-lg"
      >
        <div className="text-4xl font-extrabold text-indigo-700">{cur.en}</div>
        <div className="mt-1 text-slate-400">
          {cur.ipa} · {cur.pos}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            void speak(cur.en)
          }}
          className="mt-3 rounded-full bg-indigo-50 px-4 py-2 text-indigo-600"
        >
          🔊 Nghe lại
        </button>

        {flipped ? (
          <div className="pop mt-5 space-y-2">
            <div className="text-2xl font-bold text-emerald-600">{cur.vi}</div>
            <div className="text-slate-700">“{cur.ex}”</div>
            <div className="text-sm text-slate-400">{cur.exVi}</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                void speak(cur.ex)
              }}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
            >
              🔊 Nghe câu
            </button>
            <a
              href={`https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(cur.en.toLowerCase().replace(/\s+/g, '-'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-2 inline-block rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700"
            >
              📖 Tra Cambridge
            </a>
            <FlagButton id={`w:${cur.id}`} className="ml-2" />
            <AskButton
              className="ml-2"
              label="🧑‍🏫 Hỏi"
              ctx={{
                mode: 'word',
                context: { word: cur.en, meaning: `${cur.pos}: ${cur.vi}` },
                prompt: `Giải thích giúp tôi cách dùng từ “${cur.en}”.`,
              }}
            />
          </div>
        ) : (
          <div className="mt-6 text-sm text-slate-400">Nghĩ nghĩa của từ, rồi chạm để lật thẻ (Space)</div>
        )}
      </div>

      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {BTN.map((b) => (
            <button
              key={b.g}
              onClick={() => grade(b.g)}
              className={`${b.color} rounded-2xl py-4 font-bold text-white shadow active:scale-95`}
            >
              {b.label}
              <div className="text-[10px] font-normal opacity-80">phím {b.g + 1}</div>
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow active:scale-95"
        >
          Hiện đáp án
        </button>
      )}
    </div>
  )
}
