import { START, phaseOf } from './roadmap'
import { part1Ready } from './part1'

export type PlanTab = 'learn' | 'match' | 'dictation' | 'listen' | 'podcast' | 'lessons' | 'quiz' | 'review' | 'notes' | 'practice' | 'mock' | 'order' | 'check' | 'home'

export type Task = {
  id: string
  min: number
  icon: string
  title: string
  how: string
  /** Cách tự kiểm tra xem đã nhớ/áp dụng được chưa. */
  check: string
  go: PlanTab
  param?: string
  /** Mục có điểm tối thiểu: cần làm ít nhất `need` câu và đúng từ 70% trong `need` câu gần nhất của buổi. */
  gate?: { stat: string; need: number }
}

type Key =
  | 'cards' | 'vcheck' | 'rcheck' | 'p1' | 'games' | 'order' | 'dict' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7'
  | 'lesson' | 'podcast' | 'review' | 'notes' | 'mock' | 'relax'

const DEF = (newPerDay: number): Record<Key, Omit<Task, 'id' | 'min'>> => ({
  cards: {
    icon: '🃏', title: 'Học từ vựng bằng thẻ', go: 'learn',
    how: `Ôn hết thẻ đến hạn trước, rồi học ${newPerDay} từ mới. Đọc to từng từ, đọc luôn câu ví dụ, tự đoán nghĩa trước khi lật thẻ.`,
    check: 'Ngay sau đó làm bước “Kiểm tra từ vựng” để biết đã nhớ nghĩa và phiên âm chưa.',
  },
  rcheck: {
    icon: '🔁', title: 'Kiểm tra lại các buổi trước', go: 'check', param: 'review',
    how: 'Web chọn ngẫu nhiên từ của các buổi học trước và hỏi nhiều kiểu khác nhau: nghĩa, mặt chữ (nhìn nghĩa gõ từ), nghe & viết, phiên âm, điền câu.',
    check: 'Phải đạt từ 70% mới được tính xong. Từ sai quay lại hàng ôn thẻ; chưa đạt thì làm lại lượt khác.',
  },
  vcheck: {
    icon: '✅', title: 'Kiểm tra từ vừa học', go: 'check', param: 'new',
    how: 'Kiểm tra 6 từ vừa học trong buổi này, mỗi từ 4 câu: nhớ nghĩa, nghe chọn phiên âm, nghe và gõ lại từ, rồi điền từ vào câu.',
    check: 'Phải đạt từ 70% tổng số câu mới được tính xong. Từ sai quay lại hàng ôn thẻ; chưa đạt thì làm lại lượt khác.',
  },
  games: {
    icon: '🧩', title: 'Game từ vựng', go: 'match',
    how: 'Chơi Ghép từ 2 ván, rồi Nghe & gõ 1 ván.',
    check: 'Kỷ lục mới nghĩa là bạn nhớ nhanh hơn lần trước.',
  },
  order: {
    icon: '🧱', title: 'Sắp xếp câu', go: 'order',
    how: 'Chơi 1–2 ván: sắp từ thành câu đúng, luyện cảm giác trật tự từ.',
    check: 'Đúng từ 6/8 câu trở lên là ổn.',
  },
  dict: {
    icon: '✍️', title: 'Chép chính tả', go: 'dictation', gate: { stat: 'l-dict', need: 8 },
    how: 'Làm 8–10 câu: nghe, gõ lại, xem chỗ sai. Câu sai thì nghe lại ở tốc độ 0.75x.',
    check: 'Một câu chỉ tính đúng khi chính xác từ 90%. Cần làm ít nhất 8 câu và đúng từ 70% trong 8 câu gần nhất mới tính xong.',
  },
  p1: {
    icon: '🖼️', title: 'Nghe Part 1 Tranh ảnh', go: 'practice', param: 'p1', gate: { stat: 'l-p1', need: 6 },
    how: 'Làm 6 ảnh: nhìn ảnh, nghe 4 câu mô tả rồi chọn câu đúng nhất. Chú ý người/vật nào, đang làm gì, ở đâu.',
    check: 'Cần làm ít nhất 6 ảnh và đúng từ 70% trong 6 ảnh gần nhất mới tính xong. Câu sai: xem vì sao các câu kia sai (sai hành động, sai vật, sai vị trí).',
  },
  p2: {
    icon: '👂', title: 'Nghe Part 2 Hỏi–Đáp', go: 'listen', gate: { stat: 'l-p2', need: 10 },
    how: 'Làm 1–2 lượt (khoảng 10 câu). Sau mỗi câu đọc giải thích, chú ý bẫy từ phát âm gần giống.',
    check: 'Cần làm ít nhất 10 câu và đúng từ 7/10 trong 10 câu gần nhất mới tính xong. Câu sai: nghe lại kèm lời thoại.',
  },
  p3: {
    icon: '💬', title: 'Nghe Part 3 Hội thoại', go: 'practice', param: 'p3', gate: { stat: 'l-p3', need: 6 },
    how: 'Làm 3 bài. Đọc câu hỏi trước khi nghe, nghe rồi chọn đáp án, nộp xong xem lời thoại.',
    check: 'Cần làm ít nhất 6 câu và đúng từ 70% trong 6 câu gần nhất mới tính xong. Câu sai: tìm trong lời thoại câu chứa đáp án.',
  },
  p4: {
    icon: '📢', title: 'Nghe Part 4 Bài nói', go: 'practice', param: 'p4', gate: { stat: 'l-p4', need: 6 },
    how: 'Làm 3 bài (có bài từ podcast 🎙️). Chú ý ý chính, con số, lời nhờ vả ở cuối bài.',
    check: 'Cần làm ít nhất 6 câu và đúng từ 70% trong 6 câu gần nhất mới tính xong. Sau khi nộp, đọc lại lời chép và gạch từ chưa nghe ra.',
  },
  p5: {
    icon: '✍️', title: 'Part 5 Điền câu', go: 'quiz', gate: { stat: 'p5', need: 10 },
    how: 'Làm một lượt Part 5 (khoảng 10 câu). Xác định loại từ cần điền trước khi nhìn đáp án.',
    check: 'Cần làm ít nhất 10 câu và đúng từ 7/10 trong 10 câu gần nhất mới tính xong. Câu sai vào sổ lỗi sai: đọc giải thích rồi làm lượt khác.',
  },
  p6: {
    icon: '🧩', title: 'Part 6 Điền đoạn', go: 'practice', param: 'p6', gate: { stat: 'r-p6', need: 6 },
    how: 'Làm 2–3 đoạn. Đọc cả đoạn trước, chú ý liên kết ý giữa các câu.',
    check: 'Cần làm ít nhất 6 chỗ trống và đúng từ 70% trong 6 chỗ gần nhất mới tính xong. Với chỗ sai, chỉ ra từ nối hoặc câu quyết định đáp án.',
  },
  p7: {
    icon: '📄', title: 'Part 7 Đọc hiểu', go: 'practice', param: 'p7', gate: { stat: 'r-p7', need: 6 },
    how: 'Làm 2–3 bài, tự bấm giờ. Đọc câu hỏi trước rồi quét đoạn tìm thông tin.',
    check: 'Cần làm ít nhất 6 câu và đúng từ 70% trong 6 câu gần nhất mới tính xong. Câu sai: gạch đúng câu chứa bằng chứng.',
  },
  lesson: {
    icon: '📖', title: 'Học bài ngữ pháp', go: 'lessons',
    how: 'Học 1 bài chưa học: xem quy tắc, đọc ví dụ, rồi làm bài tập nhỏ cuối bài.',
    check: 'Làm xong bài tập: đúng dưới 70% thì đọc lại phần ví dụ rồi làm lại.',
  },
  podcast: {
    icon: '🎙️', title: 'Học qua podcast', go: 'podcast', gate: { stat: 'l-pod', need: 8 },
    how: 'Một đoạn: nghe không chữ → nghe có chữ → mục Học lấy từ mới → Điền từ (6–8 câu) → Chép vài câu. Chỉ các câu ở tab Điền từ và Chép được tính điểm.',
    check: 'Cần làm ít nhất 8 câu Điền từ hoặc Chép (Chép tính đúng khi chính xác từ 85%) và đúng từ 70% trong 8 câu gần nhất mới tính xong.',
  },
  review: {
    icon: '🛠️', title: 'Sổ lỗi sai', go: 'review',
    how: 'Làm lại các câu từng sai cho tới khi đúng 2 lần liên tiếp thì xóa khỏi sổ.',
    check: 'Số câu trong sổ giảm dần là dấu hiệu bạn đã sửa được lỗi, không chỉ nhớ đáp án.',
  },
  notes: {
    icon: '📝', title: 'Ôn ghi chú', go: 'notes',
    how: 'Ôn các ghi chú đến hạn (điền chỗ ẩn). Ghi chú mới: dán giải thích từ AI ngoài vào, đặt từ khóa trong [[ ]].',
    check: 'Tự điền được chỗ ẩn không nhìn đáp án nghĩa là đã nhớ ý.',
  },
  relax: {
    icon: '🌙', title: 'Chuẩn bị cho ngày thi', go: 'home',
    how: 'Soạn giấy tờ, kiểm tra địa điểm và giờ thi, chuẩn bị bút, ngủ sớm. Không học thêm kiến thức mới.',
    check: 'Tự đánh dấu khi đã chuẩn bị xong mọi thứ cho ngày mai.',
  },
  mock: {
    icon: '⏱️', title: 'Thi thử rút gọn', go: 'mock',
    how: 'Làm trọn bài 35 phút không dừng, rồi xem kết quả từng Part.',
    check: 'So điểm với lần trước. Chép các câu sai vào ghi chú để ôn.',
  },
})

