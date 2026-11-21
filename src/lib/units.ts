import { P2_QUESTIONS } from '../data/listening'
import type { P2 } from '../data/listening'
import { QUESTIONS } from '../data/questions'
import type { Question } from '../data/questions'
import { P3, P4, P6, P7 } from '../data/parts'
import { P3_2, P4_2, P6_2, P7_2 } from '../data/parts-2'
import { P7_3 } from '../data/parts-3'
import type { PartSet, Graphic } from '../data/parts'
import { P3_G, P4_G } from '../data/parts-graphic'
import { P7_4 } from '../data/parts-docs'
import { PODCAST_SETS } from '../data/podcast-parts'
import type { PodSet } from '../data/podcast-parts'
import { loadPodcastIndex } from './podcast'
import { loadPart1, part1Items, part1Ready } from './part1'
import type { P1Item } from './part1'
import { recordAnswer, recordStat } from './store'

/** Có podcast đã cắt trong public/podcasts hay chưa (bài bổ trợ chỉ dùng khi có). */
let podReady = false
void loadPodcastIndex().then((i) => {
  podReady = !!i
})
void loadPart1()
export const podcastAvailable = () => podReady

export type UQ = {
  id: string
  q: string
  opts: string[]
  a: number
  why: string
  /** Khóa thống kê: l-p2, l-p3, l-p4, r-p6, r-p7 hoặc 'p5' (dùng sổ lỗi sai). */
  stat: string
  tag?: string // chủ đề Part 5
}

export type AudioPart = { text: string; voice?: 0 | 1; pitch?: number; label?: string }

export type Unit = {
  id: string
  part: 1 | 2 | 3 | 4 | 5 | 6 | 7
  title: string
  audio?: AudioPart[]
  /** Ảnh hiển thị phía trên (Part 1), đường dẫn dưới /photos/. */
  image?: { src: string; alt: string }
  /** Bảng, biểu đồ hoặc sơ đồ kèm theo (Part 3, 4). */
  graphic?: Graphic
  /** Đoạn audio thật (podcast) thay cho giọng máy. */
  clip?: { src: string; start: number; end: number }
  /** Part 2: ẩn nội dung các lựa chọn cho đến khi nộp bài. */
  hideOpts?: boolean
  passage?: string
  transcript?: string[]
  vi?: string
  qs: UQ[]
}

export const PART_NAME: Record<number, string> = {
  1: 'Part 1 · Tranh ảnh',
  2: 'Part 2 · Hỏi–Đáp',
  3: 'Part 3 · Hội thoại',
  4: 'Part 4 · Bài nói',
  5: 'Part 5 · Điền câu',
  6: 'Part 6 · Điền đoạn',
  7: 'Part 7 · Đọc hiểu',
}

export const sectionOf = (part: number): 'listening' | 'reading' => (part <= 4 ? 'listening' : 'reading')

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export function unitFromP2(p: P2): Unit {
  const order = shuffle([0, 1, 2])
  const rs = order.map((i) => p.r[i])
  return {
    id: p.id,
    part: 2,
    title: 'Chọn lời đáp phù hợp nhất',
    hideOpts: true,
    audio: [
      { text: p.q, voice: 0 },
      ...rs.map((t, i) => ({ text: t, voice: 1 as const, label: 'ABC'[i] })),
    ],
    transcript: [`${p.q} — ${p.viQ}`],
    vi: `Đáp án: ${p.r[0]} — ${p.viA}`,
    qs: [{ id: p.id, q: 'Chọn A, B hoặc C', opts: rs, a: order.indexOf(0), why: p.why, stat: 'l-p2' }],
  }
}

export function unitFromSet(s: PartSet): Unit {
  const qs: UQ[] = s.qs.map((x, i) => ({
    id: `${s.id}-${i}`,
    q: x.q,
    opts: x.opts as string[],
    a: x.a,
    why: x.why,
    stat: s.kind === 'p3' ? 'l-p3' : s.kind === 'p4' ? 'l-p4' : s.kind === 'p6' ? 'r-p6' : 'r-p7',
  }))
  const part = Number(s.kind.slice(1)) as 3 | 4 | 6 | 7
  if (s.kind === 'p3') {
    return {
      id: s.id,
      part,
      title: s.title,
      audio: (s.lines ?? []).map(([who, text]) => ({ text, voice: who === 'A' ? 0 : 1, label: who })),
      transcript: (s.lines ?? []).map(([who, t]) => `${who === 'A' ? '👤 A' : '👥 B'}: ${t}`),
      vi: s.vi,
      graphic: s.graphic,
      qs,
    }
  }
  if (s.kind === 'p4') {
    return { id: s.id, part, title: s.title, audio: [{ text: s.text ?? '', voice: 0 }], transcript: [s.text ?? ''], vi: s.vi, graphic: s.graphic, qs }
  }
  return { id: s.id, part, title: s.title, passage: s.text, vi: s.vi, qs }
}

