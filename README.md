# TOEIC Quest (hoc-TOEIC-di)

Website học TOEIC **dùng cá nhân** (một người học), lộ trình 0 → 600+ điểm theo **96 buổi** (20/11/2026 → 25/02/2027). Học theo buổi, có điều kiện điểm tối thiểu, kết hợp trò chơi hóa (XP, cấp độ, streak, huy hiệu).

Giao diện tiếng Việt, tối ưu cho **máy tính** (desktop).

## Chức năng chính
- **Học từ vựng** bằng thẻ lặp lại ngắt quãng (SRS), 1.395 từ có phiên âm, nghĩa, ví dụ; kiểm tra nhiều hình thức (nhớ nghĩa, phiên âm, nghe & viết, điền câu, mặt chữ).
- **Trò chơi từ vựng:** ghép từ, nghe & gõ, sắp xếp câu, radio nghe thụ động.
- **Luyện nghe:** Part 1 (tranh ảnh), Part 2, 3, 4 (có bài kèm bảng/biểu đồ/sơ đồ), chép chính tả.
- **Luyện đọc:** ngữ pháp, Part 5, 6, 7 (hiển thị bố cục email, tin nhắn, lịch, hóa đơn), sổ lỗi sai.
- **Thi thử rút gọn** (35 phút) với điểm quy đổi ước tính.
- **Kế hoạch theo buổi:** buổi sau chỉ mở khi buổi trước đạt điều kiện (≥ 70%), có bước ôn các buổi trước.
- **Ghi chú** có ôn tập (che từ khóa), **giáo viên AI** (tùy chọn, cần khóa API), **tiến độ** và biểu đồ.
- Tự lưu tiến độ trong trình duyệt và ra file `progress/progress.json`.

## Chạy
Cần Node.js.

```bash
npm install
npm run dev     # mở http://localhost:5173
```

Trên Windows có thể dùng `start.bat`.

Giáo viên AI (tùy chọn): sao chép `.env.example` thành `.env` rồi điền `ANTHROPIC_API_KEY`. Khóa chỉ nằm ở máy chủ cục bộ, không bao giờ gửi xuống trình duyệt. Không có khóa thì phần còn lại vẫn chạy bình thường.

## Chạy bằng Docker (không cần cài Node)
Cần [Docker Desktop](https://www.docker.com/products/docker-desktop/) đang chạy.

```bash
git clone https://github.com/HoangVanNghiaTB/hoc-TOEIC-di.git
cd hoc-TOEIC-di
docker compose up --build     # mở http://localhost:5173
```

- Đổi cổng: `PORT=5180 docker compose up` (hoặc đặt `PORT=5180` trong file `.env`).
- Tắt: `Ctrl+C`, hoặc `docker compose down` nếu chạy nền (`docker compose up -d`).
- Tiến độ học lưu ngay trong thư mục `progress/` của dự án trên máy bạn (được gắn vào container), nên tắt hay xóa container cũng không mất.
- Podcast và ảnh Part 1 của bạn (nếu có) đặt trong `public/podcasts/` và `public/photos/`, cũng được gắn vào container.
- Giáo viên AI: tạo file `.env` cạnh `docker-compose.yml` với `ANTHROPIC_API_KEY=...` rồi chạy lại.
- Cổng chỉ mở cho chính máy bạn (`127.0.0.1`), không mở ra mạng ngoài.

## Công nghệ
React 19, TypeScript, Tailwind CSS 4, Vite 8. Trạng thái bằng `useSyncExternalStore`, lưu trong `localStorage` và file JSON.

## Nội dung KHÔNG nằm trong repo
Các thư mục/tệp sau chỉ ở máy người dùng (xem `.gitignore`):
- `public/podcasts/`, `src/data/podcast-parts.local.ts`: audio và lời chép podcast cá nhân (bản quyền thuộc tác giả gốc).
- `public/photos/` (trừ `part1.example.json`): ảnh Part 1 do người dùng tự thêm. Xem `docs/PART1_HUONG_DAN.md`.
- `progress/`: tiến độ học và bản sao lưu.
- `.env`: khóa API.

Khi không có các dữ liệu này, mục Podcast và Part 1 tự ẩn, phần còn lại hoạt động bình thường.

## Tài liệu
- `docs/PHAN_TICH_THIET_KE_HE_THONG.md`: phân tích và thiết kế hệ thống.
- `KE_HOACH.md`: kế hoạch ban đầu.
- `THIET_KE_LAI_FRONTEND_TOEIC_QUEST.md`: đặc tả giao diện.

## Lưu ý về nội dung
Từ vựng, câu hỏi, bài đọc và bài nghe do tác giả dự án **tự viết** (không chép đề thi thật) và có thể còn sai sót. Điểm thi thử chỉ là **ước tính rất thô**, không phải điểm TOEIC chính thức. Dự án phục vụ học cá nhân, không thương mại.
