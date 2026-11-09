# 🏫 Classroom 3D

Mô phỏng không gian phòng học 3D tương tác với các chú Capybara chibi dễ thương, xây dựng trên nền tảng WebGL/Three.js và React.

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: Tailwind CSS
- **Code Quality**: Oxlint

## 🛠️ Cài Đặt & Phát Triển

```bash
# Cài đặt dependencies
npm install

# Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# Kiểm tra linting
npx oxlint

# Đóng gói sản phẩm (Production Build)
npm run build
```

## 📂 Cấu Trúc Dự Án

```
classroom-3d/
├── docs/                # Kế hoạch thiết kế và tài liệu tham khảo
├── public/              # Static assets
└── src/
    ├── components/
    │   ├── 3d/          # Các đối tượng 3D (Room, Desks, Capybara Avatars, CameraRig)
    │   └── ui/          # Giao diện HUD (Dock điều khiển góc nhìn)
    ├── data/            # Cấu hình danh sách học sinh & vị trí bàn học
    ├── hooks/           # State store quản lý góc nhìn và dữ liệu lớp học
    └── types/           # Định nghĩa TypeScript interface
```

## 🌐 Triển Khai (Deployment)

Dự án tự động triển khai lên **Cloudflare Pages** thông qua GitHub Actions pipeline (`.github/workflows/deploy.yml`).
