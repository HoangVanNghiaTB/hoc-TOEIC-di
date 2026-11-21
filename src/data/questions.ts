import { raw2 } from './questions-2'
import { raw3 } from './questions-3'

export type Tag =
  | 'word-form'
  | 'tense'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'passive'
  | 'conditional'
  | 'comparison'
  | 'vocab'

export type Question = {
  id: string
  tag: Tag
  q: string // dùng ___ cho chỗ trống
  opts: [string, string, string, string]
  a: 0 | 1 | 2 | 3
  why: string
}

export const TAGS: { id: Tag; name: string; icon: string }[] = [
  { id: 'word-form', name: 'Loại từ', icon: '🔤' },
  { id: 'tense', name: 'Thì động từ', icon: '⏳' },
  { id: 'preposition', name: 'Giới từ', icon: '📍' },
  { id: 'conjunction', name: 'Liên từ', icon: '🔗' },
  { id: 'pronoun', name: 'Đại từ & hòa hợp', icon: '👤' },
  { id: 'passive', name: 'Câu bị động', icon: '🔄' },
  { id: 'conditional', name: 'Câu điều kiện', icon: '❓' },
  { id: 'comparison', name: 'So sánh', icon: '⚖️' },
  { id: 'vocab', name: 'Từ vựng', icon: '📚' },
]

type Q = [Tag, string, [string, string, string, string], 0 | 1 | 2 | 3, string]

