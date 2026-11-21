import { useSyncExternalStore } from 'react'

/**
 * Part 1 (Tranh ảnh): ảnh và câu mô tả do người học tự thêm vào public/photos/.
 * Danh sách nằm trong public/photos/part1.json (xem docs/PART1_HUONG_DAN.md).
 */
export type P1Item = {
  id: string
  /** Tên file ảnh trong public/photos/, ví dụ "meeting-01.jpg". */
  file: string
  title: string
  /** 4 câu mô tả (A–D); đúng một câu mô tả đúng nhất bức ảnh. */
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  /** Giải thích bằng tiếng Việt: vì sao đáp án đúng, các câu còn lại sai ở đâu. */
  why: string
  /** Tùy chọn: dịch / tóm tắt tiếng Việt về bức ảnh. */
  vi?: string
}

let items: P1Item[] = []
let loaded = false
const subs = new Set<() => void>()
const notify = () => subs.forEach((f) => f())

/** Chỉ nhận tên file trong thư mục photos: không đường dẫn, không địa chỉ ngoài. */
const safeFile = (f: unknown): f is string => typeof f === 'string' && /^[\w.\-() ]+\.(jpe?g|png|webp|gif|avif)$/i.test(f) && !f.includes('..')

function clean(raw: unknown): P1Item[] {
  if (!Array.isArray(raw)) return []
  const out: P1Item[] = []
  const seen = new Set<string>()
  for (const r of raw) {
    if (typeof r !== 'object' || r === null) continue
    const x = r as Record<string, unknown>
    const opts = x.options
    if (
      typeof x.id !== 'string' ||
      !x.id ||
      seen.has(x.id) ||
      !safeFile(x.file) ||
      typeof x.title !== 'string' ||
      !Array.isArray(opts) ||
      opts.length !== 4 ||
      !opts.every((o) => typeof o === 'string' && o.trim()) ||
      typeof x.answer !== 'number' ||
      ![0, 1, 2, 3].includes(x.answer) ||
      typeof x.why !== 'string'
    ) {
      console.warn('Part 1: bỏ qua mục không hợp lệ', x.id)
      continue
    }
    seen.add(x.id)
    out.push({
      id: x.id,
      file: x.file,
      title: x.title,
      options: opts as P1Item['options'],
      answer: x.answer as P1Item['answer'],
      why: x.why,
      vi: typeof x.vi === 'string' ? x.vi : undefined,
    })
  }
  return out
}

/** Đọc danh sách Part 1. Gọi một lần khi mở web; không bao giờ ném lỗi. */
export async function loadPart1(): Promise<void> {
  try {
    const r = await fetch('/photos/part1.json', { cache: 'no-store' })
    const ct = r.headers.get('content-type') ?? ''
    if (r.ok && ct.includes('json')) {
      const j = (await r.json()) as { items?: unknown }
      items = clean(j.items)
    }
  } catch {
    items = []
  }
  loaded = true
  notify()
}

export const part1Items = () => items
export const part1Count = () => items.length
export const part1Loaded = () => loaded

/** Đủ ảnh để đưa vào kế hoạch và điều kiện điểm (cần ít nhất 6 ảnh). */
export const PART1_MIN = 6
export const part1Ready = () => items.length >= PART1_MIN

/** Hook để giao diện cập nhật khi danh sách ảnh tải xong. */
export function usePart1(): number {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => items.length,
  )
}
