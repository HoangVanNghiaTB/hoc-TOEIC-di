# ĐẶC TẢ REDESIGN FRONTEND — TOEIC QUEST

**Phiên bản:** 1.0  
**Nguồn:** `PHAN_TICH_THIET_KE_HE_THONG.md` (21/11/2026)  
**Mục tiêu:** Làm mới UI/UX của website TOEIC Quest theo phong cách **Gaming / Competitive / Tactical EdTech**, giữ nguyên chức năng và logic hiện có.

## 1. PHẠM VI VÀ NGUYÊN TẮC BẮT BUỘC

TOEIC Quest là ứng dụng học TOEIC cá nhân, một người dùng, lộ trình 0 → 600+ trong 14 tuần, học theo **buổi**, không khóa theo ngày thực. Đây là dự án đã có chức năng; nhiệm vụ là **redesign frontend**, không xây lại hệ thống.

**Giữ nguyên:** React 19, TypeScript, Tailwind CSS 4, Vite 8; cơ chế điều hướng `Tab` trong `App.tsx` (không có router); store `useSyncExternalStore`; API `/api/progress`, `/api/tutor`; dữ liệu `src/data/*`, `localStorage` (`toeic-quest-v1`), đồng bộ file; thuật toán SRS, XP, cấp độ, streak, huy hiệu, kiểm tra, gate, podcast, thi thử. Không đổi cấu trúc state hoặc các khóa thống kê.

**Không tự thêm:** đăng nhập, tài khoản nhiều người, PvP, leaderboard online, shop, tiền ảo, chế độ thi TOEIC chính thức, Part 1, đồng bộ đa thiết bị hoặc tính năng AI khi chưa cấu hình. Các yếu tố mang phong cách game là **ngôn ngữ thị giác**, không phải yêu cầu thay đổi nghiệp vụ.

**Phạm vi thay đổi:** layout, điều hướng trình bày, màu sắc, font, spacing, card, icon, hình nền trang trí, trạng thái, hiệu ứng, responsive, khả năng tiếp cận, trải nghiệm thao tác. Có thể tách component UI dùng chung nhưng không thay đổi kết quả hoạt động.

## 2. Ý TƯỞNG THỊ GIÁC: “TRAIN. PROGRESS. CONQUER 600+.”

Hướng thiết kế: **Dark Competitive Dashboard** — giống giao diện hồ sơ người chơi và trung tâm nhiệm vụ trong game chiến thuật, nhưng nội dung và tính dễ đọc vẫn chuẩn ứng dụng giáo dục.

- **Rắn rỏi:** bố cục dạng khối rõ ràng, headline đậm, đường viền dứt khoát, ít chi tiết thừa.
- **Cuốn hút:** màu cam điện nổi bật, trạng thái hoàn thành trực quan, thanh tiến độ có cảm giác tăng trưởng.
- **Chuyên nghiệp:** nền tối trung tính, card có phân cấp, không lạm dụng neon/glow.
- **Tập trung:** trang làm bài, chép chính tả, đọc hiểu dùng bề mặt sạch, tương phản cao và chuyển động tối thiểu.
- **Đồng nhất:** cùng design system xuyên suốt Home, Plan, Flashcards, Games, Grammar, Lab, Podcast, Notes, Teacher, Settings.

Tên hiển thị chính vẫn là **TOEIC Quest**. Có thể dùng tagline **ROAD TO 600+** hoặc **TRAIN YOUR ENGLISH** trong hero; đây là copy giao diện đề xuất, không phải chức năng mới.

## 3. DESIGN TOKENS

### 3.1 Bảng màu đề xuất — Inferno Orange

| Token | Màu | Vai trò |
|---|---|---|
| `--bg-base` | `#0B0F17` | nền ứng dụng |
| `--bg-sidebar` | `#101722` | sidebar / topbar |
| `--surface-1` | `#172131` | card chính |
| `--surface-2` | `#202D3D` | card nổi / input |
| `--border` | `#344255` | đường phân cách |
| `--accent` | `#FF6533` | CTA, tab active, tiến độ quan trọng |
| `--accent-hover` | `#FF8057` | hover |
| `--text-primary` | `#F8FAFC` | chữ chính |
| `--text-secondary` | `#AEBBCD` | chữ phụ |
| `--success` | `#34D399` | hoàn thành / đúng |
| `--danger` | `#FB7185` | sai / cảnh báo lỗi |
| `--warning` | `#FBBF24` | gần hạn / cần chú ý |
| `--info` | `#60A5FA` | thông tin / chưa hoàn thành |

