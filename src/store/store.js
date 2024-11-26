import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slices/productSlice';
import registerSlice from '../slices/registerSlice';
import authSlice from '../slices/authSlice';
import pamelaReducer from '../slices/pamelaSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
    register: registerSlice,
    auth: authSlice,
    pamela: pamelaReducer,
  },
});

export default store;



