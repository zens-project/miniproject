import { CoffeeShopContext } from '@/lib/types/ai-assistant';

export const COFFEE_SHOP_KNOWLEDGE: CoffeeShopContext = {
  businessInfo: {
    name: "Coffee Shop Management System",
    type: "Quán cà phê và đồ uống",
    hours: "6:00 - 22:00 hàng ngày",
    location: "Hệ thống quản lý cho quán cà phê"
  },
  menu: {
    categories: [
      "Cà phê (Coffee)",
      "Trà (Tea)", 
      "Đồ uống lạnh (Cold Drinks)",
      "Bánh ngọt (Pastries)",
      "Bánh mì (Sandwiches)"
    ],
    popularItems: [
      "Cà phê đen đá",
      "Cà phê sữa đá", 
      "Cappuccino",
      "Latte",
      "Trà sữa trân châu",
      "Bánh croissant",
      "Bánh mì thịt nướng"
    ],
    pricing: "Giá từ 15,000 - 85,000 VND"
  },
  policies: {
    loyaltyProgram: "Chương trình tích điểm: Mua 10 đồ uống được tặng 1 ly miễn phí. Khách hàng nhận +1 điểm mỗi đơn hàng. Khi đủ 10 điểm sẽ nhận được phần thưởng và thông báo qua email.",
    refundPolicy: "Hoàn tiền 100% nếu sản phẩm có vấn đề về chất lượng trong vòng 30 phút. Đổi trả miễn phí nếu sai đơn hàng.",
    orderPolicy: "Nhận đơn hàng tại quầy và mang về. Thanh toán bằng tiền mặt hoặc chuyển khoản. Thời gian chuẩn bị: 5-15 phút tùy món."
  },
  procedures: {
    orderProcess: "1. Khách hàng chọn sản phẩm từ menu 2. Nhân viên nhập đơn hàng vào hệ thống POS 3. Chọn khách hàng (nếu có) để tích điểm 4. Xác nhận đơn hàng và thanh toán 5. Chuẩn bị đồ uống 6. Giao hàng cho khách",
    paymentMethods: [
      "Tiền mặt (Cash)",
      "Chuyển khoản ngân hàng", 
      "Ví điện tử (MoMo, ZaloPay)",
      "Thẻ ATM/Credit"
    ],
    customerService: "Hỗ trợ khách hàng 24/7 qua hotline. Giải quyết khiếu nại trong 24h. Chính sách đổi trả linh hoạt."
  }
};

export const FAQ_DATABASE = [
  {
    category: 'loyalty_program',
    question: 'Chương trình tích điểm hoạt động như thế nào?',
    answer: 'Khách hàng nhận +1 điểm cho mỗi đơn hàng hoàn thành. Khi tích đủ 10 điểm, khách hàng sẽ nhận được 1 ly cà phê miễn phí. Hệ thống sẽ tự động gửi thông báo và email khi khách hàng đạt mốc này.',
    keywords: ['tích điểm', 'loyalty', 'điểm thưởng', 'miễn phí', '10 điểm']
  },
  {
    category: 'order_process',
    question: 'Quy trình đặt hàng như thế nào?',
    answer: 'Quy trình gồm 6 bước: 1) Chọn sản phẩm từ menu, 2) Nhập đơn hàng vào POS, 3) Chọn khách hàng để tích điểm, 4) Xác nhận và thanh toán, 5) Chuẩn bị đồ uống, 6) Giao cho khách hàng.',
    keywords: ['đặt hàng', 'quy trình', 'POS', 'thanh toán', 'order']
  },
  {
    category: 'menu_items',
    question: 'Menu có những gì?',
    answer: 'Menu gồm 5 danh mục chính: Cà phê (Coffee), Trà (Tea), Đồ uống lạnh, Bánh ngọt, và Bánh mì. Các món phổ biến: Cà phê đen đá, Cà phê sữa đá, Cappuccino, Latte, Trà sữa trân châu. Giá từ 15,000 - 85,000 VND.',
    keywords: ['menu', 'cà phê', 'trà', 'bánh', 'giá', 'đồ uống']
  },
  {
    category: 'payment_methods',
    question: 'Có những hình thức thanh toán nào?',
    answer: 'Chấp nhận 4 hình thức: Tiền mặt, Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay), và Thẻ ATM/Credit.',
    keywords: ['thanh toán', 'tiền mặt', 'chuyển khoản', 'ví điện tử', 'thẻ']
  },
  {
    category: 'policies',
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Hoàn tiền 100% nếu sản phẩm có vấn đề chất lượng trong 30 phút. Đổi trả miễn phí nếu sai đơn hàng. Hỗ trợ khách hàng 24/7, giải quyết khiếu nại trong 24h.',
    keywords: ['đổi trả', 'hoàn tiền', 'chính sách', 'khiếu nại', 'chất lượng']
  },
  {
    category: 'business_hours',
    question: 'Giờ mở cửa là khi nào?',
    answer: 'Quán mở cửa từ 6:00 - 22:00 hàng ngày. Thời gian chuẩn bị đồ uống: 5-15 phút tùy món.',
    keywords: ['giờ mở cửa', 'thời gian', 'mở cửa', 'đóng cửa']
  },
  {
    category: 'customer_service',
    question: 'Làm sao để liên hệ hỗ trợ?',
    answer: 'Hỗ trợ khách hàng 24/7 qua hotline. Chính sách đổi trả linh hoạt. Mọi khiếu nại được giải quyết trong vòng 24 giờ.',
    keywords: ['hỗ trợ', 'liên hệ', 'hotline', 'customer service']
  },
  {
    category: 'general_info',
    question: 'Hệ thống quản lý có những tính năng gì?',
    answer: 'Hệ thống bao gồm: Dashboard tổng quan, Quản lý chi tiêu, Quản lý menu sản phẩm, POS bán hàng, Quản lý khách hàng với tích điểm, và Trợ lý AI. Tất cả được tối ưu cho tablet và mobile.',
    keywords: ['hệ thống', 'tính năng', 'dashboard', 'POS', 'quản lý']
  }
];

export const SYSTEM_PROMPTS = {
  COFFEE_SHOP_ASSISTANT: `Bạn là trợ lý AI của hệ thống quản lý Coffee Shop. Nhiệm vụ của bạn là hỗ trợ nhân viên và quản lý trả lời các câu hỏi về:

1. Quy trình vận hành quán cà phê
2. Chính sách và quy định
3. Hướng dẫn sử dụng hệ thống POS
4. Chương trình tích điểm khách hàng
5. Menu và sản phẩm
6. Xử lý tình huống khách hàng

Hãy trả lời một cách thân thiện, chính xác và hữu ích. Sử dụng tiếng Việt và giữ giọng điệu chuyên nghiệp nhưng gần gũi.`,

  CONTEXT_INSTRUCTION: `Dựa trên thông tin về Coffee Shop được cung cấp, hãy trả lời câu hỏi một cách chính xác và chi tiết. Nếu không có thông tin cụ thể, hãy đưa ra gợi ý hợp lý dựa trên kinh nghiệm quản lý quán cà phê.`
};
