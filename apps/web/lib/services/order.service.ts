import { MockApiService } from './mock-api.service';
import type { Order } from '@/store/slices/orders.slice';

class OrderService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-orders';

  async getAll(): Promise<Order[]> {
    await this.simulateDelay();
    const orders = this.getFromStorage<Order>(this.STORAGE_KEY);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getById(id: string): Promise<Order | null> {
    await this.simulateDelay();
    const orders = this.getFromStorage<Order>(this.STORAGE_KEY);
    return orders.find((o) => o.id === id) || null;
  }

  async create(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    await this.simulateDelay();
    const orders = this.getFromStorage<Order>(this.STORAGE_KEY);
    
    const newOrder: Order = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    
    orders.push(newOrder);
    this.saveToStorage(this.STORAGE_KEY, orders);
    
    return newOrder;
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    await this.simulateDelay();
    const orders = this.getFromStorage<Order>(this.STORAGE_KEY);
    const index = orders.findIndex((o) => o.id === id);
    
    if (index === -1) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    
    orders[index].status = status;
    this.saveToStorage(this.STORAGE_KEY, orders);
    
    return orders[index];
  }
}

export const orderService = new OrderService();
