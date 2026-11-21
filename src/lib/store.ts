import { useSyncExternalStore } from 'react'

export type Card = {
  ease: number
  interval: number // ngày
  due: number // epoch ms
  reps: number
  lapses: number
  /** Thời điểm học lần đầu (epoch ms), dùng để kiểm tra các từ học trong buổi. */
  at?: number
}

export type State = {
  cards: Record<string, Card>
  xp: number
  streak: number
  bestStreak: number
  lastDay: string
  daily: { date: string; reviewed: number; xp: number; newLearned: number }
  best: { match: number; typing: number; combo: number; order: number }
  settings: { newPerDay: number; dailyGoal: number; planMin: 60 | 90 }
  startedAt: string
  /** Sổ lỗi sai: câu hỏi sai, cần trả lời đúng 2 lần liên tiếp để xóa. */
  mistakes: Record<string, { wrong: number; streak: number }>
  /** Thống kê Part 5 theo chủ đề. */
  stats: Record<string, { ok: number; total: number }>
  fixed: number
  lessons: string[]
  /** Mục người dùng đánh dấu nghi sai: 'w:từ', 'q:id', 'l:id'. */
  flags: Record<string, true>
  /** Lịch sử theo ngày (không gồm hôm nay, hôm nay nằm ở `daily`). */
  dayLog: Record<string, { xp: number; reviewed: number }>
  /** Kết quả các bài thi thử. */
  tests: TestResult[]
  /** Ghi chú cá nhân (ví dụ giải thích dán từ AI bên ngoài). */
  notes: Note[]
  /** Các đoạn podcast đã nghe xong. */
  podcastDone: Record<string, true>
  /** Kế hoạch hằng ngày: ngày -> các mục đã xong ('_bonus' = đã nhận thưởng). */
  planDone: Record<string, string[]>
  /** Buổi học hiện tại (1, 2, 3…). Buổi sau chỉ mở khi buổi trước đã hoàn thành, không tính theo ngày. */
  sessionNo: number
  /** Các từ học lần đầu trong từng buổi: số buổi -> id từ. */
  sessionWords: Record<string, string[]>
  /** Thời điểm hoàn thành từng buổi (epoch ms). */
  sessionDone: Record<string, number>
  /** Lần thay đổi gần nhất (epoch ms); 0 = chưa có thao tác nào. Dùng để đồng bộ với file progress.json. */
  updatedAt: number
  /** Điểm kiểm tra tốt nhất (0–1) của từng bước kiểm tra trong buổi: khóa 's1:vcheck'. */
  checkBest: Record<string, number>
  /** Kết quả gần nhất các câu Part 2–7 trong từng buổi: số buổi -> khóa thống kê -> [đúng/sai]. */
  sessionAnswers: Record<string, Record<string, boolean[]>>
}

export type Note = {
  id: string
  title: string
  body: string
  tags: string[]
  createdAt: number
  updatedAt: number
  srs: Card
}

export type TestResult = {
  date: string
  correct: number
  total: number
  listening: { ok: number; total: number }
  reading: { ok: number; total: number }
  score: number // điểm quy đổi ước tính (rất thô)
  seconds: number
}

const KEY = 'toeic-quest-v1'

export const dayStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const yesterday = () => dayStr(new Date(Date.now() - 86400000))

const fresh = (): State => ({
  cards: {},
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: '',
  daily: { date: dayStr(), reviewed: 0, xp: 0, newLearned: 0 },
  best: { match: 0, typing: 0, combo: 0, order: 0 },
  settings: { newPerDay: 20, dailyGoal: 30, planMin: 60 },
  startedAt: dayStr(),
  mistakes: {},
  stats: {},
  fixed: 0,
  lessons: [],
  flags: {},
  dayLog: {},
  tests: [],
  notes: [],
  podcastDone: {},
  planDone: {},
  sessionNo: 1,
  sessionWords: {},
  sessionDone: {},
  updatedAt: 0,
  checkBest: {},
  sessionAnswers: {},
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const base = fresh()
      const p = JSON.parse(raw) as Partial<State>
      const hasData = Object.keys(p.cards ?? {}).length > 0 || (p.xp ?? 0) > 0
      return {
        ...base,
        ...p,
        updatedAt: p.updatedAt ?? (hasData ? Date.now() : 0),
        daily: { ...base.daily, ...p.daily },
        best: { ...base.best, ...p.best },
        settings: { ...base.settings, ...p.settings },
      }
    }
  } catch {
    /* bỏ qua */
  }
  return fresh()
}

