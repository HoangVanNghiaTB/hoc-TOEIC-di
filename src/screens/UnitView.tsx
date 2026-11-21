import { useEffect, useRef, useState } from 'react'
import type { Unit } from '../lib/units'
import { PART_NAME } from '../lib/units'
import { speak, stopSpeaking, ttsSupported } from '../lib/audio'
import AskButton from './AskButton'
import DocView from './DocView'
import GraphicView from './GraphicView'
import { playRange } from '../lib/podcast'

function PhotoBox({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <div className="mt-3 rounded-2xl bg-rose-50 p-4 text-center text-sm text-rose-700">Không tải được ảnh “{src}”. Kiểm tra file có nằm trong public/photos/ không.</div>
  ) : (
    <img src={src} alt={alt} onError={() => setFailed(true)} className="mx-auto mt-3 max-h-80 w-full rounded-2xl bg-slate-100 object-contain" />
  )
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function UnitView({
  unit,
  mode,
  rate,
  onSubmit,
  onNext,
  nextLabel,
}: {
  unit: Unit
  mode: 'practice' | 'mock'
  rate: number
  onSubmit: (picks: (number | null)[]) => void
  onNext: () => void
  nextLabel: string
}) {
  const [picks, setPicks] = useState<(number | null)[]>(unit.qs.map(() => null))
  const [revealed, setRevealed] = useState(false)
  const [plays, setPlays] = useState(0)
  const [lit, setLit] = useState('')
  const token = useRef(0)
  const audioEl = useRef<HTMLAudioElement | null>(null)
  const clipTok = useRef({ v: 0 })
  const isMock = mode === 'mock'
  const maxPlays = isMock ? 2 : 99 // thi thử: nghe 1 lần + 1 lần nghe lại

  function stopAll() {
    token.current += 1
    stopSpeaking()
    clipTok.current.v += 1
    audioEl.current?.pause()
  }

  async function play() {
    if (unit.clip) {
      stopAll()
      if (!audioEl.current) audioEl.current = new Audio(unit.clip.src)
      setPlays((p) => p + 1)
      setLit('podcast')
      await playRange(audioEl.current, unit.clip.start, unit.clip.end, rate, clipTok.current)
      setLit('')
      return
    }
    if (!unit.audio) return
    token.current += 1
    const t = token.current
    stopSpeaking()
    setPlays((p) => p + 1)
    for (const part of unit.audio) {
      if (token.current !== t) return
      setLit(part.label ?? '')
      await speak(part.text, 'en', rate, { voice: part.voice, pitch: part.voice === 1 ? 1.1 : 1 })
      if (token.current !== t) return
      await wait(unit.part <= 2 ? 650 : 350)
    }
    if (token.current === t) setLit('')
  }

  useEffect(() => {
    if (!unit.audio && !unit.clip) return
    const t = setTimeout(() => void play(), 350)
    return () => {
      clearTimeout(t)
      stopAll()
      audioEl.current = null
    }
    // chỉ phát tự động khi đổi đơn vị
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.id])

  const allDone = picks.every((p) => p !== null)

  function submit() {
    stopAll()
    onSubmit(picks)
    if (isMock) onNext()
    else setRevealed(true)
  }

  const letters = 'ABCD'

  // Có đoạn đọc / hình / ảnh: chia hai cột trên desktop (nội dung bên trái, câu hỏi bên phải).
  const split = !!(unit.passage || unit.graphic || unit.image)

  return (
    <div className={split ? 'grid gap-3 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-5' : 'space-y-3'}>
      <div className={`rounded-3xl bg-white p-4 shadow-lg ${split ? 'lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">{PART_NAME[unit.part]}</span>
          <span className="text-xs text-slate-400">{unit.part === 1 && !revealed ? '' : unit.title}</span>
        </div>

        {unit.image && <PhotoBox src={unit.image.src} alt={unit.image.alt} />}
        {unit.graphic && <GraphicView g={unit.graphic} />}

        {(unit.audio || unit.clip) && (
          <div className="mt-4 text-center">
            {unit.clip || ttsSupported() ? (
              <button
                onClick={() => void play()}
                disabled={plays >= maxPlays && !revealed}
                className="rounded-full bg-indigo-600 px-7 py-3 font-bold text-white shadow disabled:bg-slate-300"
              >
                🔊 {plays === 0 ? 'Nghe' : plays >= maxPlays && !revealed ? 'Đã hết lượt nghe lại' : 'Nghe lại'}
              </button>
            ) : (
              <p className="text-sm text-rose-500">Trình duyệt không hỗ trợ giọng đọc. Hãy dùng Chrome hoặc Edge.</p>
            )}
            {lit && <p className="mt-2 text-sm text-indigo-600">🔊 Đang phát {unit.part <= 3 && lit !== 'podcast' ? `(${lit})` : ''}…</p>}
            {isMock && <p className="mt-1 text-[11px] text-slate-400">Thi thử: nghe một lần và được nghe lại một lần.</p>}
          </div>
        )}

        {unit.passage &&
          (unit.part === 6 || unit.part === 7 ? (
            <DocView text={unit.passage} />
          ) : (
            <div className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-[15px] leading-relaxed">{unit.passage.replace('___', '_______')}</div>
          ))}
      </div>

      <div className="space-y-3">
      {unit.qs.map((uq, qi) => {
        const picked = picks[qi]
        return (
          <div key={uq.id} className="space-y-2 rounded-3xl bg-white p-4 shadow">
            {unit.qs.length > 1 && <div className="text-xs font-bold text-slate-400">Câu {qi + 1}</div>}
            <p className="font-semibold">{uq.q}</p>
            <div className="space-y-2">
              {uq.opts.map((o, oi) => {
                const hidden = unit.hideOpts && !revealed
                let cls = 'border-slate-200 bg-white'
                if (!revealed && picked === oi) cls = 'border-indigo-500 bg-indigo-50'
                if (revealed && oi === uq.a) cls = 'border-emerald-500 bg-emerald-50'
                else if (revealed && picked === oi) cls = 'border-rose-500 bg-rose-50'
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => setPicks((p) => p.map((v, k) => (k === qi ? oi : v)))}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left ${cls}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                      {letters[oi]}
                    </span>
                    {hidden ? <span className="text-slate-300">· · ·</span> : o}
                  </button>
                )
              })}
            </div>
            {revealed && (
              <div className="pop space-y-2 rounded-2xl bg-indigo-50 p-3 text-sm">
                <p>
                  <b>{picked === uq.a ? '✅ Chính xác! ' : '❌ Chưa đúng. '}</b>
                  {uq.why}
                </p>
                <AskButton
                  ctx={{
                    mode: 'explain',
                    context: {
                      question: `${unit.passage ? unit.passage + '\n' : ''}${unit.transcript ? unit.transcript.join('\n') + '\n' : ''}${uq.q}`,
                      options: uq.opts.map((o, k) => `${letters[k]}. ${o}`).join(' | '),
                      picked: picked === null ? '(chưa chọn)' : `${letters[picked]}. ${uq.opts[picked]}`,
                      correct: `${letters[uq.a]}. ${uq.opts[uq.a]}`,
                      note: uq.why,
                    },
                    prompt: `Giải thích giúp tôi câu này (${PART_NAME[unit.part]}).`,
                  }}
                />
              </div>
            )}
          </div>
        )
      })}

      {revealed && (unit.transcript || unit.vi) && (
        <div className="pop space-y-2 rounded-3xl bg-white p-4 text-sm shadow">
          {unit.transcript && (
            <div>
              <div className="font-bold">📜 Nội dung nghe</div>
              <div className="mt-1 space-y-1 whitespace-pre-wrap text-slate-700">
                {unit.transcript.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          )}
          {unit.vi && <p className="text-slate-500">🇻🇳 {unit.vi}</p>}
        </div>
      )}

      {!revealed ? (
        <button
          onClick={submit}
          disabled={isMock ? false : !allDone}
          className="w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300"
        >
          {isMock ? nextLabel : allDone ? 'Nộp bài' : 'Hãy chọn đủ đáp án'}
        </button>
      ) : (
        <button onClick={onNext} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white shadow">
          {nextLabel}
        </button>
      )}
      </div>
    </div>
  )
}
