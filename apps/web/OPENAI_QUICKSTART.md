# 🚀 OpenAI API - Hướng Dẫn Nhanh

## Bước 1: Lấy API Key

1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập/Đăng ký tài khoản OpenAI
3. Click "Create new secret key"
4. Copy API key (bắt đầu với `sk-...`)

## Bước 2: Tạo File .env.local

```bash
# Trong thư mục apps/web/
touch .env.local
```

Thêm nội dung:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

## Bước 3: Chạy Ứng Dụng

```bash
# Từ thư mục root
pnpm dev
```

## Bước 4: Sử Dụng

1. Login vào app
2. Click icon chat AI ở góc phải dưới
3. Bắt đầu hỏi đáp!

## ⚠️ Lưu Ý Quan Trọng

- **KHÔNG** commit file `.env.local` vào Git
- **KHÔNG** share API key với ai
- File `.env.local` đã được thêm vào `.gitignore`

## 📁 Files Đã Tạo

- `lib/config/openai.config.ts` - Cấu hình OpenAI
- `lib/services/ai.service.ts` - Service layer
- `store/slices/ai.slice.ts` - Redux state
- `app/(protected)/components/ai-chat.tsx` - UI component
- `.env.example` - Template cho env variables

## 💡 Ví Dụ Câu Hỏi

- "Làm thế nào để tăng doanh thu quán cà phê?"
- "Gợi ý cách quản lý tồn kho"
- "Chiến lược marketing cho quán nhỏ"
- "Phân tích doanh thu tháng này"

---

Xem chi tiết tại: `/AI_SETUP_GUIDE.md`