**Lưu ý:** Màu cam dùng cho CTA/active; màu xanh cho đúng/đạt; đỏ cho sai; trạng thái không chỉ dựa vào màu mà còn có icon và nhãn. Không thay đổi ý nghĩa nghiệp vụ của trạng thái hiện tại.

### 3.2 Typography

- Heading/display: **Rajdhani** hoặc **Space Grotesk** (cần kiểm tra đầy đủ dấu tiếng Việt).
- Nội dung, đề thi, lời giải, ghi chú: **Inter** hoặc font sans-serif có hỗ trợ tiếng Việt tốt.
- Heading lớn 32–44px desktop; heading khu vực 20–26px; nội dung 15–17px; thông tin phụ 12–14px.
- Tránh viết IN HOA toàn bộ đoạn dài; chỉ dùng uppercase cho nhãn ngắn, số liệu và headline.

### 3.3 Hình khối, chiều sâu, khoảng cách

- Grid spacing theo bội số 4px; khoảng cách vùng 24–32px desktop, 16–20px mobile.
- Card bo góc 12–16px; nút 10–12px; input 10–12px. Có thể cắt góc nhẹ ở hero hoặc thẻ nổi bật nhưng không áp dụng đại trà.
- Border 1px, shadow nhẹ, không dùng nhiều hiệu ứng kính mờ.
- CTA chính nổi bật bằng nền cam; CTA phụ nền tối và viền; hành động nguy hiểm có xác nhận.
- Desktop ưu tiên độ rộng nội dung linh hoạt; riêng màn làm bài giới hạn độ dài dòng để dễ đọc.

## 4. APP SHELL VÀ ĐIỀU HƯỚNG

### 4.1 Desktop (đề xuất ≥ 1024px)

**Thay bố cục mobile-first một cột `max-w-xl` hiện tại bằng Dashboard Desktop thực sự.**

- **Sidebar trái (khoảng 240–264px):** logo TOEIC Quest, nhóm điều hướng chính, active state, trạng thái thu gọn.
- **Topbar (khoảng 64–72px):** tên màn hình/breadcrumb, thông tin XP/cấp, streak, nút Giáo viên AI và Cài đặt.
- **Main content:** vùng nội dung rộng, padding 24–32px; Dashboard có grid; màn học sử dụng layout chuyên biệt.
- **Điều hướng:** giữ các giá trị `Tab` và cách chuyển màn hiện có trong `App.tsx`; chỉ thay giao diện hiển thị và cách gom nhóm.

Nhóm điều hướng dựa trên hệ thống hiện tại:

1. **Trang chủ** (`home`) — lối vào Kế hoạch (`plan`) và Tiến độ (`progress`).
2. **Học thẻ** (`learn`) — kiểm tra từ (`check`) đi từ kế hoạch.
3. **Trò chơi** (`games`) — Ghép từ (`match`), Nghe & gõ (`typing`), Sắp xếp câu (`order`), Chép chính tả (`dictation`), Part 2 (`listen`), Podcast (`podcast`), Radio (`radio`).
4. **Ngữ pháp** (`grammar`) — bài học (`lessons`), Part 5 (`quiz`), sổ lỗi sai (`review`).
5. **Luyện đề** (`lab`) — Part 3/4/6/7 (`practice`), thi thử (`mock`).
6. **Ghi chú** (`notes`).

Giáo viên AI (`teacher`) và Cài đặt (`settings`) là lối vào ở header, như cấu trúc nguồn. **Không bỏ nhóm hoặc thay đổi đích điều hướng.** Nút quay lại phải đưa về hub nhóm như hiện tại.

### 4.2 Tablet và mobile

