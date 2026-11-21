import type { State } from './store'
import { isMastered, isLearned } from './srs'
import { grammarTotals, levelOf, liveStreak } from './store'

export const START = new Date(2026, 10, 20) // 20/11/2026
export const EXAM = new Date(2027, 1, 25) // 25/02/2027 (ngày thi)

export type Phase = { name: string; from: number; to: number; focus: string; target: string }

export const PHASES: Phase[] = [
  { name: 'Nền tảng', from: 1, to: 4, focus: '600 từ cốt lõi, ngữ pháp cơ bản, nghe Part 1–2', target: '250–300' },
  { name: 'Xây dựng', from: 5, to: 9, focus: '+600 từ công sở, Part 3–4, Part 5–6', target: '400–450' },
  { name: 'Tăng tốc', from: 10, to: 13, focus: 'Luyện đề theo Part, phân tích câu sai', target: '500–550' },
  { name: 'Về đích', from: 14, to: 14, focus: '2–3 đề full test, ôn sổ lỗi sai', target: '600+' },
]

/** Mục tiêu số từ lũy kế đến cuối mỗi tuần. */
export const WORD_TARGET = [140, 280, 420, 600, 720, 840, 960, 1080, 1200, 1200, 1200, 1200, 1200, 1200]

const DAY = 86400000

export function weekOf(now = new Date()): number {
  const w = Math.floor((now.getTime() - START.getTime()) / (7 * DAY)) + 1
  return Math.min(14, Math.max(1, w))
}

export const daysToExam = (now = new Date()) =>
  Math.max(0, Math.ceil((EXAM.getTime() - now.getTime()) / DAY))

export const phaseOf = (week: number) => PHASES.find((p) => week >= p.from && week <= p.to) ?? PHASES[0]

export function weekRange(week: number): string {
  const a = new Date(START.getTime() + (week - 1) * 7 * DAY)
  const b = new Date(a.getTime() + 6 * DAY)
  const f = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`
  return `${f(a)} – ${f(b)}`
}

// ---- Huy hiệu ----
export type Badge = { id: string; icon: string; name: string; desc: string; check: (s: State) => boolean }

const learnedCount = (s: State) => Object.values(s.cards).filter(isLearned).length
const masteredCount = (s: State) => Object.values(s.cards).filter(isMastered).length

export const BADGES: Badge[] = [
  { id: 'w10', icon: '🌱', name: 'Khởi đầu', desc: 'Học 10 từ đầu tiên', check: (s) => learnedCount(s) >= 10 },
  { id: 'w50', icon: '📘', name: 'Chăm chỉ', desc: 'Học 50 từ', check: (s) => learnedCount(s) >= 50 },
  { id: 'w100', icon: '🏅', name: 'Trăm từ', desc: 'Học 100 từ', check: (s) => learnedCount(s) >= 100 },
  { id: 'm10', icon: '🧠', name: 'Nhớ lâu', desc: '10 từ đã thuộc (ôn cách ≥21 ngày)', check: (s) => masteredCount(s) >= 10 },
  { id: 's3', icon: '🔥', name: 'Lửa nhỏ', desc: 'Streak 3 ngày', check: (s) => Math.max(s.bestStreak, liveStreak(s)) >= 3 },
  { id: 's7', icon: '🔥', name: 'Một tuần', desc: 'Streak 7 ngày', check: (s) => Math.max(s.bestStreak, liveStreak(s)) >= 7 },
  { id: 's30', icon: '🏆', name: 'Kiên trì', desc: 'Streak 30 ngày', check: (s) => Math.max(s.bestStreak, liveStreak(s)) >= 30 },
  { id: 'c10', icon: '⚡', name: 'Combo 10', desc: 'Combo 10 trong game ghép từ', check: (s) => s.best.combo >= 10 },
  { id: 't15', icon: '⌨️', name: 'Tay nhanh', desc: '15 từ đúng trong 60 giây (gõ)', check: (s) => s.best.typing >= 15 },
  { id: 'l5', icon: '⭐', name: 'Cấp 5', desc: 'Đạt cấp 5', check: (s) => levelOf(s.xp) >= 5 },
  { id: 'q50', icon: '✍️', name: 'Ngữ pháp 50', desc: 'Trả lời đúng 50 câu Part 5', check: (s) => grammarTotals(s).ok >= 50 },
  { id: 'dict20', icon: '🎧', name: 'Tai thính', desc: '20 câu chép chính tả đạt ≥90%', check: (s) => (s.stats['l-dict']?.ok ?? 0) >= 20 },
  { id: 'p2-20', icon: '👂', name: 'Nghe hỏi đáp', desc: 'Đúng 20 câu Part 2', check: (s) => (s.stats['l-p2']?.ok ?? 0) >= 20 },
  { id: 'fix10', icon: '🛠️', name: 'Sửa lỗi', desc: 'Xóa 10 câu khỏi sổ lỗi sai', check: (s) => s.fixed >= 10 },
  { id: 'les5', icon: '🎓', name: 'Chăm đọc', desc: 'Học xong 5 bài ngữ pháp', check: (s) => s.lessons.length >= 5 },
  { id: 'ord8', icon: '🧱', name: 'Xếp câu hoàn hảo', desc: 'Đúng 8/8 câu ở game Sắp xếp câu', check: (s) => s.best.order >= 8 },
  { id: 'all', icon: '👑', name: 'Hoàn tất ngữ pháp', desc: 'Học đủ 9 bài ngữ pháp', check: (s) => s.lessons.length >= 9 },
]
