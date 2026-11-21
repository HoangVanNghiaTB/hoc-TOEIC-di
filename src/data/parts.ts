// Nội dung tự viết theo định dạng Part 3, 4, 6, 7 (không chép đề thật).
export type PQ = {
  q: string
  opts: [string, string, string, string]
  a: 0 | 1 | 2 | 3
  why: string
}

/** Hình minh họa đi kèm bài nghe (Part 3, 4): bảng, biểu đồ cột hoặc sơ đồ mặt bằng. */
export type Graphic =
  | { type: 'table'; title: string; headers: string[]; rows: string[][] }
  | { type: 'bars'; title: string; unit?: string; data: [string, number][] }
  | { type: 'grid'; title: string; cells: string[][] }

export type PartSet = {
  id: string
  kind: 'p3' | 'p4' | 'p6' | 'p7'
  title: string
  /** Part 3: [người nói A/B, lời thoại] */
  lines?: [('A' | 'B'), string][]
  /** Part 4, 6, 7: nội dung bài nói/đoạn văn. Part 6 dùng [1] [2] [3] cho chỗ trống. */
  text?: string
  vi: string // tóm tắt tiếng Việt
  /** Hình kèm theo (chỉ Part 3, 4): câu hỏi có thể bắt đầu bằng “Look at the graphic.” */
  graphic?: Graphic
  qs: PQ[]
}

const q = (qq: string, opts: [string, string, string, string], a: 0 | 1 | 2 | 3, why: string): PQ => ({ q: qq, opts, a, why })

