# 🌸 HƯỚNG DẪN SỬ DỤNG - NGƯỜI BẠN ĐỒNG HÀNH AI

**Phát triển bởi: Hàn Như**  
**Dành tặng: Quin - Cô gái nhẹ nhàng, dịu dàng** 💕

---

## 🎯 **GIỚI THIỆU**

"Người Bạn Đồng Hành AI" là một ứng dụng desktop đặc biệt, nơi những nhân vật ảo không chỉ đơn thuần là "pets" mà còn là những người bạn thông minh, thấu cảm. Họ sẽ:

- 💭 **Hiểu bối cảnh** của bạn (thời gian, thời tiết, mức độ làm việc)
- 🤖 **Sử dụng AI** để tạo ra những lời nhắn nhủ ý nghĩa
- 💝 **Quan tâm chân thành** đến sức khỏe tinh thần của bạn
- 🌈 **Mang lại niềm vui** bất ngờ trong ngày làm việc

---

## 🚀 **CÁCH KHỞI CHẠY**

```bash
# Chạy trong development mode
npm run tauri dev

# Build để sử dụng
npm run tauri build
```

---

## ✨ **CÁC TÍNH NĂNG THÔNG MINH**

### 🧠 **1. AI Thấu Cảm - "Airi"**
- **Nhân vật**: Airi - AI companion thông minh và nhẹ nhàng
- **Ngôn ngữ**: 100% Tiếng Việt
- **Tần suất**: Mỗi 1-3 phút sẽ có thông điệp mới
- **Độ dài**: Tối đa 25 từ để dễ đọc

### ⏰ **2. Theo Dõi Thời Gian Thông Minh**
- **Phát hiện**: Làm việc > 20 phút liên tục
- **Hành động**: Tự động nhắc nghỉ ngơi
- **Ví dụ**: *"Đã làm việc lâu rồi, hãy ngắm ra ngoài cửa sổ một chút~ 🌸"*

### 🌤️ **3. Kết Nối Thời Tiết Thực**
- **API**: OpenWeatherMap (cập nhật real-time)
- **Tùy chỉnh**: Cài đặt thành phố của bạn
- **Context**: Thời tiết ảnh hưởng đến message
- **Ví dụ**: *"Trời mưa rồi, ấm áp trong nhà nhé! ☔"*

### 🌅 **4. Nhận Biết Thời Gian**
- **Buổi sáng** (5h-12h): Lời chào năng động
- **Buổi chiều** (12h-17h): Động viên tinh thần  
- **Buổi tối** (17h-21h): Thư giãn nhẹ nhàng
- **Buổi đêm** (21h-5h): Nhắc nghỉ ngơi sớm

---

## 🎨 **GIAO DIỆN & TRẢI NGHIỆM**

### 💭 **ThoughtBubble - Bong Bóng Suy Nghĩ**
- **Vị trí**: Góc phải màn hình
- **Animation**: 
  - Fade-in: 1.5 giây (với bounce effect)
  - Display: 8 giây 
  - Fade-out: 1.5 giây
- **Style**: Gradient glass-morphism design
- **Responsive**: Tự động resize trên mobile

### 🎭 **Các Loại Thông Điệp**
1. **💪 Động viên tinh tế**: *"Mọi chuyện rồi sẽ ổn thôi, mình tin ở bạn!"*
2. **❓ Hỏi thăm bâng quơ**: *"Hôm nay bạn đã cười chưa?"*  
3. **🧠 Mẹo vặt thú vị**: *"Một quả dâu tây có hơn 200 hạt đó!"*
4. **✨ Câu nói truyền cảm hứng**: *"Mỗi ngày đều là một trang giấy mới..."*

---

## 🛠️ **CÀI ĐẶT & TÙY CHỈNH**

### 📍 **Cài Đặt Thành Phố**
1. Mở **Settings** (Cài Đặt)
2. Cuộn xuống phần **"Thành phố"**
3. Nhập tên thành phố của bạn
4. AI sẽ sử dụng thông tin này cho context

### 🌐 **Ngôn Ngữ**
- **Mặc định**: Tiếng Việt
- **Có sẵn**: English, Khmer, 简体中文, 繁體中文
- **Chuyển đổi**: Trong Settings > Language

