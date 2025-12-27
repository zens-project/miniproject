import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { aiService, type ChatMessage } from '@/lib/services/ai.service';

export interface AIState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: AIState = {
  messages: [],
  isLoading: false,
  error: null,
  isOpen: false,
};

export const sendAIMessage = createAsyncThunk(
  'ai/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as { ai: AIState };
    const conversationHistory = state.ai.messages;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    const response = await aiService.sendMessage(message, conversationHistory);
    
    return {
      userMessage,
      assistantMessage: response.message,
      error: response.error,
    };
  }
);

export const getContextualHelp = createAsyncThunk(
  'ai/getContextualHelp',
  async (context: { page?: string; data?: Record<string, unknown> }) => {
    const help = await aiService.getContextualHelp(context);
    return help;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload.userMessage);
        state.messages.push(action.payload.assistantMessage);
        if (action.payload.error) {
          state.error = action.payload.error;
        }
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Đã có lỗi xảy ra';
      })
      .addCase(getContextualHelp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContextualHelp.fulfilled, (state, action) => {
        state.isLoading = false;
        const helpMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: action.payload,
          timestamp: Date.now(),
        };
        state.messages.push(helpMessage);
      })
      .addCase(getContextualHelp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể lấy gợi ý';
      });
  },
});

export const { toggleChat, openChat, closeChat, clearMessages, addMessage } = aiSlice.actions;
export default aiSlice.reducer;
