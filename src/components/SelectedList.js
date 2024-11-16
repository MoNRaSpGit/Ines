// src/components/SelectedList/SelectedList.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseProduct, removeProductFromSelection } from '../slices/productSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const SelectedList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  const dispatch = useDispatch();
  const [purchaseQuantities, setPurchaseQuantities] = useState({});

  const handlePurchaseChange = (id, value) => {
    setPurchaseQuantities({ ...purchaseQuantities, [id]: value });
  };

  const handlePurchase = (id) => {
    const purchaseQuantity = parseInt(purchaseQuantities[id], 10) || 0;
    const selectedProduct = selectedProducts.find((p) => p.id === id);

    if (purchaseQuantity > 0 && purchaseQuantity <= selectedProduct.quantity - selectedProduct.purchased) {
      dispatch(purchaseProduct({ id, purchaseQuantity }));
    } else {
      alert('Cantidad inválida. Verifique el stock disponible.');
    }
  };

  const handleRemove = (id) => {
    dispatch(removeProductFromSelection(id));
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
              <th>Precio</th>
              <th>Cantidad Disponible</th>
              <th>Cantidad Comprada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.quantity - product.purchased}</td>
                <td>{product.purchased}</td>
                <td>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max={product.quantity - product.purchased}
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
                      onClick={() => handleRemove(product.id)}
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
