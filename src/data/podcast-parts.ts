// Bài Part 3/4 lấy từ podcast cá nhân của người học.
// Dữ liệu thật (có lời chép của tác giả podcast) nằm trong podcast-parts.local.ts, KHÔNG đưa lên git (xem .gitignore).
// Nếu file đó không tồn tại (ví dụ vừa tải dự án từ GitHub), danh sách này rỗng và các bài podcast tự ẩn.
export type PodQ = { q: string; opts: [string, string, string, string]; a: 0 | 1 | 2 | 3; why: string }
export type PodSet = {
  id: string
  kind: 'p3' | 'p4'
  title: string
  file: string // đường dẫn trong /podcasts
  start: number // giây trong file
  end: number
  lines: string[]
  vi: string
  qs: PodQ[]
}

const mods = import.meta.glob('./podcast-parts.local.ts', { eager: true }) as Record<string, { PODCAST_SETS?: PodSet[] }>

export const PODCAST_SETS: PodSet[] = Object.values(mods)[0]?.PODCAST_SETS ?? []
