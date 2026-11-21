import type { Tag } from './questions'

type Q = [Tag, string, [string, string, string, string], 0 | 1 | 2 | 3, string]

// Đợt 2: thêm câu Part 5 (tự viết).
export const raw2: Q[] = [
  // ---- Loại từ ----
  ['word-form', 'Our new office has a ___ view of the harbor.', ['spectacular', 'spectacularly', 'spectacle', 'spectate'], 0, 'Trước danh từ “view” cần tính từ → spectacular.'],
  ['word-form', 'The manager spoke ___ about the team’s results.', ['proudly', 'proud', 'pride', 'prouder'], 0, 'Bổ nghĩa cho động từ “spoke” cần trạng từ → proudly.'],
  ['word-form', 'Applicants must show ___ of their qualifications.', ['prove', 'proof', 'proving', 'provable'], 1, 'Sau động từ “show” cần danh từ làm tân ngữ → proof.'],
  ['word-form', 'The company is committed to ___ the quality of its service.', ['improve', 'improving', 'improvement', 'improved'], 1, '“be committed to + V-ing”: “to” ở đây là giới từ.'],
  ['word-form', 'She is a very ___ employee who never misses a deadline.', ['rely', 'reliable', 'reliably', 'reliance'], 1, 'Sau “very” và trước danh từ “employee” cần tính từ → reliable.'],
  // ---- Thì ----
  ['tense', 'I ___ the report when you called me yesterday.', ['finish', 'was finishing', 'have finished', 'will finish'], 1, 'Hành động đang diễn ra thì bị cuộc gọi cắt ngang → quá khứ tiếp diễn.'],
  ['tense', 'The new store ___ next Monday.', ['opens', 'opened', 'has opened', 'opening'], 0, 'Lịch trình cố định trong tương lai dùng hiện tại đơn.'],
  ['tense', 'We ___ with this supplier since 2018.', ['work', 'worked', 'have worked', 'will work'], 2, '“since + mốc quá khứ” → hiện tại hoàn thành.'],
  ['tense', 'By next year, the company ___ its sales target.', ['reaches', 'will have reached', 'reached', 'is reaching'], 1, '“By next year” → tương lai hoàn thành.'],
  ['tense', 'The train ___ by the time we reached the platform.', ['leaves', 'had left', 'will leave', 'is leaving'], 1, '“by the time + quá khứ” → hành động trước đó dùng quá khứ hoàn thành.'],
  // ---- Giới từ ----
  ['preposition', 'The meeting has been moved ___ Tuesday to Wednesday.', ['from', 'since', 'by', 'at'], 0, 'Cấu trúc “from … to …”.'],
  ['preposition', 'Please send the documents ___ email.', ['by', 'on', 'at', 'in'], 0, 'Cụm “by email” = bằng email.'],
  ['preposition', 'Our flight arrives ___ the morning.', ['on', 'at', 'in', 'by'], 2, 'Buổi trong ngày dùng “in the morning”.'],
  ['preposition', 'He has been absent ___ Monday.', ['for', 'since', 'during', 'from'], 1, '“since + mốc thời gian” đi với hiện tại hoàn thành.'],
  ['preposition', 'The company is famous ___ its excellent customer service.', ['for', 'of', 'with', 'about'], 0, 'Cụm “be famous for”.'],
  // ---- Liên từ ----
  ['conjunction', 'We will start the meeting ___ everyone has arrived.', ['as soon as', 'despite', 'because of', 'during'], 0, 'Sau chỗ trống là mệnh đề → liên từ “as soon as”.'],
  ['conjunction', '___ the project was difficult, the team finished it on time.', ['Although', 'Because', 'Unless', 'So'], 0, 'Hai vế tương phản → Although.'],
  ['conjunction', 'Please lock the door ___ you leave the office.', ['before', 'during', 'despite', 'because of'], 0, 'Sau chỗ trống là mệnh đề; “before” là liên từ thời gian.'],
  ['conjunction', 'The conference was canceled ___ the speaker was ill.', ['because', 'although', 'unless', 'whether'], 0, 'Vế sau nêu lý do → because.'],
  ['conjunction', 'Neither the manager ___ the staff knew about the change.', ['nor', 'or', 'and', 'but'], 0, 'Cặp “neither … nor …”.'],
  // ---- Đại từ ----
  ['pronoun', 'The documents ___ you requested are attached.', ['that', 'who', 'whose', 'what'], 0, 'Đại từ quan hệ chỉ vật → that (hoặc which).'],
  ['pronoun', 'Ms. Kim, ___ works in accounting, will lead the audit.', ['who', 'whom', 'whose', 'which'], 0, 'Đại từ quan hệ làm chủ ngữ, chỉ người → who.'],
  ['pronoun', 'Please review the proposal and send ___ comments by Friday.', ['you', 'your', 'yours', 'yourself'], 1, 'Trước danh từ “comments” cần tính từ sở hữu → your.'],
  ['pronoun', 'The staff must wash ___ hands before entering the kitchen.', ['they', 'them', 'their', 'theirs'], 2, 'Trước danh từ “hands” cần tính từ sở hữu → their.'],
  ['pronoun', 'Each of the managers ___ responsible for a different region.', ['is', 'are', 'were', 'have been'], 0, '“Each of …” đi với động từ số ít.'],
  // ---- Bị động ----
  ['passive', 'The new product line ___ at the trade show next week.', ['will be introduced', 'will introduce', 'introduced', 'is introducing'], 0, 'Dòng sản phẩm “được giới thiệu” → tương lai bị động.'],
  ['passive', 'All visitors are ___ to sign in at the front desk.', ['ask', 'asked', 'asking', 'asks'], 1, '“be asked to + V” → asked.'],
  ['passive', 'The documents ___ by the legal team before they were sent.', ['reviewed', 'were reviewed', 'have reviewed', 'reviewing'], 1, 'Tài liệu “được xem xét”, mốc quá khứ → were reviewed.'],
  ['passive', 'The office ___ every night by a cleaning service.', ['cleans', 'is cleaned', 'cleaning', 'has cleaned'], 1, 'Văn phòng “được dọn” hằng đêm → hiện tại bị động.'],
  ['passive', 'The error ___ yet.', ['is not fixed', 'has not been fixed', 'does not fix', 'not fixed'], 1, 'Có “yet” → hiện tại hoàn thành bị động.'],
  // ---- Điều kiện ----
  ['conditional', 'If you ___ any problems, call our help line.', ['have', 'will have', 'had had', 'having'], 0, 'Điều kiện loại 1: if + hiện tại đơn.'],
  ['conditional', 'If the weather ___ better, we would hold the event outside.', ['is', 'were', 'will be', 'has been'], 1, 'Điều kiện loại 2: if + quá khứ (were), would + V.'],
  ['conditional', 'We would have missed the deadline if you ___ helped us.', ['hadn’t', 'didn’t', 'haven’t', 'wouldn’t'], 0, 'Điều kiện loại 3: if + had + V3; ở đây là “hadn’t helped”.'],
  ['conditional', '___ the shipment be delayed, we will inform you immediately.', ['Should', 'Would', 'Could', 'Did'], 0, 'Đảo ngữ điều kiện loại 1: Should + chủ ngữ + V.'],
  // ---- So sánh ----
  ['comparison', 'This route is ___ than the other one.', ['shorter', 'short', 'shortest', 'more short'], 0, 'Có “than”, tính từ ngắn → shorter.'],
  ['comparison', 'It was the ___ day of the year.', ['busiest', 'busier', 'busy', 'most busier'], 0, '“the … of the year” → so sánh nhất của tính từ ngắn.'],
  ['comparison', 'The new phone is not as ___ as the old one.', ['heavy', 'heavier', 'heaviest', 'heavily'], 0, 'Cấu trúc “as + tính từ + as”.'],
  ['comparison', 'Prices are ___ lower than last year.', ['much', 'very', 'more', 'most'], 0, 'Bổ nghĩa cho so sánh hơn dùng much, không dùng very.'],
  // ---- Từ vựng ----
  ['vocab', 'We need to ___ our prices to stay competitive.', ['adjust', 'adopt', 'admit', 'adhere'], 0, '“adjust prices” = điều chỉnh giá.'],
  ['vocab', 'The ___ of the contract expires next month.', ['term', 'trend', 'tone', 'tour'], 0, '“term of the contract” = thời hạn hợp đồng.'],
  ['vocab', 'Please ___ the document to your email.', ['attach', 'attack', 'attend', 'attain'], 0, '“attach” = đính kèm.'],
  ['vocab', 'The company will ___ the old equipment with new machines.', ['replace', 'repeat', 'reply', 'report'], 0, '“replace A with B” = thay A bằng B.'],
  ['vocab', 'He was ___ for the Employee of the Year award.', ['nominated', 'nominal', 'numerous', 'notified'], 0, '“be nominated for” = được đề cử.'],
  ['vocab', 'We are pleased to ___ that our sales have doubled.', ['announce', 'denounce', 'renounce', 'pronounce'], 0, '“announce” = thông báo.'],
  ['vocab', 'The two companies plan to ___ next year.', ['merge', 'mere', 'merit', 'marge'], 0, '“merge” = sáp nhập.'],
]