export const P3: PartSet[] = [
  {
    id: 'p3-1', kind: 'p3', title: 'Đặt phòng họp',
    lines: [
      ['A', 'Hi Daniel, I need a room for the sales meeting on Thursday. Is the third-floor conference room free?'],
      ['B', 'It is booked in the morning, but it is available after two o’clock.'],
      ['A', 'That works. We will need a projector, too.'],
      ['B', 'No problem. I will ask the IT team to set one up and send you a confirmation email.'],
    ],
    vi: 'Người phụ nữ muốn đặt phòng họp tầng ba vào thứ Năm. Phòng trống sau 2 giờ chiều; người đàn ông sẽ nhờ bộ phận IT mang máy chiếu và gửi email xác nhận.',
    qs: [
      q('What are the speakers mainly discussing?', ['A hiring plan', 'Booking a meeting room', 'A travel schedule', 'A budget report'], 1, 'Họ bàn về việc đặt phòng họp.'),
      q('When is the room available?', ['In the morning', 'After two o’clock', 'All day Friday', 'Not until next week'], 1, 'Người đàn ông nói: “available after two o’clock”.'),
      q('What will the man do?', ['Order lunch', 'Print a schedule', 'Ask IT to set up a projector', 'Call a client'], 2, '“I will ask the IT team to set one up”.'),
    ],
  },
  {
    id: 'p3-2', kind: 'p3', title: 'Đơn hàng bị trễ',
    lines: [
      ['A', 'Good morning, this is Carlos from Greenway Supplies. I am calling about order 4471. It has not arrived yet.'],
      ['B', 'I apologize, Mr. Rivera. There was a delay at the port because of a storm. The shipment should arrive on Monday.'],
      ['A', 'Monday is too late. We have a customer event on Saturday.'],
      ['B', 'In that case, I can send part of the order by express courier tomorrow at no extra charge.'],
    ],
    vi: 'Khách gọi hỏi đơn hàng chưa đến. Nhân viên giải thích do bão ở cảng nên trễ, và đề nghị gửi một phần đơn bằng chuyển phát nhanh miễn phí vào ngày mai.',
    qs: [
      q('Why is the man calling?', ['To cancel an order', 'To ask about a late order', 'To request a refund', 'To change an address'], 1, 'Anh ấy gọi về đơn hàng chưa đến.'),
      q('What caused the delay?', ['A strike', 'A computer error', 'A storm at the port', 'A shortage of workers'], 2, '“a delay at the port because of a storm”.'),
      q('What does the woman offer?', ['A discount on the next order', 'A full refund', 'A visit from a manager', 'Free express delivery of part of the order'], 3, '“send part of the order by express courier … at no extra charge”.'),
    ],
  },
  {
    id: 'p3-3', kind: 'p3', title: 'Ngày đầu đi làm',
    lines: [
      ['A', 'Welcome to the team, Jin. Your training starts at nine tomorrow in room 204.'],
      ['B', 'Great. Should I bring my laptop?'],
      ['A', 'Yes, and please bring a photo ID so we can make your security badge.'],
      ['B', 'Will I meet my supervisor then?'],
      ['A', 'Yes, Ms. Okafor will join you at lunch.'],
    ],
    vi: 'Jin là nhân viên mới. Buổi đào tạo bắt đầu 9 giờ sáng mai ở phòng 204. Cần mang laptop và giấy tờ tùy thân có ảnh; trưa sẽ gặp người giám sát.',
    qs: [
      q('Who most likely is the man?', ['A new employee', 'A client', 'A security guard', 'A trainer'], 0, '“Welcome to the team” → nhân viên mới.'),
      q('What does the woman tell the man to bring?', ['Only a notebook', 'A laptop and a photo ID', 'A signed contract', 'His own lunch'], 1, 'Cô ấy nói mang laptop và photo ID.'),
      q('What will happen at lunch?', ['He will take a test', 'He will visit another office', 'He will meet his supervisor', 'He will receive a badge'], 2, '“Ms. Okafor will join you at lunch” (người giám sát).'),
    ],
  },
  {
    id: 'p3-4', kind: 'p3', title: 'Đặt tiệc nghỉ hưu',
    lines: [
      ['A', 'I am organizing a retirement party for forty people on the fifteenth. Can your restaurant host it?'],
      ['B', 'Yes, our private room seats up to fifty. Would you like a set menu or a buffet?'],
      ['A', 'A buffet, please. Do you offer vegetarian options?'],
      ['B', 'Of course. I will email you the menu and a price estimate this afternoon.'],
    ],
    vi: 'Người đàn ông tổ chức tiệc nghỉ hưu 40 người. Nhà hàng có phòng riêng 50 chỗ. Anh chọn buffet và hỏi món chay; chiều nay nhà hàng sẽ gửi thực đơn và báo giá qua email.',
    qs: [
      q('What event is the man planning?', ['A wedding', 'A retirement party', 'A product launch', 'A business lunch'], 1, '“a retirement party”.'),
      q('What does the man ask about?', ['Parking', 'Live music', 'Vegetarian options', 'Discounts'], 2, '“Do you offer vegetarian options?”'),
      q('What will the woman do this afternoon?', ['Visit the venue', 'Email a menu and estimate', 'Call another restaurant', 'Reserve a bus'], 1, '“I will email you the menu and a price estimate this afternoon”.'),
    ],
  },
  {
    id: 'p3-5', kind: 'p3', title: 'Đổi chuyến bay',
    lines: [
      ['A', 'I would like to change my flight to Seoul from Friday to Saturday.'],
      ['B', 'I can do that, but there is a change fee of fifty dollars. The Saturday flight also leaves earlier, at seven a.m.'],
      ['A', 'That is fine. Can I get a window seat?'],
      ['B', 'Yes, seat 14A is open. I will update your booking now.'],
    ],
    vi: 'Khách muốn đổi chuyến bay sang thứ Bảy. Có phí đổi 50 đô và chuyến bay thứ Bảy khởi hành sớm hơn, 7 giờ sáng. Nhân viên sẽ cập nhật đặt chỗ, ghế cạnh cửa sổ 14A còn trống.',
    qs: [
      q('What does the woman want to do?', ['Cancel a trip', 'Change a flight', 'Upgrade her seat', 'Buy a ticket for a friend'], 1, '“change my flight”.'),
      q('What is mentioned about the Saturday flight?', ['It is more expensive', 'It is full', 'It leaves early', 'It goes to a different city'], 2, '“leaves earlier, at seven a.m.”'),
      q('What will the man do next?', ['Update the booking', 'Print a receipt', 'Call a manager', 'Check the weather'], 0, '“I will update your booking now”.'),
    ],
  },
  {
    id: 'p3-6', kind: 'p3', title: 'Máy in bị hỏng',
    lines: [
      ['A', 'The printer on the second floor is not working again.'],
      ['B', 'I know. A technician is coming tomorrow, but you can use the one in the accounting office today.'],
      ['A', 'Where is that exactly?'],
      ['B', 'Down the hall, next to the elevator.'],
    ],
    vi: 'Máy in tầng hai lại hỏng. Kỹ thuật viên sẽ đến vào ngày mai; hôm nay có thể dùng máy ở phòng kế toán, cuối hành lang cạnh thang máy.',
    qs: [
      q('What is the problem?', ['A broken printer', 'A missing file', 'A slow network', 'A locked door'], 0, 'Máy in không hoạt động.'),
      q('When will a technician come?', ['Today', 'Tomorrow', 'Next week', 'This evening'], 1, '“A technician is coming tomorrow”.'),
      q('Where is the accounting office printer?', ['On the first floor', 'Next to the elevator', 'In the lobby', 'Behind the cafeteria'], 1, '“next to the elevator”.'),
    ],
  },
]

