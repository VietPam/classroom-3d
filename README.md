# 🏫 Classroom 3D & 2.5D Hybrid (TikTok Live Educational Showdown)

Dự án mô phỏng sân khấu phòng học tương tác trực tiếp (Interactive TikTok Live Classroom Showdown) dành cho việc học từ vựng tiếng Anh. Hệ thống hỗ trợ 20 nhân vật học sinh Chibi đại diện cho khán giả bình chọn thời gian thực, tích hợp bộ phân bổ ghế tỷ lệ Hamilton (Largest Remainder Method), bộ tổng hợp âm thanh Web Audio API không có độ trễ, và giao diện 2.5D Hybrid tối ưu cho OBS Studio / TikTok Live.

---

## 📑 Mục Lục
1. [Tổng Quan Kiến Trúc & Quyết Định Thiết Kế](#-tổng-quan-kiến-trúc--quyết-định-thiết-kế)
2. [Điểm Khác Biệt Giữa Chế Độ 2.5D Mặc Định & 3D Fallback](#-điểm-khác-biệt-giữa-chế-độ-25d-mặc-định--3d-fallback)
3. [Cấu Trúc Thư Mục & Các Module Chính](#-cấu-trúc-thư-mục--các-module-chính)
4. [Tọa Độ & Thuật Toán Phối Cảnh 2.5D](#-tọa-độ--thuật-toán-phối-cảnh-25d)
5. [Hệ Thống Bình Chọn & Giả Lập TikTok Live](#-hệ-thống-bình-chọn--giả-lập-tiktok-live)
6. [Hướng Dẫn Cài Đặt, Chạy & Kiểm Thử](#-hướng-dẫn-cài-đặt-chạy--kiểm-thử)
7. [Quy Trình Triển Khai (Deployment)](#-quy-trình-triển-khai-deployment)
8. [Trạng Thái Hiện Tại & Bàn Giao Cho Agent Kế Tiếp](#-trạng-thái-hiện-tại--bàn-giao-cho-agent-kế-tiếp)

---

## 🏛️ Tổng Quan Kiến Trúc & Quyết Định Thiết Kế

Dự án lấy cảm hứng từ cấu trúc hiệu năng cao của repo chùa tham chiếu (`zane-tv/tiktok-live-temple-rpc`):
* **Vấn đề của 3D WebGL thuần trên livestream**: Tốn GPU render, chữ trên Smartboard 3D Canvas bị mờ răng cưa khi phóng to hoặc qua nén video OBS/TikTok, avatar 3D nặng khiến FPS tụt khi chạy máy yếu.
* **Giải pháp 2.5D Hybrid**:
  1. **Nền phòng học Matte Painting 2.5D**: Kết hợp gradient chiều sâu và đường vân phối cảnh sàn gỗ hướng tâm.
  2. **Bảng thông minh DOM Vector (`Smartboard2D.tsx`)**: Chữ siêu nét (zero blur), tự co giãn theo độ dài từ vựng tiếng Anh, hỗ trợ thanh tiến trình live vote và giải nghĩa tiếng Việt khi công bố kết quả.
  3. **4 Ô đáp án sàn đấu (`FloorPads2D.tsx`)**: Perspective 3D CSS góc nghiêng 15°, hiệu ứng phát sáng neon theo 4 màu chủ đề A (Vàng), B (Xanh dương), C (Xanh lá), D (Đỏ).
  4. **20 Nhân vật Chibi Vector (`ChibiAvatar2D.tsx`)**: Vẽ bằng SVG với 4 kiểu tóc, 5 phụ kiện (cam, nơ, kính, mũ cử nhân, hoa sen), biểu cảm mắt anime và 7 trạng thái hoạt hình mượt mà: `IDLE`, `WALKING`, `CELEBRATING`, `SHOCKED`, `WAVE`, `RAISE_HAND`, `DANCE`.
  5. **Động cơ hạt pháo hoa Canvas 2D (`ParticleEngine2D.tsx`)**: 60 FPS confetti nhẹ nhàng, tự động ngắt (`cancelAnimationFrame`) khi tab ẩn (`document.hidden`) để tiết kiệm 100% CPU.

---

## 🔀 Điểm Khác Biệt Giữa Chế Độ 2.5D Mặc Định & 3D Fallback

* **Mặc định (`URL: /`)**: Chế độ **2.5D Hybrid** siêu nhẹ, khởi động tức thì, nét căng ở mọi độ phân giải màn hình dọc 9:16.
* **Chế độ 3D WebGL (`URL: /?3d=1`)**: Kích hoạt canvas Three.js / React Three Fiber với không gian 3D đầy đủ và camera tự do.
* **Chế độ OBS Studio (`URL: /?obs=1`)**: Ẩn toàn bộ thanh dock điều khiển và nút bấm HUD, tối ưu làm Browser Source trong OBS Studio.

---

## 📂 Cấu Trúc Thư Mục & Các Module Chính

```
classroom-3d/
├── src/
│   ├── components/
│   │   ├── stage2d/                # 🔥 MODULE 2.5D HYBRID MỚI
│   │   │   ├── ClassroomStage2D.tsx# Sân khấu chính 2.5D điều phối học sinh, ô đáp án, bảng thông minh
│   │   │   ├── ChibiAvatar2D.tsx   # Nhân vật Chibi vector SVG & animation states
│   │   │   ├── Smartboard2D.tsx    # Bảng thông minh DOM sắc nét, responsive font
│   │   │   ├── FloorPads2D.tsx     # 4 Ô đáp án A/B/C/D nghiêng phối cảnh
│   │   │   ├── ParticleEngine2D.tsx# Canvas 2D bắn pháo hoa giấy confetti
│   │   │   └── types2d.ts          # Ma trận tọa độ 2.5D, slot đứng và vị trí bàn học
│   │   ├── 3d/                     # MODULE 3D THREE.JS (Fallback mode ?3d=1)
│   │   │   ├── ClassroomScene.tsx  # Không gian phòng học 3D WebGL
│   │   │   ├── StudentAvatar.tsx   # Model học sinh 3D
│   │   │   ├── Room.tsx            # Phòng học 3D
│   │   │   └── CameraRig.tsx       # Điều khiển chuyển động camera 3D
│   │   └── ui/                     # GIAO DIỆN ĐIỀU KHIỂN & GIẢ LẬP
│   │       ├── HUD.tsx             # Thanh điều khiển kịch bản, emote nhanh (Chào, Giơ tay, Vũ đạo)
│   │       └── SimulatorDock.tsx   # Bảng giả lập comment TikTok Live (A, B, C, D)
│   ├── modules/
│   │   └── voting/
│   │       ├── votingEngine.ts     # Thuật toán Hamilton (Largest Remainder) chia 20 học sinh
│   │       ├── votingParser.ts     # Bộ chuẩn hóa tiếng Việt Unicode & bóc tách cú pháp bình chọn
│   │       └── votingTypes.ts      # Định nghĩa kiểu dữ liệu phiếu bầu
│   ├── audio/
│   │   ├── audioEngine.ts          # Bộ tổng hợp Web Audio API (vỗ tay, reo hò, ting đúng, còi sai)
│   │   └── useAudio.ts             # Hook âm thanh
│   ├── data/
│   │   ├── studentsData.ts         # Danh sách 20 học sinh Chibi với ngoại hình cá nhân hóa
│   │   └── quizConfig.ts           # Ngân hàng câu hỏi (Đồng nghĩa, Trái nghĩa, Điền từ)
│   ├── hooks/
│   │   └── useClassroomStore.ts    # Central Zustand/React State Store quản lý toàn bộ vòng lặp lớp học
│   ├── types/
│   │   └── classroom.ts            # Kiểu dữ liệu trung tâm
│   ├── App.tsx                     # Entrypoint rẽ nhánh 2.5D Hybrid vs 3D (?3d=1)
│   └── index.css                   # Tailwind v4 configuration
├── verify-2d-hybrid.mjs            # Puppeteer E2E script kiểm thử tự động toàn diện
├── package.json
└── vite.config.ts
```

---

## 📐 Tọa Độ & Thuật Toán Phối Cảnh 2.5D

Các tọa độ được thiết kế chuẩn tỉ lệ khung hình 9:16 (520px x 960px) tại [`src/components/stage2d/types2d.ts`](file:///home/antigravity/classroom-3d/src/components/stage2d/types2d.ts):

### 1. Nhịp điệu chiều dọc (Vertical Rhythm)
* **Bảng thông minh (`Smartboard2D`)**: `Y = 1.5% - 28%`
* **4 Ô đáp án (`FloorPads2D`)**: `Y = 30.5% - 41%` (Tâm ô `Y = 36%`)
* **Vị trí 4 hàng bàn học (`DESK_2D_POSITIONS`)**:
  - Hàng 1: `Y = 49%` (Tỉ lệ scale: `0.81x`)
  - Hàng 2: `Y = 57.5%` (Tỉ lệ scale: `0.87x`)
  - Hàng 3: `Y = 66%` (Tỉ lệ scale: `0.93x`)
  - Hàng 4: `Y = 74.5%` (Tỉ lệ scale: `0.98x`)
* **Thanh điều khiển HUD**: `Y = 81% - 98%` (Cách xa Hàng 4, tuyệt đối không bị chồng đè)

### 2. Tâm 4 ô đáp án (`ZONE_2D_CENTERS`)
* Ô A: `X = 14.0%`, `Y = 36.0%`
* Ô B: `X = 38.0%`, `Y = 36.0%`
* Ô C: `X = 62.0%`, `Y = 36.0%`
* Ô D: `X = 86.0%`, `Y = 36.0%`

### 3. Ma trận vị trí đứng của 20 học sinh trong mỗi ô (`ZONE_SLOT_2D_OFFSETS`)
Gồm 4 hàng x 5 vị trí:
* `dx`: `[-4.8%, -2.4%, 0%, +2.4%, +4.8%]`
* `dy`: `[-1.6%, -0.4%, +0.8%, +2.0%]`
Đảm bảo khi cả 20 học sinh dồn vào một ô duy nhất (100% vote), toàn bộ các bạn vẫn đứng gọn gàng bên trong ô phát sáng.

---

## 🗳️ Hệ Thống Bình Chọn & Giả Lập TikTok Live

1. **Thuật toán Hamilton (Largest Remainder Method)**:
   - File: [`src/modules/voting/votingEngine.ts`](file:///home/antigravity/classroom-3d/src/modules/voting/votingEngine.ts)
   - Đảm bảo tổng số học sinh chia về 4 ô A, B, C, D luôn luôn chính xác bằng đúng **20 bạn**, không bị sai số làm tròn số thập phân.
2. **Bộ bóc tách bình chọn tiếng Việt (`votingParser.ts`)**:
   - Tự động chuẩn hóa dấu tiếng Việt Unicode: `đáp án a`, `chọn B`, `c nhé`, `d thôi`, `câu a` -> nhận diện chính xác option `A | B | C | D`.
3. **Bảng giả lập tương tác (`SimulatorDock.tsx`)**:
   - Bấm nút icon Robot (`Bot`) ở góc dưới phải hoặc nhấn phím tắt `~` để mở.
   - Hỗ trợ thêm nhanh phiếu theo đợt (`+1`, `+5`, `+20` phiếu), gõ comment giả lập, hoặc bấm nút **Chạy đua (Race)** để kích hoạt học sinh rời bàn chạy vào ô.

---

## 🚀 Hướng Dẫn Cài Đặt, Chạy & Kiểm Thử

### 1. Cài đặt môi trường
```bash
cd /home/antigravity/classroom-3d
npm install
```

### 2. Khởi chạy máy chủ phát triển
```bash
npm run dev
```

### 3. Đóng gói kiểm tra TypeScript & Vite Build
```bash
npm run build
```
*(Yêu cầu: `tsc -b && vite build` phải hoàn tất với 0 lỗi).*

### 4. Chạy kiểm thử tự động Puppeteer E2E
```bash
node verify-2d-hybrid.mjs
```
Script sẽ khởi chạy Chromium headless với SwiftShader, mở cổng preview, mô phỏng bấm giả lập, chụp 6 ảnh screenshot lưu vào thư mục artifacts:
- `stage2d_01_initial_desks.png`: 20 học sinh ngồi ngay ngắn tại bàn.
- `stage2d_02_simulator_dock.png`: Bảng giả lập mở lên.
- `stage2d_03_votes_cast.png`: Phiếu bầu được nạp vào.
- `stage2d_04_students_at_pads.png`: Học sinh chạy tới đứng trên 4 ô A/B/C/D.
- `stage2d_05_celebrate_confetti.png`: Pháo hoa giấy nổ tung và học sinh ăn mừng nhảy cẫng.
- `stage2d_06_optional_3d_mode.png`: Chế độ 3D fallback `?3d=1`.

---

## 🌐 Quy Trình Triển Khai (Deployment)

Dự án được kết nối với repository GitHub và triển khai lên **Cloudflare Pages**:

* **Repository ứng dụng**: `VietPam/classroom-3d` (nhánh `main`)
* **Repository CI/CD**: `VietPam/repo-deploy-cloudflare`
* **URL Production chính thức**: [https://classroom-3d.pages.dev](https://classroom-3d.pages.dev)
* **Lệnh kích hoạt deploy Cloudflare**:
```bash
gh workflow run deploy-cloudflare.yml \
  --repo VietPam/repo-deploy-cloudflare \
  -f repository=VietPam/classroom-3d \
  -f ref=main \
  -f service_type=pages \
  -f project_name=classroom-3d \
  -f output_dir=dist
```
* **Lệnh theo dõi tiến trình build Cloudflare**:
```bash
gh run list --repo VietPam/repo-deploy-cloudflare --limit 1
gh run watch <run_id> --repo VietPam/repo-deploy-cloudflare
```

---

## 🤝 Trạng Thái Hiện Tại & Bàn Giao Cho Agent Kế Tiếp

### Các công việc đã hoàn thành:
1. Đã hoàn thiện toàn bộ mã nguồn 2.5D Hybrid tại `src/components/stage2d/`.
2. Đã khắc phục triệt để các lỗi giao diện:
   - Bàn học Hàng 4 không còn bị che bởi thanh nút HUD (`Chào`, `Phát Biểu`, `Vũ Đạo`).
   - Học sinh khi chạy tới sàn đấu đứng chính xác trên bề mặt phát sáng của các ô A, B, C, D.
   - Các từ vựng tiếng Anh dài (như `enormous`, `exhausted`) hiển thị responsive trọn vẹn, không bị cắt dấu ba chấm (`enor...`).
3. Đã giữ nguyên vẹn chế độ 3D fallback qua URL `?3d=1`.
4. Dự án biên dịch sạch 100% không cảnh báo lỗi type (`npm run build` thành công).

### Bước tiếp theo dành cho Agent tiếp quản:
1. **Commit & Push mã nguồn**:
   ```bash
   git add .
   git commit -m "feat: complete 2.5D hybrid classroom stage with chibi vector avatars and crisp smartboard"
   git push origin main
   ```
2. **Kích hoạt deploy lên Cloudflare Pages** bằng lệnh `gh workflow run` nêu ở mục trên.
3. **Kiểm tra production live** tại [https://classroom-3d.pages.dev](https://classroom-3d.pages.dev) và [https://classroom-3d.pages.dev/?3d=1](https://classroom-3d.pages.dev/?3d=1).
4. *(Tùy chọn mở rộng)*: Tích hợp WebSocket kết nối trực tiếp với TikTok Live Connector (thay thế SimulatorDock bằng comment thật từ TikTok Live room ID).