type Row = [Key, number][]
type Table = Record<number, Row>

// Chỉ số ngày: 0 = Chủ nhật, 1 = Thứ hai … 6 = Thứ bảy.

// ---- Bản 90 phút (có game) ----
const A1: Table = {
  1: [['cards', 25], ['games', 15], ['lesson', 20], ['p2', 15], ['podcast', 15]],
  2: [['cards', 25], ['dict', 15], ['p5', 20], ['p2', 15], ['podcast', 15]],
  3: [['cards', 25], ['games', 15], ['lesson', 20], ['p2', 15], ['podcast', 15]],
  4: [['cards', 25], ['order', 15], ['p5', 20], ['dict', 15], ['podcast', 15]],
  5: [['cards', 20], ['p5', 20], ['p2', 20], ['podcast', 20], ['review', 10]],
  6: [['cards', 20], ['p3', 20], ['p5', 15], ['podcast', 25], ['notes', 10]],
  0: [['mock', 35], ['review', 20], ['cards', 20], ['notes', 15]],
}
const A2: Table = {
  1: [['cards', 20], ['p3', 20], ['p5', 20], ['p4', 15], ['podcast', 15]],
  2: [['cards', 20], ['p5', 20], ['p6', 20], ['p2', 15], ['podcast', 15]],
  3: [['cards', 20], ['p4', 20], ['p7', 20], ['dict', 15], ['podcast', 15]],
  4: [['cards', 20], ['p3', 20], ['p5', 20], ['p6', 15], ['podcast', 15]],
  5: [['cards', 20], ['p7', 25], ['p5', 20], ['p4', 15], ['review', 10]],
  6: [['cards', 20], ['p3', 15], ['p4', 15], ['p7', 20], ['podcast', 20]],
  0: [['mock', 35], ['review', 25], ['cards', 15], ['notes', 15]],
}
const A3: Table = {
  1: [['cards', 15], ['p5', 25], ['p7', 25], ['p3', 15], ['review', 10]],
  2: [['cards', 15], ['p6', 20], ['p7', 25], ['p4', 15], ['p2', 15]],
  3: [['cards', 15], ['p5', 25], ['p3', 20], ['p4', 20], ['review', 10]],
  4: [['cards', 15], ['p7', 30], ['p6', 20], ['p2', 15], ['podcast', 10]],
  5: [['cards', 15], ['p5', 20], ['p7', 25], ['p3', 15], ['review', 15]],
  6: [['mock', 35], ['review', 30], ['p2', 10], ['podcast', 15]],
  0: [['mock', 35], ['review', 30], ['cards', 15], ['notes', 10]],
}
const A4: Table = {
  1: [['cards', 15], ['p5', 20], ['p7', 25], ['p3', 15], ['review', 15]],
  2: [['cards', 15], ['p6', 20], ['p7', 25], ['p4', 15], ['review', 15]],
  3: [['cards', 15], ['p5', 20], ['p7', 25], ['p2', 15], ['review', 15]],
  4: [['cards', 15], ['p7', 25], ['p5', 20], ['p3', 15], ['review', 15]],
  5: [['cards', 15], ['p6', 20], ['p7', 25], ['p4', 15], ['review', 15]],
  6: [['mock', 35], ['review', 35], ['cards', 10], ['notes', 10]],
  0: [['mock', 35], ['review', 35], ['cards', 10], ['notes', 10]],
}

