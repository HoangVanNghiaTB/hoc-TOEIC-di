import type { Tag } from './questions'

export type Lesson = {
  id: Tag
  title: string
  tip: string // mẹo làm bài TOEIC
  points: string[]
  examples: [string, string][] // [tiếng Anh, tiếng Việt]
}

export const LESSONS: Lesson[] = [
  {
    id: 'word-form',
    title: 'Loại từ (word form)',
    tip: 'Nhìn từ đứng trước và sau chỗ trống để đoán loại từ, đừng dịch cả câu trước.',
    points: [
      'Sau mạo từ (a, the) hoặc tính từ sở hữu (his, our): cần DANH TỪ hoặc TÍNH TỪ + danh từ.',
      'Trước danh từ: cần TÍNH TỪ (significant increase).',
      'Bổ nghĩa cho động từ, tính từ hoặc cả câu: cần TRẠNG TỪ (-ly): carefully reviewed.',
      'Sau động từ khuyết thiếu (can, will, must, should): động từ NGUYÊN MẪU.',
      'Đuôi danh từ hay gặp: -tion, -ment, -ness, -ity, -er/-or. Đuôi tính từ: -ful, -able, -ive, -ous, -al.',
    ],
    examples: [
      ['The installation of the software takes two weeks.', 'Việc cài đặt phần mềm mất hai tuần.'],
      ['She carefully reviewed the contract.', 'Cô ấy xem xét hợp đồng một cách cẩn thận.'],
      ['We are delighted to announce the news.', 'Chúng tôi vui mừng thông báo tin này.'],
    ],
  },
  {
    id: 'tense',
    title: 'Thì của động từ',
    tip: 'Tìm từ dấu hiệu thời gian: since, for, by the time, last month, right now, next March.',
    points: [
      'Hiện tại đơn: thói quen, lịch trình cố định (The meeting starts at 9).',
      'Quá khứ đơn: hành động đã xong ở mốc rõ ràng (last month, yesterday, in 2020).',
      'Hiện tại hoàn thành (have/has + V3): since / for / already / yet / recently.',
      'Quá khứ hoàn thành (had + V3): xảy ra trước một mốc trong quá khứ (by the time we arrived).',
      'Tương lai hoàn thành (will have + V3): sẽ hoàn tất trước một mốc tương lai.',
      'Tiếp diễn (be + V-ing): đang diễn ra; while + quá khứ tiếp diễn bị hành động khác cắt ngang.',
    ],
    examples: [
      ['Sales have risen steadily since the campaign began.', 'Doanh số tăng đều kể từ khi chiến dịch bắt đầu.'],
      ['By the time we arrived, the talk had already begun.', 'Khi chúng tôi đến, buổi nói chuyện đã bắt đầu.'],
    ],
  },
  {
    id: 'preposition',
    title: 'Giới từ',
    tip: 'Nhớ theo cụm cố định. Phân biệt giới từ (đi với danh từ) và liên từ (đi với mệnh đề).',
    points: [
      'Thời gian: at + giờ, on + thứ/ngày, in + tháng/năm/mùa.',
      'by + mốc = không muộn hơn; until = kéo dài đến mốc đó.',
      'for + khoảng thời gian; since + mốc bắt đầu; within = trong vòng; during + danh từ.',
      'Due to / because of + danh từ; because / although + mệnh đề.',
      'Cụm hay gặp: responsible for, in advance, in charge of, depend on, apply for, comply with.',
    ],
    examples: [
      ['The report must be submitted by Friday.', 'Báo cáo phải nộp chậm nhất thứ Sáu.'],
      ['Due to the storm, flights were canceled.', 'Vì cơn bão, các chuyến bay bị hủy.'],
    ],
  },
  {
    id: 'conjunction',
    title: 'Liên từ & từ nối',
    tip: 'Sau chỗ trống là một mệnh đề (có chủ ngữ + động từ) thì chọn liên từ, không chọn giới từ.',
    points: [
      'Tương phản: although, though, while, whereas, however (dùng sau dấu chấm phẩy).',
      'Nguyên nhân: because, since, as. Mục đích: so that, in order to.',
      'Thời gian: when, once, as soon as, before, after, until, while.',
      'Điều kiện: if, unless, provided that.',
      'Cặp liên từ: both…and, either…or, neither…nor, not only…but also.',
      'Từ nối đầu câu: moreover, therefore, however, otherwise, meanwhile.',
    ],
    examples: [
      ['Although it rained, the event went ahead.', 'Dù trời mưa, sự kiện vẫn diễn ra.'],
      ['Call me as soon as you arrive.', 'Hãy gọi tôi ngay khi bạn đến.'],
    ],
  },
  {
    id: 'pronoun',
    title: 'Đại từ & hòa hợp chủ ngữ - động từ',
    tip: 'Tìm chủ ngữ chính, bỏ qua cụm “of …” phía sau khi chia động từ.',
    points: [
      'Tính từ sở hữu đứng trước danh từ: my, his, her, its, our, their.',
      'Tân ngữ đứng sau động từ/giới từ: me, him, her, it, us, them.',
      'Đại từ quan hệ: who (người, chủ ngữ), whom (người, tân ngữ), whose (sở hữu), which (vật), that.',
      'Every / each / either / neither / one of + danh từ số ít → động từ số ít.',
      'The list of items IS attached: chủ ngữ là “list”, không phải “items”.',
    ],
    examples: [
      ['The company changed its return policy.', 'Công ty đã đổi chính sách đổi trả.'],
      ['Every employee receives a copy of the handbook.', 'Mỗi nhân viên nhận một bản sổ tay.'],
    ],
  },
  {
    id: 'passive',
    title: 'Câu bị động',
    tip: 'Chủ ngữ là vật hoặc việc bị tác động và không có tân ngữ theo sau → thường là bị động.',
    points: [
      'Công thức: be + V3 (V quá khứ phân từ).',
      'Quá khứ: was/were + V3. Hiện tại hoàn thành: has/have been + V3.',
      'Sau khuyết thiếu: must/can/will + be + V3.',
      'Cụm hay gặp: be required to, be expected to, be scheduled to, be located in, be known as.',
      'Có tân ngữ sau động từ → thường là chủ động; không có tân ngữ → thường là bị động.',
    ],
    examples: [
      ['All invoices must be paid by the end of the month.', 'Mọi hóa đơn phải được thanh toán trước cuối tháng.'],
      ['The meeting has been postponed.', 'Cuộc họp đã bị hoãn.'],
    ],
  },
  {
    id: 'conditional',
    title: 'Câu điều kiện',
    tip: 'Nhìn mệnh đề “if” để biết loại, rồi chọn động từ cho mệnh đề còn lại.',
    points: [
      'Loại 1 (có thể xảy ra): If + hiện tại đơn, will + V.',
      'Loại 2 (không có thật ở hiện tại): If + quá khứ, would + V.',
      'Loại 3 (không có thật ở quá khứ): If + had + V3, would have + V3.',
      'Đảo ngữ loại 1: Should you need help… = If you need help…',
      'Đảo ngữ loại 3: Had we known… = If we had known…',
      'Unless = if … not; sau unless vẫn dùng hiện tại đơn.',
    ],
    examples: [
      ['If the shipment arrives today, we can start tomorrow.', 'Nếu hàng đến hôm nay, ta có thể bắt đầu ngày mai.'],
      ['Should you need help, contact the help desk.', 'Nếu cần giúp đỡ, hãy liên hệ bộ phận hỗ trợ.'],
    ],
  },
  {
    id: 'comparison',
    title: 'So sánh',
    tip: 'Thấy “than” → so sánh hơn; thấy “the … in/of” → so sánh nhất; thấy “as … as” → so sánh bằng.',
    points: [
      'Tính từ ngắn: -er / the -est (cheaper, the cheapest). Tính từ dài: more / the most.',
      'So sánh bằng: as + tính từ + as.',
      'Bổ nghĩa cho so sánh hơn: much, far, even, a lot (không dùng “very”).',
      'Cấu trúc The + so sánh hơn, the + so sánh hơn (the sooner, the better).',
      'Bất quy tắc: good → better → best; bad → worse → worst.',
    ],
    examples: [
      ['This model is more efficient than the previous one.', 'Mẫu này hiệu quả hơn mẫu trước.'],
      ['She is the most experienced employee in the department.', 'Cô ấy là nhân viên nhiều kinh nghiệm nhất phòng.'],
    ],
  },
  {
    id: 'vocab',
    title: 'Từ vựng & cụm cố định (collocation)',
    tip: 'Học từ trong cụm, vì đề thường kiểm tra cụm đi cùng nhau, không chỉ nghĩa từ đơn.',
    points: [
      'Dễ nhầm mặt chữ: receipt / recipe / reception; suspend / suspect; relocate / replace.',
      'Cụm hay gặp: comply with, apologize for the inconvenience, fasten a seat belt.',
      'Phân biệt từ gần nghĩa: raise (nâng cái gì) / rise (tự tăng), say / tell, lend / borrow.',
      'Xem nghĩa cả câu: complimentary (miễn phí) ≠ complementary (bổ sung).',
      'Dùng Flashcard SRS để ôn các từ này thường xuyên.',
    ],
    examples: [
      ['Please keep your receipt as proof of purchase.', 'Hãy giữ biên lai làm bằng chứng mua hàng.'],
      ['Employees must comply with safety regulations.', 'Nhân viên phải tuân thủ quy định an toàn.'],
    ],
  },
]
