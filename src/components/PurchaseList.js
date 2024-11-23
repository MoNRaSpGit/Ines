import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // Importamos Day.js

const PurchaseList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState(
    selectedProducts.filter((product) => product.purchasedTotal > 0)
  );

  const handleSaveToDatabase = async () => {
    const dataToSave = purchasedProducts.map((product) => ({
      purchase_number: product.purchaseNumber || 'No asignado',
      product_name: product.name,
      quantity_requested: product.purchasedTotal || 0,
      pending_delivery: product.pendingDelivery || 0,
      unit: product.unit || null,
      shipping_date: product.purchaseHistory[0]?.date
        ? dayjs(product.purchaseHistory[0].date).format('YYYY-MM-DD') // Fecha en formato ISO para la base de datos
        : null,
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/purchases', dataToSave);

      if (response.status === 200 || response.status === 201) {
        console.log('Datos enviados al backend:', response.data);
        alert('Datos guardados en la base de datos exitosamente.');
        setPurchasedProducts([]);
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error);
      alert('Error al guardar los datos en la base de datos.');
    }
  };

  return (
    <div className="purchaseListContainer">
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
                      ? dayjs(product.purchaseHistory[0].date).format('DD/MM/YYYY') // Fecha en formato DD/MM/YYYY
                      : 'No registrada'}
                  </td>
                  <td>{product.purchaseNumber || 'No asignado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success mt-3" onClick={() => navigate('/pamela')}>
            Ir a Pamela
          </button>
          <button className="btn btn-info mt-3" onClick={handleSaveToDatabase}>
            Guardar en la Base de Datos
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/filtered-purchases')}>
            Ver Compras Filtradas
          </button>
        </div>
      ) : (
        <p>No se han comprado productos aún.</p>
      )}
    </div>
  );
};

export default PurchaseList;
