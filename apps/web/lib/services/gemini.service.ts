import { genAI, GEMINI_CONFIG } from '../config/gemini.config';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

class GeminiService {
  async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });

      const history = conversationHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: GEMINI_CONFIG.maxTokens,
          temperature: GEMINI_CONFIG.temperature,
        },
      });

      const fullPrompt = conversationHistory.length === 0 
        ? `${GEMINI_CONFIG.systemPrompt}\n\n${userMessage}`
        : userMessage;

      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      const assistantMessage = response.text() || 'Xin lỗi, tôi không thể trả lời lúc này.';

      return {
        message: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: assistantMessage,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('Gemini Service Error:', error);
      return {
        message: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: Date.now(),
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async streamMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    onChunk: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });

      const history = conversationHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: GEMINI_CONFIG.maxTokens,
          temperature: GEMINI_CONFIG.temperature,
        },
      });

      const fullPrompt = conversationHistory.length === 0 
        ? `${GEMINI_CONFIG.systemPrompt}\n\n${userMessage}`
        : userMessage;

      const result = await chat.sendMessageStream(fullPrompt);
      let fullContent = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullContent += chunkText;
          onChunk(chunkText);
        }
      }

      return {
        message: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('Gemini Stream Error:', error);
      return {
        message: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: Date.now(),
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getContextualHelp(context: {
    page?: string;
    data?: Record<string, unknown>;
  }): Promise<string> {
    const contextPrompt = `Người dùng đang ở trang ${context.page || 'không xác định'}. 
${context.data ? `Dữ liệu hiện tại: ${JSON.stringify(context.data)}` : ''}
Hãy đưa ra gợi ý hữu ích cho người dùng.`;

    try {
      const response = await this.sendMessage(contextPrompt);
      return response.message.content;
    } catch (error) {
      return 'Không thể lấy gợi ý lúc này.';
    }
  }
}

export const geminiService = new GeminiService();
