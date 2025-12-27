import { mockCustomers } from '../mock-data/customers';
import { MockApiService } from './mock-api.service';
import type { Customer } from '@/store/slices/customers.slice';

class CustomerService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-customers';

  async getAll(): Promise<Customer[]> {
    await this.simulateDelay();
    let customers = this.getFromStorage<Customer>(this.STORAGE_KEY);
    
    // Initialize with mock data if empty
    if (customers.length === 0) {
      customers = mockCustomers;
      this.saveToStorage(this.STORAGE_KEY, customers);
    }
    
    return customers;
  }

  async getById(id: string): Promise<Customer | null> {
    await this.simulateDelay();
    const customers = this.getFromStorage<Customer>(this.STORAGE_KEY);
    return customers.find((c) => c.id === id) || null;
  }

  async create(customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'visitCount' | 'createdAt'>): Promise<Customer> {
    await this.simulateDelay();
    const customers = this.getFromStorage<Customer>(this.STORAGE_KEY);
    
    const newCustomer: Customer = {
      ...customer,
      id: this.generateId(),
      loyaltyPoints: 0,
      totalSpent: 0,
      visitCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    this.saveToStorage(this.STORAGE_KEY, customers);
    
    return newCustomer;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.simulateDelay();
    const customers = this.getFromStorage<Customer>(this.STORAGE_KEY);
    const index = customers.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Không tìm thấy khách hàng');
    }
    
    customers[index] = { ...customers[index], ...data };
    this.saveToStorage(this.STORAGE_KEY, customers);
    
    return customers[index];
  }
}

export const customerService = new CustomerService();
