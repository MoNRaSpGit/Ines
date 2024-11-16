// src/redux/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { id: 1, name: 'Cemento Portland', price: 120, stock: 0 },
    { id: 2, name: 'Arena Fina', price: 50, stock: 0 },
    { id: 3, name: 'Hierro Corrugado', price: 300, stock: 0 },
    { id: 4, name: 'Ladrillo Común', price: 10, stock: 0 },
    { id: 5, name: 'Cal Hidratada', price: 80, stock: 0 },
    { id: 6, name: 'Teja Colonial', price: 25, stock: 0 },
    { id: 7, name: 'Azulejos Cerámicos', price: 150, stock: 0 },
    { id: 8, name: 'Tubo PVC', price: 100, stock: 0 },
  ],
  selectedProducts: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProductToSelection: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find(p => p.id === id);
      if (product) {
        const selectedProduct = state.selectedProducts.find(p => p.id === id);
        if (!selectedProduct) {
          state.selectedProducts.push({ ...product, quantity, purchased: 0 });
        } else {
          selectedProduct.quantity = quantity;
        }
      }
    },
    removeProductFromSelection: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter(p => p.id !== action.payload);
    },
    purchaseProduct: (state, action) => {
      const { id, purchaseQuantity } = action.payload;
      const selectedProduct = state.selectedProducts.find(p => p.id === id);
      if (selectedProduct && purchaseQuantity <= selectedProduct.quantity - selectedProduct.purchased) {
        selectedProduct.purchased += purchaseQuantity;
      }
    },
  },
});

export const { addProductToSelection, removeProductFromSelection, purchaseProduct } = productSlice.actions;
export default productSlice.reducer;