export const P4: PartSet[] = [
  {
    id: 'p4-1', kind: 'p4', title: 'Thông báo ở sân bay',
    text: 'Attention passengers on Flight 208 to Singapore. Due to heavy fog, your flight has been delayed by about one hour. The new departure time is four thirty p.m. Please remain near gate twelve, and show your boarding pass at the service desk to receive a free meal voucher.',
    vi: 'Chuyến bay 208 đi Singapore bị hoãn khoảng một giờ vì sương mù, giờ bay mới là 4:30 chiều. Hành khách ở gần cổng 12 và xuất trình thẻ lên máy bay tại quầy dịch vụ để nhận phiếu ăn miễn phí.',
    qs: [
      q('Where is the announcement being made?', ['At a hotel', 'At an airport', 'At a train station', 'At a bus terminal'], 1, 'Có “Flight”, “gate”, “boarding pass” → sân bay.'),
      q('Why has the flight been delayed?', ['Mechanical problems', 'Heavy fog', 'A staff shortage', 'A security check'], 1, '“Due to heavy fog”.'),
      q('What can passengers get at the service desk?', ['A hotel room', 'A refund', 'A meal voucher', 'A new passport'], 2, '“a free meal voucher”.'),
    ],
  },
  {
    id: 'p4-2', kind: 'p4', title: 'Tin nhắn thoại phòng khám',
    text: 'Hello, this is Priya from Bright Dental Clinic. I am calling to confirm your appointment tomorrow at ten a.m. Please arrive fifteen minutes early to fill out a form. If you need to reschedule, call us at five five five, zero one four two, before five o’clock today.',
    vi: 'Phòng khám nha khoa gọi xác nhận lịch hẹn 10 giờ sáng mai. Người nghe nên đến sớm 15 phút để điền biểu mẫu; muốn đổi lịch thì gọi trước 5 giờ chiều hôm nay.',
    qs: [
      q('What is the purpose of the call?', ['To confirm an appointment', 'To offer a discount', 'To ask for payment', 'To announce a new location'], 0, '“to confirm your appointment”.'),
      q('Why should the listener arrive early?', ['To meet the dentist', 'To pay in advance', 'To fill out a form', 'To park the car'], 2, '“arrive fifteen minutes early to fill out a form”.'),
      q('By when should the listener call to reschedule?', ['Ten a.m. tomorrow', 'Five o’clock today', 'Noon tomorrow', 'Next Monday'], 1, '“before five o’clock today”.'),
    ],
  },
  {
    id: 'p4-3', kind: 'p4', title: 'Quảng cáo giảm giá',
    text: 'This weekend only, Harbor Electronics is holding its annual sale. Take thirty percent off all laptops and twenty percent off headphones. Members receive an extra five percent discount with their card. The sale ends Sunday at six p.m.',
    vi: 'Harbor Electronics giảm giá cuối tuần: laptop giảm 30%, tai nghe 20%, hội viên giảm thêm 5% khi dùng thẻ. Giảm giá kết thúc lúc 6 giờ chiều Chủ nhật.',
    qs: [
      q('What is being advertised?', ['A new store opening', 'A job fair', 'A sale at an electronics store', 'A repair service'], 2, 'Đang quảng cáo đợt giảm giá cửa hàng điện tử.'),
      q('Who gets an extra discount?', ['New customers', 'Students', 'Members with a card', 'Online shoppers'], 2, '“Members receive an extra five percent discount with their card”.'),
      q('When does the sale end?', ['Friday evening', 'Saturday at noon', 'Sunday at six', 'Monday morning'], 2, '“ends Sunday at six p.m.”'),
    ],
  },
  {
    id: 'p4-4', kind: 'p4', title: 'Thông báo nội bộ',
    text: 'Good morning, everyone. I am pleased to announce that our new branch in Busan will open on March third. Ten employees from our Seoul office will transfer there. If you are interested in joining them, please submit an application to Human Resources by the end of this month.',
    vi: 'Công ty khai trương chi nhánh mới ở Busan vào ngày 3/3. Mười nhân viên từ văn phòng Seoul sẽ chuyển sang; ai quan tâm thì nộp đơn cho phòng nhân sự trước cuối tháng.',
    qs: [
      q('What will open on March third?', ['A training center', 'A branch in Busan', 'A factory', 'A cafeteria'], 1, '“our new branch in Busan will open on March third”.'),
      q('How many employees will transfer?', ['Two', 'Five', 'Ten', 'Twenty'], 2, '“Ten employees from our Seoul office will transfer”.'),
      q('What should interested employees do?', ['Call the manager', 'Attend a meeting', 'Sign a contract', 'Submit an application to HR'], 3, '“submit an application to Human Resources”.'),
    ],
  },
  {
    id: 'p4-5', kind: 'p4', title: 'Hướng dẫn viên bảo tàng',
    text: 'Welcome to the City Art Museum. Our tour lasts about ninety minutes. Photography is allowed, but please do not use a flash. The gift shop is on the first floor, and the café closes at four o’clock. Please stay with the group at all times.',
    vi: 'Chuyến tham quan bảo tàng kéo dài khoảng 90 phút. Được chụp ảnh nhưng không dùng đèn flash. Cửa hàng quà tặng ở tầng một, quán cà phê đóng cửa lúc 4 giờ. Hãy luôn đi cùng nhóm.',
    qs: [
      q('Who is the speaker?', ['A museum guard', 'A tour guide', 'A shop owner', 'An artist'], 1, 'Người nói chào mừng và hướng dẫn chuyến tham quan.'),
      q('What is NOT allowed?', ['Taking photos', 'Visiting the gift shop', 'Using a flash', 'Joining the tour'], 2, '“please do not use a flash”.'),
      q('What time does the café close?', ['Three o’clock', 'Four o’clock', 'Five o’clock', 'Six o’clock'], 1, '“the café closes at four o’clock”.'),
    ],
  },
  {
    id: 'p4-6', kind: 'p4', title: 'Bản tin giao thông',
    text: 'This is your morning traffic update. The Riverside Bridge is closed for repairs until next Friday. Drivers should take Highway Nine instead, which is expected to be busy between eight and nine. Public buses will run every ten minutes to help commuters.',
    vi: 'Cầu Riverside đóng để sửa chữa đến thứ Sáu tuần sau. Tài xế nên đi Quốc lộ 9, dự kiến đông từ 8 đến 9 giờ. Xe buýt sẽ chạy mười phút một chuyến để hỗ trợ người đi làm.',
    qs: [
      q('What is closed for repairs?', ['A highway', 'A tunnel', 'A bridge', 'A train station'], 2, '“The Riverside Bridge is closed”.'),
      q('What are drivers advised to do?', ['Stay home', 'Take Highway Nine', 'Use the subway', 'Leave before six'], 1, '“Drivers should take Highway Nine instead”.'),
      q('What will public buses do?', ['Run every ten minutes', 'Be free of charge', 'Stop at the bridge', 'Carry bicycles'], 0, '“run every ten minutes”.'),
    ],
  },
]

