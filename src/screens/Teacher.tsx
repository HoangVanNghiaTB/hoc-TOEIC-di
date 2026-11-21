import { useEffect, useRef, useState } from 'react'
import { askTutor, getPin, setPin, takePending, tutorStatus } from '../lib/tutor'
import type { TutorMode, TutorMsg, TutorStatus } from '../lib/tutor'
import { WORDS } from '../data/words'
import { TAGS } from '../data/questions'
import { daysToExam, weekOf } from '../lib/roadmap'
import { getState, liveStreak } from '../lib/store'
import { isLearned, isMastered } from '../lib/srs'
import { speak, stopSpeaking, ttsSupported } from '../lib/audio'

const SCENARIOS = [
  { title: 'Phỏng vấn xin việc', role: 'a friendly interviewer at a software company', scenario: 'a job interview for an office assistant position' },
  { title: 'Đặt phòng khách sạn', role: 'a hotel receptionist', scenario: 'the learner calls a hotel to book a room for two nights' },
  { title: 'Dời lịch họp', role: 'a colleague named Mr. Kim', scenario: 'the learner asks a colleague to move tomorrow’s meeting to another day' },
  { title: 'Đơn hàng bị trễ', role: 'a supplier’s customer service agent', scenario: 'the learner calls because an order has not arrived on time' },
  { title: 'Mua vé tàu', role: 'a ticket agent at a train station', scenario: 'the learner buys a train ticket and asks about the departure time' },
  { title: 'Khiếu nại sản phẩm', role: 'a customer service representative', scenario: 'the learner wants a refund for a broken printer' },
  { title: 'Chào đồng nghiệp mới', role: 'a new colleague', scenario: 'the learner introduces themselves to a new coworker on the first day' },
]

