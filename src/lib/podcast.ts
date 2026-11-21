export type PSentence = { s: number; e: number; t: string } // giây, tính từ đầu đoạn
export type PChunk = { id: string; file: string; dur: number; sentences: PSentence[] }
export type PEpisode = { id: string; title: string; level: string; duration: number; chunks: PChunk[] }
export type PIndex = { episodes: PEpisode[] }

let cache: PIndex | null | undefined

/** Đọc danh sách podcast đã cắt sẵn (public/podcasts/index.json). Trả về null nếu chưa có. */
export async function loadPodcastIndex(): Promise<PIndex | null> {
  if (cache !== undefined) return cache
  try {
    const r = await fetch('/podcasts/index.json', { cache: 'no-store' })
    const ct = r.headers.get('content-type') ?? ''
    if (!r.ok || !ct.includes('json')) {
      cache = null
      return null
    }
    const j = (await r.json()) as PIndex
    cache = Array.isArray(j.episodes) && j.episodes.length ? j : null
  } catch {
    cache = null
  }
  return cache
}

export const fmtTime = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`
export const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

/**
 * Phát một khoảng [start, end] của audio. Trả về hàm hủy; promise resolve khi phát xong hoặc bị hủy.
 */
export function playRange(audio: HTMLAudioElement, start: number, end: number, rate: number, token: { v: number }): Promise<void> {
  return new Promise((resolve) => {
    const my = ++token.v
    audio.playbackRate = rate
    audio.currentTime = Math.max(0, start)
    let timer = 0
    const finish = (pause: boolean) => {
      window.clearInterval(timer)
      audio.removeEventListener('ended', onEnded)
      // Chỉ dừng audio nếu lượt phát này vẫn là lượt mới nhất (tránh cắt ngang lượt phát kế tiếp).
      if (pause && token.v === my && !audio.paused) audio.pause()
      resolve()
    }
    const onEnded = () => finish(true)
    audio.addEventListener('ended', onEnded)
    audio.play().then(
      () => {
        timer = window.setInterval(() => {
          if (token.v !== my) finish(false)
          else if (audio.currentTime >= end) finish(true)
        }, 40)
      },
      () => finish(false),
    )
  })
}
