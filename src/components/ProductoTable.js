import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToSelection } from '../slices/productSlice'; // Ajusta la ruta según tu estructura
import '../Style/ProductTable.css'; // Ajusta la ruta del CSS

const ProductTable = () => {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({}); // Manejar las cantidades ingresadas por fila
  const [selectedRows, setSelectedRows] = useState({}); // Estado para manejar el tick de selección

  const handleSelect = (id) => {
    const quantity = parseInt(quantities[id], 10);
    if (quantity > 0) {
      dispatch(addProductToSelection({ id, quantity })); // Agregar producto con cantidad al store
      setSelectedRows({ ...selectedRows, [id]: true }); // Marcar fila como seleccionada
    } else {
      alert('Por favor ingrese una cantidad válida.');
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
    setSelectedRows({ ...selectedRows, [id]: false }); // Quitar tick si cambia la cantidad
  };

  return (
    <div className="productTableContainer">
      <h2>Lista de Productos</h2>
      <table className="productTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <input
                  type="number"
                  className="productInput"
                  min="1"
                  value={quantities[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  placeholder="Cantidad"
                />
              </td>
              <td>
                <button
                  className="productSelectButton"
                  onClick={() => handleSelect(product.id)}
                >
                  Seleccionar
                </button>
              </td>
              <td>
                {selectedRows[product.id] && (
                  <span className="productTick">✔</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
