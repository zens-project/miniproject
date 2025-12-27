import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

console.log('🔑 OpenAI API Key check:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const AI_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 500,
  temperature: 0.7,
  systemPrompt: `Bạn là trợ lý AI thông minh cho ứng dụng quản lý quán cà phê. 
Nhiệm vụ của bạn là:
- Trả lời các câu hỏi về quản lý quán cà phê
- Hỗ trợ về sản phẩm, đơn hàng, khách hàng
- Đưa ra gợi ý và phân tích dữ liệu
- Trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp`,
};
