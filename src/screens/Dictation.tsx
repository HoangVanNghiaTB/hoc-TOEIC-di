import { useEffect, useRef, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { diffSentence } from '../lib/diff'
import type { DiffResult } from '../lib/diff'
import { getState, recordStat } from '../lib/store'
import { isLearned } from '../lib/srs'
import { sfx, speak, stopSpeaking, ttsSupported } from '../lib/audio'
import FlagButton from './FlagButton'

const ROUND = 6

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

function build(): Word[] {
  const s = getState()
  const learned = WORDS.filter((w) => isLearned(s.cards[w.id]))
  const ok = (w: Word) => {
    const n = w.ex.split(' ').length
    return n >= 5 && n <= 12
  }
  const pool = (learned.length >= 12 ? learned : WORDS).filter(ok)
  return shuffle(pool).slice(0, ROUND)
}

export default function Dictation({ goBack }: { goBack: () => void }) {
  const [items, setItems] = useState<Word[]>(build)
  const [i, setI] = useState(0)
  const [rate, setRate] = useState(0.9)
  const [text, setText] = useState('')
  const [res, setRes] = useState<DiffResult | null>(null)
  const [plays, setPlays] = useState(0)
  const [showVi, setShowVi] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const [over, setOver] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const cur = items[i]

  function play(r = rate) {
    stopSpeaking()
    setPlays((p) => p + 1)
    void speak(cur.ex, 'en', r)
  }

  useEffect(() => {
    if (over || !cur) return
    const t = setTimeout(() => void speak(cur.ex, 'en', rate), 300)
    inputRef.current?.focus()
    return () => {
      clearTimeout(t)
      stopSpeaking()
    }
    // chỉ phát tự động khi đổi câu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, over])

  function check() {
    const r = diffSentence(cur.ex, text)
    setRes(r)
    const good = r.accuracy >= 0.9
    recordStat('l-dict', good, good ? 4 : 1)
    setScores((s) => [...s, r.accuracy])
    if (good) sfx.good()
    else sfx.bad()
  }

  function next() {
    if (i + 1 >= items.length) {
      sfx.win()
      setOver(true)
      return
    }
    setI(i + 1)
    setText('')
    setRes(null)
    setPlays(0)
    setShowVi(false)
  }

  function restart() {
    setItems(build())
    setI(0)
    setText('')
    setRes(null)
    setPlays(0)
    setShowVi(false)
    setScores([])
    setOver(false)
  }

  if (!ttsSupported()) {
    return <div className="rounded-3xl bg-white p-6 shadow">Trình duyệt không hỗ trợ giọng đọc. Hãy dùng Chrome hoặc Edge.</div>
  }

  if (over) {
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0
    const good = scores.filter((x) => x >= 0.9).length
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">🎧</div>
        <h2 className="mt-3 text-xl font-extrabold">Xong bài chép chính tả!</h2>
        <p className="mt-2 text-3xl font-extrabold text-sky-600">{avg}% chính xác</p>
        <p className="text-slate-600">
          {good}/{items.length} câu đạt ≥90% · +{good * 4 + (items.length - good)} XP
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={restart} className="rounded-2xl bg-sky-500 px-6 py-3 font-bold text-white">
            Chơi lại
          </button>
          <button onClick={goBack} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-sky-700">
          Câu {i + 1}/{items.length}
        </span>
        <span className="text-slate-400">Đã nghe {plays} lần</span>
      </div>

      <div className="rounded-3xl bg-white p-5 text-center shadow-lg">
        <p className="text-sm text-slate-500">Nghe rồi gõ lại đúng câu bạn nghe được.</p>
        <button onClick={() => play()} className="mt-3 rounded-full bg-sky-500 px-8 py-4 text-lg font-bold text-white shadow">
          🔊 Nghe lại
        </button>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          {[0.75, 0.9, 1.1].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRate(r)
                play(r)
              }}
              className={`rounded-full px-3 py-1 ${rate === r ? 'bg-sky-100 font-bold text-sky-700' : 'bg-slate-100 text-slate-500'}`}
            >
              {r === 0.75 ? 'Chậm' : r === 0.9 ? 'Vừa' : 'Nhanh'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowVi((v) => !v)} className="mt-3 text-sm text-slate-400 underline">
          {showVi ? 'Ẩn gợi ý' : 'Xem gợi ý nghĩa tiếng Việt'}
        </button>
        {showVi && <p className="pop mt-1 text-sm text-emerald-600">{cur.exVi}</p>}
      </div>

      {!res ? (
        <>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Gõ câu bạn nghe được…"
            className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-lg outline-none focus:border-sky-500"
          />
          <button
            onClick={check}
            disabled={!text.trim()}
            className="w-full rounded-2xl bg-sky-500 py-3 font-bold text-white shadow disabled:bg-slate-300"
          >
            Kiểm tra
          </button>
        </>
      ) : (
        <div className="pop space-y-3 rounded-3xl bg-white p-5 shadow">
          <div className="text-center text-2xl font-extrabold">
            {res.accuracy >= 0.9 ? '✅' : res.accuracy >= 0.6 ? '🟡' : '❌'} {Math.round(res.accuracy * 100)}%
          </div>
          <p className="text-lg leading-relaxed">
            {res.ref.map((w, k) => (
              <span key={k} className={`mr-1 ${w.ok ? 'text-emerald-600' : 'rounded bg-rose-100 px-1 font-bold text-rose-600'}`}>
                {w.word}
              </span>
            ))}
          </p>
          {res.extra.length > 0 && (
            <p className="text-sm text-slate-500">
              Từ bạn gõ nhưng không khớp: <span className="text-rose-500">{res.extra.join(' ')}</span>
            </p>
          )}
          <p className="text-sm text-slate-400">{cur.exVi}</p>
          <div className="flex items-center justify-between">
            <FlagButton id={`w:${cur.id}`} />
            <button onClick={() => void speak(cur.ex, 'en', rate)} className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700">
              🔊 Nghe lại
            </button>
          </div>
          <button onClick={next} className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white">
            {i + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </div>
  )
}
