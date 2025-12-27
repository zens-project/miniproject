'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  Plus,
  Trash2,
  RotateCcw,
  Coffee,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  sendMessage, 
  createNewSession, 
  setCurrentSession,
  deleteSession,
  clearMessages,
  clearError
} from '@/store/slices/ai-assistant.slice';
import { ChatMessage } from '@/lib/types/ai-assistant';
import { CoffeeShopAIService } from '@/lib/services/coffee-shop-ai.service';

interface AIChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function AIChatInterface({ 
  isOpen, 
  onClose, 
  isMinimized = false, 
  onToggleMinimize 
}: AIChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const { currentSession, sessions, isLoading, isTyping, error } = useAppSelector(
    (state) => state.aiAssistant
  );

  const [inputMessage, setInputMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiService = CoffeeShopAIService.getInstance();
  const suggestions = aiService.getQuickSuggestions();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setShowSuggestions(false);

    try {
      await dispatch(sendMessage({ 
        message, 
        sessionId: currentSession?.id 
      })).unwrap();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleNewSession = () => {
    dispatch(createNewSession());
    setShowSuggestions(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
      dispatch(deleteSession(sessionId));
    }
  };

  const handleClearMessages = () => {
    if (currentSession && window.confirm('Bạn có chắc chắn muốn xóa tất cả tin nhắn?')) {
      dispatch(clearMessages(currentSession.id));
      setShowSuggestions(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-4 right-4 z-50 rounded-2xl border border-white/20 bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Trợ lý AI Coffee Shop</h3>
            {!isMinimized && (
              <p className="text-xs text-white/60">
                {isTyping ? 'Đang trả lời...' : 'Sẵn sàng hỗ trợ bạn'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleMinimize && (
            <Button
              onClick={onToggleMinimize}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
              size="sm"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Session Management */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleNewSession}
                disabled={isLoading}
                className="bg-green-500/20 border-green-400/30 text-green-200 hover:bg-green-500/30 text-xs px-2 py-1"
                size="sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Cuộc trò chuyện mới
              </Button>
              
              {currentSession && (
                <Button
                  onClick={handleClearMessages}
                  disabled={isLoading}
                  className="bg-orange-500/20 border-orange-400/30 text-orange-200 hover:bg-orange-500/30 text-xs px-2 py-1"
                  size="sm"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Xóa tin nhắn
                </Button>
              )}
            </div>
            
            <div className="text-xs text-white/60">
              {sessions.length} cuộc trò chuyện
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mt-3 p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentSession || currentSession.messages.length === 0 ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center"
                >
                  <Coffee className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold mb-2">Chào mừng đến với Trợ lý AI!</h4>
                <p className="text-white/60 text-sm mb-4">
                  Tôi có thể hỗ trợ bạn về quy trình, chính sách và cách sử dụng hệ thống Coffee Shop.
                </p>
                
                {showSuggestions && (
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm font-medium">Câu hỏi gợi ý:</p>
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full p-2 text-left text-sm text-white/70 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {currentSession.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-[80%]">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Hỏi về quy trình, chính sách, cách sử dụng hệ thống..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg px-4 py-3"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
          : 'bg-gradient-to-br from-blue-400 to-indigo-600'
      }`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30' 
            : 'bg-white/10 border border-white/20'
        }`}>
          <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-xs text-white/50 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </motion.div>
  );
}
