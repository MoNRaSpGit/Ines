import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Acción para obtener productos sin número de compra
export const fetchNoAssignedProducts = createAsyncThunk(
  'pamela/fetchNoAssignedProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/no-assigned`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Acción para actualizar un producto con un número de compra
export const updatePurchaseNumber = createAsyncThunk(
  'pamela/updatePurchaseNumber',
  async ({ id, purchaseNumber }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, {
        purchase_number: purchaseNumber,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

const pamelaSlice = createSlice({
  name: 'pamela',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    addProduct: (state, action) => {
      // Agregar solo si no existe
      const exists = state.products.some((product) => product.id === action.payload.id);
      if (!exists) {
        state.products.push(action.payload);
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoAssignedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoAssignedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchNoAssignedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener los productos';
      })
      .addCase(updatePurchaseNumber.fulfilled, (state, action) => {
        const updatedProductId = action.payload.id;
        state.products = state.products.filter((product) => product.id !== updatedProductId);
      });
  },
});


export const { addProduct, removeProduct } = pamelaSlice.actions;
export default pamelaSlice.reducer;