- Tablet: sidebar thu gọn thành icon rail hoặc drawer; card giảm số cột.
- Mobile: giữ thanh điều hướng dưới với 6 nhóm như hệ thống hiện tại; topbar gọn, nội dung một cột.
- Vùng bấm tối thiểu khoảng 44×44px; không che nút nộp bài, audio player hoặc bàn phím nhập liệu.
- Các trang Reading/Podcast có thể chuyển giữa tab nội dung và câu hỏi nếu không đủ chiều ngang.

## 5. TRANG CHỦ HOME — TRỌNG TÂM REDESIGN

**Mục tiêu:** trong 5 giây người học biết buổi hiện tại, mục cần làm tiếp, tiến độ 600+, số thẻ cần ôn và trạng thái học tập.

### 5.1 Cấu trúc Desktop

```text
┌──────────────── SIDEBAR ───────────────┬────────────────────────── TOPBAR ──────────────────────────────┐
│ TOEIC QUEST                            │ Dashboard                     Level / XP  Streak   AI  Settings │
│ Trang chủ                              ├────────────────────────────────────────────────────────────────┤
│ Học thẻ                                │ HERO: ROAD TO TOEIC 600+                                       │
│ Trò chơi                               │ Buổi hiện tại • Giai đoạn • Tiến độ • [TIẾP TỤC HỌC]          │
│ Ngữ pháp                               ├──────────────────────┬───────────────────┬─────────────────────┤
│ Luyện đề                               │ XP / Level           │ Streak            │ Thẻ đến hạn / mới   │
│ Ghi chú                                ├──────────────────────┴───────────────────┴─────────────────────┤
│                                        │ NHIỆM VỤ BUỔI HIỆN TẠI     │ LỘ TRÌNH 14 TUẦN                │
│                                        │ Mục 1 / Mục 2 / ...        │ 4 giai đoạn + trạng thái        │
│                                        ├────────────────────────────┴───────────────────────────────────┤
│                                        │ BIỂU ĐỒ 14 NGÀY XP / THẺ  │ HUY HIỆU / THÀNH TÍCH            │
└────────────────────────────────────────┴────────────────────────────────────────────────────────────────┘
```

### 5.2 Hero

- Headline **ROAD TO TOEIC 600+**; tên giai đoạn và buổi hiện tại.
- Thanh tiến độ lấy từ **dữ liệu thật** (không hardcode % minh họa).
- CTA **Tiếp tục buổi học** mở `plan` hoặc đúng màn học tiếp theo đã được xác định bằng logic hiện tại.
- Hiển thị trạng thái **đi trước / đúng / chậm** nếu đã có dữ liệu tính toán; không biến nó thành điều kiện khóa.
- Trang trí có thể dùng lưới kỹ thuật, đường chéo, biểu tượng huy hiệu; tránh hình minh họa chiếm diện tích lớn.

### 5.3 Stat cards

- XP hiện tại và thanh tiến độ đến level kế tiếp.
- Level và danh hiệu hiện có: Newbie, Intern, Office Worker, Team Lead, Manager.
- Streak hiện tại.
- Thẻ SRS đến hạn, từ mới còn có thể học theo hạn mức.
- Mục tiêu thẻ ngày và tiến độ hoàn thành (nếu dữ liệu có).

### 5.4 Buổi học và lộ trình

- Card **Buổi hiện tại**: số buổi, thời lượng, danh sách mục và trạng thái.
- Card **14 tuần / 4 giai đoạn**: Nền tảng (tuần 1–4), Xây dựng (5–9), Tăng tốc (10–13), Về đích (14).
- Không biến các giai đoạn thành các mốc điểm cố định tự tạo; mục tiêu gốc lần lượt 250–300, 400–450, 500–550, 600+.
- Bước tiếp theo phải phản ánh `sessionNo`, `planDone`, `sessionDone` thực tế.

### 5.5 Biểu đồ và huy hiệu

- Biểu đồ XP và số thẻ 14 ngày gần nhất.
- Khu vực huy hiệu hiển thị từ **17 huy hiệu** có thật, phân biệt đã đạt/chưa đạt.
- Không hiển thị bảng xếp hạng người chơi khác (ứng dụng chỉ có một người dùng).

