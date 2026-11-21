import type { PQ, PartSet } from './parts'

const q = (qq: string, opts: [string, string, string, string], a: 0 | 1 | 2 | 3, why: string): PQ => ({ q: qq, opts, a, why })

// Đợt 2: thêm bài Part 3, 4, 6, 7 (tự viết).
export const P3_2: PartSet[] = [
  {
    id: 'p3-7', kind: 'p3', title: 'Khách đến gặp đối tác',
    lines: [
      ['A', 'Hello, I have a ten o’clock appointment with Ms. Reyes.'],
      ['B', 'Welcome. Please sign in and take a visitor badge. Her office is on the fourth floor.'],
      ['A', 'Is there an elevator?'],
      ['B', 'Yes, it is behind that glass door. I will let her know you have arrived.'],
    ],
    vi: 'Khách có hẹn lúc 10 giờ với bà Reyes. Lễ tân yêu cầu ký tên, nhận thẻ khách, chỉ thang máy và sẽ báo bà Reyes.',
    qs: [
      q('Why is the man at the office?', ['To apply for a job', 'To attend an appointment', 'To repair a machine', 'To deliver a package'], 1, '“I have a ten o’clock appointment”.'),
      q('What does the woman ask the man to do?', ['Wait outside', 'Fill out a survey', 'Sign in and take a badge', 'Call Ms. Reyes'], 2, '“Please sign in and take a visitor badge”.'),
      q('What will the woman do next?', ['Show him the way', 'Tell Ms. Reyes he has arrived', 'Print a map', 'Reserve a room'], 1, '“I will let her know you have arrived”.'),
    ],
  },
  {
    id: 'p3-8', kind: 'p3', title: 'Đổi hàng bị lỗi',
    lines: [
      ['A', 'I bought this blender last week, but it makes a strange noise.'],
      ['B', 'I am sorry to hear that. Do you have your receipt?'],
      ['A', 'Yes, here it is.'],
      ['B', 'Thank you. I can give you a refund, or you can exchange it for a new one.'],
      ['A', 'I will take a new one, please.'],
    ],
    vi: 'Khách mua máy xay tuần trước, máy kêu lạ. Nhân viên xin biên lai và cho chọn hoàn tiền hoặc đổi máy mới; khách chọn đổi máy mới.',
    qs: [
      q('What is the problem?', ['The blender is too expensive', 'The blender makes a strange noise', 'The blender is the wrong color', 'The blender has not arrived'], 1, '“it makes a strange noise”.'),
      q('What does the woman ask for?', ['A receipt', 'A phone number', 'A signature', 'A credit card'], 0, '“Do you have your receipt?”'),
      q('What does the man decide to do?', ['Get a refund', 'Exchange the blender', 'Wait for repairs', 'Speak to a manager'], 1, '“I will take a new one”.'),
    ],
  },
  {
    id: 'p3-9', kind: 'p3', title: 'Đặt thêm giấy in',
    lines: [
      ['A', 'We are almost out of printer paper. Should I place an order?'],
      ['B', 'Yes, but check the budget first. We spent a lot on equipment this month.'],
      ['A', 'I looked already. We still have two hundred dollars left for supplies.'],
      ['B', 'That is enough. Order five boxes, and ask for delivery by Thursday.'],
    ],
    vi: 'Sắp hết giấy in. Sau khi kiểm tra ngân sách còn 200 đô, người phụ nữ bảo đặt năm hộp và yêu cầu giao trước thứ Năm.',
    qs: [
      q('What are the speakers mainly discussing?', ['Ordering office supplies', 'Hiring staff', 'Booking a trip', 'Fixing a printer'], 0, 'Họ bàn về việc đặt giấy in và đồ dùng văn phòng.'),
      q('What does the man say about the budget?', ['It is already spent', 'It has been cut', 'Two hundred dollars is left', 'It will increase'], 2, '“We still have two hundred dollars left”.'),
      q('What does the woman ask the man to do?', ['Order five boxes for Thursday delivery', 'Call the supplier tomorrow', 'Cancel the equipment order', 'Print the budget report'], 0, '“Order five boxes, and ask for delivery by Thursday”.'),
    ],
  },
  {
    id: 'p3-10', kind: 'p3', title: 'Đăng ký hội nghị',
    lines: [
      ['A', 'I would like to register for the marketing conference in May.'],
      ['B', 'Certainly. Early registration is eighty dollars until April first. After that, it is one hundred twenty.'],
      ['A', 'I will register now. Can I pay by credit card?'],
      ['B', 'Yes, and you will receive a confirmation by email within an hour.'],
    ],
    vi: 'Khách muốn đăng ký hội nghị marketing tháng Năm. Đăng ký sớm 80 đô đến 1/4, sau đó 120 đô. Trả bằng thẻ tín dụng và nhận email xác nhận trong một giờ.',
    qs: [
      q('What does the man want to do?', ['Cancel a flight', 'Register for a conference', 'Reserve a hotel', 'Apply for a job'], 1, '“register for the marketing conference”.'),
      q('How much is early registration?', ['$40', '$80', '$120', '$200'], 1, '“eighty dollars until April first”.'),
      q('What will the man receive by email?', ['A schedule', 'A discount code', 'A confirmation', 'A receipt for a refund'], 2, '“you will receive a confirmation by email”.'),
    ],
  },
]

