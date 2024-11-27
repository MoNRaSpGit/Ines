import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import productos from '../productoJSON/productos_limpios.json'; // Ajusta la ruta según tu estructura

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  products: productos
    .filter((producto) => producto.id !== 1) // Excluye la fila de encabezados
    .map((producto) => ({
      id: producto.id, // Utiliza el ID del JSON
      name: producto.name, // Nombre del insumo
      classification: producto.classification, // Clasificación del insumo
      code: producto.code, // Código del insumo
      unit: producto.unit, // Unidad
    })),
  selectedProducts: [],  
};

export const updateDeliveredAndArrival = createAsyncThunk(
  'products/updateDeliveredAndArrival',
  async ({ id, quantity_delivered, arrival_date }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/purchases/${id}`, {
        quantity_delivered,
        arrival_date,
      });
      return { id, quantity_delivered, arrival_date };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProductToSelection: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        const selectedProduct = state.selectedProducts.find((p) => p.id === id);
        if (!selectedProduct) {
          state.selectedProducts.push({
            ...product,
            initialQuantity: quantity, // Cantidad inicial seleccionada
            quantity, // Inicialmente igual a la cantidad seleccionada
            pendingDelivery: 0,
            deliveredTotal: 0,
            purchasedTotal: 0,
          });
        } else {
          selectedProduct.initialQuantity = quantity;
          selectedProduct.quantity = quantity; // Actualizar cantidad seleccionada
        }
      }
    },    
    removeProductFromSelection: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter((p) => p.id !== action.payload);
    },
    purchaseProduct: (state, action) => {
      const { id, purchaseQuantity, purchaseDate } = action.payload;
      const selectedProduct = state.selectedProducts.find((p) => p.id === id);
    
      if (!selectedProduct) {
        console.error(`Producto con ID ${id} no encontrado en la lista seleccionada.`);
        return;
      }
    
      if (purchaseQuantity > 0) {
        // Incrementar los pendientes
        selectedProduct.pendingDelivery = (selectedProduct.pendingDelivery || 0) + purchaseQuantity;
    
        // Registrar el total comprado
        selectedProduct.purchasedTotal = (selectedProduct.purchasedTotal || 0) + purchaseQuantity;
    
        // Registrar la compra en el historial
        selectedProduct.purchaseHistory = selectedProduct.purchaseHistory || [];
        selectedProduct.purchaseHistory.push({ quantity: purchaseQuantity, date: purchaseDate });
      } else {
        console.error('Cantidad de compra inválida.');
      }
    },    
    updateStockAfterDelivery: (state, action) => {
      const { id, deliveredQuantity } = action.payload;
      const selectedProduct = state.selectedProducts.find((p) => p.id === id);
    
      if (!selectedProduct) {
        console.error(`Producto con ID ${id} no encontrado en la lista seleccionada.`);
        return;
      }
    
      const pendingDelivery = selectedProduct.pendingDelivery || 0;
    
      if (deliveredQuantity >= 0 && deliveredQuantity <= pendingDelivery) {
        // Reducir los pendientes
        selectedProduct.pendingDelivery -= deliveredQuantity;
    
        // Acumular el total entregado
        selectedProduct.deliveredTotal = (selectedProduct.deliveredTotal || 0) + deliveredQuantity;
    
        // Calcular la cantidad actual correctamente
        selectedProduct.quantity =
          selectedProduct.initialQuantity - selectedProduct.deliveredTotal - selectedProduct.pendingDelivery;
    
        // Registrar la fecha de llegada si se confirma la entrega
        if (deliveredQuantity > 0) {
          selectedProduct.arrivalDate = new Date().toISOString().split('T')[0]; // Fecha actual
        }
      } else {
        console.error(`Cantidad entregada inválida para el producto ${id}`);
      }
    },           
    addPurchaseNumber: (state, action) => {
      const { id, purchaseNumber } = action.payload;

     // console.log("tengo que tener el numero", action.payload);
      
      const selectedProduct = state.selectedProducts.find((p) => p.id === id);
    
      if (!selectedProduct) {
        console.error(`Producto con ID ${id} no encontrado en la lista seleccionada.`);
        return;
      }
    
      // Guardar el número de compra en el producto principal
      selectedProduct.purchaseNumber = purchaseNumber;
    
      // Si no existe un historial, créalo
      if (!selectedProduct.purchaseHistory) {
        selectedProduct.purchaseHistory = [];
      }
    
      // Añadir el número de compra al historial si no existe
      const existingEntry = selectedProduct.purchaseHistory.find((entry) => entry.purchaseNumber === purchaseNumber);
      if (!existingEntry) {
        selectedProduct.purchaseHistory.push({ purchaseNumber });
      }
    },    
    confirmPurchase: (state, action) => {
      const { id, purchaseQuantity } = action.payload;
      const product = state.stock.byId[id];
    
      if (product && product.currentQuantity >= purchaseQuantity) {
        product.currentQuantity -= purchaseQuantity; // Reducir stock actual
        product.purchasedTotal = (product.purchasedTotal || 0) + purchaseQuantity; // Registrar total comprado
      }
    },    
  },
});

export const {
  addProductToSelection,
  removeProductFromSelection,
  purchaseProduct,
  updateStockAfterDelivery,
  confirmPurchase,
  addPurchaseNumber,
} = productSlice.actions;
export default productSlice.reducer;