type Mic = {
  lang: string
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

function makeMic(): Mic | null {
  const w = window as unknown as { SpeechRecognition?: new () => Mic; webkitSpeechRecognition?: new () => Mic }
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition
  return C ? new C() : null
}

function weeklyStats(): string {
  const s = getState()
  const cards = Object.values(s.cards)
  const lines = [
    `Tuần ${weekOf()}/14, còn ${daysToExam()} ngày đến mốc thi.`,
    `Streak hiện tại: ${liveStreak(s)} ngày (dài nhất ${s.bestStreak}).`,
    `Từ vựng: đã học ${cards.filter(isLearned).length}/${WORDS.length} từ, đã thuộc lâu ${cards.filter(isMastered).length} từ.`,
    `Số bài ngữ pháp đã học: ${s.lessons.length}/9.`,
    `Sổ lỗi sai đang có ${Object.keys(s.mistakes).length} câu; đã sửa xong ${s.fixed} câu.`,
  ]
  for (const t of TAGS) {
    const st = s.stats[t.id]
    if (st) lines.push(`Part 5 – ${t.name}: đúng ${st.ok}/${st.total}`)
  }
  const d = s.stats['l-dict']
  const p = s.stats['l-p2']
  if (d) lines.push(`Chép chính tả: đạt ${d.ok}/${d.total} câu.`)
  if (p) lines.push(`Part 2 nghe hỏi–đáp: đúng ${p.ok}/${p.total}.`)
  lines.push(`Hôm nay: ${s.daily.reviewed} thẻ, ${s.daily.xp} XP.`)
  return lines.join('\n')
}

type Chat = { msgs: TutorMsg[]; feedback: Record<number, string> }

export default function Teacher() {
  const [status, setStatus] = useState<TutorStatus | null | 'loading'>('loading')
  const [tab, setTab] = useState<'chat' | 'speak'>('chat')
  const [pinInput, setPinInput] = useState(getPin())

  useEffect(() => {
    void tutorStatus().then(setStatus)
  }, [])

  if (status === 'loading') return <div className="rounded-3xl bg-white p-6 text-center shadow">Đang kết nối…</div>

  if (status === null) {
    return (
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">🧑‍🏫 Giáo viên AI</h2>
        <p className="text-sm text-slate-600">
          Không kết nối được máy chủ giáo viên. Có hai nguyên nhân thường gặp:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Web không chạy bằng <b>npm run dev</b> (giáo viên AI không có trong bản build).</li>
          <li>Bạn đang mở từ điện thoại mà chưa nhập mã PIN. Đặt <b>TUTOR_PIN</b> trong file <b>.env</b>, rồi nhập PIN bên dưới.</li>
        </ul>
        <p className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">
          Chưa dùng API? Bạn vẫn học được bình thường: bấm <b>📋 Chép để hỏi AI</b> ở câu khó, dán vào claude.ai, rồi lưu lời giải thích bằng <b>📝 Ghi chú</b>.
        </p>
        <div className="flex gap-2">
          <input
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Mã PIN"
            className="min-w-0 flex-1 rounded-2xl border-2 border-slate-200 px-3 py-2"
          />
          <button
            onClick={() => {
              setPin(pinInput)
              setStatus('loading')
              void tutorStatus().then(setStatus)
            }}
            className="rounded-2xl bg-indigo-600 px-4 font-bold text-white"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!status.configured) {
    return (
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">🧑‍🏫 Giáo viên AI</h2>
        <p className="text-sm text-slate-600">Máy chủ đã chạy nhưng chưa có khóa API. Làm theo 3 bước:</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Tạo khóa API tại trang quản lý của Anthropic (console.anthropic.com), phần API Keys.</li>
          <li>
            Trong thư mục dự án, sao chép <b>.env.example</b> thành <b>.env</b>, rồi điền <b>ANTHROPIC_API_KEY=khóa-của-bạn</b>.
          </li>
          <li>Tắt rồi chạy lại <b>npm run dev</b>, tải lại trang này.</li>
        </ol>
        <p className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">
          Chưa dùng API? Bạn vẫn học được bình thường: bấm <b>📋 Chép để hỏi AI</b> ở câu khó, dán vào claude.ai, rồi lưu lời giải thích bằng <b>📝 Ghi chú</b>.
        </p>
        <p className="text-xs text-slate-400">
          Khóa chỉ nằm ở máy chủ trên máy bạn, không bao giờ được gửi xuống trình duyệt. Tiền dùng API tính theo lượng dùng.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(
          [
            ['chat', '💬 Trò chuyện'],
            ['speak', '🎤 Nhập vai nói'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              stopSpeaking()
              setTab(id)
            }}
            className={`flex-1 rounded-2xl py-3 font-bold ${tab === id ? 'bg-violet-600 text-white shadow' : 'bg-white text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'chat' ? <ChatPane /> : <SpeakPane />}
      <p className="text-center text-[11px] text-slate-400">
        Mô hình: {status.model}. Nội dung bạn gõ hoặc nói được gửi tới Anthropic để tạo câu trả lời.
      </p>
    </div>
  )
}

// ------------------------------------------------------------------ Trò chuyện
function ChatPane() {
  const [chat, setChat] = useState<Chat>({ msgs: [], feedback: {} })
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ctx, setCtx] = useState<{ mode: TutorMode; context: Record<string, string> }>({ mode: 'chat', context: {} })
  const bottom = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  async function send(text: string, mode: TutorMode = ctx.mode, context: Record<string, string> = ctx.context, base: TutorMsg[] = chat.msgs) {
    const msgs = [...base, { role: 'user' as const, content: text }]
    setChat({ msgs, feedback: {} })
    setBusy(true)
    setError('')
    try {
      const r = await askTutor({ mode, messages: msgs.slice(-12), context })
      setChat({ msgs: [...msgs, { role: 'assistant', content: r.truncated ? r.text + ' …' : r.text }], feedback: {} })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    const p = takePending()
    if (p) {
      setCtx({ mode: p.mode, context: p.context })
      void send(p.prompt, p.mode, p.context, [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.msgs.length, busy])

  function weekly() {
    setCtx({ mode: 'weekly', context: { stats: weeklyStats() } })
    void send('Hãy nhận xét tuần học của tôi.', 'weekly', { stats: weeklyStats() }, [])
  }

  const empty = chat.msgs.length === 0

  return (
    <div className="space-y-3">
      <div className="min-h-[300px] space-y-3 rounded-3xl bg-white p-4 shadow">
        {empty && (
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              Chào bạn! Tôi là giáo viên AI. Hỏi tôi về từ vựng, ngữ pháp, cách làm Part 5, hoặc bấm “Hỏi giáo viên AI” ngay trên câu hỏi bạn vừa làm sai.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Khác nhau giữa since và for là gì?',
                'Làm sao nhận biết chỗ trống cần tính từ hay trạng từ?',
                'Gợi ý cách học 20 từ mới mỗi ngày',
              ].map((q) => (
                <button key={q} onClick={() => void send(q, 'chat', {}, [])} className="rounded-full bg-violet-50 px-3 py-2 text-left text-violet-700">
                  {q}
                </button>
              ))}
              <button onClick={weekly} className="rounded-full bg-amber-100 px-3 py-2 text-amber-800">
                📊 Nhận xét tuần học của tôi
              </button>
            </div>
          </div>
        )}
        {chat.msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
            >
              {m.content}
              {m.role === 'assistant' && ttsSupported() && (
                <button onClick={() => void speak(m.content.slice(0, 600), 'en', 0.95)} className="ml-2 text-xs opacity-60">
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="text-sm text-slate-400">Giáo viên đang trả lời…</div>}
        {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
        <div ref={bottom} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const t = input.trim()
          if (!t || busy) return
          setInput('')
          void send(t)
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi giáo viên bất cứ điều gì…"
          maxLength={1000}
          className="min-w-0 flex-1 rounded-2xl border-2 border-violet-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
        />
        <button disabled={busy || !input.trim()} className="rounded-2xl bg-violet-600 px-5 font-bold text-white disabled:bg-slate-300">
          Gửi
        </button>
      </form>
      {!empty && (
        <button
          onClick={() => {
            setChat({ msgs: [], feedback: {} })
            setCtx({ mode: 'chat', context: {} })
            setError('')
          }}
          className="w-full text-sm text-slate-400 underline"
        >
          Cuộc trò chuyện mới
        </button>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Nhập vai nói
function SpeakPane() {
  const [sc, setSc] = useState<(typeof SCENARIOS)[number] | null>(null)
  const [msgs, setMsgs] = useState<TutorMsg[]>([])
  const [feedback, setFeedback] = useState<Record<number, string>>({})
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const micRef = useRef<Mic | null>(null)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs.length, busy])

  useEffect(
    () => () => {
      micRef.current?.stop()
      stopSpeaking()
    },
    [],
  )

  function parse(text: string): { reply: string; fb: string } {
    const idx = text.indexOf('### Nhận xét')
    if (idx < 0) return { reply: text.trim(), fb: '' }
    return { reply: text.slice(0, idx).trim(), fb: text.slice(idx + '### Nhận xét'.length).trim() }
  }

  async function turn(userText: string, base: TutorMsg[], scenario: (typeof SCENARIOS)[number]) {
    const next = [...base, { role: 'user' as const, content: userText }]
    setBusy(true)
    setError('')
    if (userText !== '[START]') setMsgs(next)
    try {
      const r = await askTutor({
        mode: 'roleplay',
        messages: next.slice(-14),
        context: { role: scenario.role, scenario: scenario.scenario },
      })
      const { reply, fb } = parse(r.text)
      // Ghi lại hội thoại để gửi tiếp: lưu cả phần nhận xét trong nội dung assistant để giữ mạch.
      const assistantMsg: TutorMsg = { role: 'assistant', content: fb ? `${reply}\n\n### Nhận xét\n${fb}` : reply }
      const all = [...next, assistantMsg]
      setMsgs(all)
      if (fb) setFeedback((f) => ({ ...f, [all.length - 1]: fb }))
      if (autoSpeak) void speak(reply, 'en', 0.95)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
    } finally {
      setBusy(false)
    }
  }

  function start(s: (typeof SCENARIOS)[number]) {
    setSc(s)
    setMsgs([])
    setFeedback({})
    void turn('[START]', [], s)
  }

  function toggleMic() {
    if (listening) {
      micRef.current?.stop()
      return
    }
    const m = makeMic()
    if (!m) {
      setError('Trình duyệt này không hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge, hoặc gõ câu trả lời.')
      return
    }
    stopSpeaking()
    m.lang = 'en-US'
    m.interimResults = false
    m.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(' ')
      setInput((prev) => (prev ? prev + ' ' : '') + t)
    }
    m.onend = () => setListening(false)
    m.onerror = () => setListening(false)
    micRef.current = m
    setListening(true)
    m.start()
  }

  if (!sc) {
    return (
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="font-extrabold">🎤 Chọn tình huống</h2>
          <p className="mt-1 text-sm text-slate-500">
            Giáo viên đóng vai đối tác, bạn nói (hoặc gõ) bằng tiếng Anh. Mỗi lượt có nhận xét lỗi bằng tiếng Việt. Luyện nói giúp nhớ từ và cấu trúc lâu hơn, dù TOEIC Listening &amp; Reading không thi nói.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {SCENARIOS.map((s) => (
            <button key={s.title} onClick={() => start(s)} className="rounded-2xl bg-white px-4 py-4 text-left font-semibold shadow-sm">
              {s.title}
              <div className="text-xs font-normal text-slate-400">{s.scenario}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-violet-700">{sc.title}</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-slate-500">
            <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} /> Đọc to
          </label>
          <button
            onClick={() => {
              stopSpeaking()
              setSc(null)
            }}
            className="text-xs text-slate-400 underline"
          >
            Đổi tình huống
          </button>
        </div>
      </div>

      <div className="min-h-[260px] space-y-3 rounded-3xl bg-white p-4 shadow">
        {msgs.map((m, i) => {
          if (m.role === 'user') {
            if (m.content === '[START]') return null
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[88%] rounded-2xl bg-indigo-600 px-4 py-3 text-sm text-white">{m.content}</div>
              </div>
            )
          }
          const { reply } = parse(m.content)
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="max-w-[88%] whitespace-pre-wrap rounded-2xl bg-slate-100 px-4 py-3 text-sm">{reply}</div>
                <button onClick={() => void speak(reply, 'en', 0.95)} className="mt-2 text-sm opacity-60">
                  🔊
                </button>
              </div>
              {feedback[i] && (
                <div className="whitespace-pre-wrap rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                  <b>📝 Nhận xét:</b>
                  {'\n'}
                  {feedback[i]}
                </div>
              )}
            </div>
          )
        })}
        {busy && <div className="text-sm text-slate-400">Đang trả lời…</div>}
        {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
        <div ref={bottom} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const t = input.trim()
          if (!t || busy) return
          micRef.current?.stop()
          setInput('')
          void turn(t, msgs, sc)
        }}
        className="space-y-2"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={`rounded-2xl px-5 text-xl ${listening ? 'animate-pulse bg-rose-500 text-white' : 'bg-violet-100'}`}
            title="Nói bằng micro"
          >
            🎤
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? 'Đang nghe… hãy nói tiếng Anh' : 'Nói hoặc gõ câu trả lời bằng tiếng Anh…'}
            maxLength={500}
            className="min-w-0 flex-1 rounded-2xl border-2 border-violet-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
          />
          <button disabled={busy || !input.trim()} className="rounded-2xl bg-violet-600 px-5 font-bold text-white disabled:bg-slate-300">
            Gửi
          </button>
        </div>
        <p className="text-center text-xs text-slate-400">
          Bấm 🎤, nói xong bấm lại để dừng, kiểm tra chữ rồi bấm Gửi. Nhận dạng giọng chỉ gần đúng, nên đừng lo nếu có từ bị nghe sai.
        </p>
      </form>
    </div>
  )
}
