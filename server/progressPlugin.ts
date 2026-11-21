import type { IncomingMessage, ServerResponse } from 'node:http'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

const MAX_BODY = 8_000_000
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
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
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

type Saved = { updatedAt?: number; xp?: number; cards?: Record<string, unknown> }

/**
 * Tự lưu tiến trình học ra file progress/progress.json trong thư mục dự án (chỉ chạy ở máy chủ dev).
 * Chỉ nhận yêu cầu từ chính máy này, cùng nguồn, và có header riêng.
 */
export function progressPlugin(): Plugin {
  return {
    name: 'toeic-progress-file',
    configureServer(server) {
      const dir = resolve(server.config.root, 'progress')
      const file = join(dir, 'progress.json')
      const backups = join(dir, 'backups')

      const readSaved = (): Saved | null => {
        try {
          return JSON.parse(readFileSync(file, 'utf8')) as Saved
        } catch {
          return null
        }
      }

      function backup(prev: Saved | null, next: Saved) {
        if (!existsSync(file)) return
        mkdirSync(backups, { recursive: true })
        const day = new Date().toLocaleDateString('sv-SE')
        const daily = join(backups, `progress-${day}.json`)
        if (!existsSync(daily)) copyFileSync(file, daily) // bản đầu tiên của mỗi ngày
        // Nếu dữ liệu mới ít hơn hẳn bản cũ (ví dụ vừa bấm Xóa tất cả), giữ lại bản cũ trước khi ghi đè.
        const dropped = (prev?.xp ?? 0) > 50 && (next.xp ?? 0) < (prev?.xp ?? 0) * 0.5
        if (dropped) copyFileSync(file, join(backups, `before-drop-${Date.now()}.json`))
        const all = readdirSync(backups).filter((f) => f.startsWith('progress-')).sort()
        for (const old of all.slice(0, Math.max(0, all.length - 14))) unlinkSync(join(backups, old))
      }

      server.middlewares.use('/api/progress', (req, res) => {
        void (async () => {
          try {
            const origin = req.headers.origin
            if (origin) {
              const host = req.headers.host
              let ok = false
              try {
                ok = new URL(origin).host === host
              } catch {
                ok = false
              }
              if (!ok) return send(res, 403, { error: 'forbidden' })
            }
            if (req.headers['x-progress'] !== '1') return send(res, 400, { error: 'bad-request' })
            if (!LOOPBACK.has(req.socket.remoteAddress ?? '')) return send(res, 403, { error: 'local-only' })

            if (req.method === 'GET') {
              const saved = readSaved()
              return saved ? send(res, 200, saved) : send(res, 404, { error: 'none' })
            }
            if (req.method !== 'PUT') return send(res, 405, { error: 'method' })

            const parsed = JSON.parse(await readBody(req)) as Saved
            if (typeof parsed !== 'object' || parsed === null || typeof parsed.cards !== 'object' || typeof parsed.updatedAt !== 'number' || parsed.updatedAt <= 0) {
              return send(res, 400, { error: 'invalid' })
            }
            mkdirSync(dir, { recursive: true })
            const prev = readSaved()
            // Không ghi đè bản mới hơn bằng bản cũ hơn.
            if (prev?.updatedAt && prev.updatedAt > parsed.updatedAt) return send(res, 409, { error: 'older', updatedAt: prev.updatedAt })
            backup(prev, parsed)
            const tmp = `${file}.tmp`
            writeFileSync(tmp, JSON.stringify(parsed, null, 2), 'utf8')
            renameSync(tmp, file)
            send(res, 200, { ok: true, savedAt: Date.now() })
          } catch (e) {
            send(res, 500, { error: e instanceof Error && e.message === 'too-large' ? 'too-large' : 'server-error' })
          }
        })()
      })
    },
  }
}