## 6. TRANG KẾ HOẠCH PLAN — “MISSION BOARD”

Đây là màn quan trọng nhất sau Home. Biến mỗi **buổi học** thành một **mission**, mỗi mục trong buổi là một nhiệm vụ con.

- Header: **SESSION 0XX**, tuần, giai đoạn, chế độ **Chỉ học (60 phút cơ bản)** / **Có game (90 phút cơ bản)**.
- Thanh tiến độ: số mục đã hoàn thành / tổng số mục.
- Danh sách mục: icon, tên, hướng dẫn ngắn, thời lượng, CTA Bắt đầu, trạng thái.
- Với mục có **gate**: badge `Cần ≥ 70%`, tiến độ số câu đã làm và số câu tối thiểu nếu có dữ liệu; **không hiển thị checkbox cho tick thủ công**.
- Với mục không có gate: giữ khả năng tự tick như logic gốc.
- Mục khóa: icon khóa + giải thích điều kiện; không dùng chỉ một màu xám.
- Từ buổi 2: hiển thị bước kiểm tra lại các buổi trước; nếu thiếu từ thì giữ tùy chọn **Bỏ qua bước này** đúng điều kiện gốc.
- Sau khi hoàn thành toàn bộ mục: hiệu ứng xác nhận ngắn, thông báo **+30 XP**, nút **Sang buổi tiếp theo**.
- Có preview 7 buổi như hệ thống hiện tại; không mở buổi tiếp theo khi chưa đủ điều kiện.
- Không gọi các buổi là “ngày” vì tiến trình dựa trên số buổi, không phụ thuộc ngày thực.

## 7. FLASHCARDS VÀ KIỂM TRA TỪ VỰNG

### 7.1 Flashcards — “WORD TRAINING”

- Thẻ từ là trọng tâm, có trạng thái **mặt trước / mặt sau** rõ ràng; animation lật 180–250ms, có thể tắt khi giảm chuyển động.
- Mặt trước: từ tiếng Anh, phiên âm, nút phát âm.
- Mặt sau: loại từ, nghĩa, ví dụ, dịch ví dụ.
- Bốn nút đánh giá giữ nguyên: **Quên / Khó / Nhớ / Dễ**, màu và icon khác nhau, kích thước lớn.
- Tiến độ lượt học, số thẻ đến hạn và số từ mới được hiển thị trên cùng.
- Không đổi XP: Quên +1, Khó +3, Nhớ +5, Dễ +6; từ mới nhớ được có thưởng theo logic hiện tại.
- Không đổi SRS hoặc lịch ôn.

### 7.2 Kiểm tra từ (`check`)

- Layout câu hỏi lớn, progress câu số n/tổng, loại câu hỏi và đáp án.
- Hỗ trợ đủ 5 hình thức: nhớ nghĩa, phiên âm, nghe & viết, áp dụng, mặt chữ.
- Đáp án trắc nghiệm thành các lựa chọn lớn; câu gõ có input nổi bật và nút nghe.
- Sau trả lời hiển thị **giải thích mọi đáp án**, không chỉ đáp án đúng.
- Với câu gõ, giữ phần so sánh ký tự sai/thiếu.
- Kết quả: phần trăm đạt, trạng thái gate **≥70%**, CTA làm lượt khác nếu chưa đạt.

## 8. GAMES HUB — “TRAINING ARCADE”

Hub dạng grid card cho các chức năng đã có: Ghép từ–nghĩa, Nghe & gõ, Sắp xếp câu, Chép chính tả, Part 2, Podcast, Radio.

- Mỗi card có tên, mô tả 1 dòng, icon, thời lượng hoặc quy tắc, CTA **Bắt đầu**.
- Ghép từ: bảng hai cột, đồng hồ 60 giây, combo, điểm; ghép sai phản hồi rõ nhưng không nhấp nháy quá mạnh.
- Nghe & gõ: audio rõ, input lớn, đồng hồ 60 giây, kỷ lục.
- Sắp xếp câu: các token từ có thể thao tác dễ dàng, 8 câu/lượt, vùng ghép câu nổi bật.
- Chép chính tả: player, ô nhập, so sánh từ đúng/sai theo LCS; giữ ngưỡng đúng 90%.
- Radio: player tối giản, điều chỉnh tốc độ, bật/tắt nghĩa và ví dụ; không gán điểm vì chế độ này không tính điểm.
- Các kỷ lục phải lấy từ `best` hiện có, không tạo điểm giả.

