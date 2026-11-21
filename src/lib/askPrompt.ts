import type { AskCtx } from './tutor'
import type { NoteDraft } from './notesBus'

/** Câu lệnh sẵn để dán vào claude.ai (hoặc AI bất kỳ) khi chưa dùng giáo viên AI trong web. */
export function buildExternalPrompt(c: AskCtx): string {
  const x = c.context
  if (c.mode === 'word') {
    return [
      'Tôi đang luyện thi TOEIC (mục tiêu 600 điểm, trình độ cơ bản). Hãy giải thích bằng tiếng Việt, ngắn gọn dễ hiểu:',
      '',
      `Từ: ${x.word}`,
      `Nghĩa tôi đang học: ${x.meaning}`,
      '',
      'Hãy nêu: nghĩa chính trong công sở, các cụm đi kèm (collocation) phổ biến, 2 câu ví dụ đơn giản kèm bản dịch, và từ dễ nhầm nếu có.',
    ].join('\n')
  }
  return [
    'Tôi đang luyện thi TOEIC (mục tiêu 600 điểm, trình độ cơ bản). Hãy giải thích câu này bằng tiếng Việt, ngắn gọn dễ hiểu:',
    '',
    `Câu hỏi: ${x.question}`,
    `Các lựa chọn: ${x.options}`,
    `Tôi chọn: ${x.picked}`,
    `Đáp án đúng: ${x.correct}`,
    x.note ? `Ghi chú có sẵn: ${x.note}` : '',
    '',
    'Hãy nêu: vì sao đáp án đúng, vì sao lựa chọn của tôi sai (nếu sai), và một mẹo ngắn để nhận ra dạng câu này trong đề TOEIC.',
  ]
    .filter((l, i, a) => l !== '' || (a[i - 1] ?? '') !== '')
    .join('\n')
}

/** Bản nháp ghi chú điền sẵn đề bài; người dùng dán phần giải thích của AI vào dưới cùng. */
export function buildNoteDraft(c: AskCtx): NoteDraft {
  const x = c.context
  if (c.mode === 'word') {
    return {
      title: `Từ vựng: ${x.word}`,
      body: `${x.word} (${x.meaning})\n\n--- Dán giải thích từ AI vào dưới đây. Đặt từ khóa trong [[ ]] để web ẩn đi khi ôn ---\n`,
      tags: ['từ vựng'],
    }
  }
  const q = (x.question ?? '').replace(/\s+/g, ' ').trim()
  return {
    title: `Câu hỏi: ${q.slice(0, 70)}${q.length > 70 ? '…' : ''}`,
    body: `${x.question}\nLựa chọn: ${x.options}\nĐáp án đúng: ${x.correct}\n\n--- Dán giải thích từ AI vào dưới đây. Đặt từ khóa trong [[ ]] để web ẩn đi khi ôn ---\n`,
    tags: ['giải thích'],
  }
}
