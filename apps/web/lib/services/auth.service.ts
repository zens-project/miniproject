import { MockApiService } from './mock-api.service';
import type { User } from '@/store/slices/auth.slice';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-users';
  private readonly TOKEN_KEY = 'coffee-shop-token';

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.simulateDelay();

    const users = this.getFromStorage<User & { password: string }>(this.STORAGE_KEY);
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    await this.simulateDelay();

    const users = this.getFromStorage<User & { password: string }>(this.STORAGE_KEY);
    
    if (users.find((u) => u.email === email)) {
      throw new Error('Email đã được sử dụng');
    }

    const newUser: User & { password: string } = {
      id: this.generateId(),
      email,
      name,
      password,
      role: 'staff',
    };

    users.push(newUser);
    this.saveToStorage(this.STORAGE_KEY, users);

    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private generateToken(): string {
    return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with default admin user
  initializeDefaultUser(): void {
    const users = this.getFromStorage<User & { password: string }>(this.STORAGE_KEY);
    if (users.length === 0) {
      const defaultUser: User & { password: string } = {
        id: 'admin-1',
        email: 'admin@coffee.com',
        name: 'Admin',
        password: 'admin123',
        role: 'admin',
      };
      this.saveToStorage(this.STORAGE_KEY, [defaultUser]);
    }
  }
}

export const authService = new AuthService();
