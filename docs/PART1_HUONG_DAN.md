# Hướng dẫn thêm bài Part 1 (Tranh ảnh)

Part 1 của web cần **ảnh do bạn tự thêm**. Web chưa kèm ảnh nào (ảnh đề TOEIC có bản quyền).

## Ảnh nên lấy ở đâu
- Ảnh bạn tự chụp (văn phòng, đường phố, quán cà phê, đồ vật, người đang làm việc).
- Ảnh miễn phí cho phép dùng tự do: Pexels, Unsplash, Pixabay, Wikimedia Commons. Chọn ảnh có giấy phép dùng cho mục đích cá nhân, đọc kỹ điều khoản của từng ảnh.
- Nên chọn ảnh giống đề: một hoặc hai người đang làm việc, đồ vật trong phòng, cảnh ngoài trời, xe cộ, cửa hàng.

## Cách thêm (3 bước)
1. **Chép ảnh** vào thư mục `public/photos/` (định dạng jpg, jpeg, png, webp, gif hoặc avif; tên file chỉ gồm chữ, số, dấu `-`, `_`, `.`, khoảng trắng).
2. **Tạo file `public/photos/part1.json`** theo mẫu `public/photos/part1.example.json`.
3. **Tải lại trang.** Vào *Luyện đề → Part 1 Tranh ảnh*.

## Định dạng mỗi ảnh
| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `id` | có | Mã duy nhất, ví dụ `p1-001` |
| `file` | có | Tên file ảnh trong `public/photos/` |
| `title` | có | Tên ngắn của bức ảnh |
| `options` | có | Đúng **4** câu mô tả (A–D), tiếng Anh; chỉ một câu đúng nhất |
| `answer` | có | Vị trí câu đúng: 0 = A, 1 = B, 2 = C, 3 = D |
| `why` | có | Giải thích tiếng Việt: vì sao câu đúng, các câu còn lại sai ở đâu |
| `vi` | không | Tóm tắt tiếng Việt về bức ảnh |

Web **xáo thứ tự A–D** mỗi lần làm, nên đáp án không cố định ở một chữ.

## Cách viết 4 câu mô tả giống đề thật
- Câu đúng mô tả đúng người/vật và hành động có trong ảnh (thì hiện tại tiếp diễn hoặc bị động tiếp diễn: *A woman is holding a cup*; *Some boxes are being loaded*).
- Câu nhiễu thường: đúng vật nhưng **sai hành động**, đúng hành động nhưng **sai vật**, hoặc nói về vật **không có trong ảnh**, hay đoán suy nghĩ của người trong ảnh.
- Mỗi câu ngắn (5–12 từ), dùng từ vựng đời thường và công sở.

## Cách gửi ảnh cho tôi viết giúp
Bạn đặt ảnh vào `public/photos/` rồi nhắn tôi tên các file; tôi xem ảnh và viết sẵn 4 câu mô tả, đáp án và giải thích vào `part1.json`.

## Hiển thị trong web
- Part 1 có trong **Luyện đề**. Mỗi lượt 6 ảnh.
- Từ **6 ảnh trở lên**, Part 1 được đưa vào kế hoạch học (các giai đoạn đầu, 8 phút, đặt trước Part 2) và có điều kiện điểm tối thiểu 70% như các Part khác.
- Từ **1 ảnh trở lên** bạn đã luyện được ở Luyện đề; thi thử tự thêm 2 câu Part 1 khi có ảnh.
- Nếu một ảnh không tải được, web báo tên file bị lỗi.
- Mục sai định dạng trong `part1.json` sẽ bị bỏ qua (xem Console của trình duyệt để biết mục nào).
