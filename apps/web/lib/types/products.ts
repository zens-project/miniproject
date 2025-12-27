export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  COFFEE = 'coffee',      // Cà phê
  TEA = 'tea',           // Trà
  DESSERT = 'dessert',   // Bánh ngọt
  SNACK = 'snack',       // Snack
  OTHER = 'other'        // Khác
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | '';
  availability: 'all' | 'available' | 'unavailable';
  sortBy: ProductSortBy;
  sortOrder: 'asc' | 'desc';
}

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  CATEGORY = 'category',
  CREATED_AT = 'createdAt'
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: ProductCategory | '';
  imageUrl: string;
  isAvailable: boolean;
}

export interface ProductState {
  items: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
}

// Category display information
export const PRODUCT_CATEGORIES = [
  { 
    value: ProductCategory.COFFEE, 
    label: 'Cà phê', 
    icon: '☕',
    color: 'amber'
  },
  { 
    value: ProductCategory.TEA, 
    label: 'Trà', 
    icon: '🍵',
    color: 'green'
  },
  { 
    value: ProductCategory.DESSERT, 
    label: 'Bánh ngọt', 
    icon: '🧁',
    color: 'pink'
  },
  { 
    value: ProductCategory.SNACK, 
    label: 'Snack', 
    icon: '🥨',
    color: 'orange'
  },
  { 
    value: ProductCategory.OTHER, 
    label: 'Khác', 
    icon: '🍽️',
    color: 'gray'
  }
];
