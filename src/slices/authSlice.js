import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, thunkAPI) => {
      try {
        const response = await fetch('https://ines-back.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Error desconocido');
        }
  
        const data = await response.json();
        return data; // Asegúrate de que `data` incluya el token y el rol del usuario
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      loading: false,
      error: null,
      isAuthenticated: false,
      token: null,
      user: null, // Aquí se guarda el rol del usuario
    },
    reducers: {
      clearState: (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user; // Guardar el usuario autenticado
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { clearState } = authSlice.actions;
  export default authSlice.reducer;
  