export const P4_2: PartSet[] = [
  {
    id: 'p4-7', kind: 'p4', title: 'Tin nhắn thoại từ nhà cung cấp',
    text: 'Hi, this is Mina from Delta Packaging. I am calling about your order of five hundred boxes. The boxes are ready, but our truck is in repair, so delivery will be one day late. We will bring them on Wednesday morning instead of Tuesday. Please call me back at extension twenty-two if that is a problem.',
    vi: 'Nhà cung cấp báo đơn 500 hộp đã sẵn sàng nhưng xe tải đang sửa nên giao trễ một ngày: sáng thứ Tư thay vì thứ Ba. Nếu có vấn đề, gọi lại số máy nhánh 22.',
    qs: [
      q('Why is the speaker calling?', ['To report a delivery delay', 'To cancel an order', 'To ask for payment', 'To offer a discount'], 0, 'Giao hàng trễ một ngày.'),
      q('When will the boxes arrive?', ['Tuesday morning', 'Tuesday afternoon', 'Wednesday morning', 'Thursday'], 2, '“on Wednesday morning instead of Tuesday”.'),
      q('What should the listener do if there is a problem?', ['Send an email', 'Visit the warehouse', 'Call extension twenty-two', 'Contact the driver'], 2, '“call me back at extension twenty-two”.'),
    ],
  },
  {
    id: 'p4-8', kind: 'p4', title: 'Buổi định hướng nhân viên mới',
    text: 'Welcome to Orion Logistics. During orientation today, you will complete safety training, receive your laptop, and meet your team leaders. Lunch is provided in the cafeteria at noon. Please remember to turn in your tax forms to Human Resources before you leave today.',
    vi: 'Chào mừng nhân viên mới đến Orion Logistics. Hôm nay có đào tạo an toàn, nhận laptop, gặp trưởng nhóm. Bữa trưa ở căng-tin lúc 12 giờ; nhớ nộp biểu mẫu thuế cho phòng nhân sự trước khi về.',
    qs: [
      q('Who is the audience for this talk?', ['New employees', 'Customers', 'Job applicants', 'Team leaders'], 0, 'Đang nói trong buổi orientation cho nhân viên mới.'),
      q('What will happen at noon?', ['A safety test', 'Lunch in the cafeteria', 'A team meeting', 'A tour'], 1, '“Lunch is provided in the cafeteria at noon”.'),
      q('What are the listeners reminded to do?', ['Return their laptops', 'Sign a contract', 'Turn in tax forms', 'Park in Lot B'], 2, '“turn in your tax forms to Human Resources”.'),
    ],
  },
  {
    id: 'p4-9', kind: 'p4', title: 'Quảng cáo nhà hàng',
    text: 'Looking for a place to celebrate? Come to Lakeview Grill, now open on Pine Street. Enjoy fresh seafood, live music on Fridays, and a private room for parties of up to thirty. Reserve this month and get a free dessert for every guest. Call now to book your table.',
    vi: 'Nhà hàng Lakeview Grill mở trên phố Pine: hải sản tươi, nhạc sống thứ Sáu, phòng riêng tối đa 30 khách. Đặt bàn trong tháng này được tặng món tráng miệng cho mỗi khách.',
    qs: [
      q('What is being advertised?', ['A restaurant', 'A hotel', 'A music store', 'A travel agency'], 0, 'Quảng cáo nhà hàng Lakeview Grill.'),
      q('What is offered on Fridays?', ['Free parking', 'A cooking class', 'Live music', 'Half-price meals'], 2, '“live music on Fridays”.'),
      q('What can customers get if they reserve this month?', ['A free dessert for every guest', 'A gift card', 'A discount on drinks', 'A free private room'], 0, '“a free dessert for every guest”.'),
    ],
  },
  {
    id: 'p4-10', kind: 'p4', title: 'Thông báo ở nhà ga',
    text: 'May I have your attention, please. Due to track work, the express train to Harbor City will not stop at Central Station today. Passengers going to Central Station should take the local train from platform two. The next local train leaves in ten minutes. We apologize for the inconvenience.',
    vi: 'Do sửa đường ray, tàu nhanh đi Harbor City hôm nay không dừng ở ga Central. Hành khách đến ga Central đi tàu địa phương ở sân ga 2; chuyến tiếp theo khởi hành sau mười phút.',
    qs: [
      q('Where is the announcement most likely made?', ['At a train station', 'At an airport', 'At a bus stop', 'At a hotel'], 0, 'Có “train”, “platform” → nhà ga.'),
      q('What is the problem?', ['A train is full', 'The express will not stop at Central Station', 'The station is closed', 'A ticket machine is broken'], 1, '“the express train … will not stop at Central Station”.'),
      q('What should passengers going to Central Station do?', ['Wait for a refund', 'Take a taxi', 'Take the local train from platform two', 'Go to the ticket office'], 2, '“take the local train from platform two”.'),
    ],
  },
]

