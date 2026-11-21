export type TutorMode = 'chat' | 'roleplay' | 'explain' | 'word' | 'weekly'
export type TutorMsg = { role: 'user' | 'assistant'; content: string }

const PIN_KEY = 'tutor-pin'

export const getPin = (): string => {
  try {
    return localStorage.getItem(PIN_KEY) ?? ''
  } catch {
    return ''
  }
}
export const setPin = (v: string) => {
  try {
    localStorage.setItem(PIN_KEY, v)
  } catch {
    /* bỏ qua */
  }
}

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-tutor': '1',
  'x-tutor-pin': getPin(),
})

export type TutorStatus = { configured: boolean; model: string; needsPin: boolean }

export async function tutorStatus(): Promise<TutorStatus | null> {
  try {
    const r = await fetch('/api/tutor/status', { headers: headers() })
    if (!r.ok) return null
    return (await r.json()) as TutorStatus
  } catch {
    return null
  }
}

export async function askTutor(body: {
  mode: TutorMode
  messages: TutorMsg[]
  context?: Record<string, string>
}): Promise<{ text: string; truncated?: boolean }> {
  let r: Response
  try {
    r = await fetch('/api/tutor', { method: 'POST', headers: headers(), body: JSON.stringify(body) })
  } catch {
    throw new Error('Không kết nối được máy chủ. Hãy chạy web bằng npm run dev.')
  }
  let data: { text?: string; error?: string; truncated?: boolean } = {}
  try {
    data = (await r.json()) as typeof data
  } catch {
    /* bỏ qua */
  }
  if (!r.ok) {
    throw new Error(
      data.error ??
        (r.status === 404
          ? 'Giáo viên AI chỉ chạy khi dùng npm run dev (không có trong bản build).'
          : `Lỗi ${r.status}`),
    )
  }
  return { text: data.text ?? '', truncated: data.truncated }
}

// ---- Cầu nối: các màn khác gọi giáo viên kèm ngữ cảnh ----
export type AskCtx = {
  mode: 'explain' | 'word'
  context: Record<string, string>
  prompt: string
}

let pending: AskCtx | null = null

export function askTeacher(c: AskCtx) {
  pending = c
  window.dispatchEvent(new Event('goto-teacher'))
}

export function takePending(): AskCtx | null {
  const p = pending
  pending = null
  return p
}