## 9. LISTENING, READING VÀ UNITVIEW

`UnitView` là màn dùng chung cho Part 2–7. Thiết kế lại thành **Exam Workspace**: sạch, tập trung, có phân vùng rõ ràng.

### 9.1 Listening Part 2/3/4

- Player ở vùng dễ thấy; câu hỏi và lựa chọn rõ ràng.
- Part 2: **giữ cơ chế ẩn lựa chọn cho tới khi nộp** như mô tả hệ thống; UI không được làm lộ sớm.
- Part 3/4: sau khi nộp mới hiện transcript, giải thích, tóm tắt tiếng Việt.
- Hiển thị trạng thái phát/tạm dừng/đang tải, có phản hồi khi không có giọng TTS phù hợp.

### 9.2 Reading Part 6/7

- Desktop hai cột: đoạn đọc ở trái (khoảng 55%), câu hỏi ở phải (45%).
- Passage có vùng cuộn riêng nếu dài, typography dễ đọc, line-height 1.65–1.8.
- Mobile: passage và câu hỏi xếp dọc hoặc chuyển tab, vẫn dễ đối chiếu.
- Part 6 giữ các vị trí trống `[1] [2] [3]`; Part 7 giữ nội dung và câu hỏi theo `Unit`.

### 9.3 Part 5 và ngữ pháp

- Trang bài ngữ pháp: chia section Quy tắc, Ví dụ, Mẹo; đánh dấu đã học giữ +10 XP.
- Part 5: hiển thị **5 tim**, 10 câu/lượt, trạng thái chủ đề, giải thích ngay; mất tim khi sai, hết tim kết thúc theo logic hiện có.
- Sổ lỗi sai: danh sách câu cần ôn, tiến độ trả lời đúng liên tiếp; giữ quy tắc **đúng 2 lần liên tiếp mới xóa**.

## 10. THI THỬ RÚT GỌN — “MOCK EXAM”

- Header có đồng hồ 35 phút, số câu đã làm, trạng thái đang thi.
- Khu vực nội dung câu hỏi rộng, điều hướng câu hỏi dễ thao tác.
- Không hiện đáp án/giải thích trước khi nộp.
- Giữ quy tắc audio thi thử và số lượng bài theo nguồn (khoảng 35–37 câu).
- Kết quả: điểm ước tính, tỉ lệ đúng, Listening/Reading, phân tích theo Part, danh sách câu sai, nút hỏi AI khi khả dụng.
- **Gắn nhãn rõ:** điểm quy đổi là **ước tính rất thô**, không phải điểm TOEIC chính thức.
- Không dùng hiệu ứng gây mất tập trung khi đồng hồ đang chạy.

## 11. PODCAST — “LISTENING STUDIO”

- Cấu trúc: **Danh sách 14 tập → lưới đoạn (453 đoạn) → màn học đoạn**.
- Màn đoạn có 5 tab/chế độ **Nghe / Điền từ / Chép / Nhại / Học**.
- Player hiển thị waveform trang trí nếu có thể dựng nhẹ; không bắt buộc phân tích audio thật. Điều khiển gốc: tốc độ 0,75–1,15; tua ±5 giây; ẩn/hiện transcript; bấm câu để nghe riêng.
- Nghe: transcript theo câu, từ trong kho được đánh dấu, nút ghi chú và báo sai.
- Điền từ: câu bị ẩn một từ, input và phản hồi.
- Chép: nhập câu và tô sai; giữ ngưỡng đúng ≥85%.
- Nhại: phát – khoảng im lặng – lặp 3 lần; trạng thái bước hiện rõ.
- Học: danh sách từ trong đoạn, phát âm, nghĩa, ví dụ, **+ Ôn**.
- Hoàn thành đoạn: giữ **+8 XP** và `podcastDone`.
- Trạng thái thiếu `index.json`/audio phải có empty state hoặc thông báo đúng, không hiển thị dữ liệu giả.

