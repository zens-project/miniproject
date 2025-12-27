# 🤖 Hướng Dẫn Cấu Hình OpenAI API

## ✅ Đã Hoàn Thành

Tính năng hỏi đáp AI đã được tích hợp hoàn toàn vào ứng dụng Coffee Shop Management với các thành phần sau:

### 1. **OpenAI SDK** ✅
- Package: `openai@^6.15.0`
- Đã cài đặt và sẵn sàng sử dụng

### 2. **Cấu Hình OpenAI** ✅
- File: `apps/web/lib/config/openai.config.ts`
- Model: `gpt-3.5-turbo`
- System prompt được tùy chỉnh cho quản lý quán cà phê
- Cấu hình temperature, max tokens

### 3. **AI Service Layer** ✅
- File: `apps/web/lib/services/ai.service.ts`
- Hỗ trợ 2 chế độ:
  - **sendMessage**: Gửi tin nhắn và nhận phản hồi đầy đủ
  - **streamMessage**: Streaming response (real-time)
- Contextual help: Gợi ý dựa trên trang hiện tại

### 4. **Redux State Management** ✅
- File: `apps/web/store/slices/ai.slice.ts`
- Actions:
  - `sendAIMessage`: Gửi tin nhắn
  - `getContextualHelp`: Lấy gợi ý theo context
  - `toggleChat`, `openChat`, `closeChat`: Điều khiển UI
  - `clearMessages`: Xóa lịch sử chat
- State tracking: messages, loading, error, isOpen

### 5. **UI Component** ✅
- File: `apps/web/app/(protected)/components/ai-chat.tsx`
- Floating chat widget (góc phải dưới)
- Giao diện đẹp với gradient blue-purple
- Tính năng:
  - Chat interface với scroll tự động
  - Loading state với animation
  - Timestamp cho mỗi tin nhắn
  - Xóa lịch sử chat
  - Responsive design
  - Keyboard shortcuts (Enter để gửi, Shift+Enter xuống dòng)

### 6. **Tích Hợp Layout** ✅
- AI Chat đã được thêm vào `apps/web/app/(protected)/layout.tsx`
- Hiển thị trên tất cả các trang protected
- Không ảnh hưởng đến layout hiện tại

---

## 🚀 Cách Sử Dụng

### Bước 1: Tạo File `.env.local`

Tạo file `.env.local` trong thư mục `apps/web/`:

```bash
cd apps/web
touch .env.local
```

### Bước 2: Thêm OpenAI API Key

Mở file `.env.local` và thêm API key của bạn:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Lấy API Key:**
1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập hoặc tạo tài khoản
3. Tạo API key mới
4. Copy và paste vào file `.env.local`

### Bước 3: Khởi Động Ứng Dụng

```bash
# Từ thư mục root của project
pnpm dev
```

### Bước 4: Sử Dụng AI Chat

1. Đăng nhập vào ứng dụng
2. Vào bất kỳ trang protected nào (Dashboard, Sales, Products...)
3. Click vào icon chat AI ở góc phải dưới màn hình
4. Bắt đầu hỏi đáp!

---

## 💡 Ví Dụ Câu Hỏi

### Về Quản Lý Quán Cà Phê:
- "Làm thế nào để tăng doanh thu quán cà phê?"
- "Gợi ý cách quản lý tồn kho hiệu quả"
- "Chiến lược marketing cho quán cà phê nhỏ"

### Về Sản Phẩm:
- "Nên thêm những loại đồ uống nào vào menu?"
- "Cách tính giá bán sản phẩm hợp lý"
- "Xu hướng đồ uống hot hiện nay"

### Về Khách Hàng:
- "Cách xây dựng chương trình khách hàng thân thiết"
- "Làm sao để giữ chân khách hàng cũ?"
- "Chiến lược chăm sóc khách hàng VIP"

### Về Phân Tích:
- "Phân tích doanh thu tháng này"
- "Đánh giá hiệu quả kinh doanh"
- "Gợi ý cải thiện lợi nhuận"

---

## ⚙️ Tùy Chỉnh

### Thay Đổi Model AI

Mở `apps/web/lib/config/openai.config.ts`:

```typescript
export const AI_CONFIG = {
  model: 'gpt-4', // Thay đổi model ở đây
  maxTokens: 500,
  temperature: 0.7,
  // ...
};
```

