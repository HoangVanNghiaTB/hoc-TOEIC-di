import type { Tag } from './questions'

type Q = [Tag, string, [string, string, string, string], 0 | 1 | 2 | 3, string]

// Đợt 3: thêm câu Part 5 (tự viết).
export const raw3: Q[] = [
  // ---- Loại từ ----
  ['word-form', 'The company offers a wide ___ of services to small businesses.', ['vary', 'variety', 'various', 'variously'], 1, 'Sau “a wide” cần danh từ → “a wide variety of”.'],
  ['word-form', 'Please read the instructions ___ before assembling the shelf.', ['careful', 'carefully', 'carefulness', 'cared'], 1, 'Bổ nghĩa cho động từ “read” → trạng từ carefully.'],
  ['word-form', 'Mr. Gupta is responsible for the ___ of new employees.', ['train', 'trainer', 'training', 'trained'], 2, 'Sau “the” và trước “of” cần danh từ chỉ việc đào tạo → training.'],
  ['word-form', 'The warranty is ___ for two years from the date of purchase.', ['validate', 'valid', 'validity', 'validly'], 1, 'Sau “is” cần tính từ → valid (có hiệu lực).'],
  ['word-form', 'We were ___ to learn that the conference had been canceled.', ['disappoint', 'disappointed', 'disappointing', 'disappointment'], 1, 'Chỉ cảm xúc của người → tính từ đuôi -ed.'],
  ['word-form', 'Our new software is ___ easier to use than the old version.', ['significant', 'significantly', 'signify', 'significance'], 1, 'Trạng từ bổ nghĩa cho so sánh hơn “easier”.'],
  ['word-form', 'The ___ between the two offices has improved.', ['communicate', 'communicative', 'communication', 'communicatively'], 2, 'Sau “The” cần danh từ → communication.'],
  // ---- Thì ----
  ['tense', 'Ms. Park ___ the proposal yesterday afternoon.', ['reviews', 'reviewed', 'has reviewed', 'is reviewing'], 1, '“yesterday afternoon” → quá khứ đơn.'],
  ['tense', 'The factory ___ more than 500 workers since it opened.', ['employs', 'employed', 'has employed', 'will employ'], 2, '“since + mệnh đề quá khứ” → hiện tại hoàn thành.'],
  ['tense', 'Please call me when the shipment ___.', ['will arrive', 'arrives', 'arrived', 'arriving'], 1, 'Mệnh đề thời gian với “when” dùng hiện tại đơn cho tương lai.'],
  ['tense', 'At this time next week, we ___ at the conference in Tokyo.', ['are', 'will be', 'were', 'have been'], 1, '“At this time next week” → tương lai.'],
  ['tense', 'He ___ for the company for ten years when he retired.', ['works', 'had worked', 'has worked', 'will work'], 1, 'Hành động xảy ra trước mốc quá khứ “retired” → quá khứ hoàn thành.'],
  ['tense', 'Sales ___ rapidly over the past three months.', ['grow', 'grew', 'have grown', 'will grow'], 2, '“over the past three months” → hiện tại hoàn thành.'],
  ['tense', 'The manager is out of the office; she ___ a client right now.', ['visits', 'is visiting', 'visited', 'has visited'], 1, '“right now” → hiện tại tiếp diễn.'],
  // ---- Giới từ ----
  ['preposition', 'Please submit your timesheet ___ the end of the day.', ['by', 'until', 'during', 'at'], 0, '“by + mốc” = chậm nhất vào lúc đó.'],
  ['preposition', 'The company is committed ___ reducing waste.', ['to', 'for', 'with', 'in'], 0, 'Cụm “be committed to + V-ing”.'],
  ['preposition', 'She has been working here ___ three years.', ['since', 'for', 'during', 'from'], 1, '“for + khoảng thời gian”.'],
  ['preposition', 'All employees must wear ID badges ___ the building.', ['inside', 'between', 'among', 'beside'], 0, '“inside the building” = bên trong tòa nhà.'],
  ['preposition', 'The seminar is divided ___ three sessions.', ['into', 'to', 'of', 'by'], 0, 'Cụm “be divided into”.'],
  ['preposition', 'He apologized ___ the mistake.', ['for', 'of', 'on', 'with'], 0, 'Cụm “apologize for”.'],
  ['preposition', 'Orders will be shipped ___ two business days.', ['within', 'during', 'since', 'among'], 0, '“within + khoảng thời gian” = trong vòng.'],
  // ---- Liên từ ----
  ['conjunction', 'The meeting was short, ___ it covered all the main points.', ['yet', 'so', 'because', 'unless'], 0, 'Hai vế đối lập nhẹ (ngắn nhưng đủ nội dung) → yet.'],
  ['conjunction', '___ the weather improves, the outdoor event will be held as planned.', ['Provided that', 'Despite', 'Because of', 'In spite'], 0, 'Cần liên từ điều kiện → Provided that (miễn là).'],
  ['conjunction', 'You can pay by credit card ___ in cash.', ['and', 'or', 'but', 'so'], 1, 'Hai lựa chọn → or.'],
  ['conjunction', 'We moved the deadline ___ the team needed more time.', ['because', 'although', 'unless', 'whereas'], 0, 'Vế sau nêu lý do → because.'],
  ['conjunction', '___ you have finished the report, please send it to me.', ['Once', 'During', 'Despite', 'Throughout'], 0, 'Sau chỗ trống là mệnh đề → liên từ Once (khi).'],
  ['conjunction', 'Not only is the software easy to use, ___ it is also affordable.', ['but', 'and', 'so', 'or'], 0, 'Cặp “not only … but also …”.'],
  ['conjunction', 'I will wait here ___ you finish the call.', ['until', 'during', 'since', 'despite'], 0, '“until + mệnh đề” = cho đến khi.'],
  // ---- Đại từ ----
  ['pronoun', 'The customers ___ complained about the delay received a refund.', ['who', 'whom', 'whose', 'which'], 0, 'Đại từ quan hệ chủ ngữ, chỉ người → who.'],
  ['pronoun', 'Mr. Kato wrote the report ___.', ['him', 'himself', 'his', 'he'], 1, 'Đại từ phản thân nhấn mạnh tự làm → himself.'],
  ['pronoun', 'The committee announced ___ decision on Friday.', ['it', 'its', 'itself', 'them'], 1, 'Trước danh từ “decision” cần tính từ sở hữu → its.'],
  ['pronoun', 'Please give the form to ___ is at the front desk.', ['whoever', 'whomever', 'whose', 'whichever'], 0, '“whoever” làm chủ ngữ của “is at the front desk”.'],
  ['pronoun', 'Both of the candidates ___ qualified.', ['is', 'are', 'was', 'has been'], 1, '“Both of …” đi với động từ số nhiều.'],
  ['pronoun', 'The company ___ products are sold worldwide is based in Seoul.', ['whose', 'who', 'which', 'that'], 0, 'Chỉ sở hữu (sản phẩm của công ty) → whose.'],
  ['pronoun', 'Neither Ms. Lee nor her assistants ___ available this morning.', ['is', 'are', 'was', 'has'], 1, '“neither … nor …” chia động từ theo chủ ngữ gần nhất (assistants) → are.'],
  // ---- Bị động ----
  ['passive', 'The report ___ by the finance team next week.', ['will be completed', 'will complete', 'completed', 'is completing'], 0, 'Báo cáo “được hoàn thành”, mốc tương lai → will be completed.'],
  ['passive', 'Employees are ___ to arrive fifteen minutes before their shifts.', ['expect', 'expected', 'expecting', 'expectation'], 1, '“be expected to + V” → expected.'],
  ['passive', 'The new policy ___ to all staff yesterday.', ['announced', 'was announced', 'has announced', 'announcing'], 1, 'Chính sách “được thông báo”, quá khứ → was announced.'],
  ['passive', 'The shipment must ___ by Friday.', ['receive', 'be received', 'receiving', 'have received'], 1, '“must be + V3” → be received.'],
  ['passive', 'Several errors ___ in the first draft.', ['found', 'were found', 'have found', 'finding'], 1, 'Lỗi “được tìm thấy” → were found.'],
  ['passive', 'The conference room ___ for a meeting at this moment.', ['uses', 'is being used', 'has used', 'used'], 1, 'Đang được sử dụng ngay lúc này → hiện tại tiếp diễn bị động.'],
  ['passive', 'The building ___ in 1995 and renovated last year.', ['built', 'was built', 'has built', 'building'], 1, 'Tòa nhà “được xây”, mốc quá khứ → was built.'],
  // ---- Điều kiện ----
  ['conditional', 'If the printer ___ again, call the technician.', ['breaks', 'will break', 'broke', 'breaking'], 0, 'Điều kiện loại 1: if + hiện tại đơn.'],
  ['conditional', 'If I were you, I ___ the offer.', ['accept', 'would accept', 'will accept', 'accepted'], 1, 'Điều kiện loại 2: If + were, would + V.'],
  ['conditional', 'Had we known about the delay, we ___ another supplier.', ['would have chosen', 'would choose', 'will choose', 'chose'], 0, 'Đảo ngữ loại 3: Had + S + V3, would have + V3.'],
  ['conditional', 'Unless the client ___ the contract today, we will lose the deal.', ['signs', 'will sign', 'signed', 'signing'], 0, 'Sau “unless” dùng hiện tại đơn.'],
  ['conditional', 'If the budget ___ larger, we would hire more staff.', ['is', 'were', 'will be', 'has been'], 1, 'Điều kiện loại 2 → if + were.'],
  ['conditional', '___ you need an extension, please let us know.', ['Should', 'Would', 'Did', 'Could'], 0, 'Đảo ngữ điều kiện loại 1: Should + chủ ngữ + V.'],
  // ---- So sánh ----
  ['comparison', 'This is the ___ report we have received this year.', ['most detailed', 'more detailed', 'detailed', 'detail'], 0, 'Có “the … this year” → so sánh nhất.'],
  ['comparison', 'The new model is ___ expensive than the previous one.', ['less', 'least', 'lesser', 'little'], 0, 'Có “than” → less + tính từ.'],
  ['comparison', 'Prices here are not as ___ as those at the other store.', ['high', 'higher', 'highest', 'highly'], 0, 'Cấu trúc “as + tính từ + as”.'],
  ['comparison', 'The ___ the machine runs, the more energy it uses.', ['longer', 'long', 'longest', 'more long'], 0, '“The + so sánh hơn, the + so sánh hơn”.'],
  ['comparison', 'She is by far the ___ candidate for the job.', ['best', 'better', 'good', 'well'], 0, '“by far the + so sánh nhất” → best.'],
  ['comparison', 'Today’s sales were ___ than we expected.', ['good', 'better', 'best', 'well'], 1, 'Có “than” → so sánh hơn better.'],
  // ---- Từ vựng ----
  ['vocab', 'The airline will ___ passengers for the delay.', ['compensate', 'compose', 'comprise', 'compare'], 0, '“compensate” = bồi thường.'],
  ['vocab', 'The company decided to ___ a new branch in Busan.', ['establish', 'estimate', 'evaluate', 'exhaust'], 0, '“establish a branch” = thành lập chi nhánh.'],
  ['vocab', 'Please ___ your supervisor of any changes to the schedule.', ['notify', 'nominate', 'navigate', 'neglect'], 0, '“notify someone of …” = thông báo cho ai về …'],
  ['vocab', 'Due to a ___ of workers, the factory reduced output.', ['shortage', 'shortcut', 'shorthand', 'shortlist'], 0, '“a shortage of” = sự thiếu hụt.'],
  ['vocab', 'Employees can ___ for a transfer to another department.', ['apply', 'reply', 'supply', 'comply'], 0, '“apply for” = nộp đơn xin.'],
  ['vocab', 'The two companies signed an ___ to share resources.', ['agreement', 'argument', 'attention', 'ability'], 0, '“sign an agreement” = ký thỏa thuận.'],
  ['vocab', 'She was ___ to the position of regional director.', ['promoted', 'promised', 'prompted', 'protected'], 0, '“be promoted to” = được thăng chức.'],
  ['vocab', 'Please keep a ___ of all your receipts for tax purposes.', ['record', 'rumor', 'reward', 'remark'], 0, '“keep a record of” = lưu giữ hồ sơ.'],
  ['vocab', 'The new law will ___ small businesses the most.', ['affect', 'effect', 'affection', 'effective'], 0, '“affect” là động từ = ảnh hưởng; “effect” là danh từ.'],
]
