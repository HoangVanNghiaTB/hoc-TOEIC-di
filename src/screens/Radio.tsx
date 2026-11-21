import { useEffect, useMemo, useRef, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word } from '../data/words'
import { dueWords, isLearned } from '../lib/srs'
import { addXp, getState } from '../lib/store'
import { hasVietnameseVoice, speak, stopSpeaking, ttsSupported } from '../lib/audio'

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function Radio() {
  const list = useMemo<Word[]>(() => {
    const s = getState()
    const due = dueWords(s, WORDS)
    const learned = WORDS.filter((w) => isLearned(s.cards[w.id]))
    const base = due.length >= 5 ? due : learned.length >= 5 ? learned : WORDS.slice(0, 20)
    return base.slice(0, 40)
  }, [])

  const [playing, setPlaying] = useState(false)
  const [idx, setIdx] = useState(0)
  const [rate, setRate] = useState(0.9)
  const [withExample, setWithExample] = useState(true)
  const [withVi, setWithVi] = useState(true)
  const run = useRef(0) // token để hủy vòng phát cũ
  const cfg = useRef({ rate, withExample, withVi })
  cfg.current = { rate, withExample, withVi }
  const heard = useRef(0)

  async function loop(startAt: number, token: number) {
    let i = startAt
    while (run.current === token) {
      const w = list[i % list.length]
      setIdx(i % list.length)
      const { rate: r, withExample: ex, withVi: vi } = cfg.current
      await speak(w.en, 'en', r)
      if (run.current !== token) return
      await wait(700)
      if (vi) {
        await speak(w.vi, 'vi', 1)
        if (run.current !== token) return
        await wait(500)
      }
      if (ex) {
        await speak(w.ex, 'en', r)
        if (run.current !== token) return
      }
      await wait(1200)
      heard.current += 1
      i += 1
    }
  }

  function play() {
    run.current += 1
    setPlaying(true)
    void loop(idx, run.current)
  }

  function pause() {
    run.current += 1
    stopSpeaking()
    setPlaying(false)
    if (heard.current > 0) {
      addXp(Math.min(heard.current, 30))
      heard.current = 0
    }
  }

  useEffect(
    () => () => {
      run.current += 1
      stopSpeaking()
    },
    [],
  )

  const w = list[idx]

  if (!ttsSupported()) {
    return <div className="rounded-3xl bg-white p-6 shadow">Trình duyệt này không hỗ trợ giọng đọc. Hãy dùng Chrome hoặc Edge.</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-center text-white shadow-lg">
        <div className="text-sm opacity-90">📻 Radio nghe thụ động · {list.length} từ</div>
        <div className="mt-4 text-4xl font-extrabold">{w.en}</div>
        <div className="mt-1 opacity-90">{w.ipa}</div>
        <div className="mt-3 text-2xl font-bold">{w.vi}</div>
        {withExample && <div className="mt-3 text-sm opacity-95">“{w.ex}”</div>}
        <div className="mt-5 text-xs opacity-80">
          {idx + 1}/{list.length}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            const wasPlaying = playing
            run.current += 1
            stopSpeaking()
            setIdx((i) => (i - 1 + list.length) % list.length)
            if (wasPlaying) setTimeout(() => { run.current += 1; void loop(Math.max(0, idx - 1), run.current) }, 50)
          }}
          className="rounded-2xl bg-white px-5 py-3 text-xl shadow"
        >
          ⏮
        </button>
        <button
          onClick={playing ? pause : play}
          className="rounded-2xl bg-amber-500 px-10 py-3 text-xl font-bold text-white shadow"
        >
          {playing ? '⏸ Tạm dừng' : '▶ Phát'}
        </button>
        <button
          onClick={() => {
            const wasPlaying = playing
            run.current += 1
            stopSpeaking()
            setIdx((i) => (i + 1) % list.length)
            if (wasPlaying) setTimeout(() => { run.current += 1; void loop((idx + 1) % list.length, run.current) }, 50)
          }}
          className="rounded-2xl bg-white px-5 py-3 text-xl shadow"
        >
          ⏭
        </button>
      </div>

      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <label className="flex items-center justify-between text-sm">
          <span>Tốc độ đọc: {rate.toFixed(2)}x</span>
          <input type="range" min={0.6} max={1.3} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Đọc câu ví dụ</span>
          <input type="checkbox" checked={withExample} onChange={(e) => setWithExample(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Đọc nghĩa tiếng Việt {!hasVietnameseVoice() && '(máy chưa có giọng Việt)'}</span>
          <input type="checkbox" checked={withVi} onChange={(e) => setWithVi(e.target.checked)} />
        </label>
        <p className="text-xs text-slate-400">
          Radio lấy các từ cần ôn hôm nay (hoặc các từ đã học). Nghe nền lúc làm việc khác; tab trình duyệt cần
          được mở. Thưởng XP khi bạn bấm tạm dừng.
        </p>
      </div>
    </div>
  )
}
