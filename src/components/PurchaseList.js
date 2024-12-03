import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PurchaseList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Sincronizar los productos comprados con los productos seleccionados
  useEffect(() => {
    console.log('selectedProducts en PurchaseList:', selectedProducts);
    
    // Filtra los productos que tienen un `purchasedTotal` mayor a 0
    const filteredPurchasedProducts = selectedProducts.filter(
      (product) => product.purchasedTotal > 0
    );
    
    setPurchasedProducts(filteredPurchasedProducts);
    console.log('purchasedProducts en PurchaseList después del filtro:', filteredPurchasedProducts);
  }, [selectedProducts]);
  

  const handleSaveToDatabase = async () => {
    const dataToSave = purchasedProducts.map((product) => ({
      purchase_number: product.purchaseNumber || 'No asignado',
      product_name: product.name,
      quantity_requested: product.purchasedTotal || 0,
      pending_delivery: product.pendingDelivery || 0,
      unit: product.unit || null,
      shipping_date: product.purchaseHistory[0]?.date
        ? dayjs(product.purchaseHistory[0].date).format('YYYY-MM-DD')
        : null,
    }));
  
    try {
      console.log('Datos a enviar al backend:', dataToSave);
      const response = await axios.post(`${API_BASE_URL}/api/purchases`, dataToSave);
  
      if (response.status === 200 || response.status === 201) {
        console.log('Datos enviados al backend:', response.data);
        toast.success('Datos guardados en la base de datos exitosamente!', {
          position: 'top-center',
          icon: '📦',
        });
        
        // Eliminar la limpieza manual del estado:
        // setPurchasedProducts([]); // Limpiar productos después de guardar
        
        // En lugar de limpiar `purchasedProducts`, confiamos en el `useEffect` para sincronizar con `selectedProducts`
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error);
      toast.error('Error al guardar los datos en la base de datos.', {
        position: 'top-center',
        icon: '⚠️',
      });
    }
  };
  
  return (
    <div className="purchaseListContainer">
      <ToastContainer />
      <h2>Productos Comprados</h2>
      {purchasedProducts.length > 0 ? (
        <div>
          <table className="purchaseListTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Cantidad Pedida</th>
                <th>Pendiente</th>
                <th>Fecha de Envío</th>
                <th>Número de Compra</th>
              </tr>
            </thead>
            <tbody>
              {purchasedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.unit || 'No registrada'}</td>
                  <td>{product.purchasedTotal || 0}</td>
                  <td>{product.pendingDelivery || 0}</td>
                  <td>
                    {product.purchaseHistory?.length > 0
                      ? dayjs(product.purchaseHistory[0].date).format('DD/MM/YYYY')
                      : 'No registrada'}
                  </td>
                  <td>{product.purchaseNumber || 'No asignado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-info mt-3" onClick={handleSaveToDatabase}>
            Guardar
          </button>
        </div>
      ) : (
        <p>No se han comprado productos aún.</p>
      )}
    </div>
  );
};

export default PurchaseList;
