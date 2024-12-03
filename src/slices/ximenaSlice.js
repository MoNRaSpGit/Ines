import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://ines-back.onrender.com/api';

// Thunk para obtener compras sin número de compra
export const fetchComprasSinNumero = createAsyncThunk(
  'ximena/fetchComprasSinNumero',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/compras/sin-numero`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener compras sin número de compra:', error);
      return rejectWithValue('Error al obtener las compras.');
    }
  }
);

// Thunk para actualizar el número de compra
export const actualizarNumeroCompra = createAsyncThunk(
  'ximena/actualizarNumeroCompra',
  async (cambios, { rejectWithValue }) => {
    try {
      const promises = cambios.map((cambio) =>
        axios.put(`${API_BASE_URL}/compras/actualizar-numero`, cambio)
      );

      await Promise.all(promises);
      return cambios;
    } catch (error) {
      console.error('Error al actualizar número de compra:', error);
      return rejectWithValue('Error al actualizar las compras.');
    }
  }
);

const ximenaSlice = createSlice({
  name: 'ximena',
  initialState: {
    compras: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener compras
      .addCase(fetchComprasSinNumero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprasSinNumero.fulfilled, (state, action) => {
        state.loading = false;
        state.compras = action.payload;
      })
      .addCase(fetchComprasSinNumero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar números de compra
      .addCase(actualizarNumeroCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarNumeroCompra.fulfilled, (state, action) => {
        state.loading = false;
        // Filtrar las compras actualizadas
        state.compras = state.compras.filter(
          (compra) => !action.payload.some((cambio) => cambio.id === compra.id)
        );
      })
      .addCase(actualizarNumeroCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ximenaSlice.reducer;