// ---- Bản 60 phút: chỉ học, không game; mỗi phần học đều có bước kiểm tra ----
const B1: Table = {
  1: [['cards', 20], ['vcheck', 5], ['lesson', 15], ['p5', 10], ['p2', 10]],
  2: [['cards', 20], ['vcheck', 5], ['p5', 15], ['dict', 10], ['podcast', 10]],
  3: [['cards', 20], ['vcheck', 5], ['lesson', 15], ['p5', 10], ['p2', 10]],
  4: [['cards', 20], ['vcheck', 5], ['p5', 15], ['p2', 10], ['podcast', 10]],
  5: [['cards', 15], ['vcheck', 5], ['p5', 15], ['p3', 15], ['review', 10]],
  6: [['cards', 15], ['vcheck', 5], ['podcast', 20], ['p3', 10], ['notes', 10]],
  0: [['mock', 35], ['review', 15], ['vcheck', 10]],
}
const B2: Table = {
  1: [['cards', 15], ['vcheck', 5], ['p3', 15], ['p5', 15], ['p4', 10]],
  2: [['cards', 15], ['vcheck', 5], ['p5', 15], ['p6', 15], ['p2', 10]],
  3: [['cards', 15], ['vcheck', 5], ['p4', 15], ['p7', 15], ['podcast', 10]],
  4: [['cards', 15], ['vcheck', 5], ['p3', 15], ['p5', 15], ['p6', 10]],
  5: [['cards', 15], ['vcheck', 5], ['p7', 20], ['p5', 10], ['review', 10]],
  6: [['cards', 15], ['vcheck', 5], ['p3', 10], ['p4', 10], ['p7', 20]],
  0: [['mock', 35], ['review', 15], ['vcheck', 10]],
}
const B3: Table = {
  1: [['cards', 10], ['vcheck', 5], ['p5', 20], ['p7', 20], ['review', 5]],
  2: [['cards', 10], ['vcheck', 5], ['p6', 15], ['p7', 20], ['p4', 10]],
  3: [['cards', 10], ['vcheck', 5], ['p5', 15], ['p3', 15], ['p4', 15]],
  4: [['cards', 10], ['vcheck', 5], ['p7', 25], ['p6', 10], ['p2', 10]],
  5: [['cards', 10], ['vcheck', 5], ['p5', 15], ['p7', 20], ['review', 10]],
  6: [['mock', 35], ['review', 25]],
  0: [['mock', 35], ['review', 25]],
}
const B4: Table = {
  1: [['cards', 10], ['p5', 15], ['p7', 20], ['p3', 10], ['review', 5]],
  2: [['cards', 10], ['p6', 15], ['p7', 20], ['p4', 10], ['review', 5]],
  3: [['cards', 10], ['p5', 15], ['p7', 20], ['p2', 10], ['review', 5]],
  4: [['cards', 10], ['p7', 20], ['p5', 15], ['p3', 10], ['review', 5]],
  5: [['cards', 10], ['p6', 15], ['p7', 20], ['p4', 10], ['review', 5]],
  6: [['mock', 35], ['review', 25]],
  0: [['mock', 35], ['review', 25]],
}

