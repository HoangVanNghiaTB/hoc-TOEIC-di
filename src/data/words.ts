import { rowsA } from './words-a'
import { rowsB } from './words-b'
import { rowsC } from './words-c'
import { rowsD } from './words-d'
import { rowsE } from './words-e'
import { rowsF } from './words-f'
import { rowsG } from './words-g'
import { rowsH } from './words-h'

export type Word = {
  id: string
  en: string
  ipa: string
  pos: string
  vi: string
  ex: string
  exVi: string
}

// [en, ipa, pos, vi, example, example vi]
export type Row = [string, string, string, string, string, string]

const rows: Row[] = [
  // --- Họp & công việc ---
  ['agenda', '/əˈdʒendə/', 'n', 'chương trình nghị sự', 'The agenda for today’s meeting has five items.', 'Chương trình cuộc họp hôm nay có năm mục.'],
  ['attend', '/əˈtend/', 'v', 'tham dự', 'All managers must attend the training session.', 'Tất cả quản lý phải tham dự buổi đào tạo.'],
  ['deadline', '/ˈdedlaɪn/', 'n', 'hạn chót', 'The deadline for the report is Friday.', 'Hạn chót nộp báo cáo là thứ Sáu.'],
  ['schedule', '/ˈskedʒuːl/', 'n/v', 'lịch trình; lên lịch', 'Please check the schedule before you book a room.', 'Hãy kiểm tra lịch trước khi đặt phòng.'],
  ['proposal', '/prəˈpoʊzl/', 'n', 'đề xuất', 'She submitted a proposal for a new project.', 'Cô ấy đã nộp một đề xuất cho dự án mới.'],
  ['contract', '/ˈkɑːntrækt/', 'n', 'hợp đồng', 'Both parties signed the contract yesterday.', 'Hai bên đã ký hợp đồng hôm qua.'],
  ['colleague', '/ˈkɑːliːɡ/', 'n', 'đồng nghiệp', 'My colleague will cover my shift tomorrow.', 'Đồng nghiệp sẽ làm ca của tôi ngày mai.'],
  ['supervisor', '/ˈsuːpərvaɪzər/', 'n', 'người giám sát', 'Please ask your supervisor for approval.', 'Hãy xin người giám sát của bạn phê duyệt.'],
  ['department', '/dɪˈpɑːrtmənt/', 'n', 'phòng ban', 'The marketing department moved to the third floor.', 'Phòng marketing đã chuyển lên tầng ba.'],
  ['headquarters', '/ˈhedkwɔːrtərz/', 'n', 'trụ sở chính', 'The company’s headquarters is in Chicago.', 'Trụ sở chính của công ty ở Chicago.'],
  ['conference', '/ˈkɑːnfərəns/', 'n', 'hội nghị', 'He will give a speech at the annual conference.', 'Anh ấy sẽ phát biểu tại hội nghị thường niên.'],
  ['seminar', '/ˈsemɪnɑːr/', 'n', 'buổi hội thảo', 'The seminar on time management starts at nine.', 'Buổi hội thảo về quản lý thời gian bắt đầu lúc chín giờ.'],
  ['workshop', '/ˈwɜːrkʃɑːp/', 'n', 'buổi thực hành, hội thảo chuyên đề', 'Employees can join a writing workshop next week.', 'Nhân viên có thể tham gia buổi thực hành viết vào tuần tới.'],
  ['presentation', '/ˌpreznˈteɪʃn/', 'n', 'bài thuyết trình', 'Her presentation impressed the clients.', 'Bài thuyết trình của cô ấy gây ấn tượng với khách hàng.'],
  ['participant', '/pɑːrˈtɪsɪpənt/', 'n', 'người tham gia', 'Each participant will receive a certificate.', 'Mỗi người tham gia sẽ nhận một chứng chỉ.'],
  ['session', '/ˈseʃn/', 'n', 'buổi họp, phiên', 'The morning session ends at noon.', 'Buổi sáng kết thúc vào giữa trưa.'],
  ['register', '/ˈredʒɪstər/', 'v', 'đăng ký', 'You must register online before the event.', 'Bạn phải đăng ký trực tuyến trước sự kiện.'],
  ['enroll', '/ɪnˈroʊl/', 'v', 'ghi danh', 'She decided to enroll in a business course.', 'Cô ấy quyết định ghi danh vào một khóa học kinh doanh.'],
  // --- Tuyển dụng & nhân sự ---
  ['candidate', '/ˈkændɪdeɪt/', 'n', 'ứng viên', 'The best candidate will be invited for a second interview.', 'Ứng viên tốt nhất sẽ được mời phỏng vấn vòng hai.'],
  ['resume', '/ˈrezəmeɪ/', 'n', 'sơ yếu lý lịch (CV)', 'Please attach your resume to the application.', 'Vui lòng đính kèm CV vào đơn ứng tuyển.'],
  ['qualification', '/ˌkwɑːlɪfɪˈkeɪʃn/', 'n', 'trình độ, bằng cấp', 'A degree is the minimum qualification for this job.', 'Bằng đại học là trình độ tối thiểu cho công việc này.'],
  ['experience', '/ɪkˈspɪriəns/', 'n', 'kinh nghiệm', 'We are looking for someone with two years of experience.', 'Chúng tôi đang tìm người có hai năm kinh nghiệm.'],
  ['apply', '/əˈplaɪ/', 'v', 'nộp đơn, áp dụng', 'Many graduates apply for this position every year.', 'Nhiều sinh viên mới tốt nghiệp nộp đơn vào vị trí này mỗi năm.'],
  ['recruit', '/rɪˈkruːt/', 'v', 'tuyển dụng', 'The firm plans to recruit ten new engineers.', 'Công ty dự định tuyển mười kỹ sư mới.'],
  ['salary', '/ˈsæləri/', 'n', 'tiền lương', 'The salary depends on your experience.', 'Mức lương phụ thuộc vào kinh nghiệm của bạn.'],
  ['benefit', '/ˈbenɪfɪt/', 'n', 'phúc lợi, lợi ích', 'Health insurance is one of the main benefits.', 'Bảo hiểm y tế là một trong những phúc lợi chính.'],
  ['promote', '/prəˈmoʊt/', 'v', 'thăng chức; quảng bá', 'He was promoted to regional manager last month.', 'Anh ấy được thăng chức làm quản lý khu vực tháng trước.'],
  ['resign', '/rɪˈzaɪn/', 'v', 'từ chức', 'The director will resign at the end of the year.', 'Giám đốc sẽ từ chức vào cuối năm.'],
  ['retire', '/rɪˈtaɪər/', 'v', 'nghỉ hưu', 'Mr. Lee plans to retire next spring.', 'Ông Lee dự định nghỉ hưu vào mùa xuân tới.'],
  ['employee', '/ɪmˈplɔɪiː/', 'n', 'nhân viên', 'Every employee must wear an ID badge.', 'Mọi nhân viên phải đeo thẻ tên.'],
  ['employer', '/ɪmˈplɔɪər/', 'n', 'nhà tuyển dụng, chủ lao động', 'Her employer offers flexible working hours.', 'Chủ lao động của cô ấy cho phép giờ làm việc linh hoạt.'],
  ['position', '/pəˈzɪʃn/', 'n', 'vị trí công việc', 'The position requires strong communication skills.', 'Vị trí này đòi hỏi kỹ năng giao tiếp tốt.'],
  // --- Tài chính ---
  ['budget', '/ˈbʌdʒɪt/', 'n', 'ngân sách', 'We need to stay within the budget.', 'Chúng ta cần giữ trong phạm vi ngân sách.'],
  ['expense', '/ɪkˈspens/', 'n', 'chi phí', 'Travel expenses will be reimbursed.', 'Chi phí đi lại sẽ được hoàn trả.'],
  ['revenue', '/ˈrevənuː/', 'n', 'doanh thu', 'Revenue increased by ten percent this quarter.', 'Doanh thu tăng mười phần trăm trong quý này.'],
  ['profit', '/ˈprɑːfɪt/', 'n', 'lợi nhuận', 'The company made a large profit last year.', 'Công ty đạt lợi nhuận lớn năm ngoái.'],
  ['invest', '/ɪnˈvest/', 'v', 'đầu tư', 'They plan to invest in new technology.', 'Họ dự định đầu tư vào công nghệ mới.'],
  ['invoice', '/ˈɪnvɔɪs/', 'n', 'hóa đơn', 'Please send the invoice by email.', 'Vui lòng gửi hóa đơn qua email.'],
  ['refund', '/ˈriːfʌnd/', 'n/v', 'tiền hoàn lại; hoàn tiền', 'You can request a full refund within 30 days.', 'Bạn có thể yêu cầu hoàn tiền đầy đủ trong 30 ngày.'],
  ['receipt', '/rɪˈsiːt/', 'n', 'biên lai', 'Keep your receipt as proof of purchase.', 'Hãy giữ biên lai làm bằng chứng mua hàng.'],
  ['discount', '/ˈdɪskaʊnt/', 'n', 'giảm giá', 'Members receive a 15 percent discount.', 'Hội viên được giảm giá mười lăm phần trăm.'],
  ['payment', '/ˈpeɪmənt/', 'n', 'khoản thanh toán', 'Payment is due within two weeks.', 'Khoản thanh toán đến hạn trong hai tuần.'],
  ['estimate', '/ˈestɪmeɪt/', 'n/v', 'bản ước tính; ước tính', 'The contractor gave us an estimate for the repairs.', 'Nhà thầu đưa cho chúng tôi bản ước tính chi phí sửa chữa.'],
  // --- Mua bán & vận chuyển ---
  ['purchase', '/ˈpɜːrtʃəs/', 'n/v', 'mua; việc mua', 'She made a purchase online last night.', 'Cô ấy đã mua hàng trực tuyến tối qua.'],
  ['order', '/ˈɔːrdər/', 'n/v', 'đơn hàng; đặt hàng', 'Your order will arrive in three days.', 'Đơn hàng của bạn sẽ đến sau ba ngày.'],
  ['supplier', '/səˈplaɪər/', 'n', 'nhà cung cấp', 'We changed our supplier to reduce costs.', 'Chúng tôi đổi nhà cung cấp để giảm chi phí.'],
  ['shipment', '/ˈʃɪpmənt/', 'n', 'lô hàng', 'The shipment was delayed by bad weather.', 'Lô hàng bị trễ vì thời tiết xấu.'],
  ['deliver', '/dɪˈlɪvər/', 'v', 'giao hàng', 'We deliver within the city for free.', 'Chúng tôi giao hàng miễn phí trong thành phố.'],
  ['delay', '/dɪˈleɪ/', 'n/v', 'sự trì hoãn; trì hoãn', 'We apologize for the delay.', 'Chúng tôi xin lỗi vì sự chậm trễ.'],
  ['inventory', '/ˈɪnvəntɔːri/', 'n', 'hàng tồn kho', 'The store checks its inventory every Monday.', 'Cửa hàng kiểm kê hàng tồn kho vào mỗi thứ Hai.'],
  ['warehouse', '/ˈwerhaʊs/', 'n', 'nhà kho', 'The goods are stored in a warehouse nearby.', 'Hàng hóa được cất trong một nhà kho gần đây.'],
  ['customer', '/ˈkʌstəmər/', 'n', 'khách hàng', 'Customer satisfaction is our top priority.', 'Sự hài lòng của khách hàng là ưu tiên hàng đầu.'],
  ['client', '/ˈklaɪənt/', 'n', 'khách hàng (dịch vụ)', 'The client requested a few changes to the design.', 'Khách hàng yêu cầu vài thay đổi cho thiết kế.'],
  ['complaint', '/kəmˈpleɪnt/', 'n', 'lời phàn nàn', 'We received a complaint about the late delivery.', 'Chúng tôi nhận được lời phàn nàn về việc giao hàng trễ.'],
  ['warranty', '/ˈwɔːrənti/', 'n', 'bảo hành', 'The laptop comes with a two-year warranty.', 'Chiếc laptop đi kèm bảo hành hai năm.'],
  ['merchandise', '/ˈmɜːrtʃəndaɪs/', 'n', 'hàng hóa', 'All merchandise is on sale this weekend.', 'Tất cả hàng hóa đều giảm giá cuối tuần này.'],
  // --- Marketing ---
  ['advertise', '/ˈædvərtaɪz/', 'v', 'quảng cáo', 'They advertise their products on television.', 'Họ quảng cáo sản phẩm trên truyền hình.'],
  ['campaign', '/kæmˈpeɪn/', 'n', 'chiến dịch', 'The new campaign targets young customers.', 'Chiến dịch mới nhắm vào khách hàng trẻ.'],
  ['launch', '/lɔːntʃ/', 'v/n', 'ra mắt', 'The company will launch a new phone in May.', 'Công ty sẽ ra mắt một mẫu điện thoại mới vào tháng Năm.'],
  ['survey', '/ˈsɜːrveɪ/', 'n', 'khảo sát', 'A survey showed that most users like the app.', 'Một khảo sát cho thấy hầu hết người dùng thích ứng dụng.'],
  ['market', '/ˈmɑːrkɪt/', 'n/v', 'thị trường; tiếp thị', 'The company plans to enter the Asian market.', 'Công ty dự định thâm nhập thị trường châu Á.'],
  ['competitor', '/kəmˈpetɪtər/', 'n', 'đối thủ cạnh tranh', 'Our main competitor lowered its prices.', 'Đối thủ chính của chúng tôi đã hạ giá.'],
  // --- Giao tiếp công việc ---
  ['negotiate', '/nɪˈɡoʊʃieɪt/', 'v', 'đàm phán', 'They will negotiate the terms next week.', 'Họ sẽ đàm phán các điều khoản vào tuần sau.'],
  ['approve', '/əˈpruːv/', 'v', 'phê duyệt', 'The board approved the new budget.', 'Hội đồng quản trị đã phê duyệt ngân sách mới.'],
  ['submit', '/səbˈmɪt/', 'v', 'nộp', 'Please submit your timesheet by noon.', 'Vui lòng nộp bảng chấm công trước buổi trưa.'],
  ['review', '/rɪˈvjuː/', 'v/n', 'xem xét; bài đánh giá', 'I will review the document this afternoon.', 'Tôi sẽ xem xét tài liệu vào chiều nay.'],
  ['revise', '/rɪˈvaɪz/', 'v', 'sửa đổi', 'Could you revise the schedule for me?', 'Bạn có thể sửa lại lịch giúp tôi không?'],
  ['draft', '/dræft/', 'n/v', 'bản nháp; soạn thảo', 'I sent you the first draft of the contract.', 'Tôi đã gửi bạn bản nháp đầu tiên của hợp đồng.'],
  ['attach', '/əˈtætʃ/', 'v', 'đính kèm', 'I have attached the file to this email.', 'Tôi đã đính kèm tệp vào email này.'],
  ['forward', '/ˈfɔːrwərd/', 'v', 'chuyển tiếp', 'Please forward the message to the team.', 'Vui lòng chuyển tiếp tin nhắn cho cả nhóm.'],
  ['reply', '/rɪˈplaɪ/', 'v/n', 'trả lời', 'He has not replied to my email yet.', 'Anh ấy chưa trả lời email của tôi.'],
  ['confirm', '/kənˈfɜːrm/', 'v', 'xác nhận', 'Please confirm your attendance by Monday.', 'Vui lòng xác nhận việc tham dự trước thứ Hai.'],
  ['cancel', '/ˈkænsl/', 'v', 'hủy', 'The flight was canceled because of the storm.', 'Chuyến bay bị hủy vì cơn bão.'],
  ['postpone', '/poʊstˈpoʊn/', 'v', 'hoãn lại', 'The meeting has been postponed until next week.', 'Cuộc họp đã được hoãn đến tuần sau.'],
  ['reschedule', '/ˌriːˈskedʒuːl/', 'v', 'sắp xếp lại lịch', 'Can we reschedule the interview for Thursday?', 'Chúng ta có thể dời buổi phỏng vấn sang thứ Năm không?'],
  ['announce', '/əˈnaʊns/', 'v', 'thông báo', 'The company will announce the results tomorrow.', 'Công ty sẽ công bố kết quả vào ngày mai.'],
  ['notify', '/ˈnoʊtɪfaɪ/', 'v', 'thông báo cho (ai)', 'We will notify you when the item arrives.', 'Chúng tôi sẽ báo cho bạn khi hàng đến.'],
  ['inform', '/ɪnˈfɔːrm/', 'v', 'cho biết', 'Please inform us of any changes.', 'Vui lòng cho chúng tôi biết về mọi thay đổi.'],
  ['reminder', '/rɪˈmaɪndər/', 'n', 'lời nhắc', 'This is a reminder about tomorrow’s deadline.', 'Đây là lời nhắc về hạn chót ngày mai.'],
  ['recommend', '/ˌrekəˈmend/', 'v', 'giới thiệu, khuyên', 'I recommend that you book early.', 'Tôi khuyên bạn nên đặt sớm.'],
  ['suggest', '/səɡˈdʒest/', 'v', 'gợi ý', 'She suggested moving the meeting to Tuesday.', 'Cô ấy gợi ý dời cuộc họp sang thứ Ba.'],
  ['consider', '/kənˈsɪdər/', 'v', 'cân nhắc', 'We are considering several options.', 'Chúng tôi đang cân nhắc nhiều lựa chọn.'],
  ['agree', '/əˈɡriː/', 'v', 'đồng ý', 'Everyone agreed to the new schedule.', 'Mọi người đều đồng ý với lịch mới.'],
  // --- Du lịch ---
  ['reserve', '/rɪˈzɜːrv/', 'v', 'đặt trước', 'I would like to reserve a table for four.', 'Tôi muốn đặt trước một bàn cho bốn người.'],
  ['reservation', '/ˌrezərˈveɪʃn/', 'n', 'sự đặt chỗ', 'Do you have a reservation?', 'Quý khách đã đặt chỗ chưa ạ?'],
  ['itinerary', '/aɪˈtɪnəreri/', 'n', 'lịch trình chuyến đi', 'The itinerary includes two days in Tokyo.', 'Lịch trình gồm hai ngày ở Tokyo.'],
  ['luggage', '/ˈlʌɡɪdʒ/', 'n', 'hành lý', 'Please keep your luggage with you at all times.', 'Vui lòng luôn mang theo hành lý bên mình.'],
  ['passenger', '/ˈpæsɪndʒər/', 'n', 'hành khách', 'Passengers should arrive two hours early.', 'Hành khách nên đến sớm hai tiếng.'],
  ['destination', '/ˌdestɪˈneɪʃn/', 'n', 'điểm đến', 'Our final destination is Singapore.', 'Điểm đến cuối cùng của chúng tôi là Singapore.'],
  ['departure', '/dɪˈpɑːrtʃər/', 'n', 'sự khởi hành', 'The departure time is 8:15 a.m.', 'Giờ khởi hành là 8 giờ 15 sáng.'],
  ['arrival', '/əˈraɪvl/', 'n', 'sự đến nơi', 'Upon arrival, go to the baggage claim.', 'Khi đến nơi, hãy đến khu nhận hành lý.'],
  ['boarding', '/ˈbɔːrdɪŋ/', 'n', 'việc lên tàu/máy bay', 'Boarding begins at gate twelve.', 'Việc lên máy bay bắt đầu tại cổng mười hai.'],
  ['accommodation', '/əˌkɑːməˈdeɪʃn/', 'n', 'chỗ ở', 'The price includes accommodation and meals.', 'Giá đã bao gồm chỗ ở và bữa ăn.'],
  ['available', '/əˈveɪləbl/', 'adj', 'có sẵn, rảnh', 'Is the conference room available at three?', 'Phòng họp có trống lúc ba giờ không?'],
  // --- Thiết bị & cơ sở vật chất ---
  ['require', '/rɪˈkwaɪər/', 'v', 'yêu cầu, đòi hỏi', 'This job requires a valid driver’s license.', 'Công việc này yêu cầu bằng lái xe hợp lệ.'],
  ['provide', '/prəˈvaɪd/', 'v', 'cung cấp', 'The hotel provides free breakfast.', 'Khách sạn cung cấp bữa sáng miễn phí.'],
  ['receive', '/rɪˈsiːv/', 'v', 'nhận', 'Did you receive my message?', 'Bạn đã nhận được tin nhắn của tôi chưa?'],
  ['install', '/ɪnˈstɔːl/', 'v', 'cài đặt, lắp đặt', 'A technician will install the new printer.', 'Một kỹ thuật viên sẽ lắp máy in mới.'],
  ['maintain', '/meɪnˈteɪn/', 'v', 'bảo trì, duy trì', 'It is important to maintain the equipment regularly.', 'Việc bảo trì thiết bị thường xuyên là quan trọng.'],
  ['repair', '/rɪˈper/', 'v/n', 'sửa chữa', 'The elevator is under repair.', 'Thang máy đang được sửa chữa.'],
  ['replace', '/rɪˈpleɪs/', 'v', 'thay thế', 'We need to replace the old computers.', 'Chúng ta cần thay những chiếc máy tính cũ.'],
  ['inspect', '/ɪnˈspekt/', 'v', 'kiểm tra, thanh tra', 'Inspectors will inspect the factory on Monday.', 'Thanh tra sẽ kiểm tra nhà máy vào thứ Hai.'],
  ['operate', '/ˈɑːpəreɪt/', 'v', 'vận hành', 'Only trained staff may operate this machine.', 'Chỉ nhân viên được đào tạo mới được vận hành máy này.'],
  ['equipment', '/ɪˈkwɪpmənt/', 'n', 'thiết bị', 'The office equipment was updated last year.', 'Thiết bị văn phòng đã được nâng cấp năm ngoái.'],
  ['facility', '/fəˈsɪləti/', 'n', 'cơ sở vật chất', 'The company built a new research facility.', 'Công ty xây một cơ sở nghiên cứu mới.'],
  ['supply', '/səˈplaɪ/', 'n/v', 'nguồn cung; cung cấp', 'We are running low on office supplies.', 'Chúng ta sắp hết đồ dùng văn phòng.'],
  ['renovate', '/ˈrenəveɪt/', 'v', 'cải tạo, tân trang', 'The lobby will be renovated this summer.', 'Sảnh sẽ được cải tạo vào mùa hè này.'],
  ['construction', '/kənˈstrʌkʃn/', 'n', 'việc xây dựng', 'Construction of the bridge will begin in June.', 'Việc xây cầu sẽ bắt đầu vào tháng Sáu.'],
  ['permit', '/ˈpɜːrmɪt/', 'n', 'giấy phép', 'You need a permit to park here.', 'Bạn cần giấy phép để đỗ xe ở đây.'],
  // --- Quy định ---
  ['regulation', '/ˌreɡjuˈleɪʃn/', 'n', 'quy định', 'New safety regulations take effect next month.', 'Quy định an toàn mới có hiệu lực vào tháng sau.'],
  ['comply', '/kəmˈplaɪ/', 'v', 'tuân thủ', 'All staff must comply with company policy.', 'Mọi nhân viên phải tuân thủ chính sách công ty.'],
  ['policy', '/ˈpɑːləsi/', 'n', 'chính sách', 'The return policy is printed on the receipt.', 'Chính sách đổi trả được in trên biên lai.'],
  ['procedure', '/prəˈsiːdʒər/', 'n', 'quy trình', 'Follow the safety procedure in case of fire.', 'Hãy làm theo quy trình an toàn khi có cháy.'],
  ['guideline', '/ˈɡaɪdlaɪn/', 'n', 'hướng dẫn', 'Please read the guidelines before you start.', 'Vui lòng đọc hướng dẫn trước khi bắt đầu.'],
  ['mandatory', '/ˈmændətɔːri/', 'adj', 'bắt buộc', 'Attendance at the training is mandatory.', 'Việc tham dự buổi đào tạo là bắt buộc.'],
  ['optional', '/ˈɑːpʃənl/', 'adj', 'tùy chọn', 'The extra insurance is optional.', 'Bảo hiểm bổ sung là tùy chọn.'],
  // --- Tính từ/ trạng thái hay gặp ---
  ['efficient', '/ɪˈfɪʃnt/', 'adj', 'hiệu quả', 'The new system is more efficient than the old one.', 'Hệ thống mới hiệu quả hơn hệ thống cũ.'],
  ['significant', '/sɪɡˈnɪfɪkənt/', 'adj', 'đáng kể', 'There was a significant rise in sales.', 'Doanh số đã tăng đáng kể.'],
  ['recent', '/ˈriːsnt/', 'adj', 'gần đây', 'Recent studies show a change in customer habits.', 'Các nghiên cứu gần đây cho thấy thói quen khách hàng đã thay đổi.'],
  ['current', '/ˈkɜːrənt/', 'adj', 'hiện tại', 'What is your current address?', 'Địa chỉ hiện tại của bạn là gì?'],
  ['previous', '/ˈpriːviəs/', 'adj', 'trước đó', 'She worked at a bank in her previous job.', 'Cô ấy từng làm ở ngân hàng trong công việc trước.'],
  ['upcoming', '/ˈʌpkʌmɪŋ/', 'adj', 'sắp tới', 'The upcoming event will be held downtown.', 'Sự kiện sắp tới sẽ được tổ chức ở trung tâm.'],
  ['temporary', '/ˈtempəreri/', 'adj', 'tạm thời', 'The office is closed for temporary repairs.', 'Văn phòng đóng cửa để sửa chữa tạm thời.'],
]

const seen = new Set<string>()
export const WORDS: Word[] = [...rows, ...rowsA, ...rowsB, ...rowsC, ...rowsD, ...rowsE, ...rowsF, ...rowsG, ...rowsH]
  .filter(([en]) => {
    if (seen.has(en)) return false
    seen.add(en)
    return true
  })
  .map(([en, ipa, pos, vi, ex, exVi]) => ({ id: en, en, ipa, pos, vi, ex, exVi }))