**Models khả dụng:**
- `gpt-3.5-turbo`: Nhanh, rẻ, phù hợp cho hầu hết use case
- `gpt-4`: Thông minh hơn, chậm hơn, đắt hơn
- `gpt-4-turbo`: Cân bằng giữa GPT-3.5 và GPT-4

### Thay Đổi System Prompt

Chỉnh sửa `systemPrompt` trong cùng file để AI trả lời theo phong cách khác:

```typescript
systemPrompt: `Bạn là chuyên gia tư vấn kinh doanh F&B...`
```

### Tùy Chỉnh Giao Diện

Chỉnh sửa `apps/web/app/(protected)/components/ai-chat.tsx`:

- Thay đổi màu sắc gradient
- Điều chỉnh kích thước chat box
- Thêm/bớt tính năng

---

## 🔧 Cấu Trúc Code

```
apps/web/
├── lib/
│   ├── config/
│   │   └── openai.config.ts          # Cấu hình OpenAI
│   └── services/
│       └── ai.service.ts              # Service layer cho AI
├── store/
│   ├── slices/
│   │   └── ai.slice.ts                # Redux slice cho AI
│   └── index.ts                       # Store config (đã thêm AI reducer)
└── app/
    └── (protected)/
        ├── components/
        │   └── ai-chat.tsx            # UI component
        └── layout.tsx                 # Layout (đã tích hợp AIChat)
```

---

## 🐛 Xử Lý Lỗi

### Lỗi: "API key not found"
- Kiểm tra file `.env.local` đã tồn tại
- Đảm bảo `OPENAI_API_KEY` được set đúng
- Restart dev server sau khi thêm env variable

### Lỗi: "Rate limit exceeded"
- Bạn đã vượt quá giới hạn API của OpenAI
- Chờ một lúc hoặc upgrade plan

### Lỗi: "Model not found"
- Kiểm tra model name trong config
- Đảm bảo tài khoản OpenAI có quyền truy cập model đó

### Chat không hiển thị
- Kiểm tra Redux DevTools
- Xem console log có lỗi không
- Đảm bảo đã login vào ứng dụng

---

## 📊 Chi Phí Ước Tính

**GPT-3.5-Turbo:**
- Input: $0.0005 / 1K tokens
- Output: $0.0015 / 1K tokens
- ~1 cuộc hội thoại (10 tin nhắn): $0.01 - $0.03

**GPT-4:**
- Input: $0.03 / 1K tokens
- Output: $0.06 / 1K tokens
- ~1 cuộc hội thoại (10 tin nhắn): $0.50 - $1.00

---

## 🔐 Bảo Mật

### ⚠️ QUAN TRỌNG:

1. **KHÔNG commit file `.env.local`** vào Git
2. **KHÔNG share API key** với người khác
3. **SỬ DỤNG environment variables** cho production
4. **SET usage limits** trên OpenAI dashboard
5. **MONITOR usage** thường xuyên

### Production Setup:

Khi deploy lên production (Vercel, Netlify, etc.):

1. Thêm `OPENAI_API_KEY` vào Environment Variables của platform
2. Xóa `dangerouslyAllowBrowser: true` trong config
3. Tạo API route riêng để call OpenAI từ server-side

---

## 🎯 Tính Năng Nâng Cao (Có Thể Thêm)

### 1. Voice Input
- Thêm speech-to-text
- Sử dụng Web Speech API

### 2. Context Awareness
- Tự động gửi data của trang hiện tại
- AI phân tích và đưa ra gợi ý cụ thể

### 3. Quick Actions
- AI có thể thực hiện actions (tạo sản phẩm, đơn hàng...)
- Tích hợp với Redux actions

### 4. Chat History
- Lưu lịch sử chat vào database
- Sync giữa các devices

### 5. Multi-language
- Hỗ trợ nhiều ngôn ngữ
- Tự động detect và translate

---

## 📚 Tài Liệu Tham Khảo

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Node.js Library](https://github.com/openai/openai-node)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

## ✅ Checklist

- [x] Cài đặt OpenAI SDK
- [x] Tạo config file
- [x] Tạo service layer
- [x] Tạo Redux slice
- [x] Tạo UI component
- [x] Tích hợp vào layout
- [ ] Thêm OpenAI API key vào `.env.local`
- [ ] Test chat functionality
- [ ] Deploy lên production

---

**🎉 Chúc bạn sử dụng tính năng AI chat thành công!**

Nếu có vấn đề gì, hãy kiểm tra console log hoặc Redux DevTools để debug.
