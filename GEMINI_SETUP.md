# 🤖 Google Gemini AI - Hướng Dẫn Setup

## ✅ Đã Hoàn Thành

Tính năng AI Chat đã được chuyển sang sử dụng **Google Gemini AI (FREE)** thay vì OpenAI.

### Tại sao chọn Gemini?
- ✅ **Hoàn toàn miễn phí** với quota hào phóng
- ✅ **Không cần thẻ tín dụng** để sử dụng
- ✅ **Hiệu suất tốt** với model `gemini-1.5-flash`
- ✅ **Hỗ trợ tiếng Việt** tự nhiên

---

## 🎯 Những gì đã được tích hợp:

### 1. **Package đã cài đặt**
- `@google/generative-ai@^0.24.1`

### 2. **Files mới được tạo**
- `lib/config/gemini.config.ts` - Cấu hình Gemini AI
- `lib/services/gemini.service.ts` - Service layer cho Gemini

### 3. **Files được cập nhật**
- `store/slices/ai.slice.ts` - Đổi từ OpenAI sang Gemini
- `.env.local` - Thêm `NEXT_PUBLIC_GEMINI_API_KEY`
- `.env.example` - Document cả 2 API keys

### 4. **Files OpenAI được giữ lại** (không xóa)
- `lib/config/openai.config.ts` ✅ Vẫn còn
- `lib/services/ai.service.ts` ✅ Vẫn còn

---

## 🚀 Cách sử dụng:

### API Key đã được setup:
```env
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC-3IDwmBy9kC8bW_RoBv_QQ6Q-fxjViHo
```

### Khởi động ứng dụng:
```bash
# Restart dev server để load env variables mới
pnpm dev
```

### Test AI Chat:
1. Mở `http://localhost:3000`
2. Login với `admin@coffee.com` / `admin123`
3. Click icon chat AI ở góc phải dưới
4. Bắt đầu hỏi đáp!

---

## 🔄 Chuyển đổi giữa OpenAI và Gemini

Nếu muốn quay lại dùng OpenAI, chỉ cần:

### Bước 1: Mở `store/slices/ai.slice.ts`

Đổi dòng import:
```typescript
// Từ:
import { geminiService, type ChatMessage } from '@/lib/services/gemini.service';

// Thành:
import { aiService, type ChatMessage } from '@/lib/services/ai.service';
```

### Bước 2: Đổi tất cả `geminiService` thành `aiService`

```typescript
// Line 31:
const response = await aiService.sendMessage(message, conversationHistory);

// Line 44:
const help = await aiService.getContextualHelp(context);
```

### Bước 3: Restart dev server

---

## 📊 So sánh OpenAI vs Gemini

| Tính năng | OpenAI | Google Gemini |
|-----------|---------|---------------|
| **Giá** | Trả phí | **Miễn phí** ✅ |
| **Cần thẻ** | Có | **Không** ✅ |
| **Model** | gpt-4o-mini | gemini-1.5-flash |
| **Tiếng Việt** | Tốt | **Rất tốt** ✅ |
| **Tốc độ** | Nhanh | **Rất nhanh** ✅ |
| **Quota** | Giới hạn | **Hào phóng** ✅ |

---

## 🔧 Cấu hình Gemini

### Model hiện tại:
```typescript
model: 'gemini-1.5-flash'  // Nhanh, miễn phí
```

### Models khác có thể dùng:
- `gemini-1.5-flash` - Nhanh nhất, miễn phí (đang dùng)
- `gemini-1.5-pro` - Thông minh hơn, vẫn miễn phí
- `gemini-1.0-pro` - Phiên bản cũ, ổn định

### Thay đổi model:

Mở `lib/config/gemini.config.ts`:
```typescript
export const GEMINI_CONFIG = {
  model: 'gemini-1.5-pro', // Đổi model ở đây
  maxTokens: 500,
  temperature: 0.7,
  // ...
};
```

---

## 💡 Lấy Gemini API Key mới (nếu cần)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google Account
3. Click "Create API Key"
4. Copy key và paste vào `.env.local`

**Lưu ý:** API key của bạn đã được setup sẵn rồi!

---

## 🎨 Tính năng AI Chat

### Đã có sẵn:
- ✅ Chat interface đẹp mắt
- ✅ Lịch sử hội thoại
- ✅ Loading states với animation
- ✅ Error handling
- ✅ Keyboard shortcuts (Enter/Shift+Enter)
- ✅ Clear chat history
- ✅ Responsive design

### Có thể hỏi:
- Quản lý quán cà phê
- Tư vấn sản phẩm
- Phân tích doanh thu
- Chiến lược marketing
- Chăm sóc khách hàng
- Và nhiều hơn nữa!

---

## 🐛 Troubleshooting

### Lỗi: "API key not found"
```bash
# Kiểm tra .env.local
cat apps/web/.env.local

# Phải có dòng:
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC-3IDwmBy9kC8bW_RoBv_QQ6Q-fxjViHo

# Restart server
pnpm dev
```

### Lỗi: "Model not found"
- Kiểm tra tên model trong `gemini.config.ts`
- Đảm bảo dùng model hợp lệ

### Chat không phản hồi
- Mở Console (F12) để xem logs
- Tìm dòng: `🔑 Gemini API Key check: Found (...)`
- Kiểm tra Redux DevTools

---

## 📚 Cấu trúc Code

```
apps/web/
├── lib/
│   ├── config/
│   │   ├── openai.config.ts    # OpenAI (giữ lại)
│   │   └── gemini.config.ts    # Gemini (đang dùng) ✅
│   └── services/
│       ├── ai.service.ts        # OpenAI service (giữ lại)
│       └── gemini.service.ts    # Gemini service (đang dùng) ✅
├── store/
│   └── slices/
│       └── ai.slice.ts          # Redux (dùng Gemini) ✅
└── app/
    └── (protected)/
        └── components/
            └── ai-chat.tsx      # UI component ✅
```

---

## ✅ Checklist

- [x] Cài đặt `@google/generative-ai`
- [x] Tạo Gemini config
- [x] Tạo Gemini service
- [x] Cập nhật Redux slice
- [x] Thêm API key vào `.env.local`
- [x] Giữ lại OpenAI files
- [ ] Restart dev server
- [ ] Test chat functionality

---

**🎉 Gemini AI đã sẵn sàng sử dụng - HOÀN TOÀN MIỄN PHÍ!**

Hãy restart dev server và test thử nhé!
