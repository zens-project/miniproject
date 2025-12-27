import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth.slice';
import productsReducer from './slices/products.slice';
import ordersReducer from './slices/orders.slice';
import customersReducer from './slices/customers.slice';
import expensesReducer from './slices/expenses.slice';
import aiReducer from './slices/ai.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  orders: ordersReducer,
  customers: customersReducer,
  expenses: expensesReducer,
  ai: aiReducer,
});

const persistConfig = {
  key: 'coffee-shop-root',
  storage,
  whitelist: ['auth', 'products', 'customers'], // Only persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
