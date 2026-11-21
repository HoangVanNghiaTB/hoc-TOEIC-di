import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { MODES, buildSystem } from './prompts.ts'
import { isLocalAddress } from './local.ts'
import type { Mode } from './prompts.ts'

type Msg = { role: 'user' | 'assistant'; content: string }

const MAX_BODY = 40_000

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new Error('too-large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function parseMessages(v: unknown): Msg[] | null {
  if (!Array.isArray(v) || v.length < 1 || v.length > 24) return null
  const out: Msg[] = []
  for (const m of v) {
    if (typeof m !== 'object' || m === null) return null
    const { role, content } = m as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    if (!content.trim() || content.length > 3000) return null
    out.push({ role, content })
  }
  return out[0].role === 'user' && out[out.length - 1].role === 'user' ? out : null
}

function parseContext(v: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (typeof v === 'object' && v !== null) {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === 'string') out[k.slice(0, 40)] = val.slice(0, 3000)
    }
  }
  return out
}

/** API giáo viên AI chạy trong máy chủ dev của Vite. Khóa API chỉ nằm ở phía máy chủ. */
export function tutorPlugin(): Plugin {
  return {
    name: 'toeic-tutor-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '')
      const model = env.TUTOR_MODEL || 'claude-haiku-5-5'
      const pin = env.TUTOR_PIN || ''
      // Haiku 5.5 không có chuyển mô hình dự phòng phía máy chủ; chỉ bật cho các mô hình khác.
      const useFallback = env.TUTOR_FALLBACK !== 'off' && !/haiku/i.test(model)
      const configured = !!env.ANTHROPIC_API_KEY
      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY || undefined, maxRetries: 2, timeout: 120_000 })

      const hits: number[] = []

      server.middlewares.use('/api/tutor', (req, res) => {
        void (async () => {
          try {
            // Chặn trang web khác gọi vào máy này: yêu cầu cùng nguồn và có header riêng.
            const origin = req.headers.origin
            if (origin) {
              let host = ''
              try {
                host = new URL(origin).host
              } catch {
                /* bỏ qua */
              }
              if (host !== req.headers.host) return send(res, 403, { error: 'Nguồn không hợp lệ.' })
            }
            if (req.headers['x-tutor'] !== '1') return send(res, 403, { error: 'Thiếu header xác thực.' })

            // Từ mạng LAN (ví dụ điện thoại) phải có mã PIN, nếu không thì chỉ máy này được dùng.
            const local = isLocalAddress(req.socket.remoteAddress)
            if (!local) {
              if (!pin) return send(res, 403, { error: 'Giáo viên AI chỉ dùng được trên máy chủ. Đặt TUTOR_PIN trong .env để dùng từ điện thoại.' })
              if (req.headers['x-tutor-pin'] !== pin) return send(res, 401, { error: 'Sai mã PIN.' })
            }

            const path = (req.url ?? '/').split('?')[0]
            if (req.method === 'GET' && path === '/status') {
              return send(res, 200, { configured, model, needsPin: !local && !!pin })
            }
            if (req.method !== 'POST' || path !== '/') return send(res, 404, { error: 'Không tìm thấy.' })
            if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
              return send(res, 415, { error: 'Cần JSON.' })
            }

            const now = Date.now()
            while (hits.length && now - hits[0] > 60_000) hits.shift()
            if (hits.length >= 20) return send(res, 429, { error: 'Bạn gửi hơi nhanh, hãy đợi một chút rồi thử lại.' })
            hits.push(now)

            let body: Record<string, unknown>
            try {
              body = JSON.parse(await readBody(req)) as Record<string, unknown>
            } catch (err) {
              if (err instanceof Error && err.message === 'too-large') return send(res, 413, { error: 'Nội dung quá dài.' })
              return send(res, 400, { error: 'Dữ liệu không hợp lệ.' })
            }
            const mode = body.mode as Mode
            const messages = parseMessages(body.messages)
            if (!MODES.includes(mode) || !messages) return send(res, 400, { error: 'Yêu cầu không hợp lệ.' })

            if (!configured) {
              return send(res, 401, { error: 'Chưa có ANTHROPIC_API_KEY. Tạo file .env từ .env.example, điền khóa rồi chạy lại npm run dev.' })
            }

            const system = buildSystem(mode, parseContext(body.context))
            const effort = mode === 'explain' || mode === 'weekly' ? 'medium' : 'low'
            const base = {
              model,
              max_tokens: 2000,
              system,
              messages,
              output_config: { effort },
            } as const

            const response = useFallback
              ? await client.beta.messages.create({
                  ...base,
                  betas: ['server-side-fallback-2026-07-01'],
                  fallbacks: 'default',
                })
              : await client.messages.create(base)

            if (response.stop_reason === 'refusal') {
              return send(res, 200, { text: 'Xin lỗi, giáo viên AI không thể trả lời câu này. Bạn thử diễn đạt khác nhé.', refused: true })
            }
            const text = (response.content as { type: string; text?: string }[])
              .filter((b) => b.type === 'text')
              .map((b) => b.text ?? '')
              .join('')
              .trim()
            send(res, 200, {
              text: text || 'Giáo viên chưa trả lời được, bạn thử hỏi lại nhé.',
              truncated: response.stop_reason === 'max_tokens',
              usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
            })
          } catch (e) {
            if (e instanceof Anthropic.AuthenticationError) {
              return send(res, 401, { error: 'Chưa có khóa API hợp lệ. Hãy kiểm tra ANTHROPIC_API_KEY trong file .env rồi khởi động lại.' })
            }
            if (e instanceof Anthropic.RateLimitError) {
              return send(res, 429, { error: 'API đang giới hạn tốc độ, hãy thử lại sau ít phút.' })
            }
            if (e instanceof Anthropic.BadRequestError) {
              const hint = useFallback ? ' Nếu lỗi lặp lại, thử đặt TUTOR_FALLBACK=off trong .env.' : ''
              return send(res, 400, { error: `API từ chối yêu cầu: ${e.message}.${hint}` })
            }
            if (e instanceof Anthropic.APIError) {
              return send(res, 502, { error: `Lỗi từ API (${e.status ?? 'mạng'}). Thử lại sau.` })
            }
            send(res, 500, { error: 'Lỗi máy chủ.' })
          }
        })()
      })
    },
  }
}
