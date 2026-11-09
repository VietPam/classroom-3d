# 🎥 Sổ Tay Hướng Dẫn Góc Nhìn 3D & Camera POV (Camera Guide for Beginners)

> **Mục đích**: Tài liệu bỏ túi giải thích các thuật ngữ chuyên môn về góc nhìn 3D (POV), tiêu cự camera, và các kỹ thuật điều chỉnh camera trong dự án **Classroom 3D** giúp người mới bắt đầu dễ dàng mô tả và điều chỉnh khung hình chính xác theo ý muốn.

---

## 🔍 1. Phân Biệt 3 Kiểu "Zoom" Trong Không Gian 3D

Khi làm việc trong Three.js / WebGL, từ "Zoom" thông thường thực chất bao gồm 3 thao tác vật lý hoàn toàn khác nhau:

| Kỹ thuật | Bản chất vật lý | Minh họa đời thực | Hiệu ứng hình ảnh trong lớp học |
| :--- | :--- | :--- | :--- |
| **1. Dolly Zoom** <br>*(Thay đổi `position.z`)* | **Di chuyển thân camera** tiến lại gần hoặc lùi ra xa vật thể. | Giống như bạn **cầm điện thoại đi bộ lại gần** hoặc **lùi ra sau**. | • **Dolly Out (Lùi xa)**: Thấy nhiều sàn nhà hơn, hai bên tường mở rộng. Tỉ lệ phối cảnh không bị biến dạng.<br>• **Dolly In (Tiến gần)**: Lại sát lưng học sinh hoặc cận cảnh mặt bàn laptop. |
| **2. FOV / Optical Zoom** <br>*(Thay đổi `camera.fov`)* | **Thay đổi tiêu cự ống kính** (Field of View - Góc mở góc nhìn). | Giống như đứng yên một chỗ và **dùng 2 ngón tay pinch-zoom trên camera iPhone** ($0.5\times \leftrightarrow 1\times \leftrightarrow 3\times$). | • **FOV nhỏ ($40^\circ - 50^\circ$, Telephoto)**: Hình ảnh bị "nén phẳng", bảng đen và học sinh trông gần nhau hơn, ít bị méo viền.<br>• **FOV lớn ($65^\circ - 85^\circ$, Ultra-Wide)**: Góc siêu rộng bao quát cả phòng, nhưng viền mép màn hình hơi cong mắt cá (fisheye). |
| **3. Pedestal / Crane** <br>*(Thay đổi `position.y`)* | **Nâng cao hoặc hạ thấp** độ cao của camera theo trục thẳng đứng. | Giống như bạn **ngồi xổm xuống** hoặc **đứng lên ghế / giơ gậy selfie lên cao**. | • **Hạ thấp (Low-Angle)**: Camera ngang tầm mắt học sinh, bảng đen trông sừng sững, uy nghiêm.<br>• **Nâng cao (High-Angle)**: Camera từ trên cao chúc xuống, thấy rõ mặt bàn, bàn phím laptop và đỉnh đầu học sinh. |

---

## 🎬 2. Bảng Tra Cứu Nhanh Các Góc Máy (POV Cheat-Sheet)

Dưới đây là các từ khóa chuẩn bạn có thể dùng để yêu cầu điều chỉnh camera:

### A. Góc Toàn Cảnh (Overview / High-Angle Wide)
* **Mô tả**: Camera lùi xa ra phía sau ($Z \approx -6.0\text{m}$) và nâng cao ($Y \approx 2.5\text{m}$), chúc nhẹ mắt nhìn xuống sàn.
* **Mục đích**: Nhìn thấy toàn bộ lớp học, bao gồm bảng đen, bục giảng, lối đi trung tâm và cả 4 bộ bàn ghế.

### B. Góc Ngang Tầm Mắt (Eye-Level / Cinematic)
* **Mô tả**: Camera hạ xuống độ cao ngang tầm đầu học sinh ($Y \approx 1.2\text{m} - 1.5\text{m}$), hướng thẳng về phía trước.
* **Mục đích**: Tạo cảm giác như người xem đang đứng ở cuối lớp học hoặc ngồi ở hàng ghế sau nhìn lên bảng.

### C. Góc Cận Cảnh Qua Vai (Over-The-Shoulder - OTS)
* **Mô tả**: Camera đặt chếch sát phía sau vai của một học sinh cụ thể (ví dụ bàn A1 hoặc B1).
* **Mục đích**: Nhìn thấy rõ màn hình laptop đang phát sáng, đôi tay đang gõ phím/viết bài và xa xa là bảng đen.

### D. Góc Nghiêng Đẳng Cự (Isometric / Diorama View)
* **Mô tả**: Camera đặt lệch sang một góc $30^\circ - 45^\circ$ so với trục giữa lớp học.
* **Mục đích**: Biến lớp học thành một mô hình sa bàn đồ chơi (miniature model) có chiều sâu khối 3D rõ nét nhất.

---

## 📱 3. Nguyên Tắc Khung Hình Dọc TikTok / Reels / Shorts (9:16)

Khi sản xuất nội dung hiển thị trên điện thoại:
1. **Top Safe Zone ($10\% - 15\%$ Trên cùng)**:
   - Thường bị che bởi nút Search, tab *Following / For You*, icon Live.
   - 👉 **Nguyên tắc**: Đẩy mép trên của bảng đen chạm sát vùng này để triệt tiêu trần nhà thừa, không để nội dung văn bản quan trọng bị đè.
2. **Bottom Safe Zone ($15\% - 20\%$ Dưới cùng)**:
   - Thường bị che bởi thanh điều khiển âm thanh, caption, nút like, share và avatar kênh.
   - 👉 **Nguyên tắc**: Dành khoảng trống này cho sàn gỗ tiền cảnh và thanh điều hướng cảm ứng.
3. **Khu Vực Trung Tâm Vàng (Center Focus $70\%$)**:
   - Nửa trên là **Mặt Bảng Đen Khổng Lồ**: Dành cho bài giảng, câu đố, code, chữ text.
   - Nửa dưới là **Bàn Học & Laptop Phát Sáng**: Tạo không khí lớp học sinh động, cuốn hút.
