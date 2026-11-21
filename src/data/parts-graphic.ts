// Bài Part 3 và 4 có hình (bảng, biểu đồ, sơ đồ), tự viết theo định dạng đề hiện hành. Câu hỏi “Look at the graphic.”
import type { PartSet, PQ } from './parts'

const q = (qq: string, opts: [string, string, string, string], a: 0 | 1 | 2 | 3, why: string): PQ => ({ q: qq, opts, a, why })

export const P3_G: PartSet[] = [
  {
    id: 'p3-g1', kind: 'p3', title: 'Đặt phòng họp (có bảng lịch phòng)',
    graphic: {
      type: 'table', title: 'Meeting room schedule – today',
      headers: ['Room', '9 a.m.', '1 p.m.', '3 p.m.'],
      rows: [['Room A', 'Booked', 'Booked', 'Free'], ['Room B', 'Free', 'Booked', 'Booked'], ['Room C', 'Booked', 'Free', 'Free']],
    },
    lines: [
      ['A', 'Hi Dana, I need a room for a client meeting this afternoon. It will last about an hour, and we will need a projector.'],
      ['B', 'Let me check the schedule. Room A has a projector, but it is booked until three o’clock. Room C is free after one.'],
      ['A', 'Room C would work, but does it have a projector?'],
      ['B', 'No, it does not. Only Room A and Room B have projectors.'],
      ['A', 'Then I will take the room that has a projector and is free at three.'],
      ['B', 'Good choice. I will put your name down.'],
    ],
    vi: 'Người nói cần phòng họp chiều nay có máy chiếu. Phòng A và B có máy chiếu; lúc 3 giờ chỉ phòng A trống nên chọn phòng A.',
    qs: [
      q('What is the first speaker preparing for?', ['A client meeting', 'A job interview', 'A training day', 'A product demonstration'], 0, '“a room for a client meeting this afternoon”.'),
      q('What equipment does the first speaker need?', ['A microphone', 'A projector', 'A whiteboard', 'A video camera'], 1, '“we will need a projector”.'),
      q('Look at the graphic. Which room will the first speaker reserve?', ['Room A', 'Room B', 'Room C', 'None of the rooms'], 0, 'Cần máy chiếu (A hoặc B) và trống lúc 3 giờ: chỉ Room A (Free ở 3 p.m.).'),
    ],
  },
  {
    id: 'p3-g2', kind: 'p3', title: 'Hỏi đường trong tòa nhà (bảng tầng)',
    graphic: {
      type: 'table', title: 'Building directory',
      headers: ['Floor', 'Department'],
      rows: [['1', 'Reception and Cafeteria'], ['2', 'Human Resources'], ['3', 'Accounting'], ['4', 'Marketing'], ['5', 'Executive Offices']],
    },
    lines: [
      ['A', 'Good morning. I’m here to see Ms. Lopez in Human Resources. I think her office is on the third floor.'],
      ['B', 'That used to be true, but the departments were rearranged last month. You can check the directory by the elevator.'],
      ['A', 'Oh, thanks. Do I need to sign in somewhere?'],
      ['B', 'Yes, please sign this visitor log and wear this badge while you are in the building.'],
    ],
    vi: 'Khách đến gặp bà Lopez ở phòng Nhân sự, tưởng tầng 3. Nhân viên nói các phòng đã sắp xếp lại tháng trước; xem bảng tầng thì Nhân sự ở tầng 2. Khách ký tên và đeo thẻ khách.',
    qs: [
      q('Why is the visitor in the building?', ['To submit a report', 'To meet with a staff member', 'To repair some equipment', 'To attend a training session'], 1, '“I’m here to see Ms. Lopez”.'),
      q('Look at the graphic. Which floor will the visitor go to?', ['Floor 1', 'Floor 3', 'Floor 4', 'Floor 2'], 3, 'Phòng Human Resources nay ở tầng 2 theo bảng chỉ dẫn (tầng 3 là cũ).'),
      q('What does the employee give the visitor?', ['A parking pass', 'A building map', 'A visitor badge', 'An employee handbook'], 2, '“wear this badge while you are in the building”.'),
    ],
  },
  {
    id: 'p3-g3', kind: 'p3', title: 'Báo cáo doanh số (biểu đồ cột)',
    graphic: {
      type: 'bars', title: 'Units sold, January to May', unit: '',
      data: [['Jan', 120], ['Feb', 150], ['Mar', 90], ['Apr', 170], ['May', 160]],
    },
    lines: [
      ['A', 'Have you seen the sales report for the first five months? One month looks much worse than the others.'],
      ['B', 'I did. That was the month our online store was closed for a week because of a system upgrade.'],
      ['A', 'That explains it. Next year we should schedule upgrades for a slower time and offer a discount right before the shutdown.'],
      ['B', 'Good idea. I will bring it up at Friday’s meeting.'],
    ],
    vi: 'Hai người xem báo cáo doanh số 5 tháng. Tháng thấp nhất là do cửa hàng trực tuyến đóng một tuần để nâng cấp hệ thống. Họ đề xuất lên lịch nâng cấp vào lúc vắng khách và giảm giá trước khi đóng, và sẽ nêu trong cuộc họp thứ Sáu.',
    qs: [
      q('What are the speakers discussing?', ['Monthly sales results', 'A hiring plan', 'A new store location', 'Shipping costs'], 0, 'Họ nói về báo cáo doanh số các tháng.'),
      q('Look at the graphic. Which month are the speakers most likely talking about?', ['January', 'February', 'March', 'April'], 2, 'Tháng có doanh số thấp nhất là March (90).'),
      q('What does one speaker say will happen on Friday?', ['A system will be upgraded', 'A new idea will be raised at a meeting', 'A report will be printed', 'A discount will begin'], 1, '“I will bring it up at Friday’s meeting.”'),
    ],
  },
  {
    id: 'p3-g4', kind: 'p3', title: 'Chọn chuyến tàu (bảng giờ tàu)',
    graphic: {
      type: 'table', title: 'Train timetable',
      headers: ['Train', 'Departs', 'Arrives'],
      rows: [['T12', '8:15 a.m.', '10:45 a.m.'], ['T14', '9:30 a.m.', '12:00 p.m.'], ['T16', '11:00 a.m.', '1:30 p.m.'], ['T18', '1:15 p.m.', '3:45 p.m.']],
    },
    lines: [
      ['A', 'Hi, I need to be in the city for a noon meeting tomorrow, and I would like to arrive at least an hour early to go over my presentation.'],
      ['B', 'Let me look at the timetable. The 9:30 train would get you there right at noon, which is too late for you.'],
      ['A', 'Right. Is there anything earlier?'],
      ['B', 'Yes, there is an earlier train that arrives before eleven. Would you like me to book the ticket online?'],
      ['A', 'Please do. Thanks.'],
    ],
    vi: 'Khách cần đến thành phố trước cuộc họp lúc 12 giờ ít nhất một giờ. Chuyến 9:30 đến đúng 12 giờ nên quá muộn; chuyến sớm hơn đến trước 11 giờ là T12 (10:45). Nhân viên đề nghị đặt vé trực tuyến.',
    qs: [
      q('Why does the customer want to arrive early?', ['To meet a friend', 'To review a presentation', 'To buy a ticket', 'To visit a client’s office'], 1, '“to go over my presentation”.'),
      q('Look at the graphic. Which train will the customer take?', ['Train T14', 'Train T16', 'Train T18', 'Train T12'], 3, 'Cần đến trước 11 giờ: chỉ T12 đến lúc 10:45 a.m.'),
      q('What does the agent offer to do?', ['Change the meeting time', 'Book a ticket online', 'Give a refund', 'Print a timetable'], 1, '“Would you like me to book the ticket online?”'),
    ],
  },
  {
    id: 'p3-g5', kind: 'p3', title: 'Tìm phòng đào tạo (sơ đồ mặt bằng)',
    graphic: {
      type: 'grid', title: 'Floor plan',
      cells: [['Kitchen', 'Room 101', 'Room 102', 'Storage'], ['Entrance', 'Reception', 'Room 103', 'Restroom']],
    },
    lines: [
      ['A', 'Hello, I am here for the ten o’clock training session. Could you tell me which room it is in?'],
      ['B', 'Sure. Please sign in at the reception desk first, then go to the room right next to the kitchen.'],
      ['A', 'Thanks. And is there somewhere I can leave my coat?'],
      ['B', 'You can hang it in the storage room at the end of the hall.'],
    ],
    vi: 'Người đến dự buổi đào tạo 10 giờ được hướng dẫn ký tên ở quầy tiếp tân rồi vào phòng ngay cạnh bếp (Room 101); áo khoác có thể treo ở phòng chứa đồ cuối hành lang.',
    qs: [
      q('What is the visitor attending?', ['A job interview', 'A client meeting', 'A training session', 'An office tour'], 2, '“the ten o’clock training session”.'),
      q('Look at the graphic. Which room should the visitor go to?', ['Room 101', 'Room 102', 'Room 103', 'Reception'], 0, 'Phòng ngay cạnh bếp (Kitchen) là Room 101.'),
      q('Where can the visitor leave a coat?', ['At the entrance', 'In the kitchen', 'At the reception desk', 'In the storage room'], 3, '“hang it in the storage room at the end of the hall”.'),
    ],
  },
  {
    id: 'p3-g6', kind: 'p3', title: 'Đặt tiệc trưa (bảng giá)',
    graphic: {
      type: 'table', title: 'Catering packages',
      headers: ['Package', 'Includes', 'Price per person'],
      rows: [['Basic', 'Sandwiches and drinks', '$10'], ['Standard', 'Hot lunch and drinks', '$15'], ['Deluxe', 'Three-course meal and dessert', '$25']],
    },
    lines: [
      ['A', 'Hello, I am planning a lunch for twenty clients next week, and our total budget is three hundred fifty dollars. We would like a hot meal.'],
      ['B', 'In that case, one of our packages fits your budget. Could you email me the final guest list by Wednesday?'],
      ['A', 'Sure. I will send it tomorrow.'],
    ],
    vi: 'Khách muốn đặt bữa trưa nóng cho 20 người với ngân sách 350 đô. Gói Standard (15 đô/người, tổng 300 đô) phù hợp; khách sẽ gửi danh sách khách mời trước thứ Tư.',
    qs: [
      q('What is the caller planning?', ['A staff party', 'A client lunch', 'A product launch', 'A training workshop'], 1, '“a lunch for twenty clients”.'),
      q('Look at the graphic. Which package will the caller most likely choose?', ['Basic', 'Deluxe', 'Standard', 'None of the packages'], 2, '20 người × $15 = $300, trong ngân sách $350 và là bữa nóng. Deluxe là $500 (quá ngân sách), Basic không có bữa nóng.'),
      q('What is the caller asked to do?', ['Pay a deposit', 'Visit the restaurant', 'Call back on Friday', 'Email a guest list'], 3, '“email me the final guest list by Wednesday”.'),
    ],
  },
]

