import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIAssistantState, ChatSession, ChatMessage, AIQuery, AI_CONFIG } from '@/lib/types/ai-assistant';
import { CoffeeShopAIService } from '@/lib/services/coffee-shop-ai.service';

// AI Service instance
const aiService = CoffeeShopAIService.getInstance();

// Async thunks
export const sendMessage = createAsyncThunk(
  'aiAssistant/sendMessage',
  async ({ message, sessionId }: { message: string; sessionId?: string }) => {
    const query: AIQuery = {
      question: message,
      sessionId
    };

    const response = await aiService.processQuery(query);
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const aiMessage = aiService.createChatMessage(response, messageId);

    return {
      userMessage: {
        id: `msg_${Date.now()}_user`,
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      },
      aiMessage,
      sessionId
    };
  }
);

export const createNewSession = createAsyncThunk(
  'aiAssistant/createNewSession',
  async (title?: string) => {
    const sessionId = `session_${Date.now()}`;
    const session: ChatSession = {
      id: sessionId,
      title: title || 'Cuộc trò chuyện mới',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return session;
  }
);

// Initial state
const initialState: AIAssistantState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  isTyping: false,
  error: undefined
};

const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    // Session management
    setCurrentSession: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        state.currentSession = session;
      }
    },

    updateSessionTitle: (state, action: PayloadAction<{ sessionId: string; title: string }>) => {
      const { sessionId, title } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.title = title;
        session.updatedAt = new Date();
      }
      if (state.currentSession?.id === sessionId) {
        state.currentSession.title = title;
        state.currentSession.updatedAt = new Date();
      }
    },

    deleteSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      state.sessions = state.sessions.filter(s => s.id !== sessionId);
      
      if (state.currentSession?.id === sessionId) {
        state.currentSession = state.sessions.length > 0 ? state.sessions[0] : null;
      }
    },

    clearAllSessions: (state) => {
      state.sessions = [];
      state.currentSession = null;
    },

    // Message management
    addMessage: (state, action: PayloadAction<{ sessionId: string; message: ChatMessage }>) => {
      const { sessionId, message } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      
      if (session) {
        session.messages.push(message);
        session.updatedAt = new Date();
        
        // Limit messages per session
        if (session.messages.length > AI_CONFIG.MAX_MESSAGES_PER_SESSION) {
          session.messages = session.messages.slice(-AI_CONFIG.MAX_MESSAGES_PER_SESSION);
        }
      }
      
      if (state.currentSession?.id === sessionId) {
        state.currentSession.messages.push(message);
        state.currentSession.updatedAt = new Date();
        
        if (state.currentSession.messages.length > AI_CONFIG.MAX_MESSAGES_PER_SESSION) {
          state.currentSession.messages = state.currentSession.messages.slice(-AI_CONFIG.MAX_MESSAGES_PER_SESSION);
        }
      }
    },

    deleteMessage: (state, action: PayloadAction<{ sessionId: string; messageId: string }>) => {
      const { sessionId, messageId } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      
      if (session) {
        session.messages = session.messages.filter(m => m.id !== messageId);
        session.updatedAt = new Date();
      }
      
      if (state.currentSession?.id === sessionId) {
        state.currentSession.messages = state.currentSession.messages.filter(m => m.id !== messageId);
        state.currentSession.updatedAt = new Date();
      }
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      
      if (session) {
        session.messages = [];
        session.updatedAt = new Date();
      }
      
      if (state.currentSession?.id === sessionId) {
        state.currentSession.messages = [];
        state.currentSession.updatedAt = new Date();
      }
    },

    // UI state management
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = undefined;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        const { userMessage, aiMessage, sessionId } = action.payload;
        
        // If no current session, create one
        if (!state.currentSession) {
          const newSession: ChatSession = {
            id: sessionId || `session_${Date.now()}`,
            title: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          state.currentSession = newSession;
          state.sessions.unshift(newSession);
        }
        
        // Add messages to current session
        if (state.currentSession) {
          state.currentSession.messages.push(userMessage, aiMessage);
          state.currentSession.updatedAt = new Date();
          
          // Update session in sessions array
          const sessionIndex = state.sessions.findIndex(s => s.id === state.currentSession!.id);
          if (sessionIndex !== -1) {
            state.sessions[sessionIndex] = { ...state.currentSession };
          }
          
          // Limit messages per session
          if (state.currentSession.messages.length > AI_CONFIG.MAX_MESSAGES_PER_SESSION) {
            state.currentSession.messages = state.currentSession.messages.slice(-AI_CONFIG.MAX_MESSAGES_PER_SESSION);
          }
        }
        
        // Limit total sessions
        if (state.sessions.length > AI_CONFIG.MAX_SESSIONS) {
          state.sessions = state.sessions.slice(0, AI_CONFIG.MAX_SESSIONS);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.error.message || 'Có lỗi xảy ra khi gửi tin nhắn';
      })
      // Create new session
      .addCase(createNewSession.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createNewSession.fulfilled, (state, action) => {
        state.isLoading = false;
        const newSession = action.payload;
        
        state.sessions.unshift(newSession);
        state.currentSession = newSession;
        
        // Limit total sessions
        if (state.sessions.length > AI_CONFIG.MAX_SESSIONS) {
          state.sessions = state.sessions.slice(0, AI_CONFIG.MAX_SESSIONS);
        }
      })
      .addCase(createNewSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tạo cuộc trò chuyện mới';
      });
  }
});

export const {
  setCurrentSession,
  updateSessionTitle,
  deleteSession,
  clearAllSessions,
  addMessage,
  deleteMessage,
  clearMessages,
  setTyping,
  clearError
} = aiAssistantSlice.actions;

export default aiAssistantSlice.reducer;
