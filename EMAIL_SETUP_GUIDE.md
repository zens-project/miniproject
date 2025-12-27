# 📧 Email Service Setup Guide

Hướng dẫn cài đặt dịch vụ email cho tính năng thông báo loyalty của Coffee Shop Management System.

## 🚀 Cài đặt Dependencies

Trước tiên, cần cài đặt nodemailer package:

```bash
cd apps/web
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## ⚙️ Cấu hình Environment Variables

1. Copy file `.env.example` thành `.env.local`:
```bash
cp .env.example .env.local
```

2. Cập nhật các biến môi trường email trong `.env.local`:

### Gmail Configuration (Khuyến nghị)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Outlook/Hotmail Configuration
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Configuration
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
```

## 🔐 Setup Gmail App Password (Khuyến nghị)

### Bước 1: Bật 2-Factor Authentication
1. Đi tới [Google Account Settings](https://myaccount.google.com/)
2. Chọn "Security" → "2-Step Verification"
3. Bật 2-Step Verification nếu chưa có

### Bước 2: Tạo App Password
1. Trong Security settings, chọn "App passwords"
2. Chọn "Mail" và "Other (Custom name)"
3. Nhập tên: "Coffee Shop Management"
4. Copy password được tạo và paste vào `SMTP_PASS`

### Bước 3: Cập nhật .env.local
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=generated_app_password_here
```

## 🧪 Test Email Service

Tạo file test để kiểm tra email service:

```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Coffee Shop Test" <${process.env.SMTP_USER}>`,
      to: "test@example.com",
      subject: "Test Email",
      html: "<h1>Email service is working!</h1>",
    });
    
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email failed:', error);
  }
}

testEmail();
```

Chạy test:
```bash
node test-email.js
```

## 🎯 Tính năng Email trong Customer Management

### 1. Loyalty Points Threshold
- Mặc định: 15 điểm
- Có thể thay đổi trong Settings modal
- Khách hàng đủ điểm sẽ nhận email tự động

### 2. Email Template
- Có thể tùy chỉnh trong Settings
- Sử dụng placeholders: `{name}`, `{points}`
- Template mặc định: "Chúc mừng bạn đã đủ {points} điểm! Bạn có thể đổi 1 ly miễn phí."

### 3. Alert System
- **Popup Alerts**: Hiển thị ở góc phải màn hình
- **Scrolling Alert**: Chạy chữ ở bottom màn hình
- **Email Button**: Gửi email thủ công cho khách hàng đủ điểm

### 4. Cách sử dụng
1. Vào trang **Customers** (`/customers`)
2. Click nút **Cài đặt** để cấu hình loyalty threshold
3. Khi khách hàng đủ điểm:
   - Alert sẽ hiện ở góc phải
   - Click **Gửi email** để gửi thông báo
   - Scrolling alert sẽ chạy ở bottom

## 🔧 Troubleshooting

### Lỗi "Authentication failed"
- Kiểm tra username/password
- Đảm bảo đã bật App Password (Gmail)
- Kiểm tra 2FA settings

### Lỗi "Connection timeout"
- Kiểm tra SMTP_HOST và SMTP_PORT
- Kiểm tra firewall/network settings
- Thử đổi SMTP_SECURE=true cho port 465

### Lỗi "Invalid recipient"
- Kiểm tra email address format
- Đảm bảo khách hàng có email hợp lệ

### Gmail specific issues
- Bật "Less secure app access" (không khuyến nghị)
- Sử dụng App Password thay vì password thường
- Kiểm tra Gmail quota limits

## 📝 Email Template Customization

Trong Settings modal, bạn có thể tùy chỉnh:

### Email Template
```
Chúc mừng {name}!
Bạn đã tích lũy được {points} điểm.
Hãy ghé shop để nhận phần thưởng nhé!
```

### Admin Alert Message
```
Khách hàng {name} đã đủ {points} điểm để nhận thưởng!
```

## 🎨 Email Design Features

- **Coffee Shop Branding**: Logo và màu sắc coffee theme
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Professional Layout**: Header, content, footer structure
- **Gradient Background**: Coffee-themed color scheme
- **Icons & Emojis**: Coffee và gift icons

## 🚀 Production Deployment

### Vercel Deployment
1. Add environment variables trong Vercel dashboard
2. Deploy project: `vercel --prod`

### Environment Variables for Production
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=production_email@gmail.com
SMTP_PASS=production_app_password
```

### Security Best Practices
- Không commit `.env.local` vào git
- Sử dụng App Passwords thay vì passwords thường
- Rotate passwords định kỳ
- Monitor email sending logs
- Set up email rate limiting nếu cần

## 📊 Monitoring & Analytics

### Email Logs
- Check console logs cho email sending status
- Monitor failed email attempts
- Track email delivery rates

### Customer Engagement
- Track email open rates (nếu cần)
- Monitor loyalty program effectiveness
- Analyze customer response to rewards

---

✅ **Setup hoàn tất!** Email service đã sẵn sàng cho Coffee Shop Management System.
