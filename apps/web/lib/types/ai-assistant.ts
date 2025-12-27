export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAssistantState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  isTyping: boolean;
  error?: string;
}

export interface CoffeeShopContext {
  businessInfo: {
    name: string;
    type: string;
    hours: string;
    location: string;
  };
  menu: {
    categories: string[];
    popularItems: string[];
    pricing: string;
  };
  policies: {
    loyaltyProgram: string;
    refundPolicy: string;
    orderPolicy: string;
  };
  procedures: {
    orderProcess: string;
    paymentMethods: string[];
    customerService: string;
  };
}

export interface AIQuery {
  question: string;
  context?: string;
  sessionId?: string;
}

export interface AIResponse {
  answer: string;
  confidence: number;
  sources?: string[];
  suggestedActions?: string[];
}

// AI Assistant Configuration
export const AI_CONFIG = {
  MAX_MESSAGES_PER_SESSION: 50,
  MAX_SESSIONS: 10,
  TYPING_DELAY: 1000,
  RESPONSE_TIMEOUT: 30000,
} as const;

// Coffee Shop Knowledge Base Categories
export const KNOWLEDGE_CATEGORIES = [
  'menu_items',
  'pricing',
  'loyalty_program', 
  'order_process',
  'payment_methods',
  'policies',
  'procedures',
  'customer_service',
  'business_hours',
  'general_info'
] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];