let state: State = load()
const listeners = new Set<() => void>()

function commit(next: State, keepStamp = false) {
  state = keepStamp ? next : { ...next, updatedAt: Date.now() }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* bỏ qua */
  }
  listeners.forEach((l) => l())
}

export const getState = () => state

export function subscribeStore(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Nạp tiến trình từ file progress.json (giữ nguyên mốc thời gian của file). */
export function adoptState(p: Partial<State>) {
  const base = fresh()
  commit(
    {
      ...base,
      ...p,
      daily: { ...base.daily, ...p.daily },
      best: { ...base.best, ...p.best },
      settings: { ...base.settings, ...p.settings },
    },
    true,
  )
}

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

/** Cập nhật ngày học: reset thống kê ngày, tính streak. */
function touch(s: State): State {
  const t = dayStr()
  const daily = s.daily.date === t ? s.daily : { date: t, reviewed: 0, xp: 0, newLearned: 0 }
  let dayLog = s.dayLog
  if (s.daily.date !== t && (s.daily.xp > 0 || s.daily.reviewed > 0)) {
    dayLog = { ...dayLog, [s.daily.date]: { xp: s.daily.xp, reviewed: s.daily.reviewed } }
    const keys = Object.keys(dayLog).sort()
    if (keys.length > 120) for (const k of keys.slice(0, keys.length - 120)) delete dayLog[k]
  }
  let { streak, bestStreak, lastDay } = s
  if (lastDay !== t) {
    streak = lastDay === yesterday() ? streak + 1 : 1
    lastDay = t
    bestStreak = Math.max(bestStreak, streak)
  }
  return { ...s, daily, dayLog, streak, bestStreak, lastDay }
}

/** Streak hiển thị (về 0 nếu đã lỡ hơn một ngày). */
export function liveStreak(s: State): number {
  return s.lastDay === dayStr() || s.lastDay === yesterday() ? s.streak : 0
}

export function addXp(n: number) {
  const s = touch(state)
  commit({ ...s, xp: s.xp + n, daily: { ...s.daily, xp: s.daily.xp + n } })
}

export function setCard(id: string, card: Card, opts: { isNew: boolean; xp: number }) {
  const s = touch(state)
  const sk = String(s.sessionNo)
  const inSession = s.sessionWords[sk] ?? []
  commit({
    ...s,
    sessionWords: opts.isNew && !inSession.includes(id) ? { ...s.sessionWords, [sk]: [...inSession, id] } : s.sessionWords,
    xp: s.xp + opts.xp,
    cards: { ...s.cards, [id]: { ...card, at: s.cards[id]?.at ?? (opts.isNew ? Date.now() : undefined) } },
    daily: {
      ...s.daily,
      xp: s.daily.xp + opts.xp,
      reviewed: s.daily.reviewed + 1,
      newLearned: s.daily.newLearned + (opts.isNew ? 1 : 0),
    },
  })
}

/** Ghi kết quả một câu hỏi: thống kê theo chủ đề, sổ lỗi sai, XP. */
const GATED_STATS = new Set(['p5', 'r-p6', 'r-p7', 'l-p1', 'l-p2', 'l-p3', 'l-p4', 'l-dict', 'l-pod'])

/** Ghi kết quả câu Part 2–7 vào buổi học hiện tại (giữ 40 câu gần nhất mỗi loại). */
function withSessionAnswer(s: State, key: string, ok: boolean): State['sessionAnswers'] {
  if (!GATED_STATS.has(key)) return s.sessionAnswers
  const sk = String(s.sessionNo)
  const cur = s.sessionAnswers[sk] ?? {}
  return { ...s.sessionAnswers, [sk]: { ...cur, [key]: [...(cur[key] ?? []), ok].slice(-40) } }
}

export function recordAnswer(qid: string, tag: string, ok: boolean, xp: number) {
  const s = touch(state)
  const st = s.stats[tag] ?? { ok: 0, total: 0 }
  const stats = { ...s.stats, [tag]: { ok: st.ok + (ok ? 1 : 0), total: st.total + 1 } }
  const mistakes = { ...s.mistakes }
  let fixed = s.fixed
  const m = mistakes[qid]
  if (!ok) {
    mistakes[qid] = { wrong: (m?.wrong ?? 0) + 1, streak: 0 }
  } else if (m) {
    if (m.streak + 1 >= 2) {
      delete mistakes[qid]
      fixed += 1
    } else {
      mistakes[qid] = { ...m, streak: m.streak + 1 }
    }
  }
  commit({ ...s, stats, mistakes, fixed, sessionAnswers: withSessionAnswer(s, 'p5', ok), xp: s.xp + xp, daily: { ...s.daily, xp: s.daily.xp + xp } })
}

/** Thống kê cho bài nghe (không đụng sổ lỗi sai). */
export function recordStat(tag: string, ok: boolean, xp: number) {
  const s = touch(state)
  const st = s.stats[tag] ?? { ok: 0, total: 0 }
  commit({
    ...s,
    stats: { ...s.stats, [tag]: { ok: st.ok + (ok ? 1 : 0), total: st.total + 1 } },
    sessionAnswers: withSessionAnswer(s, tag, ok),
    xp: s.xp + xp,
    daily: { ...s.daily, xp: s.daily.xp + xp },
  })
}

export function toggleFlag(key: string) {
  const flags = { ...state.flags }
  if (flags[key]) delete flags[key]
  else flags[key] = true
  commit({ ...state, flags })
}

/** Thống kê Part 5 (chỉ các chủ đề ngữ pháp, không tính bài nghe). */
export function grammarTotals(s: State): { ok: number; total: number } {
  let ok = 0
  let total = 0
  for (const [k, v] of Object.entries(s.stats)) {
    if (k.startsWith('l-') || k.startsWith('r-') || k.startsWith('v-')) continue
    ok += v.ok
    total += v.total
  }
  return { ok, total }
}

export function recordTest(t: TestResult) {
  const s = touch(state)
  const xp = Math.round(t.correct * 2)
  commit({
    ...s,
    tests: [...s.tests, t].slice(-50),
    xp: s.xp + xp,
    daily: { ...s.daily, xp: s.daily.xp + xp },
  })
}

export function markChunkDone(id: string) {
  if (state.podcastDone[id]) return
  const s = touch(state)
  commit({ ...s, podcastDone: { ...s.podcastDone, [id]: true }, xp: s.xp + 8, daily: { ...s.daily, xp: s.daily.xp + 8 } })
}

// ---- Ghi chú ----
const newNoteCard = (): Card => ({ ease: 2.5, interval: 0, due: Date.now(), reps: 0, lapses: 0 })

export function saveNote(n: { id?: string; title: string; body: string; tags: string[] }): string {
  const now = Date.now()
  const title = n.title.trim().slice(0, 200)
  const body = n.body.slice(0, 20000)
  if (n.id && state.notes.some((x) => x.id === n.id)) {
    commit({ ...state, notes: state.notes.map((x) => (x.id === n.id ? { ...x, title, body, tags: n.tags, updatedAt: now } : x)) })
    return n.id
  }
  const id = `n${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`
  commit({ ...state, notes: [{ id, title, body, tags: n.tags, createdAt: now, updatedAt: now, srs: newNoteCard() }, ...state.notes].slice(0, 500) })
  return id
}

export function deleteNote(id: string) {
  commit({ ...state, notes: state.notes.filter((x) => x.id !== id) })
}

export function setNoteSrs(id: string, card: Card, xp: number) {
  const s = touch(state)
  commit({
    ...s,
    notes: s.notes.map((x) => (x.id === id ? { ...x, srs: card } : x)),
    xp: s.xp + xp,
    daily: { ...s.daily, xp: s.daily.xp + xp },
  })
}

export function markLesson(id: string) {
  if (state.lessons.includes(id)) return
  const s = touch(state)
  commit({ ...s, lessons: [...s.lessons, id], xp: s.xp + 10, daily: { ...s.daily, xp: s.daily.xp + 10 } })
}

export function recordBest(kind: 'match' | 'typing' | 'combo' | 'order', value: number) {
  if (value > state.best[kind]) commit({ ...state, best: { ...state.best, [kind]: value } })
}

export function setSettings(p: Partial<State['settings']>) {
  commit({ ...state, settings: { ...state.settings, ...p } })
}

export function exportJson(): string {
  return JSON.stringify(state, null, 2)
}

export function importJson(text: string): boolean {
  try {
    const p = JSON.parse(text) as Partial<State>
    if (typeof p !== 'object' || p === null || typeof p.cards !== 'object') return false
    const base = fresh()
    commit({
      ...base,
      ...p,
      daily: { ...base.daily, ...p.daily },
      best: { ...base.best, ...p.best },
      settings: { ...base.settings, ...p.settings },
    })
    return true
  } catch {
    return false
  }
}

export function resetAll() {
  commit(fresh())
}

// ---- Cấp độ ----
export const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 60)) + 1
export const xpForLevel = (lv: number) => (lv - 1) ** 2 * 60