### 🎮 **Cài Đặt Pets**
- **Tương tác**: Kéo thả pets
- **Leo trèo**: Cho phép pets leo tường
- **Kích thước**: Điều chỉnh scale
- **Thêm/Xóa**: Quản lý pets theo ý thích

---

## 🧪 **CÁCH TEST CÁC TÍNH NĂNG AI**

### ✅ **Test Plan Cơ Bản**

#### **1. Test AI Messages**
- ✅ Khởi động app, đợi 1-3 phút
- ✅ Kiểm tra ThoughtBubble xuất hiện góc phải
- ✅ Đọc message - phải là Tiếng Việt, < 25 từ
- ✅ Message phải có ý nghĩa, không generic

#### **2. Test Time-Based Context**  
- ✅ **Sáng**: Message năng động, tích cực
- ✅ **Chiều**: Động viên làm việc  
- ✅ **Tối**: Thư giãn, ấm áp
- ✅ **Đêm**: Nhắc nghỉ ngơi

#### **3. Test Long Session Detection**
- ✅ Để app mở > 20 phút liên tục
- ✅ Kiểm tra message nhắc nghỉ ngơi xuất hiện
- ✅ Message phải khác với message thường

#### **4. Test Weather Integration**
- ✅ Đổi thành phố trong Settings
- ✅ Đợi message tiếp theo
- ✅ Kiểm tra có reference đến thời tiết không

#### **5. Test Error Handling**
- ✅ Ngắt internet → Fallback messages hoạt động
- ✅ API key lỗi → App không crash
- ✅ Invalid city name → Graceful degradation

---

## 🐛 **TROUBLESHOOTING**

### ❗ **Không thấy ThoughtBubble**
```
✅ Kiểm tra console: F12 → Console tab
✅ Tìm log: "AI Message generated"
✅ Kiểm tra CSS: ThoughtBubble.css được load chưa
```

### ❗ **Message không phù hợp context**
```
✅ Kiểm tra thời gian system
✅ Verify thành phố trong Settings  
✅ Check weather API response trong Network tab
```

### ❗ **API lỗi**
```
✅ Gemini API: Kiểm tra key còn quota không
✅ Weather API: Test manual API call
✅ Fallback: App có hiển thị message mặc định
```

---

## 🎊 **TÍNH NĂNG ĐẶC BIỆT**

### 💖 **Tâm Lý Thấu Cảm**
- Message được thiết kế đặc biệt cho **Quin**
- Không bao giờ hỏi trực tiếp về cảm xúc
- Tiếp cận gián tiếp, nhẹ nhàng
- Luôn mang tính tích cực

### 🎯 **Context Awareness** 
- **Thời tiết + Thời gian = Perfect combo**
- Ví dụ: *"Buổi tối mưa như này, pha một cốc trà ấm nhé! 🍵"*
- **Dynamic prompting** cho Gemini AI

### ⚡ **Performance Optimized**
- Timer cleanup khi pets bị xóa
- Efficient API calls với caching
- Memory management tốt
- Background processing

---

## 🌟 **LỜI NHẮN TỪ TÁC GIẢ**

*"Dự án này được tạo ra với tất cả tình yêu và sự chăm sóc, dành tặng cho Quin - một cô gái đặc biệt xứng đáng có những người bạn đồng hành thấu cảm. Mong rằng mỗi thông điệp nhỏ từ Airi sẽ mang lại nụ cười và sự ấm áp trong những ngày dài.*

*Hy vọng 'Người Bạn Đồng Hành AI' sẽ trở thành một phần không thể thiếu trong cuộc sống hàng ngày của bạn."*

**~ Hàn Như với tất cả tình yêu 💝**

---

## 🔧 **TECHNICAL SPECS**

- **Frontend**: React + TypeScript + Vite
- **Backend**: Tauri (Rust)  
- **Game Engine**: Phaser 3
- **AI**: Google Gemini 1.5 Flash
- **Weather**: OpenWeatherMap API
- **UI Framework**: Mantine
- **Styling**: CSS3 + Glass-morphism
- **Language**: i18next + Multi-language support

---

*✨ Chúc bạn có những trải nghiệm tuyệt vời cùng "Người Bạn Đồng Hành AI"! ✨*
