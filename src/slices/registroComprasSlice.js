import { createSlice } from '@reduxjs/toolkit';

const registroComprasSlice = createSlice({
  name: 'registroCompras',
  initialState: {
    registros: [], // Arreglo para almacenar los registros de compras
  },
  reducers: {
    agregarRegistro: (state, action) => {
      state.registros.push(action.payload); // Agregar un nuevo registro
      console.log("soy el producto comprado ", action.payload);
    },
    eliminarRegistro: (state, action) => {
      state.registros = state.registros.filter((_, index) => index !== action.payload); // Eliminar por índice
    },
    actualizarRegistro: (state, action) => {
      const { index, data } = action.payload;
      state.registros[index] = { ...state.registros[index], ...data }; // Actualizar un registro específico
      
      
    },
  },
});

export const { agregarRegistro, eliminarRegistro, actualizarRegistro } = registroComprasSlice.actions;

export default registroComprasSlice.reducer;