export const P6_2: PartSet[] = [
  {
    id: 'p6-5', kind: 'p6', title: 'Email dời lịch họp',
    text: 'Dear Mr. Evans,\n\nI am writing to let you know that our meeting has been [1] from Tuesday to Thursday at 3 p.m. The change is [2] to a conflict in the director’s schedule. [3] you have any questions, please do not hesitate to contact me.\n\nBest regards,\nLaura',
    vi: 'Email báo cuộc họp được dời từ thứ Ba sang thứ Năm lúc 3 giờ chiều do lịch của giám đốc bị trùng. Nếu có câu hỏi, hãy liên hệ.',
    qs: [
      q('Blank [1]', ['rescheduled', 'reschedule', 'rescheduling', 'reschedules'], 0, '“has been + V3” → rescheduled.'),
      q('Blank [2]', ['due', 'because', 'although', 'so'], 0, '“due to + danh từ” = do.'),
      q('Blank [3]', ['Should', 'Unless', 'Although', 'Because'], 0, 'Đảo ngữ điều kiện: “Should you have any questions…”.'),
    ],
  },
  {
    id: 'p6-6', kind: 'p6', title: 'Tin tuyển dụng',
    text: 'Position Available: Sales Assistant\n\nBlue Harbor Travel is [1] a sales assistant to join our busy office. The ideal candidate has strong [2] skills and at least one year of customer service experience. Interested applicants should send their resumes [3] March 15.',
    vi: 'Blue Harbor Travel tuyển trợ lý bán hàng, cần kỹ năng giao tiếp tốt và ít nhất một năm kinh nghiệm chăm sóc khách hàng. Gửi CV trước 15/3.',
    qs: [
      q('Blank [1]', ['seeking', 'seek', 'sought', 'seeks'], 0, '“is + V-ing” (hiện tại tiếp diễn) → seeking.'),
      q('Blank [2]', ['communication', 'communicate', 'communicative', 'communicates'], 0, 'Cụm “communication skills” (danh từ ghép).'),
      q('Blank [3]', ['by', 'at', 'in', 'for'], 0, '“by + mốc” = chậm nhất vào ngày đó.'),
    ],
  },
  {
    id: 'p6-7', kind: 'p6', title: 'Thông báo bảo trì hệ thống đặt hàng',
    text: 'Dear customers,\n\nOur online ordering system will be [1] for maintenance on Sunday between 1 a.m. and 5 a.m. Orders placed during this time will not be [2]. We [3] you to place your orders before midnight on Saturday.',
    vi: 'Hệ thống đặt hàng trực tuyến sẽ đóng để bảo trì từ 1 đến 5 giờ sáng Chủ nhật; đơn đặt trong thời gian này sẽ không được xử lý. Khách nên đặt trước nửa đêm thứ Bảy.',
    qs: [
      q('Blank [1]', ['closed', 'closing', 'close', 'closure'], 0, '“will be + V3” → closed.'),
      q('Blank [2]', ['processed', 'process', 'processing', 'processes'], 0, '“will not be + V3” → processed.'),
      q('Blank [3]', ['encourage', 'encouraged', 'encouraging', 'encouragement'], 0, 'Chủ ngữ “We” + động từ nguyên mẫu → encourage.'),
    ],
  },
]