const DAY_NAMES = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
export const dayName = (d: Date) => DAY_NAMES[d.getDay()]

const ORDER = [1, 2, 3, 4, 5, 6, 0] // thứ tự mẫu ngày trong một tuần học

/**
 * Tổng số buổi: học từ 20/11/2026 đến hết 24/02/2027 (thi ngày 25/02/2027) = 96 buổi, một buổi mỗi ngày.
 * Tuần 1–13 gồm 7 buổi (91 buổi); tuần 14 “Về đích” chỉ có 5 buổi, dùng mẫu: ngày 1, 2, 3 rồi hai buổi thi thử cuối.
 */
export const TOTAL_SESSIONS = 96
const WEEKS_FULL = 13

/** Phút cộng thêm cho từng mục, tăng dần theo tuần, áp dụng cho các buổi không có thi thử. */
const BOOST: Record<number, Partial<Record<Key, number>>> = {
  10: { p7: 10 },
  11: { p7: 15, review: 5 },
  12: { p7: 15, review: 10 },
  13: { p7: 15, review: 10, p5: 10 },
}

/**
 * Tuần cuối (buổi 92–96): dồn cường độ vào bốn buổi đầu, buổi cuối (96) là buổi nhẹ.
 * 92: thi thử + sửa lỗi · 93: luyện đọc dày · 94: thi thử + nghe · 95: ôn điểm yếu, nặng nhất · 96: nhẹ, chuẩn bị ngày thi.
 */
