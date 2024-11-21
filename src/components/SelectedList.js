import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseProduct, removeProductFromSelection } from '../slices/productSlice'; // Incluye la acción de eliminación
import 'bootstrap/dist/css/bootstrap.min.css';

const SelectedList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const dispatch = useDispatch();
  const [purchaseQuantities, setPurchaseQuantities] = useState({});
  const [purchaseDates, setPurchaseDates] = useState({});

  const handlePurchaseChange = (id, value) => {
    setPurchaseQuantities({ ...purchaseQuantities, [id]: value });
  };

  const handleDateChange = (id, value) => {
    setPurchaseDates({ ...purchaseDates, [id]: value });
  };

  const handlePurchase = (id) => {
    const purchaseQuantity = parseInt(purchaseQuantities[id], 10) || 0;
    const purchaseDate = purchaseDates[id] || new Date().toISOString().split('T')[0]; // Fecha actual por defecto
    const selectedProduct = selectedProducts.find((p) => p.id === id);

    if (!selectedProduct) {
      alert('Producto no encontrado.');
      return;
    }

    if (purchaseQuantity > 0 && purchaseQuantity <= selectedProduct.quantity) {
      // Despacha la acción para registrar la compra
      dispatch(
        purchaseProduct({
          id,
          purchaseQuantity,
          purchaseDate,
        })
      );

      // Limpia los campos después de la compra
      setPurchaseQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: '',
      }));
      setPurchaseDates((prevDates) => ({
        ...prevDates,
        [id]: new Date().toISOString().split('T')[0], // Resetea la fecha al día actual
      }));
    } else {
      alert('Cantidad inválida. Verifique el stock disponible.');
    }
  };

  const handleRemove = (id) => {
    dispatch(removeProductFromSelection(id)); // Llama a la acción de eliminación
  };

  return (
    <div className="container mt-5">
      <h2>Productos Seleccionados</h2>
      {selectedProducts.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad Total</th>
              <th>Unidad</th>
              <th>Total Comprado</th>
              <th>Total Entregado</th>
              <th>Pendiente</th>
              <th>Fecha de Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td> {/* Mostrar cantidad actual calculada */}
                <td>{product.unit}</td>
                <td>{product.purchasedTotal || 0}</td>
                <td>{product.deliveredTotal || 0}</td>
                <td>{product.pendingDelivery || 0}</td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={purchaseDates[product.id] || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(product.id, e.target.value)}
                  />
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={purchaseQuantities[product.id] || ''}
                      onChange={(e) => handlePurchaseChange(product.id, e.target.value)}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handlePurchase(product.id)}
                    >
                      Comprar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(product.id)} // Llama a la función de eliminación
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos seleccionados.</p>
      )}
    </div>
  );
};

export default SelectedList;
