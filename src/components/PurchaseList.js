import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStockAfterDelivery } from '../slices/productSlice';
import { useNavigate } from 'react-router-dom';

const PurchaseList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliveredQuantities, setDeliveredQuantities] = useState({});

  const purchasedProducts = selectedProducts.filter((product) => product.purchasedTotal > 0);

  const handleDeliveredChange = (id, value) => {
    setDeliveredQuantities({ ...deliveredQuantities, [id]: value });
  };

  const handleConfirmDelivery = (id) => {
    const deliveredQuantity = parseInt(deliveredQuantities[id], 10) || 0;
    const selectedProduct = purchasedProducts.find((product) => product.id === id);

    if (!selectedProduct) {
      alert('Producto no encontrado.');
      return;
    }

    const pendingDelivery = selectedProduct.purchasedTotal - (selectedProduct.deliveredTotal || 0);

    if (deliveredQuantity >= 0 && deliveredQuantity <= pendingDelivery) {
      // Despachar acción con la cantidad entregada
      dispatch(
        updateStockAfterDelivery({
          id,
          deliveredQuantity,
        })
      );

      // Limpiar el input de cantidad entregada
      setDeliveredQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: '',
      }));
    } else {
      alert('Cantidad entregada inválida. Verifique el total pendiente.');
    }
  };

  return (
    <div className="purchaseListContainer">
      <h2>Productos Comprados</h2>
      {purchasedProducts.length > 0 ? (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Cantidad Pedida</th>
                <th>Cantidad Entregada</th>
                <th>Pendiente</th>
                <th>Fecha de Envío</th>
                <th>Fecha de Llegada</th>
                <th>Número de Compra</th>
                <th>¿Cuántos Llegaron?</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {purchasedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.purchasedTotal || 0}</td>
                  <td>{product.deliveredTotal || 0}</td>
                  <td>{product.pendingDelivery || 0}</td>
                  <td>
                    {/* Mostrar la última fecha de envío */}
                    {product.purchaseHistory?.length > 0
                      ? product.purchaseHistory[product.purchaseHistory.length - 1].date
                      : 'No registrada'}
                  </td>
                  <td>
                    {/* Mostrar la fecha de llegada */}
                    {product.arrivalDate || 'No registrada'}
                  </td>
                  <td>
                    {/* Mostrar el número de compra */}
                    {product.purchaseNumber || 'No asignado'}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max={product.pendingDelivery}
                      value={deliveredQuantities[product.id] || ''}
                      onChange={(e) => handleDeliveredChange(product.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmDelivery(product.id)}
                    >
                      Confirmar Llegada
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate('/pamela')}
          >
            Ir a Pamela
          </button>
        </div>
      ) : (
        <p>No se han comprado productos aún.</p>
      )}
    </div>
  );
};

export default PurchaseList;