export const P7_2: PartSet[] = [
  {
    id: 'p7-7', kind: 'p7', title: 'Chương trình hội nghị nhân viên',
    text: 'Annual Staff Conference – Friday, October 12\n\n9:00 a.m. Opening remarks – Ms. Patel\n9:30 a.m. Workshop: Customer Service Skills\n11:00 a.m. Coffee break\n11:30 a.m. Presentation: New Products for Next Year – Mr. Singh\n12:30 p.m. Lunch (Garden Room)\n2:00 p.m. Closing remarks and awards\n\nNote: Registration closes October 5. Parking is available in Lot B.',
    vi: 'Chương trình hội nghị thường niên ngày 12/10: khai mạc 9:00 (bà Patel), workshop 9:30, giải lao 11:00, thuyết trình sản phẩm mới 11:30 (ông Singh), ăn trưa 12:30, bế mạc và trao giải 14:00. Đăng ký đóng ngày 5/10; đỗ xe ở bãi B.',
    qs: [
      q('Who will give the opening remarks?', ['Ms. Patel', 'Mr. Singh', 'The director', 'A guest speaker'], 0, '“9:00 a.m. Opening remarks – Ms. Patel”.'),
      q('What will happen at 11:30 a.m.?', ['A coffee break', 'A workshop', 'A presentation about new products', 'The awards'], 2, '“11:30 a.m. Presentation: New Products for Next Year”.'),
      q('What is stated in the note?', ['Registration closes October 5', 'Lunch is free for guests', 'The event moves online', 'Parking costs ten dollars'], 0, '“Registration closes October 5”.'),
    ],
  },
  {
    id: 'p7-8', kind: 'p7', title: 'Email yêu cầu sửa hóa đơn',
    text: 'Subject: Invoice correction\n\nDear Ms. Alvarez,\n\nI received invoice #3308 today. It lists twelve desks, but we ordered only ten. Could you please send a corrected invoice before the end of the week? Our accounting department needs it to process payment. I have attached a copy of our purchase order for your reference.\n\nThank you,\nDavid Chen\nOffice Manager, Parkside Dental',
    vi: 'Ông Chen nhận hóa đơn ghi 12 chiếc bàn nhưng đặt chỉ 10. Ông nhờ gửi hóa đơn đã sửa trước cuối tuần để kế toán thanh toán và đính kèm bản đơn đặt hàng để tham khảo.',
    qs: [
      q('Why did Mr. Chen write the email?', ['To cancel an order', 'To request a corrected invoice', 'To order more desks', 'To complain about delivery'], 1, 'Ông nhờ gửi hóa đơn đã sửa.'),
      q('What is the problem?', ['The invoice is late', 'The invoice lists more desks than ordered', 'The desks are damaged', 'The price is too high'], 1, '“It lists twelve desks, but we ordered only ten”.'),
      q('What did Mr. Chen attach?', ['A payment', 'A photo of the desks', 'A copy of the purchase order', 'A list of employees'], 2, '“attached a copy of our purchase order”.'),
    ],
  },
  {
    id: 'p7-9', kind: 'p7', title: 'Tin thư viện kéo dài giờ mở cửa',
    text: 'City Library to Extend Hours\n\nStarting next month, the Central Library will stay open until 9 p.m. on weekdays instead of 6 p.m. The change follows a survey in which most residents said they could not visit during the day. The library will also add a quiet study room and free Wi-Fi on all floors. Library director Tom Reed said the changes would be paid for by a city grant.',
    vi: 'Từ tháng sau Thư viện Trung tâm mở đến 9 giờ tối các ngày trong tuần (thay vì 6 giờ), sau khảo sát cho thấy phần lớn cư dân không thể đến ban ngày. Có thêm phòng học yên tĩnh và Wi-Fi miễn phí; chi phí lấy từ khoản tài trợ của thành phố.',
    qs: [
      q('What is the article mainly about?', ['A new library building', 'Extended library hours', 'A book sale', 'A city election'], 1, 'Bài nói về việc kéo dài giờ mở cửa thư viện.'),
      q('Why was the change made?', ['Staff asked for it', 'A survey showed residents could not visit during the day', 'The library lost money', 'A new director arrived'], 1, '“The change follows a survey…”.'),
      q('Who will pay for the changes?', ['The library members', 'Mr. Reed', 'A city grant', 'Local businesses'], 2, '“paid for by a city grant”.'),
    ],
  },
  {
    id: 'p7-10', kind: 'p7', title: 'Chat hỗ trợ giao hàng',
    text: 'Customer (2:10 p.m.): Hello, my package was supposed to arrive today, but it has not come yet.\nSupport (2:12 p.m.): I am sorry about that. Could you give me your order number?\nCustomer (2:13 p.m.): It is 88215.\nSupport (2:15 p.m.): Thank you. The courier says the driver will deliver it by 6 p.m. today. I will also add a ten percent discount to your next order.\nCustomer (2:16 p.m.): That sounds good. Thanks.',
    vi: 'Khách báo gói hàng chưa đến. Nhân viên hỗ trợ xin mã đơn hàng 88215, báo tài xế sẽ giao trước 6 giờ chiều hôm nay và tặng giảm 10% cho đơn sau.',
    qs: [
      q('Why does the customer write?', ['To change an address', 'To report that a package has not arrived', 'To cancel an order', 'To ask for a refund'], 1, 'Gói hàng lẽ ra phải đến hôm nay nhưng chưa tới.'),
      q('What does the support agent ask for?', ['A receipt', 'A phone number', 'An order number', 'A home address'], 2, '“Could you give me your order number?”'),
      q('What will the customer receive?', ['A full refund', 'A free gift', 'Free shipping', 'A ten percent discount on the next order'], 3, '“a ten percent discount to your next order”.'),
    ],
  },
]
