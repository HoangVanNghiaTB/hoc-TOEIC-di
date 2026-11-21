# Kế hoạch web học TOEIC cá nhân (0 → 600 điểm)

**Thời gian:** 20/11/2026 → 25/02/2027 (ngày thi; 96 buổi học, khoảng 14 tuần).
**Mục tiêu:** 600 điểm TOEIC. Học đều 1,5–2 giờ mỗi ngày.
**Nguyên tắc:** làm xong MVP trong khoảng 1 tuần để học song song, không chờ web hoàn hảo.

---

## 1. Công nghệ

Web dùng một mình nên không cần backend, tài khoản hay database.

- **Vite + React + TypeScript + Tailwind**
- **Lưu tiến độ:** IndexedDB / localStorage, có nút Xuất/Nhập JSON để sao lưu
- **Nội dung:** file JSON trong `src/data/` (từ vựng, ngữ pháp, câu hỏi)
- **Âm thanh:** Web Speech API (TTS) cho từ và câu; thêm mp3 thật sau
- **Chạy:** `npm run dev`, hoặc đưa lên Vercel/Netlify để học trên điện thoại
- Giao diện sáng, màu rõ, có hiệu ứng và âm thanh đúng/sai, dùng tốt trên điện thoại

---

## 2. Hệ thống game ("vừa chơi vừa học")

- **XP và cấp độ:** Newbie → Office Worker → Team Lead → Manager
- **Streak hằng ngày:** có "đóng băng streak" 1 lần/tuần
- **Mạng (hearts):** sai thì mất tim ở chế độ thử thách, hết tim thì chuyển sang ôn lại
- **Huy hiệu:** 100 từ đầu tiên, 7 ngày liền, 0 lỗi một bài, hoàn thành Part 5, ...
- **Mục tiêu tuần và boss tuần:** gom các câu sai trong tuần thành một trận đấu
- **Bản đồ hành trình:** 14 tuần = 14 chặng, từ "Sân bay" đến "Văn phòng công ty" (đích: 600 điểm)
- **Thưởng cá nhân:** tự đặt phần thưởng thật gắn với các mốc, web nhắc khi đạt

### Mini-game theo kỹ năng

| Mini-game | Luyện gì | Cách chơi |
|---|---|---|
| Flashcard SRS | Từ vựng | Lật thẻ, tự chấm Nhớ/Quên, thuật toán xếp lịch ôn lại |
| Ghép từ - nghĩa (Match) | Từ vựng | Ghép cặp trong 60 giây, tính combo |
| Gõ từ nghe được (Speed Typing) | Nghe + chính tả | Nghe từ, gõ đúng càng nhanh càng nhiều điểm |
| Hangman / Đoán chữ | Chính tả | Đoán từ theo gợi ý nghĩa |
| Điền từ vào câu (Part 5 Quiz) | Ngữ pháp | Trắc nghiệm có đồng hồ, combo đúng liên tiếp |
| Sắp xếp câu | Cấu trúc câu | Kéo thả từ thành câu đúng |
| Nghe và chọn tranh (Part 1) | Nghe | Nghe câu mô tả, chọn tranh khớp |
| Dictation | Nghe | Nghe câu, gõ lại, tô màu chỗ sai |
| Boss tuần | Ôn tổng hợp | Gom câu sai trong tuần thành một trận đấu |
| Thi thử mô phỏng | Tổng hợp | Đề đúng định dạng TOEIC, có đồng hồ, ước tính điểm |

### Cách chơi để nhớ lâu

- Mọi mini-game từ vựng và ngữ pháp nối vào **cùng một kho SRS**: sai trong game thì từ tự quay lại ôn đúng lúc.
- Ưu tiên **tự nhớ ra** (gõ, nghe-viết) hơn chỉ nhận mặt (trắc nghiệm).
- Mỗi từ có **câu ví dụ ngữ cảnh công sở** và **phát âm**.
- **Ôn xen kẽ** các dạng bài và từ cũ trong cùng buổi, không học dồn một chủ đề.
- **Sổ lỗi sai** tự gom lại, mỗi tuần quay lại thành boss.

---

## 3. Các giai đoạn làm web