export function titleOf(level: number): string {
  if (level < 3) return 'Newbie'
  if (level < 5) return 'Intern'
  if (level < 8) return 'Office Worker'
  if (level < 12) return 'Team Lead'
  return 'Manager'
}

/** Khóa lưu tiến độ của một buổi học. */
export const sessionKey = (n: number) => `s${n}`

/**
 * Đánh dấu một mục của buổi học hiện tại. `force` = true: chỉ đánh dấu xong (không bỏ đánh dấu).
 * Xong hết các mục: buổi hoàn thành, thưởng 30 XP một lần.
 */
export function togglePlanTask(key: string, id: string, allIds: string[], force = false) {
  const s = touch(state)
  const cur = s.planDone[key] ?? []
  if (force && cur.includes(id)) return
  let next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
  let bonus = 0
  let sessionDone = s.sessionDone
  if (allIds.every((x) => next.includes(x)) && !next.includes('_bonus')) {
    next = [...next, '_bonus']
    bonus = 30
    sessionDone = { ...sessionDone, [key.slice(1)]: Date.now() }
  }
  commit({
    ...s,
    planDone: { ...s.planDone, [key]: next },
    sessionDone,
    xp: s.xp + bonus,
    daily: { ...s.daily, xp: s.daily.xp + bonus },
  })
}

/** Sang buổi tiếp theo, chỉ khi buổi hiện tại đã hoàn thành. */
export function nextSession(): boolean {
  if (!state.sessionDone[String(state.sessionNo)]) return false
  commit({ ...state, sessionNo: state.sessionNo + 1 })
  return true
}

/** Điểm tối thiểu của bước kiểm tra để được tính là hoàn thành (và mở buổi sau). */
export const PASS_RATE = 0.7

/** Ghi điểm một bước kiểm tra; đạt từ PASS_RATE trở lên thì tự đánh dấu mục đó xong. Trả về true nếu đạt. */
export function recordCheckResult(sKey: string, taskId: string, pct: number, allIds: string[]): boolean {
  const k = `${sKey}:${taskId}`
  const best = Math.max(state.checkBest[k] ?? 0, pct)
  commit({ ...state, checkBest: { ...state.checkBest, [k]: best } })
  if (pct >= PASS_RATE) {
    togglePlanTask(sKey, taskId, allIds, true)
    return true
  }
  return false
}