export function unitFromPod(s: PodSet): Unit {
  return {
    id: s.id,
    part: s.kind === 'p3' ? 3 : 4,
    title: `🎙️ ${s.title}`,
    clip: { src: `/podcasts/${s.file}`, start: s.start, end: s.end },
    transcript: s.lines,
    vi: s.vi,
    qs: s.qs.map((x, i) => ({ id: `${s.id}-${i}`, q: x.q, opts: x.opts as string[], a: x.a, why: x.why, stat: s.kind === 'p3' ? 'l-p3' : 'l-p4' })),
  }
}

const podSets = (kind: 'p3' | 'p4') => (podReady ? PODCAST_SETS.filter((x) => x.kind === kind) : [])

export function unitFromP1(p: P1Item): Unit {
  const order = shuffle([0, 1, 2, 3])
  const opts = order.map((i) => p.options[i])
  return {
    id: p.id,
    part: 1,
    title: p.title,
    image: { src: `/photos/${encodeURIComponent(p.file)}`, alt: p.title },
    hideOpts: true,
    audio: opts.map((text, i) => ({ text, voice: 0 as const, label: 'ABCD'[i] })),
    transcript: opts.map((t, i) => `${'ABCD'[i]}. ${t}`),
    vi: p.vi,
    qs: [{ id: p.id, q: 'Nghe 4 câu và chọn câu mô tả đúng nhất bức ảnh', opts, a: order.indexOf(p.answer), why: p.why, stat: 'l-p1' }],
  }
}

export const part1Units = (n: number): Unit[] => (part1Ready() ? shuffle(part1Items()).slice(0, n).map(unitFromP1) : [])

export function unitFromP5(q: Question): Unit {
  return {
    id: q.id,
    part: 5,
    title: 'Điền vào chỗ trống',
    passage: q.q,
    qs: [{ id: q.id, q: 'Chọn đáp án đúng nhất', opts: q.opts as string[], a: q.a, why: q.why, stat: 'p5', tag: q.tag }],
  }
}

export const ALL_P2 = P2_QUESTIONS
export const ALL_P5 = QUESTIONS

export function buildPracticeUnits(kind: 'p1' | 'p3' | 'p4' | 'p6' | 'p7', n = kind === 'p1' ? 6 : 3): Unit[] {
  if (kind === 'p1') return shuffle(part1Items()).slice(0, n).map(unitFromP1)
  const pods = kind === 'p3' || kind === 'p4' ? podSets(kind).map(unitFromPod) : []
  const sets = { p3: [...P3, ...P3_2, ...P3_G], p4: [...P4, ...P4_2, ...P4_G], p6: [...P6, ...P6_2], p7: [...P7, ...P7_2, ...P7_3, ...P7_4] }[kind]
  // Bài podcast chỉ chiếm tối đa 1/3 số bài để không lấn bài TOEIC chính.
  const podCount = Math.min(pods.length, Math.max(0, Math.floor(n / 3)) + (Math.random() < (n % 3) / 3 ? 1 : 0))
  return shuffle([...shuffle(sets.map(unitFromSet)).slice(0, n - podCount), ...shuffle(pods).slice(0, podCount)])
}

/** Bài thi thử rút gọn: (2 Part 1 nếu đã có ảnh), 6 Part 2, 2 Part 3, 2 Part 4, 8 Part 5, 1 Part 6, 2 Part 7 = khoảng 35–37 câu. */
/** Lấy 2 bài: nếu có podcast thì 1 bài thường + 1 bài podcast. */
function mixPod(own: Unit[], pods: Unit[]): Unit[] {
  return pods.length ? [...shuffle(own).slice(0, 1), ...shuffle(pods).slice(0, 1)] : shuffle(own).slice(0, 2)
}

export function buildMockUnits(withPodcast = false): Unit[] {
  const pods = (k: 'p3' | 'p4') => (withPodcast ? podSets(k).map(unitFromPod) : [])
  return [
    ...part1Units(2),
    ...shuffle(P2_QUESTIONS).slice(0, 6).map(unitFromP2),
    ...mixPod([...P3, ...P3_2, ...P3_G].map(unitFromSet), pods('p3')),
    ...mixPod([...P4, ...P4_2, ...P4_G].map(unitFromSet), pods('p4')),
    ...shuffle(QUESTIONS).slice(0, 8).map(unitFromP5),
    ...shuffle([...P6, ...P6_2]).slice(0, 1).map(unitFromSet),
    ...shuffle([...P7, ...P7_2, ...P7_3, ...P7_4]).slice(0, 2).map(unitFromSet),
  ]
}

/** Ghi thống kê cho các câu trong một đơn vị (chưa trả lời tính là sai). */
export function recordUnit(unit: Unit, picks: (number | null)[]) {
  unit.qs.forEach((uq, i) => {
    const ok = picks[i] === uq.a
    if (uq.stat === 'p5') recordAnswer(uq.id, uq.tag ?? 'p5', ok, ok ? 4 : 0)
    else recordStat(uq.stat, ok, ok ? 3 : 0)
  })
}

/** Quy đổi tỉ lệ đúng sang điểm 5–495. Chỉ là ước tính rất thô, không phải bảng quy đổi chính thức. */
export const estimateScaled = (pct: number) => Math.min(495, Math.max(5, Math.round((5 + 490 * pct) / 5) * 5))
