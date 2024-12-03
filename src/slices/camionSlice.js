import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://ines-back.onrender.com/api';

// Thunk para filtrar compras por fecha
export const fetchComprasPorFecha = createAsyncThunk(
  'camion/fetchComprasPorFecha',
  async (fecha_envio, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/compras/filtrar-por-fecha`, {
        params: { fecha_envio },
      });
      return response.data;
    } catch (error) {
      console.error('Error al filtrar compras por fecha:', error);
      return rejectWithValue('Error al filtrar las compras por fecha.');
    }
  }
);

// Thunk para filtrar compras por número de compra
export const fetchComprasPorNumero = createAsyncThunk(
  'camion/fetchComprasPorNumero',
  async (numero_compra, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/compras/filtrar-por-numero`, {
        params: { numero_compra },
      });
      return response.data;
    } catch (error) {
      console.error('Error al filtrar compras por número:', error);
      return rejectWithValue('Error al filtrar las compras por número.');
    }
  }
);

const camionSlice = createSlice({
  name: 'camion',
  initialState: {
    compras: [],
    confirmados: [], // Agregamos una lista para las confirmaciones
    loading: false,
    error: null,
  },
  reducers: {
    confirmarCompra: (state, action) => {
      // Guardar datos confirmados en el estado global
      const compraConfirmada = action.payload;
      console.log("soy el confirmar" , compraConfirmada);
      
      state.confirmados = [
        ...state.confirmados.filter((item) => item.id !== compraConfirmada.id), // Evitar duplicados
        compraConfirmada,
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      // Filtrar por fecha
      .addCase(fetchComprasPorFecha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprasPorFecha.fulfilled, (state, action) => {
        state.loading = false;
        state.compras = action.payload;
      })
      .addCase(fetchComprasPorFecha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filtrar por número
      .addCase(fetchComprasPorNumero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprasPorNumero.fulfilled, (state, action) => {
        state.loading = false;
        state.compras = action.payload;
      })
      .addCase(fetchComprasPorNumero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { confirmarCompra } = camionSlice.actions;
export default camionSlice.reducer;
