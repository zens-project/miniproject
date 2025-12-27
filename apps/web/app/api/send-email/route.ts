import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  customerName: string;
  points: number;
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, customerName, points }: EmailRequest = await request.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email template with coffee shop branding
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thông báo tích điểm</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .header {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .content {
            padding: 40px 30px;
            background: white;
            margin: 0;
          }
          .reward-badge {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #8B4513;
            padding: 15px 25px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(255,215,0,0.3);
          }
          .points {
            font-size: 36px;
            font-weight: bold;
            color: #8B4513;
            text-align: center;
            margin: 20px 0;
          }
          .message {
            font-size: 16px;
            line-height: 1.8;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            background: #8B4513;
            color: white;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
          }
          .coffee-icon {
            font-size: 24px;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>☕ Coffee Shop Management ☕</h1>
          </div>
          <div class="content">
            <div class="message">
              <h2 style="color: #8B4513; margin-bottom: 10px;">Chúc mừng ${customerName}!</h2>
              <p>Bạn đã tích lũy được:</p>
              <div class="points">${points} điểm</div>
              <div class="reward-badge">
                🎁 Bạn đã đủ điểm nhận thưởng! 🎁
              </div>
              <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 10px; border-left: 4px solid #8B4513;">
                ${html}
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Hãy ghé thăm cửa hàng để nhận phần thưởng của bạn!<br>
                Cảm ơn bạn đã là khách hàng thân thiết của chúng tôi.
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">
              <span class="coffee-icon">☕</span>
              Coffee Shop Management System
              <span class="coffee-icon">☕</span>
            </p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">
              Email được gửi tự động từ hệ thống quản lý
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: emailTemplate,
    });

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
