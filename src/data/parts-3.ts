import type { PQ, PartSet } from './parts'

const q = (qq: string, opts: [string, string, string, string], a: 0 | 1 | 2 | 3, why: string): PQ => ({ q: qq, opts, a, why })

// Đợt 3: thêm bài Part 7, gồm các bài một đoạn và ba bài hai đoạn liên kết (tự viết).
export const P7_3: PartSet[] = [
  {
    id: 'p7-11', kind: 'p7', title: 'Bản ghi nhớ làm việc từ xa',
    text: 'To: All staff\nFrom: Human Resources\nSubject: Remote Work Trial\n\nStarting April 1, employees in the design and marketing teams may work from home on Wednesdays and Fridays for a three-month trial. Participants must be available by phone and email from 9 a.m. to 5 p.m. and must attend all team meetings online. At the end of June, HR will survey participants and managers to decide whether to extend the program. Please submit your request to your supervisor by March 15.',
    vi: 'Từ 1/4, nhóm thiết kế và marketing được làm việc ở nhà vào thứ Tư và thứ Sáu trong ba tháng thử nghiệm. Người tham gia phải liên lạc được từ 9 đến 5 giờ và dự họp trực tuyến. Cuối tháng Sáu HR khảo sát để quyết định có gia hạn không. Gửi yêu cầu cho người giám sát trước 15/3.',
    qs: [
      q('Who may take part in the trial?', ['All employees', 'Design and marketing teams', 'New employees only', 'Supervisors only'], 1, '“employees in the design and marketing teams”.'),
      q('What must participants do?', ['Work only on weekends', 'Be reachable during working hours and join meetings online', 'Visit the office twice a week', 'Submit a weekly report'], 1, '“be available by phone and email … attend all team meetings online”.'),
      q('What will HR do at the end of June?', ['End the program', 'Hire more staff', 'Survey participants and managers', 'Change the work hours'], 2, '“HR will survey participants and managers”.'),
      q('By when should requests be submitted?', ['April 1', 'March 15', 'June 30', 'Wednesday'], 1, '“by March 15”.'),
    ],
  },
  {
    id: 'p7-12', kind: 'p7', title: 'Email xác nhận đặt phòng khách sạn',
    text: 'Subject: Your reservation at Maple Grove Hotel\n\nThank you for booking with us. Reservation 20418\n\nCheck-in: Friday, June 7, from 3 p.m.\nCheck-out: Sunday, June 9, by 11 a.m.\nRoom: Deluxe King, breakfast included\nTotal: $340, payable at check-in\n\nCancellation is free until June 4. After that, a one-night charge applies. Parking is $12 per day. Early check-in may be possible; please call ahead.',
    vi: 'Email xác nhận đặt phòng Deluxe King, nhận phòng thứ Sáu 7/6, trả phòng Chủ nhật 9/6, gồm bữa sáng, tổng 340 đô trả khi nhận phòng. Hủy miễn phí đến 4/6, sau đó tính phí một đêm. Đỗ xe 12 đô mỗi ngày.',
    qs: [
      q('How long is the guest staying?', ['One night', 'Two nights', 'Three nights', 'A week'], 1, 'Từ thứ Sáu 7/6 đến Chủ nhật 9/6 = hai đêm.'),
      q('What is included in the room price?', ['Parking', 'Breakfast', 'Airport transport', 'Dinner'], 1, '“breakfast included”.'),
      q('What happens if the guest cancels on June 6?', ['Nothing is charged', 'A one-night charge applies', 'The full amount is charged', 'A new date is given'], 1, 'Sau 4/6 phải trả phí một đêm.'),
      q('How much does parking cost?', ['$12 per day', '$12 per stay', '$34 per day', 'It is free'], 0, '“Parking is $12 per day”.'),
    ],
  },
  {
    id: 'p7-13', kind: 'p7', title: 'Tin tiệm bánh mở cửa hàng thứ hai',
    text: 'Riverside Bakery to Open Second Shop\n\nRiverside Bakery, known for its sourdough bread, will open a second shop on Harper Street on April 12. Owner Lucia Gomez said demand at the original shop has grown so much that customers often wait in line for thirty minutes. The new shop will have seating for forty people and will sell sandwiches and coffee in addition to bread. Ten new employees will be hired, and applications are accepted online. To celebrate the opening, the first one hundred customers will receive a free loaf.',
    vi: 'Tiệm bánh Riverside mở cửa hàng thứ hai trên phố Harper ngày 12/4 vì cửa hàng cũ quá đông, khách thường xếp hàng ba mươi phút. Cửa hàng mới có 40 chỗ ngồi, bán thêm bánh mì kẹp và cà phê, tuyển 10 nhân viên qua mạng. Một trăm khách đầu tiên được tặng một ổ bánh.',
    qs: [
      q('Why is the bakery opening a second shop?', ['The rent is cheaper', 'Demand at the first shop has grown', 'The owner is moving', 'A new law requires it'], 1, '“demand at the original shop has grown so much”.'),
      q('What is true about the new shop?', ['It has seating for forty', 'It sells only bread', 'It opens in March', 'It is on the same street'], 0, '“seating for forty people”.'),
      q('How can people apply for jobs?', ['By phone', 'In person', 'Online', 'By mail'], 2, '“applications are accepted online”.'),
      q('What will the first one hundred customers receive?', ['A discount card', 'A free coffee', 'A free loaf', 'A cooking class'], 2, '“a free loaf”.'),
    ],
  },
  {
    id: 'p7-14', kind: 'p7', title: 'Thông báo diễn tập phòng cháy',
    text: 'Fire Drill Notice\n\nA fire drill will be held on Thursday, May 9, at 10:30 a.m. When the alarm sounds, leave the building by the nearest exit and gather in the parking lot behind the building. Do not use the elevators. Floor wardens will check each floor and take attendance. The drill should last about twenty minutes. Employees who are working from home do not need to participate. Questions? Contact Facilities at extension 115.',
    vi: 'Diễn tập phòng cháy vào thứ Năm 9/5 lúc 10:30. Khi chuông báo, ra bằng lối thoát gần nhất, tập trung ở bãi đỗ xe phía sau; không dùng thang máy. Diễn tập khoảng 20 phút; người làm việc ở nhà không cần tham gia. Liên hệ bộ phận Cơ sở vật chất, số máy nhánh 115.',
    qs: [
      q('What is the purpose of the notice?', ['To announce a fire drill', 'To report a fire', 'To close the building', 'To introduce a new alarm'], 0, 'Thông báo về buổi diễn tập phòng cháy.'),
      q('Where should employees gather?', ['In the lobby', 'On the roof', 'In the parking lot behind the building', 'At the main entrance'], 2, '“gather in the parking lot behind the building”.'),
      q('What should employees avoid during the drill?', ['Using the stairs', 'Using the elevators', 'Talking to wardens', 'Leaving the building'], 1, '“Do not use the elevators”.'),
      q('Who does not need to participate?', ['Floor wardens', 'New employees', 'Employees working from home', 'Visitors'], 2, '“Employees who are working from home do not need to participate”.'),
    ],
  },
  {
    id: 'p7-15', kind: 'p7', title: 'Tin nhắn hẹn thăm nhà máy',
    text: 'Priya (8:40 a.m.): Are you still planning to visit the Dalton plant on Thursday?\nMarcus (8:42 a.m.): Yes, but my train is delayed. I may be thirty minutes late.\nPriya (8:43 a.m.): No problem. The tour starts at 10, so aim to arrive by 9:45 to get your visitor pass.\nMarcus (8:45 a.m.): Got it. Should I bring anything?\nPriya (8:46 a.m.): Just your ID and closed-toe shoes. Safety glasses are provided.',
    vi: 'Marcus có thể đến muộn vì tàu trễ. Priya dặn anh đến trước 9:45 để lấy thẻ khách, vì buổi tham quan bắt đầu lúc 10 giờ. Anh cần mang giấy tờ tùy thân và giày kín mũi; kính bảo hộ do nhà máy phát.',
    qs: [
      q('Why might Marcus be late?', ['His train is delayed', 'He has a meeting', 'His car broke down', 'He forgot the address'], 0, '“my train is delayed”.'),
      q('By what time should Marcus arrive?', ['9:00', '9:45', '10:00', '10:30'], 1, '“aim to arrive by 9:45”.'),
      q('What is Marcus asked to bring?', ['Safety glasses', 'A laptop', 'ID and closed-toe shoes', 'A signed form'], 2, '“Just your ID and closed-toe shoes”.'),
      q('At 8:43, what does Priya mean by “No problem”?', ['She cannot help', 'Being late is acceptable', 'The tour is canceled', 'She will wait outside'], 1, 'Cô ấy chấp nhận việc anh đến muộn.'),
    ],
  },
  {
    id: 'p7-16', kind: 'p7', title: 'Hai email: ứng tuyển và phản hồi',
    text: '— Email 1 —\nFrom: Hannah Cole\nTo: Human Resources\nSubject: Application for Marketing Assistant\n\nDear Hiring Team,\nI am writing to apply for the Marketing Assistant position advertised on your website. I have two years of experience in social media and recently completed a certificate in digital marketing. I have attached my resume and two references. I am available for an interview any weekday after 2 p.m.\nSincerely,\nHannah Cole\n\n— Email 2 —\nFrom: Sam Ortiz, Human Resources\nTo: Hannah Cole\nSubject: RE: Application for Marketing Assistant\n\nDear Ms. Cole,\nThank you for your application. We would like to invite you for an interview on Tuesday, April 2, at 3 p.m. at our downtown office. Please bring a portfolio of your previous work and arrive ten minutes early to sign in. If this time does not work for you, reply by Friday and we will find another.\nBest regards,\nSam Ortiz',
    vi: 'Email 1: Hannah ứng tuyển vị trí trợ lý marketing, có hai năm kinh nghiệm mạng xã hội và rảnh các ngày trong tuần sau 2 giờ chiều. Email 2: HR mời phỏng vấn thứ Ba 2/4 lúc 3 giờ chiều, mang hồ sơ năng lực và đến sớm 10 phút; nếu không hợp giờ thì trả lời trước thứ Sáu.',
    qs: [
      q('Why did Ms. Cole write the first email?', ['To ask about a refund', 'To apply for a job', 'To change an interview time', 'To thank a manager'], 1, '“I am writing to apply for the Marketing Assistant position”.'),
      q('What does Ms. Cole say about her availability?', ['She is free only on weekends', 'She is free on weekdays after 2 p.m.', 'She cannot attend an interview', 'She is free in the mornings'], 1, '“available for an interview any weekday after 2 p.m.”'),
      q('What is Ms. Cole asked to bring to the interview?', ['A portfolio of her work', 'A letter from her employer', 'Two photos', 'A certificate of birth'], 0, '“bring a portfolio of your previous work”.'),
      q('What can be inferred about the interview time?', ['It is outside Ms. Cole’s stated availability', 'It is within Ms. Cole’s stated availability', 'It is in the morning', 'It cannot be changed'], 1, '3 giờ chiều nằm trong “after 2 p.m.” cô ấy nêu.'),
    ],
  },
  {
    id: 'p7-17', kind: 'p7', title: 'Quảng cáo và đánh giá dịch vụ vệ sinh',
    text: '— Advertisement —\nGreenleaf Cleaning Services\nOffice cleaning from $80 per visit.\nWeekly, biweekly or monthly plans.\nEco-friendly products only.\nFirst visit 20% off. Call 555-0188 or book online.\n\n— Customer review —\n★★★★☆\nWe started with Greenleaf in January. The team is reliable and always on time, and our office has never looked better. I took off one star because the booking website was slow, but the staff fixed my schedule quickly when I called. We chose a biweekly plan and are happy with the price.\n— Omar, Brightside Law',
    vi: 'Quảng cáo: dịch vụ vệ sinh văn phòng từ 80 đô mỗi lần, gói hằng tuần, hai tuần hoặc hằng tháng, dùng sản phẩm thân thiện môi trường, giảm 20% lần đầu. Đánh giá: nhóm đúng giờ, văn phòng sạch; trừ một sao vì trang đặt lịch chậm; chọn gói hai tuần một lần và hài lòng với giá.',
    qs: [
      q('What is stated about Greenleaf’s products?', ['They are imported', 'They are eco-friendly', 'They are sold in stores', 'They are free'], 1, '“Eco-friendly products only”.'),
      q('What discount is offered in the advertisement?', ['10% off every visit', '20% off the first visit', 'Free cleaning supplies', 'A free annual plan'], 1, '“First visit 20% off”.'),
      q('What problem does Omar mention?', ['The staff arrived late', 'The price was too high', 'The booking website was slow', 'The office was not clean'], 2, '“the booking website was slow”.'),
      q('What kind of plan did Omar choose?', ['Weekly', 'Biweekly', 'Monthly', 'A one-time visit'], 1, '“We chose a biweekly plan”.'),
    ],
  },
  {
    id: 'p7-18', kind: 'p7', title: 'Thông báo và lịch ngày tình nguyện',
    text: '— Notice —\nCommunity Garden Volunteer Day\nSaturday, May 18\n\nJoin us to plant vegetables and flowers at the Elm Street garden. Tools and lunch are provided. Volunteers under 16 must be accompanied by an adult. Please register online by May 15 so that we can order enough lunch.\n\n— Schedule —\n9:00 a.m. Check-in and tool distribution\n9:30 a.m. Planting groups begin\n12:00 p.m. Lunch\n1:00 p.m. Painting the garden fence\n3:00 p.m. Cleanup and thank-you remarks',
    vi: 'Ngày tình nguyện ở vườn cộng đồng phố Elm, thứ Bảy 18/5: trồng rau và hoa, có dụng cụ và bữa trưa. Tình nguyện viên dưới 16 tuổi phải đi cùng người lớn; đăng ký trực tuyến trước 15/5 để đặt đủ bữa trưa. Lịch: 9:00 điểm danh, 9:30 trồng cây, 12:00 ăn trưa, 1:00 sơn hàng rào, 3:00 dọn dẹp và phát biểu cảm ơn.',
    qs: [
      q('What are volunteers asked to do by May 15?', ['Bring tools', 'Register online', 'Call the organizers', 'Pay a fee'], 1, '“register online by May 15”.'),
      q('Why are volunteers asked to do this?', ['To receive a T-shirt', 'To choose a task', 'To help the organizers order enough lunch', 'To get a parking pass'], 2, '“so that we can order enough lunch”.'),
      q('What will happen at 1:00 p.m.?', ['Lunch will be served', 'The fence will be painted', 'Planting will begin', 'Remarks will be given'], 1, '“1:00 p.m. Painting the garden fence”.'),
      q('Who must be accompanied by an adult?', ['Anyone new to the garden', 'Volunteers under 16', 'Visitors', 'Anyone using tools'], 1, '“Volunteers under 16 must be accompanied by an adult”.'),
    ],
  },
]
