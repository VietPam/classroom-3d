# 📋 Kế Hoạch Triển Khai: Zoom Xa Góc Nhìn Mặc Định & Dọn Dẹp Codebase Legacy Toàn Diện

> **Mục tiêu**:
> 1. Thiết lập góc nhìn camera mặc định lùi xa ra phía sau (zoom-out) tái hiện chính xác $100\%$ bố cục không gian trong ảnh mẫu [`IMG_3207.png`](file:///home/antigravity/IMG_3207.png).
> 2. Rà soát, thanh lọc và xóa bỏ triệt để toàn bộ code legacy, file mồ côi (dead files), kiểu dữ liệu thừa (unused types), dữ liệu giả lập không còn dùng (mock data), và các thư viện npm dư thừa để đảm bảo codebase siêu tinh gọn, clean và hiện đại.

---

## 🔍 1. Phân Tích Hiện Trạng & Yêu Cầu

### A. Góc nhìn mặc định zoom xa ([`IMG_3207.png`](file:///home/antigravity/IMG_3207.png))
- Trong ảnh mẫu:
  - **Tiền cảnh (Foreground)**: Một khoảng sàn gỗ thênh thang chiếm khoảng $40\%$ chiều cao phía dưới màn hình, với thanh dock `[ 📷 Toàn Cảnh Orbit ] [ ⟳ ]` nổi bật ở chính giữa đáy.
  - **Trung cảnh (Middleground)**: Cụm 9 bàn học sinh Capybara thu gọn đặt tại trung tâm, cách camera một khoảng xa vừa tầm mắt, nhìn bao quát trọn vẹn từ trên cao xuống nhẹ nhàng.
  - **Hậu cảnh (Background)**: Sân khấu gỗ tối màu, mặt bảng đen thông minh siêu lớn trải dài toàn bộ chiều ngang lớp học, đồng hồ treo tường và trần nhà kèm các tấm tiêu âm hiện rõ phía trên.
  - **Hai bên (Walls)**: Thấy rõ góc tường xanh navy bên trái và tường bên phải.
- **Tọa độ camera tính toán chuẩn xác**:
  - **Vị trí (Position)**: $[0, 2.8, -6.5]$ (Mobile 9:16) và $[0, 2.6, -6.2]$ (Desktop 16:9).
  - **Điểm nhìn (Target / LookAt)**: $[0, 1.8, 3.5]$ (ngay tâm bục giảng và hàng ghế đầu).
  - **Góc ngước (Pitch)**: Nghiêng nhẹ xuống sàn $\approx 6^\circ$ tạo chiều sâu 3D đẳng cự cực kỳ thoáng đãng.
  - **OrbitControls**: Cho phép người dùng chạm/kéo xoay tự do quanh tâm $[0, 1.8, 3.5]$, giới hạn khoảng cách zoom `maxDistance = 22.0`. Khi bấm nút `⟳` hoặc `Toàn Cảnh Orbit`, camera lập tức khôi phục về đúng góc nhìn xa mặc định này.

---

### B. Danh mục rà soát code legacy cần dọn dẹp (Codebase Audit)

| Thành phần | Đường dẫn | Trạng thái | Hành động |
|---|---|:---:|---|
| **TeacherStation** | [`src/components/3d/TeacherStation.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/TeacherStation.tsx) | 162 dòng code bàn giáo viên cũ, chuông bấm, laptop (không còn dùng) | **[DELETE] Xóa hoàn toàn file** |
| **ScorecardModal** | [`src/components/ui/ScorecardModal.tsx`](file:///home/antigravity/classroom-3d/src/components/ui/ScorecardModal.tsx) | 124 dòng modal chấm điểm thi, nhận xét (không còn dùng) | **[DELETE] Xóa hoàn toàn file** |
| **SoundEngine** | [`src/audio/SoundEngine.ts`](file:///home/antigravity/classroom-3d/src/audio/SoundEngine.ts) | 273 dòng bộ tổng hợp âm thanh Web Audio kéo ghế, tiếng bước chân, chuông thi (không còn dùng) | **[DELETE] Xóa hoàn toàn file & thư mục `src/audio`** |
| **App.css** | [`src/App.css`](file:///home/antigravity/classroom-3d/src/App.css) | File CSS mẫu Vite/React thừa, không được import ở bất cứ đâu | **[DELETE] Xóa file** |
| **Unused Assets** | `src/assets/{hero.png, react.svg, vite.svg}` | File hình ảnh thừa từ boilerplate | **[DELETE] Xóa các file thừa** |
| **Legacy Types** | [`src/types/classroom.ts`](file:///home/antigravity/classroom-3d/src/types/classroom.ts) | Định nghĩa `StudentState`, `ExamQuestion`, `StudentScorecard`, `CameraMode`, `aisleWaypoint`, `submissionWaypoint`, `scorecard` | **[MODIFY] Rút gọn về `StudentData` thuần túy** |
| **Legacy Mock Data** | [`src/data/students.ts`](file:///home/antigravity/classroom-3d/src/data/students.ts) | 303 dòng code chứa dữ liệu mock bài thi Calculus, điểm số, nhận xét của 9 học sinh | **[MODIFY] Rút gọn còn ~75 dòng cấu hình vị trí & ngoại hình 3D** |
| **Avatar Dead Code** | [`src/components/3d/StudentAvatar.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentAvatar.tsx) | Đoạn code mesh bài thi cầm tay `isCarryingPaper` (dòng 516-540) | **[MODIFY] Xóa bỏ đoạn mesh thừa** |
| **Desk Dead Props** | [`src/components/3d/StudentDesk.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentDesk.tsx) | Props không dùng: `isHovered`, `hasPaper`, `chairPushedBack` | **[MODIFY] Đơn giản hóa props thành `{ position, seatId }`** |
| **Scene Cleanup** | [`src/components/3d/ClassroomScene.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/ClassroomScene.tsx) | Dọn sạch lời gọi `StudentDesk` và cập nhật logic | **[MODIFY] Đồng bộ props gọn gàng** |
| **Dead npm Packages** | [`package.json`](file:///home/antigravity/classroom-3d/package.json) | `canvas-confetti`, `@types/canvas-confetti`, `clsx`, `tailwind-merge` | **[MODIFY] Gỡ bỏ qua `npm uninstall`** |

---

## 🛠️ 2. Chi Tiết Kế Hoạch Chỉnh Sửa Từng File

### Component 1: Camera Zoom-Out ([`src/components/3d/CameraRig.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/CameraRig.tsx) & [`src/App.tsx`](file:///home/antigravity/classroom-3d/src/App.tsx))

#### [MODIFY] [`src/components/3d/CameraRig.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/CameraRig.tsx)
- Cập nhật vị trí ban đầu và điểm ngắm:
  ```typescript
  // Mobile portrait (9:16) zoom-out perspective matching IMG_3207.png
  initialCamPos.current.set(0, 2.8, -6.5);
  initialTarget.current.set(0, 1.8, 3.5);
  // Desktop landscape (16:9)
  initialCamPos.current.set(0, 2.6, -6.2);
  initialTarget.current.set(0, 1.8, 3.5);
  ```
- Cập nhật thông số OrbitControls:
  - `minDistance = 1.0`
  - `maxDistance = 22.0` (đảm bảo không bị giới hạn khi người dùng zoom xa)
  - `target = [0, 1.8, 3.5]`
  - Bổ sung logic lerp hoặc snap khi bấm nút reset để camera mượt mà lùi về đúng vị trí zoom-out.

#### [MODIFY] [`src/App.tsx`](file:///home/antigravity/classroom-3d/src/App.tsx)
- Cập nhật Canvas initial camera:
  ```typescript
  camera={{
    position: [0, 2.8, -6.5],
    fov: 68,
    near: 0.1,
    far: 50,
  }}
  ```

---

### Component 2: Thanh Lọc Kiểu Dữ Liệu & Data ([`src/types/classroom.ts`](file:///home/antigravity/classroom-3d/src/types/classroom.ts) & [`src/data/students.ts`](file:///home/antigravity/classroom-3d/src/data/students.ts))

#### [MODIFY] [`src/types/classroom.ts`](file:///home/antigravity/classroom-3d/src/types/classroom.ts)
- Xóa sạch: `StudentState`, `ExamQuestion`, `StudentScorecard`, `CameraMode`.
- Chỉ giữ lại interface `StudentData` thiết yếu cho việc render 3D:
  ```typescript
  export interface StudentData {
    id: string;
    name: string;
    seatId: string;
    gender: 'm' | 'f';
    skinTone: string;
    hairColor: string;
    hairStyle: 'short' | 'curly' | 'ponytail' | 'buzz';
    shirtColor: string;
    pantsColor: string;
    shoesColor: string;
    accessory?: 'orange' | 'lotus' | 'glasses' | 'scholar_hat' | 'red_bow' | 'none';
    capybaraTone?: string;
    deskPosition: [number, number, number];
  }
  ```

#### [MODIFY] [`src/data/students.ts`](file:///home/antigravity/classroom-3d/src/data/students.ts)
- Loại bỏ toàn bộ `scorecard: { ... }`, `aisleWaypoint`, `submissionWaypoint`.
- Chỉ lưu trữ các trường ngoại hình và tọa độ `deskPosition` của 9 học sinh. Giảm hơn $75\%$ dung lượng file.

---

### Component 3: Dọn Dẹp Model 3D ([`src/components/3d/StudentAvatar.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentAvatar.tsx) & [`src/components/3d/StudentDesk.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentDesk.tsx))

#### [MODIFY] [`src/components/3d/StudentAvatar.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentAvatar.tsx)
- Xóa bỏ biến `const isCarryingPaper = false;`.
- Xóa bỏ khối mesh bài thi cầm tay thừa (dòng 516-540).

#### [MODIFY] [`src/components/3d/StudentDesk.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/StudentDesk.tsx)
- Rút gọn interface:
  ```typescript
  interface StudentDeskProps {
    position: [number, number, number];
    seatId: string;
  }
  ```
- Bỏ các props thừa `isHovered`, `hasPaper`, `chairPushedBack`.

#### [MODIFY] [`src/components/3d/ClassroomScene.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/ClassroomScene.tsx)
- Gọi `<StudentDesk position={student.deskPosition} seatId={student.seatId} />` sạch sẽ và trực quan.

---

### Component 4: Xóa Bỏ Các File Mồ Côi & Thư Viện Dư Thừa

#### [DELETE] [`src/components/3d/TeacherStation.tsx`](file:///home/antigravity/classroom-3d/src/components/3d/TeacherStation.tsx)
#### [DELETE] [`src/components/ui/ScorecardModal.tsx`](file:///home/antigravity/classroom-3d/src/components/ui/ScorecardModal.tsx)
#### [DELETE] [`src/audio/SoundEngine.ts`](file:///home/antigravity/classroom-3d/src/audio/SoundEngine.ts) (và thư mục `src/audio/`)
#### [DELETE] [`src/App.css`](file:///home/antigravity/classroom-3d/src/App.css)
#### [DELETE] `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`

#### [MODIFY] Dependencies trong [`package.json`](file:///home/antigravity/classroom-3d/package.json)
- Chạy lệnh: `npm uninstall canvas-confetti @types/canvas-confetti clsx tailwind-merge`
- Tối ưu hóa dung lượng gói cài đặt và thời gian build của Vite.

---

## 🧪 3. Kế Hoạch Kiểm Thử & Xác Minh (Verification Plan)

### A. Kiểm thử tự động (Automated Verification)
1. **Kiểm tra TypeScript & Build Production**:
   ```bash
   npm run build
   ```
   Đảm bảo 0 lỗi TypeScript, 0 cảnh báo import mồ côi, bundle size giảm sâu.

2. **Chụp ảnh màn hình kiểm chứng thị giác (Visual Inspection)**:
   - Chạy script preview để chụp ảnh `mobile_zoom_out.png` và `desktop_zoom_out.png`.
   - Dùng tool `view_file` so sánh trực quan với [`IMG_3207.png`](file:///home/antigravity/IMG_3207.png):
     - [ ] Tiền cảnh sàn gỗ chiếm khoảng $40\%$ màn hình.
     - [ ] Cụm 9 học sinh Capybara thu gọn đặt tại trung tâm màn hình.
     - [ ] Bảng đen tối giản và bục giảng nằm gọn gàng tại nửa trên màn hình.
     - [ ] Thanh dock `Toàn Cảnh Orbit` & nút `⟳` nổi bật tại đáy màn hình.

3. **Deploy lên Cloudflare Pages & Chạy E2E Production Test**:
   - Commit & push lên repo `VietPam/classroom-3d`.
   - Kích hoạt pipeline GitHub Actions trên `VietPam/repo-deploy-cloudflare`.
   - Chạy `test-e2e-production.mjs` trên live URL `https://classroom-3d.pages.dev` kiểm tra 100% test cases pass.

### B. Kiểm thử thủ công (Manual Verification)
- Mở `https://classroom-3d.pages.dev` trên điện thoại di động:
  - Góc nhìn mở ra ngay lập tức là góc nhìn zoom xa thoáng đãng như [`IMG_3207.png`](file:///home/antigravity/IMG_3207.png).
  - Thử vuốt xoay 3D quanh lớp học, sau đó bấm `⟳` để kiểm tra camera khôi phục tức thì về góc nhìn xa mặc định.
