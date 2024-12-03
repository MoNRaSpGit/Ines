import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Importamos la librería xlsx

const formatDate = (dateString) => {
  if (!dateString) return 'No registrada';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Devuelve formato YYYY-MM-DD
};

const FilteredPurchases = () => {
  const [filters, setFilters] = useState({ shipping_date: '', purchase_number: '' });
  const [results, setResults] = useState([]);
  const [deliveredQuantities, setDeliveredQuantities] = useState({});
  const [arrivalDates, setArrivalDates] = useState({});
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const fetchFilteredResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/purchases/filter`, {
        params: filters,
      });
  
      // Eliminar duplicados antes de actualizar los resultados
      const uniqueResults = response.data.filter(
        (item, index, self) => self.findIndex((i) => i.id === item.id) === index
      );
  
      setResults(uniqueResults);
      toast.success('Datos filtrados obtenidos exitosamente.', {
        position: 'top-right',
        icon: '🔍',
      });
    } catch (error) {
      console.error('Error al filtrar los datos:', error);
      toast.error('Error al obtener los datos filtrados.', {
        position: 'top-right',
        icon: '⚠️',
      });
    }
  };

  const handleDeliveredChange = (id, value) => {
    setDeliveredQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleArrivalDateChange = (id, value) => {
    setArrivalDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirmArrival = async (id) => {
    const deliveredQuantity = parseInt(deliveredQuantities[id], 10) || 0;
    const arrivalDate = arrivalDates[id] ? new Date(arrivalDates[id]).toISOString().split('T')[0] : null;
  
    if (deliveredQuantity <= 0 || !arrivalDate) {
      toast.error('Por favor ingrese una cantidad válida y una fecha de llegada.', {
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }
  
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
    if (arrivalDate < todayFormatted) {
      toast.error('La fecha de llegada no puede ser anterior a la fecha actual.', {
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }
  
    try {
      const response = await axios.put(`${API_BASE_URL}/api/purchases/${id}`, {
        quantity_delivered: deliveredQuantity,
        arrival_date: arrivalDate,
      });
  
      console.log('Actualización exitosa:', response.data);
  
      setResults((prevResults) =>
        prevResults.map((result) =>
          result.id === id
            ? {
                ...result,
                quantity_delivered: (result.quantity_delivered || 0) + deliveredQuantity,
                pending_delivery: result.pending_delivery - deliveredQuantity,
                arrival_date: arrivalDate,
              }
            : result
        )
      );
  
      toast.success('Datos actualizados exitosamente.', {
        position: 'top-right',
        icon: '✅',
      });
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      toast.error('Error al actualizar los datos.', {
        position: 'top-right',
        icon: '⚠️',
      });
    }
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (results.length === 0) {
      toast.error('No hay datos para exportar.', {
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Results');

    // Generar archivo Excel y descargarlo
    XLSX.writeFile(workbook, 'Filtered_Purchases.xlsx');
  };
  
  return (
    <div className="container-fluid mt-5">
      <ToastContainer />
      <h2>Filtrar Compras</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label htmlFor="shipping_date" className="form-label">
            Fecha de Envío:
          </label>
          <input
            type="date"
            className="form-control"
            value={filters.shipping_date || new Date().toISOString().split('T')[0]} // Día actual como valor por defecto
            onChange={handleFilterChange}
            name="shipping_date"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="purchase_number" className="form-label">
            Número de Compra:
          </label>
          <input
            type="text"
            id="purchase_number"
            name="purchase_number"
            className="form-control"
            placeholder="Número de Compra"
            value={filters.purchase_number}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <button className="btn btn-primary mb-4" onClick={fetchFilteredResults}>
        Filtrar
      </button>
     

      {results.length > 0 ? (
        <div className="table-responsive w-100">
          <table className="table table-striped table-hover w-100">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Número de Compra</th>
                <th>Producto</th>
                <th>Cantidad Pedida</th>
                <th>Cantidad Entregada</th>
                <th>Pendiente</th>
                <th>Unidad</th>
                <th>Fecha de Envío</th>
                <th>Fecha de Llegada</th>
                <th>¿Cuántos Llegaron?</th>
                <th>Nueva Fecha de Llegada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.purchase_number}</td>
                  <td>{result.product_name}</td>
                  <td>{result.quantity_requested}</td>
                  <td>{result.quantity_delivered}</td>
                  <td>{result.pending_delivery}</td>
                  <td>{result.unit || 'No registrada'}</td>
                  <td>{formatDate(result.shipping_date)}</td>
                  <td>{formatDate(result.arrival_date)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max={result.pending_delivery}
                      value={deliveredQuantities[result.id] || ''}
                      onChange={(e) => handleDeliveredChange(result.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={arrivalDates[result.id] || new Date().toISOString().split('T')[0]} // Día actual como valor por defecto
                      onChange={(e) => handleArrivalDateChange(result.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmArrival(result.id)}
                    >
                      Confirmar Llegada
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default FilteredPurchases;
