import type { Card, State } from './store'
import { getState, setCard } from './store'
import type { Word } from '../data/words'

export type Grade = 0 | 1 | 2 | 3 // Quên, Khó, Nhớ, Dễ

const DAY = 86400000

export const newCard = (): Card => ({ ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 })

export function schedule(c: Card, grade: Grade, now = Date.now()): Card {
  let { ease, interval, reps, lapses } = c
  if (grade === 0) {
    lapses += 1
    reps = 0
    ease = Math.max(1.3, ease - 0.2)
    return { ease, interval: 0, reps, lapses, due: now + 60_000 }
  }
  if (grade === 1) {
    ease = Math.max(1.3, ease - 0.15)
    interval = Math.max(1, Math.round(Math.max(interval, 1) * 1.2))
  } else if (grade === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease)
  } else {
    ease += 0.15
    interval = reps === 0 ? 3 : Math.round(Math.max(interval, 1) * ease * 1.3)
  }
  return { ease, interval, reps: reps + 1, lapses, due: now + interval * DAY }
}

export const GRADE_XP: Record<Grade, number> = { 0: 1, 1: 3, 2: 5, 3: 6 }

/** Chấm một thẻ: cập nhật lịch ôn + XP. Trả về thẻ mới. */
export function gradeWord(id: string, grade: Grade): Card {
  const prev = getState().cards[id]
  const next = schedule(prev ?? newCard(), grade)
  setCard(id, next, { isNew: !prev, xp: GRADE_XP[grade] + (!prev && grade > 0 ? 5 : 0) })
  return next
}

export function dueWords(s: State, words: Word[], now = Date.now()): Word[] {
  return words
    .filter((w) => s.cards[w.id] && s.cards[w.id].due <= now)
    .sort((a, b) => s.cards[a.id].due - s.cards[b.id].due)
}

export function newWords(s: State, words: Word[]): Word[] {
  const left = Math.max(0, s.settings.newPerDay - s.daily.newLearned)
  return words.filter((w) => !s.cards[w.id]).slice(0, left)
}

/** Từ đã thuộc: khoảng cách ôn ≥ 21 ngày. */
export const isMastered = (c?: Card) => !!c && c.interval >= 21
export const isLearned = (c?: Card) => !!c && c.reps > 0