export const P6: PartSet[] = [
  {
    id: 'p6-1', kind: 'p6', title: 'Email xác nhận đơn hàng',
    text: 'Dear Ms. Tanaka,\n\nThank you for your order of ten office chairs. We are pleased to [1] you that your order has been shipped. You should receive it [2] three business days. Please [3] the chairs carefully when they arrive, and contact us right away if any item is damaged.\n\nSincerely,\nCustomer Service',
    vi: 'Email báo đơn hàng 10 chiếc ghế văn phòng đã được gửi đi, sẽ đến trong ba ngày làm việc; nhờ kiểm tra kỹ khi nhận và báo ngay nếu hư hỏng.',
    qs: [
      q('Blank [1]', ['inform', 'informing', 'informed', 'information'], 0, '“be pleased to + động từ nguyên mẫu” → inform.'),
      q('Blank [2]', ['within', 'during', 'since', 'until'], 0, '“within three business days” = trong vòng ba ngày làm việc.'),
      q('Blank [3]', ['inspect', 'inspected', 'inspecting', 'inspection'], 0, 'Câu mệnh lệnh “Please + động từ nguyên mẫu”.'),
    ],
  },
  {
    id: 'p6-2', kind: 'p6', title: 'Thông báo bảo trì thang máy',
    text: 'Notice to all tenants\n\nThe building’s elevators will be [1] for maintenance on Saturday, June 8. During this time, please use the stairs. We apologize for any [2]. The work is expected to be [3] by 6 p.m.',
    vi: 'Thang máy sẽ ngừng hoạt động để bảo trì vào thứ Bảy 8/6; hãy dùng cầu thang. Công việc dự kiến hoàn tất lúc 6 giờ chiều.',
    qs: [
      q('Blank [1]', ['unavailable', 'available', 'unavailably', 'avail'], 0, 'Sau “will be” cần tính từ; ý nghĩa: không dùng được → unavailable.'),
      q('Blank [2]', ['inconvenience', 'inconvenient', 'conveniently', 'convenient'], 0, 'Cụm “apologize for any inconvenience”.'),
      q('Blank [3]', ['completed', 'complete', 'completing', 'completion'], 0, '“be expected to be + V3” (bị động) → completed.'),
    ],
  },
  {
    id: 'p6-3', kind: 'p6', title: 'Thông báo làm việc tại nhà',
    text: 'To: All staff\n\nStarting next month, employees may work from home [1] two days per week. Requests must be [2] to your supervisor at least one week in advance. [3], everyone is expected to attend the monthly team meeting in person.',
    vi: 'Từ tháng sau nhân viên có thể làm việc tại nhà tối đa hai ngày mỗi tuần. Yêu cầu phải nộp cho người giám sát trước ít nhất một tuần. Tuy vậy, mọi người vẫn phải dự họp nhóm hằng tháng trực tiếp.',
    qs: [
      q('Blank [1]', ['up to', 'in addition', 'as well as', 'ahead of'], 0, '“up to two days” = tối đa hai ngày.'),
      q('Blank [2]', ['submitted', 'submit', 'submitting', 'submission'], 0, '“must be + V3” → submitted.'),
      q('Blank [3]', ['However', 'Because', 'Unless', 'Therefore'], 0, 'Câu trước nói được làm tại nhà; câu sau nêu ngoại lệ → However (tuy nhiên).'),
    ],
  },
  {
    id: 'p6-4', kind: 'p6', title: 'Tin khai trương quán cà phê',
    text: 'Fresh Bites Café will open its second location on Elm Street next week. The new café will offer the same menu as the original shop, [1] a larger seating area. The owner, Ms. Lopez, said she [2] to hire twenty new employees. Job applications [3] on the café’s website.',
    vi: 'Quán Fresh Bites khai trương cơ sở thứ hai ở phố Elm, menu giống quán cũ và chỗ ngồi rộng hơn. Chủ quán dự định tuyển hai mươi nhân viên; đơn xin việc có trên trang web.',
    qs: [
      q('Blank [1]', ['along with', 'as if', 'in case', 'so that'], 0, '“the same menu …, along with a larger seating area” = cùng với.'),
      q('Blank [2]', ['plans', 'plan', 'planning', 'to plan'], 0, 'Chủ ngữ “she” số ít, thì hiện tại → plans.'),
      q('Blank [3]', ['are available', 'available', 'availability', 'is available'], 0, 'Chủ ngữ “applications” số nhiều → are available.'),
    ],
  },
]

