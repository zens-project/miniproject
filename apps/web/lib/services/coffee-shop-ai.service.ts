import { AIQuery, AIResponse, ChatMessage } from '@/lib/types/ai-assistant';
import { COFFEE_SHOP_KNOWLEDGE, FAQ_DATABASE, SYSTEM_PROMPTS } from '@/lib/data/coffee-shop-knowledge';

export class CoffeeShopAIService {
  private static instance: CoffeeShopAIService;

  private constructor() {}

  public static getInstance(): CoffeeShopAIService {
    if (!CoffeeShopAIService.instance) {
      CoffeeShopAIService.instance = new CoffeeShopAIService();
    }
    return CoffeeShopAIService.instance;
  }

  /**
   * Process AI query with coffee shop context
   */
  public async processQuery(query: AIQuery): Promise<AIResponse> {
    try {
      // First, try to find direct match in FAQ
      const faqMatch = this.findFAQMatch(query.question);
      if (faqMatch) {
        return {
          answer: faqMatch.answer,
          confidence: 0.95,
          sources: ['Coffee Shop FAQ'],
          suggestedActions: this.getSuggestedActions(faqMatch.category)
        };
      }

      // If no direct match, use context-aware processing
      const contextualResponse = await this.generateContextualResponse(query);
      return contextualResponse;

    } catch (error) {
      console.error('Error processing AI query:', error);
      return {
        answer: 'Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau hoặc liên hệ quản lý để được hỗ trợ.',
        confidence: 0.1,
        sources: [],
        suggestedActions: ['Thử lại sau', 'Liên hệ quản lý']
      };
    }
  }

  /**
   * Find matching FAQ entry
   */
  private findFAQMatch(question: string): any | null {
    const normalizedQuestion = question.toLowerCase();
    
    for (const faq of FAQ_DATABASE) {
      // Check if question contains any keywords
      const hasKeywordMatch = faq.keywords.some(keyword => 
        normalizedQuestion.includes(keyword.toLowerCase())
      );
      
      // Check similarity with question
      const questionSimilarity = this.calculateSimilarity(
        normalizedQuestion, 
        faq.question.toLowerCase()
      );

      if (hasKeywordMatch || questionSimilarity > 0.6) {
        return faq;
      }
    }

    return null;
  }

  /**
   * Generate contextual response using coffee shop knowledge
   */
  private async generateContextualResponse(query: AIQuery): Promise<AIResponse> {
    const context = this.buildContext(query.question);
    const relevantInfo = this.extractRelevantInfo(query.question);

    // Simulate AI processing with coffee shop context
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let answer = '';
    let confidence = 0.7;
    let sources: string[] = [];
    let suggestedActions: string[] = [];

    // Generate response based on question type
    if (this.isMenuRelated(query.question)) {
      answer = this.generateMenuResponse(query.question);
      sources = ['Menu Database', 'Product Information'];
      suggestedActions = ['Xem menu chi tiết', 'Kiểm tra giá sản phẩm'];
    } else if (this.isLoyaltyRelated(query.question)) {
      answer = this.generateLoyaltyResponse(query.question);
      sources = ['Loyalty Program Policy'];
      suggestedActions = ['Kiểm tra điểm khách hàng', 'Xem lịch sử tích điểm'];
    } else if (this.isPOSRelated(query.question)) {
      answer = this.generatePOSResponse(query.question);
      sources = ['POS System Manual', 'Operation Procedures'];
      suggestedActions = ['Mở POS', 'Xem hướng dẫn chi tiết'];
    } else if (this.isPolicyRelated(query.question)) {
      answer = this.generatePolicyResponse(query.question);
      sources = ['Company Policies', 'Standard Procedures'];
      suggestedActions = ['Xem chính sách đầy đủ', 'Liên hệ quản lý'];
    } else {
      answer = this.generateGeneralResponse(query.question);
      confidence = 0.5;
      sources = ['General Knowledge'];
      suggestedActions = ['Tìm hiểu thêm', 'Đặt câu hỏi cụ thể hơn'];
    }

    return {
      answer,
      confidence,
      sources,
      suggestedActions
    };
  }

  /**
   * Build context for AI processing
   */
  private buildContext(question: string): string {
    const relevantKnowledge = [];
    
    // Add business info
    relevantKnowledge.push(`Thông tin quán: ${JSON.stringify(COFFEE_SHOP_KNOWLEDGE.businessInfo)}`);
    
    // Add relevant policies based on question
    if (this.isLoyaltyRelated(question)) {
      relevantKnowledge.push(`Chính sách tích điểm: ${COFFEE_SHOP_KNOWLEDGE.policies.loyaltyProgram}`);
    }
    
    if (this.isPolicyRelated(question)) {
      relevantKnowledge.push(`Chính sách: ${JSON.stringify(COFFEE_SHOP_KNOWLEDGE.policies)}`);
    }

    return relevantKnowledge.join('\n');
  }

  /**
   * Extract relevant information based on question
   */
  private extractRelevantInfo(question: string): any {
    const info: any = {};
    
    if (this.isMenuRelated(question)) {
      info.menu = COFFEE_SHOP_KNOWLEDGE.menu;
    }
    
    if (this.isLoyaltyRelated(question)) {
      info.loyalty = COFFEE_SHOP_KNOWLEDGE.policies.loyaltyProgram;
    }
    
    return info;
  }

