# 🎧 NGÂN HÀNG ÂM THANH HIỆU ỨNG (SFX REGISTRY)

Thư mục này là **Nguồn Chân Lý Duy Nhất (SSOT)** về toàn bộ **28 hiệu ứng âm thanh (Sound Effects - SFX)** dùng chung cho các ứng dụng sản xuất video ngắn và truyền thông tương tác trong hệ sinh thái.

---

## 1. Tiêu Chuẩn Kỹ Thuật (Technical Invariants)
* **Độ trễ đầu (Zero Silence Delay)**: Cắt sạch khoảng lặng đầu tệp, đảm bảo phát ra tức thì tại frame 0 khi gọi lệnh.
* **Tối ưu dung lượng**: Tất cả các file đều $< 65\text{ KB}$, tốc độ nạp nhanh, chống giật lag bộ nhớ đệm.
* **Cấu hình máy đọc**: Toàn bộ thuộc tính kỹ thuật được định nghĩa chuẩn hóa tại [`sfx-catalog.json`](./sfx-catalog.json).

---

## 2. Bảng Danh Mục 28 Hiệu Ứng Âm Thanh

| Nhóm (Category) | Mã định danh (`id`) | Tên tệp | Thời lượng | Âm lượng chuẩn (`volume`) | Ngữ cảnh sử dụng |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Chuyển cảnh & Motion** | `whoosh_fast` | `whoosh_fast.mp3` | 0.86s | `0.22` | Gió vút nhanh khi chuyển cảnh hoặc lướt trang |
| | `throwing_sound` | `throwing_sound.mp3` | 0.74s | `0.22` | Quăng/ném thẻ bài học hoặc sticker vào khung hình |
| | `card_slide` | `card_slide.mp3` | 0.34s | `0.20` | Trượt êm ái khi thẻ bài học xuất hiện |
| **Giao diện & UI** | `pop_soft` | `pop_soft.mp3` | 0.31s | `0.25` | Chữ, icon hoặc badge nảy ra trên màn hình |
| | `click_ui` | `click_ui.mp3` | 0.18s | `0.25` | Nhấp chọn nút bấm hoặc ô tương tác |
| | `keyboard_tap` | `keyboard_tap.mp3` | 0.84s | `0.18` | Gõ phím nhanh khi hiện nội dung đánh máy |
| | `marker_swipe` | `marker_swipe.mp3` | 1.06s | `0.20` | Quẹt bút dạ quang khi highlight từ khóa cốt lõi |
| | `piuw` | `piuw.mp3` | 0.46s | `0.25` | Bắn laser hoạt hình cho mũi tên chỉ dẫn |
| **Meme & Hài hước** | `cat_huh` | `cat_huh.mp3` | 0.34s | `0.40` | Tiếng "Huh?" ngơ ngác khi gặp tình huống lạ |
| | `bonk` | `bonk.mp3` | 0.42s | `0.30` | Gõ đầu hài hước khi gặp lỗi ngớ ngẩn |
| | `dry_fart` | `dry_fart.mp3` | 0.34s | `0.30` | Tiếng xì hơi châm chọc cách diễn đạt quê xệ |
| | `mac_quack` | `mac_quack.mp3` | 0.44s | `0.28` | Tiếng vịt cạp ngộ nghĩnh ngắt lời hoặc biểu thị ngơ ngác |
| | `pop_mouth` | `pop_mouth.mp3` | 0.44s | `0.30` | Tiếng búng miệng vui nhộn |
| | `rizz_sound` | `rizz_sound.mp3` | 1.49s | `0.28` | Riff guitar điện khi đưa ra câu tiếng Anh chuẩn ngầu |
| **Kịch tính & Tác động** | `vine_boom` | `vine_boom.mp3` | 1.23s | `0.30` | Nổ trầm kinh điển ngắt quán tính lướt ở Hook |
| | `dun_dun_dun` | `dun_dun_dun.mp3` | 3.45s | `0.22` | Kèn ba nốt báo hiệu bước ngoặt bất ngờ |
| | `among_us_role` | `among_us_role.mp3` | 2.35s | `0.24` | Âm thanh bí ẩn khi đặt câu hỏi nghi vấn |
| | `record_scratch` | `record_scratch.mp3` | 0.63s | `0.25` | Cào đĩa than đột ngột khi ngắt mạch suy nghĩ |
| | `punch_sound` | `punch_sound.mp3` | 0.53s | `0.28` | Cú đấm uy lực khi nói về va chạm, tranh cãi |
| | `bone_crack` | `bone_crack.mp3` | 0.55s | `0.25` | Bẻ khớp khi nói về cày cuốc, kiệt sức |
| **Công nghệ & Báo lỗi** | `loading_lost` | `loading_lost.mp3` | 2.54s | `0.22` | Treo máy khi người học bị đứng hình quên từ |
| | `windows_error` | `windows_error.mp3` | 0.94s | `0.22` | Báo lỗi Windows XP khi phạm lỗi ngữ pháp nặng |
| | `glitch` | `glitch.mp3` | 0.62s | `0.18` | Nhiễu sóng công nghệ khi chuyển pha |
| | `camera_shutter` | `camera_shutter.mp3` | 0.48s | `0.22` | Màn trập máy ảnh khi nhắc chụp màn hình lưu bài |
| **Game Show & Thưởng** | `ding_correct` | `ding_correct.mp3` | 1.30s | `0.22` | Chuông báo đáp án đúng hoặc cụm từ khuyên dùng |
| | `wrong_buzzer` | `wrong_buzzer.mp3` | 1.04s | `0.22` | Còi báo lỗi sai hoặc cách diễn đạt nên tránh |
| | `coin_reward` | `coin_reward.mp3` | 0.99s | `0.20` | Nhận xu thưởng khi vượt qua thử thách |
| | `ding_bell` | `ding_bell.mp3` | 1.83s | `0.18` | Chuông lễ tân báo mẹo học quan trọng |
