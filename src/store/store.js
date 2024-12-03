import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slices/productSlice';
import registerSlice from '../slices/registerSlice';
import authSlice from '../slices/authSlice';
import pamelaReducer from '../slices/pamelaSlice';
import comprasReducer from '../slices/comprasSlice'; // Ajusta la ruta
import registroComprasReducer from '../slices/registroComprasSlice'; // Importar el nuevo slice
import comprasBddReducer from '../slices/comprasBddSlice';
import ximenaReducer from '../slices/ximenaSlice';
import camionReducer from '../slices/camionSlice';
import stockReducer from '../slices/stockSlice'; // Importar el slice de stock


const store = configureStore({
  reducer: {
    products: productSlice,
    register: registerSlice,
    auth: authSlice,
    pamela: pamelaReducer,
    compras: comprasReducer,
    registroCompras: registroComprasReducer, // Nuevo slice
    comprasBdd: comprasBddReducer, // Nuevo slice
    ximena: ximenaReducer,
    camion: camionReducer,
    stock: stockReducer, // Agregar el slice de stock
  },
});

export default store;








