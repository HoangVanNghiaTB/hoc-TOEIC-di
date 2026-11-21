// Bài Part 7 có bố cục tài liệu dạng bảng (hóa đơn, lịch, biểu mẫu). Dòng bắt đầu bằng | được hiển thị thành bảng.
import type { PartSet, PQ } from './parts'

const q = (qq: string, opts: [string, string, string, string], a: 0 | 1 | 2 | 3, why: string): PQ => ({ q: qq, opts, a, why })

export const P7_4: PartSet[] = [
  {
    id: 'p7-19', kind: 'p7', title: 'Hóa đơn thiết bị nha khoa',
    text: `— Invoice —
Smile Supply Co.
Invoice #4471

Date: March 3
Bill to: Parkview Dental Clinic
Terms: Net 30

| Item | Quantity | Unit price | Total |
| Dental chairs | 2 | $1,200 | $2,400 |
| Instrument trays | 10 | $45 | $450 |
| Delivery | 1 | $100 | $100 |

Total due: $2,950
Payment is due within 30 days. A 2 percent discount applies if payment is received within 10 days.`,
    vi: 'Hóa đơn của công ty Smile Supply gửi phòng khám Parkview: 2 ghế nha khoa, 10 khay dụng cụ, phí giao hàng; tổng 2.950 đô. Thanh toán trong 30 ngày, giảm 2% nếu trả trong 10 ngày.',
    qs: [
      q('What is the purpose of the document?', ['To request payment for goods and services', 'To announce a new product', 'To confirm a delivery time', 'To advertise a sale'], 0, 'Đây là hóa đơn (Invoice) liệt kê hàng và tổng tiền phải trả.'),
      q('What is the total amount due?', ['$2,400', '$2,850', '$2,950', '$3,050'], 2, '2.400 + 450 + 100 = 2.950 đô (“Total due: $2,950”).'),
      q('What is stated about payment?', ['It must be made in cash', 'It can be made in installments', 'A deposit is required first', 'A discount is offered for early payment'], 3, '“A 2 percent discount applies if payment is received within 10 days.”'),
    ],
  },
  {
    id: 'p7-20', kind: 'p7', title: 'Lịch xe đưa đón sân bay',
    text: `Hotel Lakeside – Airport Shuttle

Shuttles run between the hotel and the airport and leave from the main entrance. Guests who stay two nights or more ride free. All other passengers pay the fare shown below.

| Hotel departure | Airport arrival | Fare |
| 6:00 a.m. | 6:40 a.m. | $8 |
| 8:30 a.m. | 9:10 a.m. | $8 |
| 12:00 p.m. | 12:45 p.m. | $8 |
| 4:00 p.m. | 4:40 p.m. | $8 |

Note: Guests with flights before 8 a.m. should reserve a seat at the front desk the night before.`,
    vi: 'Lịch xe đưa đón khách sạn Lakeside đến sân bay: xe khởi hành từ cửa chính, khách ở từ hai đêm trở lên đi miễn phí, người khác trả 8 đô. Khách có chuyến bay trước 8 giờ sáng nên đặt chỗ ở quầy lễ tân tối hôm trước.',
    qs: [
      q('How long does the 8:30 a.m. shuttle take to reach the airport?', ['30 minutes', '40 minutes', '45 minutes', '50 minutes'], 1, '8:30 → 9:10 là 40 phút.'),
      q('Who can ride the shuttle for free?', ['All airport employees', 'Children under twelve', 'Guests staying two nights or more', 'Guests who reserve online'], 2, '“Guests who stay two nights or more ride free.”'),
      q('What are guests with early flights advised to do?', ['Arrive at the airport the day before', 'Reserve a seat the night before', 'Pay the fare in advance', 'Take a taxi instead'], 1, '“reserve a seat at the front desk the night before”.'),
    ],
  },
  {
    id: 'p7-21', kind: 'p7', title: 'Biểu mẫu đăng ký hội thảo',
    text: `Greenfield Community Center – Workshop Registration

| Workshop | Day | Time | Fee |
| Photography Basics | Tuesday | 6:00 p.m. | $30 |
| Healthy Cooking | Thursday | 6:30 p.m. | $25 |
| Public Speaking | Saturday | 10:00 a.m. | $40 |

Name: Kevin Brooks
Email: kbrooks@example.com
Workshops selected: Healthy Cooking, Public Speaking
Payment: Credit card

Registrations must be received three days before the workshop. Members receive a $5 discount per workshop.`,
    vi: 'Biểu mẫu đăng ký hội thảo của trung tâm cộng đồng Greenfield: ông Kevin Brooks chọn hai hội thảo (Nấu ăn lành mạnh và Nói trước công chúng), thanh toán bằng thẻ. Đăng ký trước hội thảo ba ngày; hội viên giảm 5 đô mỗi hội thảo.',
    qs: [
      q('How much will Mr. Brooks pay before any discount?', ['$25', '$55', '$70', '$65'], 3, 'Healthy Cooking $25 + Public Speaking $40 = $65.'),
      q('When does the Healthy Cooking workshop meet?', ['Tuesday evening', 'Thursday evening', 'Saturday morning', 'Saturday evening'], 1, 'Theo bảng: Thursday, 6:30 p.m.'),
      q('What is indicated about members?', ['They can register late', 'They attend for free', 'They receive a discount on each workshop', 'They choose the workshop time'], 2, '“Members receive a $5 discount per workshop.”'),
    ],
  },
]
