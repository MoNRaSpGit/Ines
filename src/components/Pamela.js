import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNoAssignedProducts, updatePurchaseNumber } from '../slices/pamelaSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify
import { updateProductPurchaseNumber } from '../slices/productSlice';


const Pamela = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.pamela);
  const { user } = useSelector((state) => state.auth); // Obtener usuario del estado global
  const [purchaseNumbers, setPurchaseNumbers] = useState({});
  const [localProducts, setLocalProducts] = useState([]);

  // Sincronizar el estado local con los productos del estado global
  useEffect(() => {
    dispatch(fetchNoAssignedProducts());
    setLocalProducts(products);
  }, [products, dispatch]);

  // Manejar el cambio de número de compra
  const handlePurchaseNumberChange = (id, value) => {
    setPurchaseNumbers({ ...purchaseNumbers, [id]: value });
  };

  // Enviar el formulario para actualizar el número de compra
  const handleSendForm = async (id) => {
    const purchaseNumber = purchaseNumbers[id];
    if (!purchaseNumber) {
      toast.error('Por favor, ingrese un número de compra válido.', { position: 'top-center' });
      return;
    }
  
    try {
      console.log("Despachando 'updatePurchaseNumber' para el producto con ID:", id);
      
      // Primero, actualiza el estado en pamelaSlice (esto también actualizará la base de datos)
      const updatedProduct = await dispatch(updatePurchaseNumber({ id, purchaseNumber })).unwrap();
      console.log('Número de compra actualizado en pamelaSlice:', updatedProduct);
  
      // Ahora, actualiza el estado en productSlice para mantener `PurchaseList` sincronizado
      console.log("Despachando 'updateProductPurchaseNumber' en productSlice para el producto con ID:", id);
      await dispatch(updateProductPurchaseNumber({ id, purchaseNumber }));
      console.log('Estado de productSlice actualizado con número de compra.');
  
      // Esperar un poco antes de eliminar para asegurarse de que el estado esté sincronizado
      setTimeout(() => {
        // Eliminar producto del estado local y del pamelaSlice después de actualizar `productSlice`
        setLocalProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        dispatch({ type: 'pamela/removeProduct', payload: id }); // Acción para remover del estado pamela
        console.log('Producto eliminado del pamelaSlice y estado local.');
      }, 500); // Asegúrate de que el retardo permita la sincronización completa del estado
    } catch (error) {
      toast.error('Hubo un error al actualizar el número de compra.', { position: 'top-center' });
      console.error('Error al actualizar el número de compra:', error);
    }
  };
  
  
  
  // Formatear la fecha a YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return 'No registrada';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Obtener un saludo personalizado basado en la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="container mt-5">
      {/* Encabezado amigable */}
      <div className="text-center mb-4">
        <h1>
          {getGreeting()}, {user?.username || 'Usuario'}!
        </h1>
        <p className="text-muted">Aquí puedes gestionar los productos sin número asignado.</p>
      </div>

      {/* Mostrar error general si existe */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabla de productos */}
      {localProducts.length > 0 ? (
        <div className="card shadow p-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre del Producto</th>
                <th>Cantidad Pedida</th>
                <th>Fecha de Envío</th>
                <th>Número de Compra</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {localProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.quantity_requested}</td>
                  <td>{formatDate(product.shipping_date)}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={purchaseNumbers[product.id] || ''}
                      onChange={(e) => handlePurchaseNumberChange(product.id, e.target.value)}
                      placeholder="Número de Compra"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSendForm(product.id)}
                    >
                      Enviar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info text-center mt-4">
          No hay productos sin número de compra en este momento.
        </div>
      )}

      {/* Contenedor de notificaciones */}
      <ToastContainer />
    </div>
  );
};

export default Pamela;
