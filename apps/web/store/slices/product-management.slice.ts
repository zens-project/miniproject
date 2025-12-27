import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState, ProductFilters, ProductSortBy, ProductCategory } from '@/lib/types/products';
import mockData from '@/lib/mock-data/products.json';

// Simulate API calls with mock data
export const fetchProducts = createAsyncThunk(
  'productManagement/fetchAll',
  async (filters?: Partial<ProductFilters>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert string dates to Date objects
    let products: Product[] = mockData.products.map(product => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
      category: product.category as ProductCategory
    }));

    // Apply filters
    if (filters) {
      if (filters.search) {
        products = products.filter(product => 
          product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          product.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      if (filters.category) {
        products = products.filter(product => product.category === filters.category);
      }
      
      if (filters.availability && filters.availability !== 'all') {
        const isAvailable = filters.availability === 'available';
        products = products.filter(product => product.isAvailable === isAvailable);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        products.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];
          
          if (filters.sortBy === ProductSortBy.PRICE) {
            aValue = Number(aValue);
            bValue = Number(bValue);
          } else if (filters.sortBy === ProductSortBy.CREATED_AT) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
    }

    return products;
  }
);

export const createProduct = createAsyncThunk(
  'productManagement/create',
  async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newProduct;
  }
);

export const updateProduct = createAsyncThunk(
  'productManagement/update',
  async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date()
      }
    };
  }
);

export const deleteProduct = createAsyncThunk(
  'productManagement/delete',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return id;
  }
);

export const toggleProductAvailability = createAsyncThunk(
  'productManagement/toggleAvailability',
  async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return { id, isAvailable, updatedAt: new Date() };
  }
);

const initialState: ProductState = {
  items: [],
  filters: {
    search: '',
    category: '',
    availability: 'all',
    sortBy: ProductSortBy.NAME,
    sortOrder: 'asc'
  },
  isLoading: false,
  isSubmitting: false,
  error: undefined
};

const productManagementSlice = createSlice({
  name: 'productManagement',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách sản phẩm';
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể tạo sản phẩm';
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật sản phẩm';
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa sản phẩm';
      })
      // Toggle availability
      .addCase(toggleProductAvailability.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(toggleProductAvailability.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].isAvailable = action.payload.isAvailable;
          state.items[index].updatedAt = action.payload.updatedAt;
        }
      })
      .addCase(toggleProductAvailability.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể thay đổi trạng thái sản phẩm';
      });
  }
});

export const { setFilters, clearError } = productManagementSlice.actions;
export default productManagementSlice.reducer;
