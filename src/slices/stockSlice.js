import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    confirmados: [], // Datos confirmados del stock
  },
  reducers: {
    agregarStockConfirmado: (state, action) => {
      const confirmado = action.payload;
      state.confirmados = [
        ...state.confirmados.filter((item) => item.id !== confirmado.id), // Evitar duplicados
        confirmado,
      ];
    },
  },
});

export const { agregarStockConfirmado } = stockSlice.actions;
export default stockSlice.reducer;