const FINAL_ROWS: Record<number, Row> = {
  92: [['cards', 10], ['mock', 35], ['review', 25], ['p7', 20]],
  93: [['cards', 10], ['p5', 20], ['p6', 20], ['p7', 25], ['p3', 15], ['p4', 15], ['review', 10]],
  94: [['cards', 10], ['mock', 35], ['review', 30], ['p2', 15], ['p3', 15], ['notes', 10]],
  95: [['cards', 10], ['p5', 20], ['p7', 25], ['p3', 15], ['p4', 15], ['p2', 10], ['dict', 10], ['review', 20]],
  96: [['review', 15], ['cards', 10], ['notes', 10], ['relax', 5]],
}

/** Số câu cần làm mỗi phút theo từng mục có điểm tối thiểu (dùng để tăng số câu bắt buộc khi mục dài hơn). */
const GATE_RATE: Record<string, number> = { 'l-p1': 0.75, 'l-p2': 1, 'l-p3': 0.4, 'l-p4': 0.4, p5: 0.7, 'r-p6': 0.4, 'r-p7': 0.3, 'l-dict': 0.8, 'l-pod': 0.8 }
const GATE_MAX = 40 // khớp số kết quả gần nhất được lưu cho mỗi loại (40)

/** Số câu tối thiểu = max(số câu gốc, phút × tốc độ), tối đa 40; cập nhật cả lời mô tả. */
function scaleGate(t: Task): Task {
  if (!t.gate) return t
  const base = t.gate.need
  const need = Math.min(GATE_MAX, Math.max(base, Math.round(t.min * (GATE_RATE[t.gate.stat] ?? 0))))
  if (need === base) return t
  const check = t.check
    .replace('7/10', '70%')
    .replace(`ít nhất ${base} `, `ít nhất ${need} `)
    .replace(`trong ${base} `, `trong ${need} `)
  return { ...t, gate: { ...t.gate, need }, check }
}

