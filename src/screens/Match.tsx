import { useEffect, useMemo, useRef, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { addXp, getState, recordBest } from '../lib/store'
import { isLearned } from '../lib/srs'
import { sfx, speak } from '../lib/audio'

const TIME = 60
const SLOTS = 5

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

function buildPool(): Word[] {
  const s = getState()
  const learned = WORDS.filter((w) => isLearned(s.cards[w.id]))
  const pool = learned.length >= 12 ? learned : WORDS
  return shuffle(pool)
}

export default function Match({ goHome }: { goHome: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'play' | 'over'>('ready')
  const [left, setLeft] = useState(TIME)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [pairs, setPairs] = useState(0)
  const [active, setActive] = useState<Word[]>([])
  const [rightOrder, setRightOrder] = useState<string[]>([])
  const [selEn, setSelEn] = useState<string | null>(null)
  const [selVi, setSelVi] = useState<string | null>(null)
  const [wrong, setWrong] = useState(false)
  const pool = useRef<Word[]>([])
  const next = useRef(0)

  const byId = useMemo(() => new Map(WORDS.map((w) => [w.id, w])), [])

  function start() {
    pool.current = buildPool()
    next.current = SLOTS
    const first = pool.current.slice(0, SLOTS)
    setActive(first)
    setRightOrder(shuffle(first.map((w) => w.id)))
    setScore(0)
    setCombo(0)
    setBestCombo(0)
    setPairs(0)
    setLeft(TIME)
    setSelEn(null)
    setSelVi(null)
    setPhase('play')
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
      recordBest('match', score)
      recordBest('combo', bestCombo)
      addXp(Math.round(score / 2) + 5)
    }
  }, [left, phase, score, bestCombo])

  function check(en: string, vi: string) {
    if (en === vi) {
      const c = combo + 1
      setCombo(c)
      setBestCombo((b) => Math.max(b, c))
      setScore((sc) => sc + 10 + Math.min(c, 10) * 2)
      setPairs((p) => p + 1)
      sfx.good()
      void speak(byId.get(en)!.en)
      // thay cặp vừa ghép bằng cặp mới
      const w = pool.current[next.current % pool.current.length]
      next.current += 1
      const newActive = active.map((a) => (a.id === en ? w : a))
      setActive(newActive)
      setRightOrder((order) => order.map((id) => (id === en ? w.id : id)))
    } else {
      setCombo(0)
      setScore((sc) => Math.max(0, sc - 5))
      setWrong(true)
      sfx.bad()
      setTimeout(() => setWrong(false), 300)
    }
    setSelEn(null)
    setSelVi(null)
  }

  function pickEn(id: string) {
    setSelEn(id)
    if (selVi) check(id, selVi)
  }
  function pickVi(id: string) {
    setSelVi(id)
    if (selEn) check(selEn, id)
  }

  if (phase === 'ready') {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">🧩</div>
        <h2 className="mt-3 text-xl font-extrabold">Ghép từ – nghĩa</h2>
        <p className="mt-2 text-slate-600">
          Ghép từ tiếng Anh với nghĩa đúng trong {TIME} giây. Ghép liên tiếp để tăng combo, ghép sai bị trừ điểm.
        </p>
        <button onClick={start} className="mt-5 rounded-2xl bg-pink-500 px-8 py-3 font-bold text-white">
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
        <p className="mt-2 text-3xl font-extrabold text-pink-600">{score} điểm</p>
        <p className="text-slate-600">
          {pairs} cặp đúng · combo cao nhất {bestCombo} · +{Math.round(score / 2) + 5} XP
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-2xl bg-pink-500 px-6 py-3 font-bold text-white">
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
    <div className={`space-y-3 ${wrong ? 'shake' : ''}`}>
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow">
        <span className="font-extrabold text-pink-600">⏱ {Math.max(0, left)}s</span>
        <span className="font-bold">Điểm {score}</span>
        <span className="font-bold text-amber-600">Combo ×{combo}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-pink-500 transition-all" style={{ width: `${(left / TIME) * 100}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {active.map((w) => (
            <button
              key={w.id}
              onClick={() => pickEn(w.id)}
              className={`w-full rounded-2xl border-2 px-3 py-4 text-lg font-bold shadow-sm ${selEn === w.id ? 'border-pink-500 bg-pink-50' : 'border-transparent bg-white'}`}
            >
              {w.en}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightOrder.map((id) => (
            <button
              key={id}
              onClick={() => pickVi(id)}
              className={`flex min-h-[60px] w-full items-center justify-center rounded-2xl border-2 px-3 py-3 text-sm font-semibold shadow-sm ${selVi === id ? 'border-pink-500 bg-pink-50' : 'border-transparent bg-white'}`}
            >
              {byId.get(id)!.vi}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
