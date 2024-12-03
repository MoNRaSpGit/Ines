import { createSlice } from '@reduxjs/toolkit';

const comprasSlice = createSlice({
  name: 'compras',
  initialState: {
    comprasData: [], // Datos globales de las compras
  },
  reducers: {
    setComprasData: (state, action) => {
      state.comprasData = action.payload; // Guardar datos procesados en el store
    },
  },
});

export const { setComprasData } = comprasSlice.actions;

export default comprasSlice.reducer;