| Giai đoạn | Thời gian | Có gì |
|---|---|---|
| **MVP** | Tuần 1 (20–27/11) | Flashcard SRS, XP, cấp độ, streak, dashboard, 2 mini-game (Match, Speed Typing), lịch học theo ngày |
| **v1** | Tuần 2–3 | Part 5 Quiz, Sắp xếp câu, bài ngữ pháp ngắn, huy hiệu, hearts, sổ lỗi sai |
| **v2** | Tuần 4–6 | Dictation, Part 1–2, Part 6–7 cơ bản, bản đồ hành trình, boss tuần, thống kê theo Part |
| **v3** | Tuần 7+ | Part 3–7 đầy đủ, thi thử mô phỏng, biểu đồ tiến bộ, hiệu ứng và âm thanh |

Từ tuần 7 trở đi chủ yếu là học, chỉ sửa web khi cần.

---

## 4. Lộ trình học 14 tuần

| Giai đoạn | Tuần | Trọng tâm | Mốc |
|---|---|---|---|
| **Nền tảng** | 1–4 (đến 18/12) | 600 từ cốt lõi (~20 từ/ngày), ngữ pháp cơ bản (thì, danh/động/tính/trạng từ, giới từ), nghe Part 1–2 | Test đầu vào ~250–300 |
| **Xây dựng** | 5–9 (18/12 → 22/01) | Thêm 600 từ chủ đề công sở, Part 3–4, Part 5–6, mẹo Part 7 | ~400–450 |
| **Tăng tốc** | 10–13 (22/01 → 19/02) | Luyện đề theo Part, phân tích câu sai, tăng tốc độ đọc | ~500–550 |
| **Về đích** | 14 (19/02 → 25/02, 5 buổi) | 2–3 đề full test, ôn sổ lỗi sai, giữ sức | 600+ |

**Lưu ý:** Tết Nguyên đán 2027 khoảng 6/2/2027, nên giảm tải nhẹ tuần đó, không bỏ hẳn.

### Nhịp học hằng ngày (~90 phút)

- 20 phút ôn flashcard theo SRS
- 30 phút ngữ pháp hoặc từ vựng mới
- 30 phút nghe hoặc đọc
- 10 phút ôn câu sai

Cuối mỗi tuần làm một bài test nhỏ để theo dõi tiến bộ.

---

## 5. Nội dung

Từ vựng, bài ngữ pháp và câu hỏi luyện tập được tạo dưới dạng JSON, viết mới theo đúng dạng Part 1–7. Không chép đề thật của ETS (có bản quyền). Audio thật có thể bổ sung sau từ nguồn của bạn.

---

## 6. Lộ trình luyện nghe

Nghe thụ động giúp quen tai nhưng không thay được nghe chủ động. Tỉ lệ gợi ý: khoảng 70% chủ động, 30% thụ động.

### Nghe chủ động (ngồi học, tập trung)
- Dictation: nghe câu, gõ lại, xem chỗ sai
- Shadowing: nghe rồi nhại theo ngay, bắt chước nhịp và ngữ điệu
- Luyện Part 1–4 có chấm điểm, xem transcript sau khi trả lời
- Câu nghe sai vào sổ lỗi sai, quay lại ở boss tuần

### Nghe thụ động (làm việc khác, nghe nền)
- **Chế độ Radio trong web:** tự phát từ SRS cần ôn hôm nay (từ → nghĩa → câu ví dụ), lặp vòng, chạy được khi khóa màn hình điện thoại
- Podcast hoặc bản tin tiếng Anh chậm (VOA Learning English, BBC Learning English)
- Dùng lúc đi đường, ăn cơm, dọn nhà

### Theo giai đoạn

| Giai đoạn | Chủ động | Thụ động | Tốc độ |
|---|---|---|---|
| Tuần 1–4 | 15 phút dictation từ/câu ngắn + 10 phút shadowing, Part 1–2 | 30 phút Radio từ vựng đang học | 0.75x – 1x |
| Tuần 5–9 | Part 3–4 chia nhỏ từng đoạn, nghe trước, xem transcript sau | 30–45 phút podcast chậm, có transcript | 1x |
| Tuần 10–13 | Luyện đủ Part 1–4 theo đề, không xem transcript trước | 30–60 phút podcast, bản tin tốc độ thường | 1x – 1.25x |
| Tuần 14 | 1–2 đề nghe full, ôn câu nghe sai | Radio ôn từ nhẹ | 1x |