export const P4_G: PartSet[] = [
  {
    id: 'p4-g1', kind: 'p4', title: 'Thông báo đổi phòng hội nghị (bảng chương trình)',
    graphic: {
      type: 'table', title: 'Conference program – morning',
      headers: ['Time', 'Session', 'Room'],
      rows: [['9:00', 'Opening Remarks', 'Hall 1'], ['10:00', 'Marketing Trends', 'Room 204'], ['11:00', 'Digital Tools', 'Room 305'], ['1:00', 'Panel Discussion', 'Hall 1']],
    },
    text: 'Attention conference attendees. Due to a scheduling conflict, one session has been moved. The ten o’clock session on marketing trends will now take place in Room 305 instead of the room listed in your program. The eleven o’clock session will go ahead as planned. Lunch tickets are available at the registration desk, and please remember to wear your name badge at all times. Thank you, and enjoy the rest of the morning.',
    vi: 'Thông báo cho người dự hội nghị: buổi 10 giờ về xu hướng marketing đổi sang phòng 305 so với chương trình. Buổi 11 giờ giữ nguyên. Vé ăn trưa phát ở quầy đăng ký và nhớ đeo thẻ tên.',
    qs: [
      q('Where is the announcement most likely being made?', ['At a conference', 'At a restaurant', 'At an airport', 'At a school'], 0, '“Attention conference attendees”.'),
      q('Look at the graphic. Which session has changed rooms?', ['Opening Remarks', 'Marketing Trends', 'Digital Tools', 'Panel Discussion'], 1, 'Buổi 10 giờ về marketing trends (Marketing Trends) chuyển sang phòng 305.'),
      q('What are listeners reminded to do?', ['Turn off their phones', 'Register online', 'Wear their name badges', 'Return early from lunch'], 2, '“please remember to wear your name badge at all times”.'),
    ],
  },
  {
    id: 'p4-g2', kind: 'p4', title: 'Quảng cáo giảm giá (bảng mức giảm)',
    graphic: {
      type: 'table', title: 'Weekend sale discounts',
      headers: ['Purchase total', 'Discount'],
      rows: [['$50 – $99', '5%'], ['$100 – $199', '10%'], ['$200 or more', '20%']],
    },
    text: 'Welcome to Harper’s Clothing, where this weekend’s big sale is on. Take a look at the savings shown on the sign by the door. And that is not all: if you have a Harper’s store card, you will receive an additional five percent off on top of the amounts shown. The sale runs through Sunday at closing time, so do not miss out. Our fitting rooms are located at the back of the store, near the shoes.',
    vi: 'Cửa hàng quần áo Harper’s giảm giá cuối tuần theo bảng ở cửa; có thẻ cửa hàng được giảm thêm 5%. Khuyến mãi đến hết Chủ nhật; phòng thử đồ ở cuối cửa hàng gần giày.',
    qs: [
      q('What type of business is Harper’s?', ['A clothing store', 'A shoe factory', 'A furniture shop', 'A bookstore'], 0, '“Harper’s Clothing”.'),
      q('Look at the graphic. What discount will a customer with a store card receive when spending $150?', ['10 percent', '5 percent', '20 percent', '15 percent'], 3, '$150 thuộc mức 10%, cộng thêm 5% cho thẻ cửa hàng = 15%.'),
      q('When does the sale end?', ['On Friday', 'On Saturday', 'On Sunday', 'On Monday'], 2, '“The sale runs through Sunday”.'),
    ],
  },
  {
    id: 'p4-g3', kind: 'p4', title: 'Báo cáo mức hài lòng khách hàng (biểu đồ cột)',
    graphic: {
      type: 'bars', title: 'Customer satisfaction by quarter', unit: '%',
      data: [['Q1', 72], ['Q2', 78], ['Q3', 85], ['Q4', 80]],
    },
    text: 'Good morning, everyone. I would like to review our customer satisfaction results for this year. As you can see on the chart, satisfaction increased steadily during the first three quarters, then dipped slightly in the fourth quarter, when we had longer delivery times during the holidays. Our goal for next year is to reach ninety percent. To get there, we will hire two more people for the delivery team. I would like to hear your ideas on other improvements.',
    vi: 'Người nói xem lại mức hài lòng của khách hàng trong năm: tăng đều ba quý đầu, giảm nhẹ ở quý 4 do giao hàng chậm dịp lễ. Mục tiêu năm sau là 90%, sẽ thuê thêm hai người cho bộ phận giao hàng.',
    qs: [
      q('What is the main topic of the talk?', ['Employee schedules', 'Customer satisfaction results', 'A new product line', 'Holiday bonuses'], 1, '“review our customer satisfaction results”.'),
      q('Look at the graphic. In which quarter was satisfaction highest?', ['The first quarter', 'The second quarter', 'The fourth quarter', 'The third quarter'], 3, 'Quý 3 (Q3) cao nhất: 85%.'),
      q('What will the company do to reach its goal?', ['Open a new store', 'Reduce prices', 'Hire more delivery staff', 'Extend business hours'], 2, '“we will hire two more people for the delivery team”.'),
    ],
  },
  {
    id: 'p4-g4', kind: 'p4', title: 'Hướng dẫn tham quan bảo tàng (sơ đồ)',
    graphic: {
      type: 'grid', title: 'Museum floor plan',
      cells: [['Entrance', 'Gallery A', 'Gallery B'], ['Gift Shop', 'Café', 'Gallery C']],
    },
    text: 'Welcome to the City Art Museum. Our tour begins in the gallery directly to the right of the entrance, where you will see the oldest paintings in the collection. We will then continue to the gallery beside the café, and the tour will finish in the gift shop. Please remember that flash photography is not allowed in any gallery. If you need a break, the café is a good place to rest.',
    vi: 'Hướng dẫn viên bảo tàng: tour bắt đầu ở phòng trưng bày ngay bên phải lối vào, rồi sang phòng cạnh quán cà phê, và kết thúc ở cửa hàng quà tặng. Không được chụp ảnh có đèn flash; có thể nghỉ ở quán cà phê.',
    qs: [
      q('Look at the graphic. Where will the tour begin?', ['Gallery B', 'Gallery A', 'Gallery C', 'The café'], 1, 'Phòng ngay bên phải lối vào (Entrance) là Gallery A.'),
      q('What is NOT allowed in the galleries?', ['Talking quietly', 'Taking notes', 'Using flash photography', 'Bringing a bag'], 2, '“flash photography is not allowed in any gallery”.'),
      q('Where will the tour end?', ['At the café', 'In the gift shop', 'In Gallery C', 'At the entrance'], 1, '“the tour will finish in the gift shop”.'),
    ],
  },
]
