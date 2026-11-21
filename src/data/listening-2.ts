import type { P2 } from './listening'

type Row = [string, [string, string, string], string, string, string]

// Đợt 2: thêm Part 2 (tự viết). Phần tử đầu của mỗi bộ ba là đáp án đúng.
export const rows2: Row[] = [
  ['What time is the staff meeting?', ['At ten thirty.', 'In the conference room.', 'Yes, I do.'], 'Mấy giờ họp nhân viên?', 'Lúc mười giờ rưỡi.', 'What time → trả lời bằng giờ.'],
  ['Who is responsible for ordering supplies?', ['Mr. Brown handles that.', 'Two boxes of paper.', 'By next Friday.'], 'Ai chịu trách nhiệm đặt đồ dùng?', 'Ông Brown lo việc đó.', 'Who → trả lời bằng người.'],
  ['Where should I put these files?', ['On the shelf by the door.', 'At three o’clock.', 'They are very important.'], 'Tôi nên để các hồ sơ này ở đâu?', 'Trên kệ cạnh cửa.', 'Where → địa điểm.'],
  ['How long will the repairs take?', ['About two days.', 'Around the corner.', 'Twenty dollars.'], 'Việc sửa chữa mất bao lâu?', 'Khoảng hai ngày.', 'How long → khoảng thời gian.'],
  ['Why was the flight canceled?', ['Because of a technical problem.', 'To the airport.', 'Around noon.'], 'Vì sao chuyến bay bị hủy?', 'Vì sự cố kỹ thuật.', 'Why → lý do (because…).'],
  ['Would you like to join us for lunch?', ['I would love to.', 'It is a long lunch.', 'Yes, it is on the menu.'], 'Bạn muốn ăn trưa cùng chúng tôi không?', 'Tôi rất muốn.', 'Lời mời → đồng ý hoặc từ chối.'],
  ['Could you send me the updated schedule?', ['Sure, I will email it now.', 'It is on the second floor.', 'Every morning.'], 'Bạn gửi tôi lịch cập nhật được không?', 'Được, tôi gửi email ngay.', 'Lời nhờ vả → đồng ý hoặc từ chối.'],
  ['Which train goes to the airport?', ['The one on platform four.', 'About an hour.', 'Yes, I have a ticket.'], 'Tàu nào đi ra sân bay?', 'Chuyến ở sân ga số bốn.', 'Which → chọn một đối tượng cụ thể.'],
  ['How many copies do you need?', ['Twenty should be enough.', 'At the copy center.', 'Yes, it is ready.'], 'Bạn cần bao nhiêu bản?', 'Hai mươi bản là đủ.', 'How many → số lượng.'],
  ['When did the new manager start?', ['Last Monday.', 'In the sales department.', 'She is very friendly.'], 'Quản lý mới bắt đầu làm khi nào?', 'Thứ Hai tuần trước.', 'When → thời gian.'],
  ['Do you want me to book a taxi?', ['No, I will walk.', 'The meter is running.', 'Next to the bank.'], 'Bạn có muốn tôi gọi taxi không?', 'Không, tôi sẽ đi bộ.', 'Câu hỏi Yes/No → đáp trả lời trực tiếp.'],
  ['Where did you buy that laptop?', ['At the store downtown.', 'About nine hundred dollars.', 'It is very fast.'], 'Bạn mua chiếc laptop đó ở đâu?', 'Ở cửa hàng trung tâm.', 'Where → địa điểm.'],
  ['Isn’t this the right address?', ['No, you need number twelve.', 'I wrote a long letter.', 'In the afternoon.'], 'Đây không phải đúng địa chỉ sao?', 'Không, bạn cần số mười hai.', 'Câu hỏi phủ định vẫn trả lời Yes/No + thông tin.'],
  ['I cannot log in to my account.', ['Let me reset your password.', 'At the front desk.', 'Last year’s report.'], 'Tôi không đăng nhập được tài khoản.', 'Để tôi đặt lại mật khẩu cho bạn.', 'Câu nêu vấn đề → đáp lại bằng cách giải quyết.'],
  ['What would you recommend for dessert?', ['The chocolate cake is popular.', 'Yes, I am hungry.', 'Dinner is at seven.'], 'Bạn gợi ý món tráng miệng nào?', 'Bánh sô-cô-la rất được ưa chuộng.', 'What would you recommend → hỏi gợi ý.'],
  ['Should I wait here or go inside?', ['You can go in; they are ready.', 'It is a nice building.', 'Yes, a long wait.'], 'Tôi nên đợi ở đây hay vào trong?', 'Bạn vào được rồi, họ sẵn sàng.', 'Câu hỏi lựa chọn “A or B” → chọn một trong hai.'],
]

export const P2_MORE: P2[] = rows2.map(([q, r, viQ, viA, why], i) => ({ id: `p2b-${i}`, q, r, viQ, viA, why }))
