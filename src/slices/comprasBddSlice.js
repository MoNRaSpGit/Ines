import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Thunk para enviar datos a la API
export const enviarCompras = createAsyncThunk(
  'comprasBdd/enviarCompras',
  async (data, { rejectWithValue }) => {
    try {
      // Asegurarnos de que accedemos correctamente al arreglo de registros
      const registros = data.registros;

      // Transformar los registros si es necesario
      const registrosTransformados = registros.map((registro) => ({
        ...registro,
        fecha_envio: registro.fecha_envio, // Asegurar que está en el formato correcto
      }));

      // Enviar la solicitud al backend
      const response = await axios.post(`https://ines-back.onrender.com/api/compras`, {
        registros: registrosTransformados,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('Error al enviar los datos.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      return rejectWithValue('Error al enviar los datos.');
    }
  }
);


const comprasBddSlice = createSlice({
  name: 'comprasBdd',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enviarCompras.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(enviarCompras.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(enviarCompras.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default comprasBddSlice.reducer;
