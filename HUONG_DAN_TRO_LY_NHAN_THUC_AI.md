# 🧠 HƯỚNG DẪN SỬ DỤNG TRỢ LÝ NHẬN THỨC AI

## 🎯 **GIỚI THIỆU**

**"Trợ Lý Nhận Thức AI"** là phiên bản nâng cấp cách mạng của "Người Bạn Đồng Hành AI", biến desktop của bạn thành một hệ sinh thái thông minh, thích ứng và tối ưu hóa workflow. Với 2 trụ cột chính đã triển khai trong Giai đoạn 1:

- **🔍 TRỤ CỘT I**: Nhận Thức Ngữ Cảnh Toàn Diện (Context Awareness)
- **⚡ TRỤ CỘT II**: Tối Ưu Hóa Luồng Công Việc (Workflow Optimization)

---

## 🚀 **TÍNH NĂNG MỚI - GIAI ĐOẠN 1**

### **1. 🧠 CONTEXT AWARENESS - NHẬN THỨC NGỮ CẢNH**

#### **📋 Clipboard Intelligence**
- **Tự động giám sát** clipboard của bạn
- **Phân tích thông minh** nội dung được copy:
  - 🔴 **Lỗi lập trình**: Tự động phát hiện và gợi ý khắc phục
  - 💻 **Code**: Phân tích và đưa ra nhận xét hữu ích
  - 📄 **Văn bản dài**: Tóm tắt thành 3 điểm chính
  - 🔗 **URL**: Nhận diện và đưa ra context phù hợp

#### **🪟 Active Window Detection**
- **Theo dõi ứng dụng** bạn đang sử dụng
- **Đưa ra gợi ý** dựa trên context làm việc
- **Thích ứng thông điệp** theo môi trường hiện tại

#### **💡 AI Context Suggestions**
- Thông điệp xuất hiện tự động khi phát hiện nội dung quan trọng
- Gợi ý không gây gián đoạn workflow
- Tích hợp seamless với ThoughtBubble system

---

### **2. 🎯 SCENARIOS MANAGEMENT - TỰ ĐỘNG HÓA WORKFLOW**

#### **📋 Quản Lý Kịch Bản Thông Minh**
- **Tab mới trong Settings**: "🎯 Quản Lý Kịch Bản"
- **3 kịch bản có sẵn**:
  - 🌅 **Bắt đầu ngày làm việc**: Spotify + Gmail + Calendar
  - 💻 **Khởi động Dev Environment**: VS Code + Terminal + GitHub + Projects
  - 🎵 **Thư giãn & Giải trí**: YouTube Music + Steam + Netflix

#### **⚡ Thực Thi Tự Động**
- **Một click** chạy toàn bộ workflow
- **5 loại action hỗ trợ**:
  - `open_app`: Mở ứng dụng
  - `open_url`: Mở website
  - `open_folder`: Mở thư mục
  - `run_command`: Chạy lệnh shell
  - `delay`: Tạm dừng giữa các hành động

#### **🤖 AI Suggestions cho Scenarios**
- Gợi ý kịch bản mới dựa trên ứng dụng đang sử dụng
- Phân tích workflow pattern và đề xuất tối ưu
- Tự động cập nhật suggestions theo thời gian

---

## 🛠️ **CÁCH SỬ DỤNG**

### **🔧 Khởi Tạo Trợ Lý Nhận Thức AI**

1. **Khởi chạy ứng dụng** "Người Bạn Đồng Hành AI"
2. **Trong 3 giây đầu**, bạn sẽ thấy thông báo:
   ```
   🧠 Trợ Lý Nhận Thức AI đã khởi động! Tôi sẽ giúp bạn tối ưu workflow.
   ```
3. **Context monitoring** sẽ tự động bắt đầu

### **📋 Sử Dụng Clipboard Intelligence**

#### **Test Phát Hiện Lỗi:**
1. **Copy đoạn text chứa lỗi**, ví dụ:
   ```
   TypeError: Cannot read property 'map' of undefined
   at Array.forEach (script.js:15)
   ```
2. **Trong 2-5 giây**, AI sẽ hiện suggestion:
   ```
   Lỗi JavaScript: Kiểm tra array null trước khi dùng map()
   ```

#### **Test Phân Tích Code:**
1. **Copy đoạn code**, ví dụ:
   ```javascript
   function calculateTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```
2. **AI sẽ phân tích** và đưa ra nhận xét hữu ích

#### **Test Tóm Tắt Văn Bản:**
1. **Copy đoạn văn bản dài** (>100 từ)
2. **AI sẽ hỏi**: "Mình thấy bạn vừa sao chép văn bản dài. Bạn có muốn tóm tắt không?"
3. **Tự động tóm tắt** thành 3 điểm chính

### **🎯 Sử Dụng Scenarios Management**

#### **Truy Cập Giao Diện:**
1. **Mở Settings** (Click icon Settings)
2. **Chọn tab** "🎯 Kịch Bản AI"
3. **Giao diện hiện ra** với 3 scenarios có sẵn

#### **Chạy Kịch Bản:**
1. **Chọn scenario** muốn chạy
2. **Click "Chạy Kịch Bản"**
3. **Theo dõi progress** qua AI messages:
   ```
   🚀 Đang thực thi "Bắt đầu ngày làm việc" - 4 hành động
   ✅ Hoàn thành "Bắt đầu ngày làm việc" trong 8s
   ```

#### **Tùy Chỉnh (Đang phát triển):**
- Giao diện tạo/chỉnh sửa scenario chi tiết sẽ có trong bản cập nhật tiếp theo
- Hiện tại có thể sử dụng scenarios có sẵn

