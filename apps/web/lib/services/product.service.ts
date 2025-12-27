import { MockApiService } from './mock-api.service';
import type { Product } from '@/store/slices/products.slice';
import { mockProducts } from '../mock-data/products';

class ProductService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-products';

  async getAll(): Promise<Product[]> {
    await this.simulateDelay();
    let products = this.getFromStorage<Product>(this.STORAGE_KEY);
    
    // Initialize with mock data if empty
    if (products.length === 0) {
      products = mockProducts;
      this.saveToStorage(this.STORAGE_KEY, products);
    }
    
    return products;
  }

  async getById(id: string): Promise<Product | null> {
    await this.simulateDelay();
    const products = this.getFromStorage<Product>(this.STORAGE_KEY);
    return products.find((p) => p.id === id) || null;
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    await this.simulateDelay();
    const products = this.getFromStorage<Product>(this.STORAGE_KEY);
    
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
    };
    
    products.push(newProduct);
    this.saveToStorage(this.STORAGE_KEY, products);
    
    return newProduct;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.simulateDelay();
    const products = this.getFromStorage<Product>(this.STORAGE_KEY);
    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    
    products[index] = { ...products[index], ...data };
    this.saveToStorage(this.STORAGE_KEY, products);
    
    return products[index];
  }

  async delete(id: string): Promise<void> {
    await this.simulateDelay();
    const products = this.getFromStorage<Product>(this.STORAGE_KEY);
    const filtered = products.filter((p) => p.id !== id);
    this.saveToStorage(this.STORAGE_KEY, filtered);
  }
}

export const productService = new ProductService();