  /**
   * Question type detection methods
   */
  private isMenuRelated(question: string): boolean {
    const menuKeywords = ['menu', 'món', 'đồ uống', 'cà phê', 'trà', 'bánh', 'giá', 'sản phẩm'];
    return menuKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private isLoyaltyRelated(question: string): boolean {
    const loyaltyKeywords = ['tích điểm', 'loyalty', 'điểm', 'thưởng', 'miễn phí', 'khách hàng'];
    return loyaltyKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private isPOSRelated(question: string): boolean {
    const posKeywords = ['pos', 'bán hàng', 'đơn hàng', 'thanh toán', 'order', 'hệ thống'];
    return posKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private isPolicyRelated(question: string): boolean {
    const policyKeywords = ['chính sách', 'quy định', 'đổi trả', 'hoàn tiền', 'policy'];
    return policyKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  /**
   * Response generation methods
   */
  private generateMenuResponse(question: string): string {
    const menu = COFFEE_SHOP_KNOWLEDGE.menu;
    return `Menu của chúng tôi bao gồm ${menu.categories.length} danh mục chính: ${menu.categories.join(', ')}. 

Các món phổ biến: ${menu.popularItems.join(', ')}.

Mức giá: ${menu.pricing}.

Bạn có thể xem menu chi tiết trong phần Quản lý Menu của hệ thống để cập nhật giá và sản phẩm mới.`;
  }

  private generateLoyaltyResponse(question: string): string {
    return `${COFFEE_SHOP_KNOWLEDGE.policies.loyaltyProgram}

Cách thức hoạt động:
- Khách hàng nhận +1 điểm cho mỗi đơn hàng
- Khi đủ 10 điểm → Nhận 1 ly miễn phí
- Hệ thống tự động gửi thông báo và email
- Có thể theo dõi điểm trong phần Bán hàng (POS)

Bạn có thể kiểm tra điểm của khách hàng trong Customer Selector khi tạo đơn hàng.`;
  }

  private generatePOSResponse(question: string): string {
    return `Hệ thống POS (Point of Sale) hỗ trợ quy trình bán hàng hoàn chỉnh:

${COFFEE_SHOP_KNOWLEDGE.procedures.orderProcess}

Tính năng chính:
- Chọn sản phẩm từ menu
- Tích hợp tích điểm khách hàng
- Nhiều hình thức thanh toán
- Theo dõi đơn hàng real-time
- Báo cáo doanh thu

Truy cập POS qua menu "Bán hàng (POS)" để bắt đầu tạo đơn hàng.`;
  }

  private generatePolicyResponse(question: string): string {
    const policies = COFFEE_SHOP_KNOWLEDGE.policies;
    return `Chính sách của quán:

🔄 **Đổi trả**: ${policies.refundPolicy}

📋 **Đơn hàng**: ${policies.orderPolicy}

🎁 **Tích điểm**: ${policies.loyaltyProgram}

💳 **Thanh toán**: ${COFFEE_SHOP_KNOWLEDGE.procedures.paymentMethods.join(', ')}

📞 **Hỗ trợ**: ${COFFEE_SHOP_KNOWLEDGE.procedures.customerService}`;
  }

  private generateGeneralResponse(question: string): string {
    return `Tôi là trợ lý AI của hệ thống Coffee Shop Management. Tôi có thể hỗ trợ bạn về:

🏪 **Thông tin quán**: Giờ mở cửa, menu, chính sách
📱 **Hướng dẫn hệ thống**: POS, quản lý, báo cáo  
👥 **Chăm sóc khách hàng**: Tích điểm, đổi trả, hỗ trợ
📊 **Vận hành**: Quy trình, thủ tục, best practices

Bạn có thể hỏi cụ thể hơn về bất kỳ chủ đề nào ở trên. Ví dụ:
- "Chương trình tích điểm hoạt động như thế nào?"
- "Cách sử dụng POS để tạo đơn hàng?"
- "Menu có những món gì?"`;
  }

  /**
   * Get suggested actions based on category
   */
  private getSuggestedActions(category: string): string[] {
    const actionMap: Record<string, string[]> = {
      'loyalty_program': ['Kiểm tra điểm khách hàng', 'Xem lịch sử tích điểm', 'Tạo đơn hàng mới'],
      'order_process': ['Mở POS', 'Tạo đơn hàng', 'Xem hướng dẫn POS'],
      'menu_items': ['Xem menu', 'Cập nhật sản phẩm', 'Kiểm tra giá'],
      'payment_methods': ['Xem hướng dẫn thanh toán', 'Cấu hình POS'],
      'policies': ['Xem chính sách đầy đủ', 'Liên hệ quản lý'],
      'business_hours': ['Xem lịch làm việc', 'Cập nhật giờ mở cửa'],
      'customer_service': ['Liên hệ hỗ trợ', 'Xem FAQ'],
      'general_info': ['Tìm hiểu thêm', 'Đặt câu hỏi cụ thể']
    };

    return actionMap[category] || ['Tìm hiểu thêm'];
  }

  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Generate chat message from AI response
   */
  public createChatMessage(response: AIResponse, messageId: string): ChatMessage {
    return {
      id: messageId,
      role: 'assistant',
      content: response.answer,
      timestamp: new Date()
    };
  }

  /**
   * Get quick suggestions for common questions
   */
  public getQuickSuggestions(): string[] {
    return [
      "Chương trình tích điểm hoạt động như thế nào?",
      "Cách sử dụng POS để tạo đơn hàng?",
      "Menu có những món gì?",
      "Chính sách đổi trả như thế nào?",
      "Hệ thống có những tính năng gì?",
      "Cách thêm khách hàng mới?",
      "Làm sao để xem báo cáo doanh thu?",
      "Quy trình xử lý khiếu nại khách hàng?"
    ];
  }
}