---

## 📊 **MONITORING VÀ FEEDBACK**

### **🔍 Console Logs**
Mở **Developer Tools** (F12) để xem:
```javascript
🧠 Context AI đã khởi động - bắt đầu giám sát ngữ cảnh...
📋 Clipboard update: error (25 words)
🪟 Active window: Visual Studio Code
⚡ Thực thi: Mở Spotify
```

### **💭 AI Messages**
Các loại thông điệp AI:
- **Context suggestions**: Phân tích clipboard/window
- **Scenario notifications**: Thông báo thực thi
- **Regular thoughts**: Thông điệp thường xuyên từ pets
- **Long session reminders**: Nhắc nghỉ ngơi

### **📈 Usage Statistics**
- Scenarios track số lần sử dụng
- Clipboard history (10 entries gần nhất)
- Active window monitoring logs

---

## 🎛️ **CÀI ĐẶT VÀ TÙY CHỈNH**

### **⚙️ Settings Mới**
- **Thành phố**: Để AI lấy thông tin thời tiết
- **Language**: Vẫn giữ Tiếng Việt làm mặc định
- **Scenarios**: Tab quản lý kịch bản riêng

### **🔐 Quyền Riêng Tư**
- **Clipboard monitoring**: Chỉ phân tích, không lưu trữ
- **Window detection**: Chỉ lấy title, không screenshot
- **Network requests**: Chỉ gửi tới Gemini AI và OpenWeatherMap
- **Local storage**: Chỉ lưu scenarios và preferences

### **🚨 Troubleshooting**

#### **Không thấy Context Suggestions:**
```bash
✅ Kiểm tra internet connection
✅ Mở Console (F12) tìm logs "Context AI"
✅ Thử copy text có chứa "error" hoặc "exception"
```

#### **Scenarios không chạy:**
```bash
✅ Kiểm tra permissions (Administrator nếu cần)
✅ Verify applications có tồn tại (VS Code, Spotify, etc.)
✅ Xem Console logs cho error messages
```

#### **AI Messages không hiện:**
```bash
✅ Restart ứng dụng
✅ Kiểm tra Gemini API keys còn hoạt động
✅ Verify ThoughtBubble không bị block bởi other windows
```

---

## 🔮 **ROADMAP - CÁC GIAI ĐOẠN TIẾP THEO**

### **📅 Giai Đoạn 2 (Coming Soon)**
- **🎯 TRỤ CỘT III**: Quản Lý Tập Trung Thông Minh
  - Focus Timer với Pomodoro technique
  - Smart break reminders
  - Concentration mode với pet animations
  
- **📚 TRỤ CỘT IV**: Trợ Lý Clipboard Thông Minh
  - Advanced clipboard analysis
  - Research assistant features
  - Knowledge synthesis capabilities

### **📅 Giai Đoạn 3 (Advanced)**
- **🔍 Enhanced Context Detection**
  - Tab-level browser monitoring
  - Application state awareness
  - Multi-screen support

- **🤖 Advanced AI Features**
  - Learning user patterns
  - Predictive suggestions
  - Custom AI personality training

---

## 💡 **TIPS VÀ TRICKS**

### **🚀 Productivity Hacks**
1. **Morning Routine**: Sử dụng scenario "Bắt đầu ngày làm việc"
2. **Context Switching**: Copy error messages để get instant help
3. **Research Mode**: Copy long articles để get quick summaries
4. **Dev Flow**: Use "Khởi động Dev Environment" cho coding sessions

### **🎨 Customization Ideas**
1. **Create Personal Scenarios**: Tạo workflow riêng cho công việc
2. **Context-Aware Usage**: Để AI learn patterns và suggest improvements
3. **Multi-Context**: Sử dụng different scenarios cho different projects

### **⚡ Performance Tips**
1. **Clipboard**: AI chỉ analyze nội dung >10 characters
2. **Window Detection**: Updates mỗi 5 giây để không lag system
3. **Scenarios**: Có built-in delays giữa actions để stability

---

## 🤝 **HỖ TRỢ VÀ COMMUNITY**

### **📞 Liên Hệ**
- **Developer**: Hàn Như
- **Based on**: WindowPet by SeakMengs
- **GitHub**: [Original WindowPet Repository](https://github.com/SeakMengs/WindowPet)

### **🐛 Bug Reports**
Khi gặp lỗi, hãy provide:
1. **Console logs** (F12 → Console)
2. **Steps to reproduce**
3. **System info** (Windows version, etc.)
4. **Screenshots** nếu có thể

### **💫 Feature Requests**
Chúng tôi luôn chào đón ý tưởng mới:
1. **Context awareness improvements**
2. **New scenario types**
3. **AI personality enhancements**
4. **Integration với apps khác**

---

## 🎉 **KẾT LUẬN**

**Trợ Lý Nhận Thức AI** đã transform "Người Bạn Đồng Hành AI" từ một desktop pet thành một **intelligent productivity companion**. Với 2 trụ cột đã triển khai:

✅ **Context Awareness** - Hiểu bạn đang làm gì  
✅ **Workflow Optimization** - Tự động hóa công việc  

Bạn giờ đây có một trợ lý AI thật sự **thấu hiểu**, **chủ động** và **hữu ích** ngay trên desktop!

**🚀 Hãy trải nghiệm và khám phá sức mạnh của Trợ Lý Nhận Thức AI ngay hôm nay!**

---

*Phát triển bởi **Hàn Như** với ❤️ - Dựa trên WindowPet by SeakMengs*  
*Phiên bản: Giai đoạn 1 - Context Awareness & Workflow Optimization*
