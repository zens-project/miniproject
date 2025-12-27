import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '@/lib/services/product.service';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  isAvailable: boolean;
}

interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
}

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const products = await productService.getAll();
  return products;
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: Omit<Product, 'id'>) => {
    const newProduct = await productService.create(product);
    return newProduct;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const updated = await productService.update(id, data);
    return updated;
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: string) => {
  await productService.delete(id);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Create product
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // Update product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Delete product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    });
  },
});

export const { setSelectedCategory, clearError } = productsSlice.actions;
export default productsSlice.reducer;
