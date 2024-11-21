import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPurchaseNumber } from '../slices/productSlice';

const Pamela = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const dispatch = useDispatch();
  const [purchaseNumbers, setPurchaseNumbers] = useState({});

  const handlePurchaseNumberChange = (id, value) => {
    setPurchaseNumbers({ ...purchaseNumbers, [id]: value });
  };

  const handleSendForm = (id) => {
    const purchaseNumber = purchaseNumbers[id];
    if (!purchaseNumber) {
      alert('Por favor, ingrese un número de compra válido.');
      return;
    }

    // Despacha la acción para actualizar el número de compra
    dispatch(addPurchaseNumber({ id, purchaseNumber }));
    alert(`Formulario enviado para el producto ${id} con el número de compra: ${purchaseNumber}`);
  };

  return (
    <div className="container mt-5">
      <h2>Formulario de Compra</h2>
      {selectedProducts.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Total Comprado</th>
              <th>Fecha de Compra</th>
              <th>Número de Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.purchasedTotal || 0}</td>
                <td>
                  {/* Muestra la fecha de compra más reciente */}
                  {product.purchaseHistory?.length > 0
                    ? product.purchaseHistory[product.purchaseHistory.length - 1].date
                    : 'No registrada'}
                </td>
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
      ) : (
        <p>No hay productos seleccionados.</p>
      )}
    </div>
  );
};

export default Pamela;