### Công cụ trong web
- Chỉnh tốc độ phát (0.75x, 1x, 1.25x), nút nghe lại
- Xem transcript kèm dịch nghĩa, từ khóa tô sáng
- Chế độ "nghe mù" (ẩn transcript) và "nghe có phụ đề"
- Từ mới nghe được thêm vào SRS

### Nguồn âm thanh
- Giai đoạn đầu: giọng đọc của trình duyệt (Web Speech API), chỉ có vài giọng
- Về sau: mp3 thật do bạn thêm, hoặc tạo bằng dịch vụ TTS (có thể mất phí)
- TOEIC thật có giọng Mỹ, Anh, Úc, Canada. TTS không thay được hoàn toàn, nên nghe thêm đề thật và podcast cho quen giọng

---

## 7. Nguồn dữ liệu

| Nội dung | Nguồn | Ghi chú |
|---|---|---|
| Từ vựng | Danh sách từ mở nhắm TOEIC (TOEIC Service List, Business Service List) | Cần kiểm tra giấy phép trước khi dùng |
| Nghĩa, phiên âm, ví dụ công sở | Tự viết | Nên rà lại từ nhiều nghĩa |
| Câu ví dụ có sẵn | Tatoeba (có bản dịch tiếng Việt) | Cần kiểm tra giấy phép |
| Ngữ pháp | Tự viết bài giảng và bài tập | Kiến thức chung, không dính bản quyền |
| Đề thi | Câu hỏi mới viết theo format Part 1–7 | Không chép đề thật của ETS (có bản quyền) |
| Đề của bạn | Công cụ nhập JSON để dùng riêng | Sách, đề bạn đã mua |
| Đề mẫu chính thức | Mở ở tab khác để luyện song song | ETS công bố miễn phí |

Lưu ý:
- Đề tự viết không phải đề thật, điểm ước tính chỉ gần đúng. Gần ngày thi nên làm vài đề chính thức.
- Có nút "Báo câu lỗi" trong web để đánh dấu câu hoặc đáp án sai.

---

## 8. Giáo viên AI và luyện nói

TOEIC Listening & Reading (mốc 600 điểm) không thi nói, nên luyện nói là phần hỗ trợ: nói giúp nhớ từ và cấu trúc lâu hơn, và nhại giọng cải thiện nghe.

### Luồng hoạt động
1. Bạn nói vào micro, trình duyệt chuyển giọng nói thành chữ (Web Speech API, dùng Chrome hoặc Edge)
2. Chữ được gửi cho Claude (qua API) đóng vai giáo viên
3. Claude trả lời, sửa lỗi ngữ pháp và từ vựng, gợi ý cách nói tự nhiên hơn
4. Câu trả lời được đọc lại bằng giọng TTS

### Chế độ luyện nói
- **Hội thoại tình huống công sở:** họp, gọi điện, phỏng vấn, đặt phòng, giải thích sự cố
- **Dùng từ vừa học:** AI yêu cầu bạn đặt câu hoặc nói tình huống có chứa các từ SRS hôm nay
- **Shadowing có chấm:** nhại theo câu mẫu, so chữ nhận dạng được với câu gốc để thấy từ nào chưa rõ
- **Sửa lỗi:** lỗi hay lặp lại vào sổ lỗi sai

### Giáo viên AI cho phần khác
- Giải thích vì sao đáp án sai/đúng trong Part 5–7
- Giải thích ngữ pháp theo lỗi bạn hay mắc
- Tạo thêm câu hỏi theo điểm yếu
- Nhận xét tuần: tóm tắt tiến bộ, gợi ý ưu tiên tuần sau

### Giới hạn và lưu ý
- Chấm phát âm chỉ ở mức gần đúng (dựa vào chữ nhận dạng được), không phải chấm âm vị
- Web Speech API phụ thuộc trình duyệt, cần mạng và có thể nhận sai giọng Việt
- **API key:** không để lộ trong code gửi lên mạng. Chạy một server proxy nhỏ trên máy, key để trong file `.env` (không đưa vào git)
- Chi phí tính theo lượng dùng. Dùng model nhỏ cho hội thoại thường, model lớn hơn cho giải thích khó
- Giai đoạn làm: v2 (tuần 4–6) cho giáo viên AI cơ bản, v3 cho hội thoại giọng nói

---

## 9. Bước tiếp theo

Làm MVP trong `d:\web_hoc_TOEIC`: khung dự án React + Vite, flashcard SRS, hệ thống XP/streak, 2 mini-game đầu và 600 từ đầu tiên.
