// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slices/productSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
  },
});

export default store;
