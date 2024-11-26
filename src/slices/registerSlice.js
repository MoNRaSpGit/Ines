import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Acción asíncrona para registrar un usuario
export const registerUser = createAsyncThunk(
    'register/registerUser',
    async (userData, thunkAPI) => {
      try {
        // Asegurar el rol por defecto si no está presente
        const userDataWithRole = { ...userData, role: 'common' };
  
        const response = await fetch('http://localhost:3001/api/register', { // Verifica la URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userDataWithRole),
        });
  
        // Verifica si la respuesta tiene un código de error HTTP
        if (!response.ok) {
          // Si la respuesta no es JSON válida, captura el texto para un mensaje más claro
          const errorText = await response.text();
          throw new Error(`Error en el registro: ${response.status} - ${errorText}`);
        }
  
        // Intenta parsear la respuesta como JSON
        const data = await response.json();
        return data;
      } catch (error) {
        // Captura el mensaje del error y lo envía al thunk
        return thunkAPI.rejectWithValue(error.message || 'Error desconocido en el registro');
      }
    }
  );
  
  

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = registerSlice.actions;
export default registerSlice.reducer;