## 12. NOTES, TEACHER, PROGRESS, SETTINGS

### 12.1 Notes — “KNOWLEDGE VAULT”

- Danh sách ghi chú, tìm kiếm, nhãn; editor dễ đọc.
- Hiển thị Markdown rút gọn; giữ cú pháp cloze `[[...]]` và ôn SRS của ghi chú.
- Nút tạo ghi chú từ câu hỏi/từ/podcast giữ luồng hiện có.

### 12.2 Teacher — “AI COACH”

- Giao diện chat hiện đại, phân biệt người học và AI, khối nội dung dễ đọc.
- Các chế độ hiện có: chat, roleplay (7 tình huống), explain, word, weekly.
- Có trạng thái **chưa cấu hình API**, lỗi mạng, đang xử lý; không giả lập AI đã hoạt động.
- Giao diện nhập vai nói có nút microphone và trạng thái nhận dạng giọng nói; tôn trọng quyền truy cập trình duyệt.

### 12.3 Progress — “PERFORMANCE CENTER”

- Tóm tắt XP/Level/Streak, từ đã học, từ hay quên, tiến độ podcast và ngữ pháp.
- Biểu đồ 14 ngày; độ chính xác theo mảng; cảnh báo điểm yếu khi đủ dữ liệu theo quy tắc nguồn (≥5 câu và <70%).
- Lịch sử thi thử; mục **Học tiếp từ đâu**.
- Không tạo số liệu từ dữ liệu không có trong state.

### 12.4 Settings

- Mục tiêu từ mới/ngày, thẻ/ngày, chế độ thời lượng kế hoạch.
- Trạng thái lưu localStorage/file, xuất/nhập JSON, danh sách báo sai, xóa tiến độ.
- Hành động xóa dữ liệu có dialog xác nhận rõ ràng.
- Không thay đổi quy trình sao lưu, API hoặc bảo vệ dữ liệu.

## 13. COMPONENT SYSTEM ĐỀ XUẤT

Có thể xây các component UI dùng chung trong `src/components/ui/` (đây là **đề xuất tổ chức frontend**, không phải cấu trúc hiện tại được xác nhận):

- `AppShell`, `Sidebar`, `Topbar`, `MobileNav`, `PageHeader`
- `StatCard`, `MissionCard`, `LessonCard`, `GameCard`, `PhaseTimeline`
- `ProgressBar`, `XPBar`, `StatusBadge`, `LevelBadge`, `AchievementBadge`
- `PrimaryButton`, `SecondaryButton`, `IconButton`, `ConfirmDialog`, `Toast`
- `AudioPlayer`, `AnswerOption`, `QuestionNavigator`, `ExamLayout`
- `EmptyState`, `LoadingSkeleton`, `ErrorState`, `SectionHeading`

Component phải nhận dữ liệu và callback từ màn hình hiện tại, **không tự viết lại logic nghiệp vụ**. Tránh tạo store song song.

## 14. TƯƠNG TÁC, ACCESSIBILITY VÀ HIỆU NĂNG

- Hover 120–180ms, chuyển panel 180–250ms; animation thưởng XP ngắn và không che nội dung.
- Hỗ trợ `prefers-reduced-motion`.
- Tương phản chữ đạt mức dễ đọc; có focus ring khi dùng bàn phím.
- Button có nhãn hoặc `aria-label`; form có label; trạng thái đúng/sai/khóa có chữ đi kèm.
- Không tự phát âm thanh trang trí khi chuyển trang; giữ các âm thanh nghiệp vụ vốn có.
- Không tạo hiệu ứng blur/glow nặng trên toàn màn hình; không khiến audio giật hoặc timer lệch.
- Đảm bảo dữ liệu vẫn hiển thị đúng khi chưa có tiến độ, đã hoàn thành buổi, thiếu podcast, AI chưa cấu hình, API lưu file lỗi.
- Kiểm tra ở desktop 1440px/1280px, tablet 768px và mobile 390px/360px; kiểm tra cả màn hình dài có bàn phím ảo.

## 15. QUY TRÌNH TRIỂN KHAI REDESIGN

