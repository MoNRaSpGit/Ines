import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToSelection } from '../slices/productSlice'; // Ajusta la ruta según tu estructura
import '../Style/ProductTable.css'; // Ajusta la ruta del CSS

const ProductTable = () => {
  const products = useSelector((state) => state.products.products);
//  console.log("soy el producto", products);

  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({}); // Manejar las cantidades ingresadas por fila
  const [selectedRows, setSelectedRows] = useState({}); // Estado para manejar el tick de selección
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="productTableContainer">
      <h2>Lista de Productos</h2>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Buscar por nombre, código o clasificación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="productSearchInput"
        />
      </div>
      <table className="productTable">
        <thead>
          <tr>
            <th>N°</th>
            <th>Clasificación del Insumo</th>
            <th>Código del Insumo</th>
            <th>Nombre del Insumo</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Acciones</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.classification}</td>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.unit}</td>
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
              <td>{selectedRows[product.id] && <span className="productTick">✔</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
