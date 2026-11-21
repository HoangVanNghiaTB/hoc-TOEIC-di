import { P2_MORE } from './listening-2'

// Part 2 mô phỏng: một câu hỏi/câu nói, ba lời đáp. Phần tử đầu của `r` luôn là đáp án đúng,
// ứng dụng sẽ xáo thứ tự khi hiển thị.
export type P2 = {
  id: string
  q: string
  r: [string, string, string]
  viQ: string
  viA: string
  why: string
}

type Row = [string, [string, string, string], string, string, string]

const rows: Row[] = [
  ['Where is the conference room?', ['On the third floor.', 'At nine o’clock.', 'Yes, it was very long.'], 'Phòng họp ở đâu?', 'Ở tầng ba.', 'Câu hỏi Where → trả lời bằng địa điểm.'],
  ['When does the sales report need to be finished?', ['By the end of the week.', 'In the conference room.', 'Mr. Kim wrote it.'], 'Khi nào cần hoàn thành báo cáo doanh số?', 'Trước cuối tuần.', 'Câu hỏi When → trả lời bằng thời gian.'],
  ['Who is leading the training session?', ['Ms. Alvarez from Human Resources.', 'It starts at ten.', 'In the main hall.'], 'Ai dẫn buổi đào tạo?', 'Cô Alvarez ở phòng nhân sự.', 'Câu hỏi Who → trả lời bằng người.'],
  ['How much does the monthly pass cost?', ['Forty dollars.', 'About twenty minutes.', 'Every Monday.'], 'Vé tháng giá bao nhiêu?', 'Bốn mươi đô la.', 'How much → trả lời bằng giá tiền.'],
  ['Why was the shipment delayed?', ['Because of the bad weather.', 'By express mail.', 'Two boxes.'], 'Vì sao lô hàng bị trễ?', 'Vì thời tiết xấu.', 'Why → trả lời bằng lý do (because…).'],
  ['Did you receive my email about the schedule?', ['Yes, I’ll reply this afternoon.', 'No, it’s on the left.', 'At the front desk.'], 'Bạn nhận được email của tôi về lịch chưa?', 'Rồi, chiều nay tôi sẽ trả lời.', 'Câu hỏi Yes/No, đáp án phù hợp nội dung email.'],
  ['Would you like coffee or tea?', ['Tea, please.', 'Yes, I would.', 'In the kitchen.'], 'Bạn muốn cà phê hay trà?', 'Trà, cảm ơn.', 'Câu hỏi lựa chọn “A or B” → chọn một trong hai.'],
  ['Could you help me move these boxes?', ['Sure, I have a few minutes.', 'They’re in the storage room.', 'Last week.'], 'Bạn giúp tôi chuyển mấy cái hộp này được không?', 'Được, tôi có vài phút.', 'Lời nhờ vả → đồng ý hoặc từ chối.'],
  ['Should we order lunch for the meeting?', ['Yes, I’ll call the caterer.', 'It was delicious.', 'At noon yesterday.'], 'Chúng ta có nên đặt bữa trưa cho cuộc họp không?', 'Có, tôi sẽ gọi bên cung cấp tiệc.', 'Câu hỏi “Should we…” → đồng ý kèm hành động.'],
  ['What time does the store close?', ['At nine tonight.', 'It’s a large store.', 'Two blocks away.'], 'Mấy giờ cửa hàng đóng cửa?', 'Chín giờ tối nay.', 'What time → trả lời bằng giờ.'],
  ['Isn’t the printer broken?', ['Yes, a technician is coming tomorrow.', 'I prefer the blue one.', 'Print it twice.'], 'Máy in chưa hỏng à?', 'Đúng, ngày mai có kỹ thuật viên đến.', 'Câu hỏi phủ định vẫn trả lời Yes/No + thông tin.'],
  ['How often do you travel for work?', ['About once a month.', 'By airplane.', 'For three days.'], 'Bạn đi công tác bao lâu một lần?', 'Khoảng một lần mỗi tháng.', 'How often → tần suất.'],
  ['Which desk is yours?', ['The one by the window.', 'Yes, it’s mine.', 'At two o’clock.'], 'Bàn nào là của bạn?', 'Cái cạnh cửa sổ.', 'Which → chọn một đối tượng cụ thể.'],
  ['Who should I send the invoice to?', ['Send it to the accounting department.', 'It’s two hundred dollars.', 'Yesterday afternoon.'], 'Tôi nên gửi hóa đơn cho ai?', 'Gửi cho phòng kế toán.', 'Who → trả lời bằng người hoặc bộ phận.'],
  ['I’d like to change my reservation.', ['Certainly, what date would you prefer?', 'No, I haven’t eaten yet.', 'The restaurant is nearby.'], 'Tôi muốn đổi đặt chỗ.', 'Vâng, bạn muốn ngày nào?', 'Câu nói/yêu cầu → đáp lại phù hợp, hỏi tiếp thông tin.'],
  ['Why don’t we meet at the café across the street?', ['That sounds fine.', 'He met the client.', 'Across the bridge.'], 'Sao ta không gặp ở quán cà phê bên kia đường?', 'Nghe được đấy.', '“Why don’t we…” là lời đề nghị → đồng ý/từ chối.'],
  ['Where can I find the visitor passes?', ['Ask at the reception desk.', 'Two passes, please.', 'Yes, he did.'], 'Tôi lấy thẻ khách ở đâu?', 'Hãy hỏi ở quầy lễ tân.', 'Where → địa điểm/cách tìm.'],
  ['When will the new software be installed?', ['Sometime next week.', 'It’s very easy to use.', 'In the office downstairs.'], 'Khi nào cài phần mềm mới?', 'Khoảng tuần sau.', 'When → thời gian.'],
  ['Do you know if the bank is open on Saturdays?', ['Yes, until noon.', 'A savings account.', 'I walked there.'], 'Bạn có biết ngân hàng có mở thứ Bảy không?', 'Có, đến trưa.', 'Yes/No kèm thông tin giờ mở cửa.'],
  ['The air conditioner isn’t working again.', ['I’ll call maintenance right away.', 'It’s very cold outside, yes.', 'Two conditioners.'], 'Máy lạnh lại hỏng rồi.', 'Tôi sẽ gọi bộ phận bảo trì ngay.', 'Câu phàn nàn → đáp lại bằng hành động giải quyết.'],
  ['How did the client presentation go?', ['Very well, they signed the contract.', 'At the client’s office.', 'I presented it.'], 'Buổi thuyết trình với khách thế nào?', 'Rất tốt, họ đã ký hợp đồng.', 'How did … go → hỏi kết quả, trả lời bằng nhận xét.'],
  ['Whose umbrella is this?', ['I think it’s Ms. Park’s.', 'It’s raining hard.', 'Two umbrellas.'], 'Cái ô này của ai?', 'Tôi nghĩ là của cô Park.', 'Whose → chủ sở hữu.'],
  ['What do you think of the new design?', ['I like it a lot.', 'Yes, I designed it.', 'By next month.'], 'Bạn nghĩ gì về thiết kế mới?', 'Tôi rất thích.', 'What do you think → hỏi ý kiến.'],
  ['Haven’t you finished the budget report yet?', ['Not yet, I need one more day.', 'Yes, the budget is big.', 'A few months ago.'], 'Bạn vẫn chưa xong báo cáo ngân sách à?', 'Chưa, tôi cần thêm một ngày.', 'Câu phủ định → trả lời trạng thái + lý do.'],
]

const base: P2[] = rows.map(([q, r, viQ, viA, why], i) => ({ id: `p2-${i}`, q, r, viQ, viA, why }))

export const P2_QUESTIONS: P2[] = [...base, ...P2_MORE]