const raw: Q[] = [
  // ---- Loại từ ----
  ['word-form', 'The company announced a ___ increase in profits.', ['significant', 'significantly', 'signify', 'significance'], 0, 'Trước danh từ “increase” cần một tính từ → significant.'],
  ['word-form', 'Ms. Tanaka ___ reviewed the contract before signing it.', ['careful', 'carefully', 'care', 'caring'], 1, 'Cần trạng từ bổ nghĩa cho động từ “reviewed” → carefully.'],
  ['word-form', 'The ___ of the new software will take two weeks.', ['install', 'installation', 'installed', 'installing'], 1, 'Sau “The” và trước “of” cần danh từ → installation.'],
  ['word-form', 'The manager was pleased with the team’s ___ performance.', ['impressive', 'impressively', 'impress', 'impression'], 0, 'Trước danh từ “performance” cần tính từ → impressive.'],
  ['word-form', 'We are ___ to announce a new partnership.', ['delighted', 'delighting', 'delight', 'delightfully'], 0, 'Cấu trúc “be delighted to + V”: rất vui khi → delighted.'],
  ['word-form', 'The results were ___ better than we expected.', ['considerable', 'considerably', 'consider', 'consideration'], 1, 'Trạng từ bổ nghĩa cho dạng so sánh “better” → considerably.'],
  ['word-form', 'Mr. Park’s ___ to the project was recognized by the board.', ['contribute', 'contributor', 'contribution', 'contributive'], 2, 'Sau sở hữu cách “Mr. Park’s” cần danh từ → contribution.'],
  ['word-form', 'Customers can ___ their orders online.', ['track', 'tracking', 'to track', 'tracks'], 0, 'Sau động từ khuyết thiếu “can” dùng động từ nguyên mẫu → track.'],
  // ---- Thì ----
  ['tense', 'The meeting ___ at 9 a.m. tomorrow.', ['starts', 'started', 'has started', 'was starting'], 0, 'Lịch trình cố định trong tương lai dùng hiện tại đơn → starts.'],
  ['tense', 'By the time we arrived, the presentation ___.', ['already began', 'had already begun', 'has already begun', 'will already begin'], 1, '“By the time + quá khứ” → hành động trước đó dùng quá khứ hoàn thành.'],
  ['tense', 'Ms. Lee ___ at the company for ten years next March.', ['works', 'worked', 'will have worked', 'has worked'], 2, '“for ten years next March”: mốc tương lai → tương lai hoàn thành.'],
  ['tense', 'We ___ our new product last month.', ['launch', 'launched', 'have launched', 'are launching'], 1, '“last month” là mốc quá khứ rõ ràng → quá khứ đơn.'],
  ['tense', 'Sales ___ steadily since the campaign began.', ['rise', 'rose', 'have risen', 'will rise'], 2, '“since + mốc” → hiện tại hoàn thành.'],
  ['tense', 'While I ___ the report, the power went out.', ['wrote', 'was writing', 'have written', 'write'], 1, 'Hành động đang diễn ra thì bị cắt ngang → quá khứ tiếp diễn.'],
  ['tense', 'The CEO ___ in Tokyo right now for a conference.', ['is', 'was', 'has been', 'will be'], 0, '“right now” → hiện tại.'],
  ['tense', 'The factory ___ since 7 a.m. this morning.', ['operates', 'is operating', 'has been operating', 'operated'], 2, '“since 7 a.m.” và hành động kéo dài → hiện tại hoàn thành tiếp diễn.'],
  // ---- Giới từ ----
  ['preposition', 'The report must be submitted ___ Friday.', ['by', 'until', 'since', 'during'], 0, '“by + mốc” = không muộn hơn mốc đó (hạn chót).'],
  ['preposition', 'The event starts ___ 6:30 p.m.', ['in', 'on', 'at', 'by'], 2, 'Giờ cụ thể dùng “at”.'],
  ['preposition', 'She has worked here ___ 2019.', ['for', 'since', 'during', 'from'], 1, '“since + mốc thời gian” đi với hiện tại hoàn thành.'],
  ['preposition', 'Please complete the form ___ ten days of receiving it.', ['within', 'during', 'for', 'while'], 0, '“within + khoảng thời gian” = trong vòng.'],
  ['preposition', '___ the storm, all flights were canceled.', ['Because', 'Due to', 'Although', 'So'], 1, 'Sau chỗ trống là danh từ “the storm” → cần giới từ “Due to”.'],
  ['preposition', 'The store is open every day ___ Sunday.', ['except', 'besides', 'unless', 'without'], 0, '“except” = ngoại trừ.'],
  ['preposition', 'Attendees must register ___ advance.', ['in', 'on', 'at', 'by'], 0, 'Cụm cố định “in advance” = trước.'],
  ['preposition', 'The manager is responsible ___ training new staff.', ['for', 'of', 'to', 'with'], 0, 'Cụm “be responsible for + V-ing/danh từ”.'],
  // ---- Liên từ ----
  ['conjunction', '___ the weather was bad, the event went ahead.', ['Because', 'Although', 'Unless', 'So'], 1, 'Hai vế tương phản → “Although” (mặc dù).'],
  ['conjunction', 'You cannot enter the lab ___ you have a badge.', ['unless', 'although', 'while', 'since'], 0, '“unless” = trừ khi, nếu không.'],
  ['conjunction', 'Please call me ___ you arrive at the airport.', ['as soon as', 'despite', 'during', 'because of'], 0, 'Sau chỗ trống là một mệnh đề → cần liên từ “as soon as”.'],
  ['conjunction', 'Mr. Cho is both skilled ___ experienced.', ['and', 'or', 'but', 'so'], 0, 'Cặp “both … and …”.'],
  ['conjunction', 'The prices are low; ___, the quality is excellent.', ['moreover', 'however', 'otherwise', 'instead'], 0, 'Hai ý cùng chiều (bổ sung) → moreover.'],
  ['conjunction', 'Either the manager ___ his assistant will attend.', ['or', 'nor', 'and', 'but'], 0, 'Cặp “either … or …”.'],
  ['conjunction', '___ the client approves the design, we will begin production.', ['Once', 'During', 'Despite', 'Beyond'], 0, 'Sau chỗ trống là mệnh đề → liên từ “Once” (khi/một khi).'],
  ['conjunction', 'I will send the file ___ you can review it before the meeting.', ['so that', 'so', 'such as', 'as if'], 0, '“so that + mệnh đề” chỉ mục đích.'],
  // ---- Đại từ & hòa hợp ----
  ['pronoun', 'The company changed ___ return policy last year.', ['it', 'its', 'it’s', 'itself'], 1, 'Cần tính từ sở hữu trước danh từ → its.'],
  ['pronoun', 'Ms. Jung asked me to send ___ the report.', ['she', 'her', 'hers', 'herself'], 1, 'Sau động từ “send” cần tân ngữ → her.'],
  ['pronoun', 'The manager ___ introduced the new policy was Ms. Ito.', ['who', 'whom', 'whose', 'which'], 0, 'Đại từ quan hệ làm chủ ngữ, chỉ người → who.'],
  ['pronoun', 'The software, ___ was released in May, has been very popular.', ['which', 'who', 'whose', 'what'], 0, 'Đại từ quan hệ chỉ vật, có dấu phẩy → which.'],
  ['pronoun', 'The list of items ___ attached.', ['is', 'are', 'were', 'have been'], 0, 'Chủ ngữ chính là “list” (số ít) → is.'],
  ['pronoun', 'Neither of the candidates ___ ready for the interview.', ['was', 'were', 'are', 'have'], 0, '“Neither of …” đi với động từ số ít.'],
  ['pronoun', 'Every employee ___ a copy of the handbook.', ['receives', 'receive', 'are receiving', 'have received'], 0, '“Every + danh từ số ít” → động từ chia số ít.'],
  ['pronoun', 'The candidate ___ resume impressed us was hired.', ['whose', 'who', 'whom', 'which'], 0, 'Chỉ sở hữu (resume của ứng viên) → whose.'],
  // ---- Bị động ----
  ['passive', 'The contract ___ by both parties yesterday.', ['was signed', 'signed', 'has signing', 'is signing'], 0, 'Hợp đồng “được ký”, mốc quá khứ → was signed.'],
  ['passive', 'All invoices must ___ before the end of the month.', ['be paid', 'pay', 'paying', 'to pay'], 0, '“must be + V3” = phải được thanh toán.'],
  ['passive', 'The old equipment ___ with new machines last year.', ['replaced', 'was replaced', 'has replaced', 'is replacing'], 1, 'Thiết bị “bị thay thế” → quá khứ bị động.'],
  ['passive', 'Employees are ___ to submit timesheets weekly.', ['require', 'required', 'requiring', 'requirement'], 1, '“be required to + V” = được yêu cầu.'],
  ['passive', 'The meeting has been ___ until next week.', ['postpone', 'postponing', 'postponed', 'postpones'], 2, '“has been + V3” → hiện tại hoàn thành bị động.'],
  ['passive', 'The shipment ___ at the port by customs officials.', ['inspected', 'was inspected', 'inspects', 'has inspected'], 1, 'Lô hàng bị kiểm tra bởi hải quan → bị động.'],
  ['passive', 'The report is expected ___ completed by Monday.', ['to be', 'being', 'be', 'been'], 0, '“be expected to + V” → to be completed.'],
  ['passive', 'Applications ___ until June 30.', ['are accepted', 'accept', 'accepting', 'has accepted'], 0, 'Đơn “được nhận” → bị động, chủ ngữ số nhiều.'],
  // ---- Điều kiện ----
  ['conditional', 'If the shipment ___ today, we can start tomorrow.', ['arrives', 'will arrive', 'arrived', 'arriving'], 0, 'Điều kiện loại 1: mệnh đề “if” dùng hiện tại đơn.'],
  ['conditional', 'If I ___ more time, I would attend the seminar.', ['have', 'had', 'will have', 'having'], 1, 'Điều kiện loại 2: if + quá khứ, would + V.'],
  ['conditional', 'We would have finished earlier if the system ___ crashed.', ['hadn’t', 'didn’t', 'hasn’t', 'wouldn’t'], 0, 'Điều kiện loại 3: if + had + V3.'],
  ['conditional', '___ you need help, please contact the help desk.', ['Should', 'Although', 'Unless', 'Whereas'], 0, 'Đảo ngữ điều kiện loại 1: Should + chủ ngữ + V.'],
  ['conditional', 'Unless you ___ the form, we cannot process your request.', ['submit', 'will submit', 'submitted', 'submitting'], 0, 'Sau “unless” dùng hiện tại đơn khi nói về tương lai.'],
  ['conditional', 'If it ___ tomorrow, the picnic will be canceled.', ['rains', 'will rain', 'rained', 'raining'], 0, 'Điều kiện loại 1 → hiện tại đơn sau “if”.'],
  // ---- So sánh ----
  ['comparison', 'This model is ___ than the previous one.', ['more efficient', 'most efficient', 'efficient', 'efficiently'], 0, 'Có “than” → so sánh hơn: more + tính từ dài.'],
  ['comparison', 'She is the ___ employee in our department.', ['most experienced', 'more experienced', 'experience', 'experiencing'], 0, 'Có “the … in …” → so sánh nhất.'],
  ['comparison', 'The new system is as ___ as the old one.', ['reliable', 'more reliable', 'most reliable', 'reliably'], 0, 'Cấu trúc “as + tính từ + as”.'],
  ['comparison', 'Sales were ___ higher than last year.', ['far', 'very', 'most', 'more'], 0, 'Bổ nghĩa cho so sánh hơn dùng far/much/even, không dùng “very”.'],
  ['comparison', 'The ___ you submit the form, the sooner you will get a reply.', ['earlier', 'early', 'earliest', 'more early'], 0, 'Cấu trúc “The + so sánh hơn, the + so sánh hơn”.'],
  ['comparison', 'Of all the candidates, Mr. Han is the ___ qualified.', ['best', 'most', 'more', 'much'], 1, '“the most + tính từ dài” cho so sánh nhất.'],
  // ---- Từ vựng ----
  ['vocab', 'Please ___ your seat belts during takeoff.', ['fasten', 'hold', 'carry', 'open'], 0, 'Cụm “fasten a seat belt” = thắt dây an toàn.'],
  ['vocab', 'The company will ___ a new CEO next month.', ['appoint', 'apply', 'appeal', 'approach'], 0, '“appoint” = bổ nhiệm.'],
  ['vocab', 'We apologize for the ___ caused by the delay.', ['inconvenience', 'convenience', 'invention', 'inclusion'], 0, 'Cụm “apologize for the inconvenience” = xin lỗi vì sự bất tiện.'],
  ['vocab', 'The hotel offers a ___ breakfast to all guests.', ['complimentary', 'complicated', 'competitive', 'complete'], 0, '“complimentary” = miễn phí, tặng kèm.'],
  ['vocab', 'Employees must ___ with safety regulations.', ['comply', 'compare', 'complain', 'compete'], 0, 'Cụm “comply with” = tuân thủ.'],
  ['vocab', 'Please keep your ___ as proof of purchase.', ['receipt', 'recipe', 'reception', 'recession'], 0, '“receipt” = biên lai.'],
  ['vocab', 'The factory had to ___ production because of the power failure.', ['suspend', 'suspect', 'suppose', 'support'], 0, '“suspend” = tạm ngừng.'],
  ['vocab', 'Mr. Davis is ___ to the Seoul office; he will move in June.', ['relocating', 'reloading', 'reminding', 'replacing'], 0, '“relocate” = chuyển địa điểm làm việc.'],
]

export const QUESTIONS: Question[] = [...raw, ...raw2, ...raw3].map(([tag, q, opts, a, why], i) => ({
  id: `${tag}-${i}`,
  tag,
  q,
  opts,
  a,
  why,
}))