export const P7: PartSet[] = [
  {
    id: 'p7-1', kind: 'p7', title: 'Email về chỗ đỗ xe',
    text: 'Subject: Updated Parking Policy\n\nStarting June 1, employees must register their vehicles with Security to receive a parking permit. Permits are free for the first car; a second car costs $20 per month. Visitors may park in Lot C for up to four hours. Registration forms are available at the front desk or on the intranet and must be returned by May 25.',
    vi: 'Từ 1/6 nhân viên phải đăng ký xe để nhận giấy phép đỗ xe. Xe đầu miễn phí, xe thứ hai 20 đô mỗi tháng. Khách đỗ ở bãi C tối đa 4 giờ. Biểu mẫu nộp trước 25/5.',
    qs: [
      q('What is the purpose of the email?', ['To announce a new parking rule', 'To advertise a car sale', 'To invite staff to a party', 'To report an accident'], 0, 'Email thông báo quy định đỗ xe mới.'),
      q('How much does a permit for a second car cost?', ['Nothing', '$10 a month', '$20 a month', '$40 a year'], 2, '“a second car costs $20 per month”.'),
      q('By when must the forms be returned?', ['June 1', 'May 25', 'The end of May', 'Within four hours'], 1, '“must be returned by May 25”.'),
    ],
  },
  {
    id: 'p7-2', kind: 'p7', title: 'Quảng cáo lớp tiếng Anh',
    text: 'Sunrise Language Center\nEvening English courses for working adults\n\nClasses meet Monday and Wednesday from 6:30 to 8:30 p.m. Small classes with a maximum of 12 students. Register before March 10 and receive 15% off. New students take a free placement test.',
    vi: 'Trung tâm Sunrise mở lớp tiếng Anh buổi tối cho người đi làm, học thứ Hai và thứ Tư, tối đa 12 học viên. Đăng ký trước 10/3 giảm 15%; học viên mới thi xếp lớp miễn phí.',
    qs: [
      q('Who are the courses designed for?', ['Children', 'Working adults', 'Teachers', 'Tourists'], 1, '“for working adults”.'),
      q('What happens if a student registers before March 10?', ['They get a free book', 'They get 15% off', 'They skip the test', 'They choose their teacher'], 1, '“receive 15% off”.'),
      q('What is true about the classes?', ['They are held on weekends', 'They are online only', 'They have at most 12 students', 'They last all day'], 2, '“a maximum of 12 students”.'),
    ],
  },
  {
    id: 'p7-3', kind: 'p7', title: 'Thông báo cải tạo văn phòng',
    text: 'Office Renovation Notice\n\nThe fifth floor will be under renovation from August 1 to August 15. Employees on that floor will temporarily work on the second floor. Please remove personal items from your desks by July 30. The IT team will move all computers on July 31. If you have questions, contact Ms. Gómez at extension 310.',
    vi: 'Tầng năm sẽ được cải tạo từ 1/8 đến 15/8. Nhân viên tầng đó tạm làm việc ở tầng hai. Dọn đồ cá nhân trước 30/7; bộ phận IT chuyển máy tính ngày 31/7. Có thắc mắc liên hệ cô Gómez, số máy nhánh 310.',
    qs: [
      q('What will happen to the fifth-floor employees?', ['They will work from home', 'They will move temporarily to the second floor', 'They will take a vacation', 'They will change jobs'], 1, '“temporarily work on the second floor”.'),
      q('What should employees do by July 30?', ['Return their computers', 'Contact IT', 'Remove personal items from desks', 'Sign a form'], 2, '“remove personal items from your desks by July 30”.'),
      q('Who should employees contact with questions?', ['Ms. Gómez', 'The IT team', 'The building owner', 'Human Resources'], 0, '“contact Ms. Gómez at extension 310”.'),
    ],
  },
  {
    id: 'p7-4', kind: 'p7', title: 'Chuỗi tin nhắn',
    text: 'Lena (9:05 a.m.): The client moved the presentation to 2 p.m. instead of 11 a.m.\nOmar (9:07 a.m.): That’s fine. I’ll finish the slides before lunch.\nLena (9:08 a.m.): Great. Could you also bring printed copies? About ten.\nOmar (9:10 a.m.): Sure. I’ll use the printer on the fourth floor.',
    vi: 'Khách dời buổi thuyết trình sang 2 giờ chiều. Omar đồng ý và sẽ làm xong slide trước bữa trưa, in khoảng mười bản bằng máy in tầng bốn.',
    qs: [
      q('Why did Lena write to Omar?', ['To cancel a meeting', 'To tell him about a changed time', 'To ask for a day off', 'To complain about a printer'], 1, 'Lena báo khách đã dời giờ thuyết trình.'),
      q('At 9:07, what does Omar mean by “That’s fine”?', ['He cannot attend', 'He accepts the new time', 'He wants more time', 'He needs help'], 1, 'Anh ấy chấp nhận giờ mới.'),
      q('What will Omar probably do next?', ['Visit the client', 'Reserve a room', 'Print about ten copies', 'Send an invoice'], 2, 'Anh ấy sẽ làm slide và in khoảng mười bản.'),
    ],
  },
  {
    id: 'p7-5', kind: 'p7', title: 'Tin ngân hàng mở rộng',
    text: 'Greenfield Bank announced on Monday that it will open five new branches over the next two years. The expansion is expected to create about 120 jobs. CEO Hannah Wells said the bank wants to be closer to small business owners. The first new branch will open in Dayton in October.',
    vi: 'Ngân hàng Greenfield sẽ mở năm chi nhánh mới trong hai năm tới, tạo khoảng 120 việc làm. Giám đốc Hannah Wells nói ngân hàng muốn gần gũi chủ doanh nghiệp nhỏ. Chi nhánh đầu tiên mở ở Dayton vào tháng Mười.',
    qs: [
      q('What is the article mainly about?', ['A bank’s expansion plan', 'A new CEO', 'A computer problem', 'A tax change'], 0, 'Bài nói về kế hoạch mở rộng của ngân hàng.'),
      q('How many jobs are expected to be created?', ['About 5', 'About 12', 'About 50', 'About 120'], 3, '“about 120 jobs”.'),
      q('Where will the first new branch open?', ['Greenfield', 'Dayton', 'Chicago', 'Hannah'], 1, '“The first new branch will open in Dayton”.'),
    ],
  },
  {
    id: 'p7-6', kind: 'p7', title: 'Thư trả lời khiếu nại',
    text: 'Dear Mr. Park,\n\nThank you for contacting us about your damaged blender. We are sorry for the trouble. Because the product is still under warranty, we will send you a replacement free of charge. Please return the damaged item using the prepaid label enclosed. Your replacement will ship within five business days after we receive it.\n\nSincerely,\nHome Goods Support',
    vi: 'Công ty xin lỗi về chiếc máy xay bị hỏng và sẽ gửi thay thế miễn phí vì còn bảo hành. Khách gửi trả hàng hỏng bằng nhãn trả trước đính kèm; hàng mới sẽ được gửi trong vòng năm ngày làm việc sau khi nhận hàng trả.',
    qs: [
      q('Why was the letter written?', ['To respond to a complaint', 'To advertise a product', 'To ask for a review', 'To confirm a delivery'], 0, 'Thư trả lời việc khách liên hệ về máy xay hỏng.'),
      q('What is included with the letter?', ['A refund check', 'A prepaid return label', 'A new blender', 'A discount coupon'], 1, '“the prepaid label enclosed”.'),
      q('When will the replacement be shipped?', ['Immediately', 'Within five business days after the item is returned', 'Next month', 'After a payment is made'], 1, '“within five business days after we receive it”.'),
    ],
  },
]