**Giai đoạn 1 — Nền tảng:** tạo design tokens, typography, buttons, cards, badge, progress, AppShell; thay navigation desktop/mobile nhưng giữ `Tab`.

**Giai đoạn 2 — Dashboard:** redesign Home, Plan, Progress; đây là các màn thể hiện rõ phong cách mới nhất.

**Giai đoạn 3 — Học tập:** Flashcards, Check, GamesHub và từng game; đảm bảo điều khiển bàn phím, TTS, phản hồi đúng/sai.

**Giai đoạn 4 — Luyện TOEIC:** Grammar, Part 5, sổ lỗi sai, UnitView, Part 2–7, Mock; ưu tiên dễ đọc và giữ gate.

**Giai đoạn 5 — Nội dung bổ trợ:** Podcast, Radio, Notes, Teacher, Settings.

**Giai đoạn 6 — Kiểm thử:** responsive, dữ liệu, các luồng nghiệp vụ, audio, lưu tiến độ, hiệu năng.

## 16. TIÊU CHÍ NGHIỆM THU

1. Desktop có Sidebar + Topbar + Dashboard nhiều cột thực sự, không chỉ phóng to giao diện mobile.
2. Mobile vẫn sử dụng được đủ 6 nhóm điều hướng và mọi màn hiện có.
3. Mọi tab, nút, form, audio, kiểm tra, game và thao tác lưu vẫn hoạt động như trước.
4. Gate ≥70%, điều kiện mở buổi, +30 XP khi xong buổi, SRS, tim Part 5, kỷ lục game và hoàn thành podcast không thay đổi.
5. Giao diện hiển thị số liệu từ store thật, không hardcode XP, streak, số buổi, điểm hay tiến độ.
6. Trang làm bài ưu tiên nội dung, không để hiệu ứng che câu hỏi, đáp án, đồng hồ hoặc transcript.
7. AI chưa cấu hình và podcast không khả dụng có trạng thái thông báo phù hợp.
8. `npm run build` thành công; kiểm tra trên trình duyệt thật các luồng quan trọng, vì tài liệu nguồn ghi chưa kiểm thử đầy đủ.
9. Không sửa hoặc làm mất dữ liệu `toeic-quest-v1` và file `progress/progress.json`.
10. Không đưa podcast riêng tư, khóa API hoặc dữ liệu tiến độ lên dịch vụ bên ngoài trong quá trình redesign.

## 17. PROMPT TRIỂN KHAI CHO AI LẬP TRÌNH

> Hãy redesign **chỉ frontend** của dự án TOEIC Quest theo tài liệu này. Trước tiên đọc mã nguồn thực tế (`src/App.tsx`, `src/screens/*`, `src/lib/store.ts`, `src/lib/plan.ts`, `src/lib/sessionGate.ts`, `src/lib/units.ts`) để đối chiếu. Giữ nguyên React 19 + TypeScript + Tailwind CSS 4 + Vite 8 và toàn bộ logic, state, dữ liệu, API, audio, SRS, gate, XP, tiến độ. Không thêm chức năng mới. Xây dựng design system Dark Gaming / Competitive với Inferno Orange; thiết kế Dashboard desktop có Sidebar, Topbar, hero, stat cards, mission board, roadmap, biểu đồ, huy hiệu; responsive mobile giữ 6 nhóm điều hướng. Redesign lần lượt từng màn theo tài liệu, kiểm thử từng luồng trước khi chuyển màn tiếp theo. Nếu một yêu cầu UI mâu thuẫn logic thực tế, ưu tiên giữ logic và báo lại sự khác biệt. Không dùng dữ liệu giả ở sản phẩm cuối.

---

**Ghi chú nguồn và giới hạn:** Tài liệu này dựa trên bản phân tích hệ thống người dùng cung cấp, **không phải kết quả kiểm tra trực tiếp toàn bộ mã nguồn**. Các giá trị màu, layout, font, component và thứ tự triển khai là **đề xuất redesign**. Các chức năng, số liệu và quy tắc nghiệp vụ nêu trong tài liệu được lấy từ bản phân tích hệ thống; cần đối chiếu mã nguồn khi triển khai.
