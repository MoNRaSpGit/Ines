import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { addProductToSelection } from '../slices/productSlice'; // Ajusta la ruta según tu estructura
import '../Style/ProductTable.css'; // Ajusta la ruta del CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const ProductTable = () => {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({}); // Manejar las cantidades ingresadas por fila
  const [selectedRows, setSelectedRows] = useState({}); // Estado para manejar el tick de selección
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Base URL del API (de .env)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSelect = async (id) => {
    const product = products.find((p) => p.id === id);
    const quantity = parseInt(quantities[id], 10);
    
    if (quantity > 0) {
      // Obtener la fecha actual en la zona horaria de Montevideo
      const currentDate = dayjs().tz('America/Montevideo').format('YYYY-MM-DD');

      // Guardar en el estado global
      dispatch(addProductToSelection({ id, quantity })); // Agregar producto con cantidad al store
      setSelectedRows({ ...selectedRows, [id]: true }); // Marcar fila como seleccionada

      // Guardar los datos en la base de datos (TablaExcel)
      try {
        const response = await axios.post(`${API_BASE_URL}/api/excel/save`, {
          classification: product.classification,
          code: product.code,
          product_name: product.name,
          unit: product.unit,
          quantity: quantity,
          observation_date: currentDate, // Se agrega la fecha actual
          observation_place: null, // Se inicializa como null porque no se ingresa aquí
        });

        if (response.status === 200) {
          toast.success('Producto guardado exitosamente en la base de datos.', {
            position: 'top-right',
            icon: '✔️',
          });
        } else {
          throw new Error('Error al guardar el producto.');
        }
      } catch (error) {
        console.error('Error al guardar el producto en la base de datos:', error);
        toast.error('Error al guardar el producto en la base de datos.', {
          position: 'top-right',
          icon: '⚠️',
        });
      }
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
      <ToastContainer />
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
