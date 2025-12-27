import { openai, AI_CONFIG } from '../config/openai.config';

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

class AIService {
  async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: AI_CONFIG.systemPrompt,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
      });

      const assistantMessage = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';

      return {
        message: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: assistantMessage,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('AI Service Error:', error);
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
      const messages = [
        {
          role: 'system' as const,
          content: AI_CONFIG.systemPrompt,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      const stream = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content);
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
      console.error('AI Stream Error:', error);
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

export const aiService = new AIService();
