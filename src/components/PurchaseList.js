import React from 'react';
import { useSelector } from 'react-redux';
import '../Style/Miercoles.css'; // Reutilizamos estilos

const PurchaseList = () => {
  const selectedProducts = useSelector((state) => state.products.selectedProducts);

  // Filtrar productos comprados
  const purchasedProducts = selectedProducts.filter((product) => product.purchased > 0);

  return (
    <div className="purchaseListContainer">
      <h2>Productos Comprados</h2>
      {purchasedProducts.length > 0 ? (
        <table className="miercolesTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad Comprada</th>
            </tr>
          </thead>
          <tbody>
            {purchasedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.purchased}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se han comprado productos aún.</p>
      )}
    </div>
  );
};

export default PurchaseList;
