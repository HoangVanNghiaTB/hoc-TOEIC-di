import { useEffect, useRef, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { addXp, getState, recordBest } from '../lib/store'
import { isLearned } from '../lib/srs'
import { sfx, speak, ttsSupported } from '../lib/audio'

const TIME = 60

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export default function Typing({ goHome }: { goHome: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'play' | 'over'>('ready')
  const [left, setLeft] = useState(TIME)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [word, setWord] = useState<Word | null>(null)
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const [showEn, setShowEn] = useState(false)
  const pool = useRef<Word[]>([])
  const idx = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const shownAt = useRef(0)

  function nextWord() {
    const w = pool.current[idx.current % pool.current.length]
    idx.current += 1
    setWord(w)
    setInput('')
    setShowEn(false)
    shownAt.current = Date.now()
    void speak(w.en)
  }

  function start() {
    const s = getState()
    const learned = WORDS.filter((w) => isLearned(s.cards[w.id]))
    pool.current = shuffle(learned.length >= 10 ? learned : WORDS)
    idx.current = 0
    setScore(0)
    setCorrect(0)
    setSkipped(0)
    setLeft(TIME)
    setPhase('play')
    nextWord()
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && left <= 0) {
      setPhase('over')
      sfx.win()
      recordBest('typing', correct)
      addXp(correct * 3 + 3)
    }
  }, [left, phase, correct])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!word) return
    if (input.trim().toLowerCase() === word.en.toLowerCase()) {
      const fast = Date.now() - shownAt.current < 4000 ? 5 : 0
      setScore((s) => s + 10 + fast)
      setCorrect((c) => c + 1)
      setFlash('ok')
      sfx.good()
      setTimeout(() => setFlash(null), 250)
      nextWord()
    } else {
      setFlash('bad')
      sfx.bad()
      setScore((s) => Math.max(0, s - 3))
      setTimeout(() => setFlash(null), 300)
      setInput('')
    }
  }

  function skip() {
    setSkipped((n) => n + 1)
    nextWord()
    inputRef.current?.focus()
  }

  if (phase === 'ready') {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">⌨️</div>
        <h2 className="mt-3 text-xl font-extrabold">Nghe & gõ</h2>
        <p className="mt-2 text-slate-600">
          Nghe từ tiếng Anh, gõ lại đúng chính tả trong {TIME} giây. Bạn thấy nghĩa tiếng Việt làm gợi ý; từ tiếng Anh
          bị ẩn (bấm “Xem từ” nếu bí).
        </p>
        {!ttsSupported() && <p className="mt-2 text-sm text-rose-500">Trình duyệt không hỗ trợ giọng đọc, bạn sẽ chỉ thấy nghĩa.</p>}
        <button onClick={start} className="mt-5 rounded-2xl bg-teal-500 px-8 py-3 font-bold text-white">
          Bắt đầu
        </button>
      </div>
    )
  }

  if (phase === 'over') {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">🏁</div>
        <h2 className="mt-3 text-xl font-extrabold">Hết giờ!</h2>
        <p className="mt-2 text-3xl font-extrabold text-teal-600">{correct} từ đúng</p>
        <p className="text-slate-600">
          {score} điểm · bỏ qua {skipped} · +{correct * 3 + 3} XP
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-2xl bg-teal-500 px-6 py-3 font-bold text-white">
            Chơi lại
          </button>
          <button onClick={goHome} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${flash === 'bad' ? 'shake' : ''}`}>
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow">
        <span className="font-extrabold text-teal-600">⏱ {Math.max(0, left)}s</span>
        <span className="font-bold">Điểm {score}</span>
        <span className="font-bold">✔ {correct}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-teal-500 transition-all" style={{ width: `${(left / TIME) * 100}%` }} />
      </div>

      {word && (
        <div
          className={`rounded-3xl p-6 text-center shadow-lg transition-colors ${flash === 'ok' ? 'bg-emerald-100' : flash === 'bad' ? 'bg-rose-100' : 'bg-white'}`}
        >
          <div className="text-sm text-slate-400">{word.pos}</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{word.vi}</div>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={() => void speak(word.en)} className="rounded-full bg-teal-50 px-4 py-2 text-teal-700">
              🔊 Nghe lại
            </button>
            <button onClick={() => setShowEn(true)} className="rounded-full bg-slate-100 px-4 py-2 text-slate-600">
              👁 Xem từ
            </button>
          </div>
          {showEn && <div className="pop mt-3 text-xl font-bold tracking-wide text-indigo-700">{word.en}</div>}
        </div>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Gõ từ bạn nghe được…"
          className="min-w-0 flex-1 rounded-2xl border-2 border-teal-200 bg-white px-4 py-3 text-lg outline-none focus:border-teal-500"
        />
        <button className="rounded-2xl bg-teal-500 px-5 font-bold text-white">OK</button>
      </form>
      <button onClick={skip} className="w-full rounded-2xl bg-white py-2 text-sm text-slate-500 shadow-sm">
        Bỏ qua từ này
      </button>
    </div>
  )
}