/** Kế hoạch của một buổi học (tính theo số buổi, không theo ngày thực). */
export function planFor(session: number, newPerDay: number, planMin: 60 | 90 = 60): { week: number; phase: string; tasks: Task[]; baseMin: number } {
  const week = session <= WEEKS_FULL * 7 ? Math.floor((session - 1) / 7) + 1 : 14
  const phase = phaseOf(week)
  const idx = week <= 4 ? 0 : week <= 9 ? 1 : week <= 13 ? 2 : 3
  const table = (planMin === 60 ? [B1, B2, B3, B4] : [A1, A2, A3, A4])[idx]
  const defs = DEF(newPerDay)
  const light = session >= TOTAL_SESSIONS // buổi cuối: nhẹ, không có điểm tối thiểu
  let rows: Row = week < 14 ? [...table[ORDER[(session - 1) % 7]]] : [...FINAL_ROWS[Math.min(session, TOTAL_SESSIONS)]]
  // Tăng dần cường độ từ tuần 10 đến 13 ở các buổi không có thi thử (cộng thêm phút cho từng mục).
  const boost = BOOST[week]
  if (boost && !rows.some(([k]) => k === 'mock')) {
    for (const [k, extra] of Object.entries(boost) as [Key, number][]) {
      const at = rows.findIndex(([x]) => x === k)
      if (at >= 0) rows[at] = [k, rows[at][1] + extra]
      else rows.push([k, extra])
    }
  }
  const baseMin = rows.reduce((a, [, m]) => a + m, 0)
  const ci = rows.findIndex(([k]) => k === 'cards')
  if (!light && !rows.some(([k]) => k === 'vcheck') && ci >= 0) rows.splice(ci + 1, 0, ['vcheck', 8])
  rows = rows.map(([k, m]) => (k === 'vcheck' ? [k, 8] : [k, m]) as [Key, number])
  if (!light && session >= 2) {
    const at = rows.findIndex(([k]) => k === 'vcheck')
    rows.splice(at >= 0 ? at + 1 : 0, 0, ['rcheck', session < 4 ? 10 : session < 8 ? 12 : 15])
  }
  // Part 1 chỉ xuất hiện khi đã có đủ ảnh; đặt trước Part 2 ở các buổi có Part 2 (các giai đoạn đầu).
  if (part1Ready() && week <= 9) {
    const at = rows.findIndex(([k]) => k === 'p2')
    if (at >= 0) rows.splice(at, 0, ['p1', 8])
  }
  const tasks = rows.map(([k, min]) => scaleGate({ id: k, min, ...defs[k] }))
  return { week, phase: phase.name, tasks, baseMin }
}

/** Buổi học đáng lẽ phải tới theo lịch (1 buổi/ngày kể từ ngày bắt đầu), chỉ để so tiến độ. */
export function expectedSession(now = new Date()): number {
  return Math.min(TOTAL_SESSIONS, Math.max(1, Math.floor((now.getTime() - START.getTime()) / 86400000) + 1))
}

/** Tóm tắt 7 buổi kế tiếp kể từ buổi `from`. */
export function sessionPreview(from: number, newPerDay: number, planMin: 60 | 90 = 60) {
  return Array.from({ length: 7 }, (_, i) => ({ n: from + i, tasks: planFor(from + i, newPerDay, planMin).tasks }))
}

/** Đánh giá một mục có điểm tối thiểu từ các câu gần nhất của buổi. */
export function gateStatus(results: boolean[] | undefined, need: number, passRate = 0.7) {
  const r = results ?? []
  const last = r.slice(-need)
  const ok = last.filter(Boolean).length
  return { done: Math.min(r.length, need), need, ok, pass: last.length >= need && ok / need >= passRate }
}
