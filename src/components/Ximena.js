import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComprasSinNumero, actualizarNumeroCompra } from '../slices/ximenaSlice'; // Importar acciones del slice
import dayjs from 'dayjs';

const Ximena = () => {
  const dispatch = useDispatch();
  const comprasSinNumero = useSelector((state) => state.ximena.compras); // Acceder a los datos del slice
  const loading = useSelector((state) => state.ximena.loading); // Estado de carga
  const [numeroCompras, setNumeroCompras] = useState({});

  // Manejar cambios en el número de compra
  const handleNumeroChange = (id, value) => {
    setNumeroCompras((prev) => ({ ...prev, [id]: value }));
  };

  // Mostrar las compras (cargar datos)
  const handleMostrar = () => {
    dispatch(fetchComprasSinNumero());
  };

  // Guardar los cambios
  const handleGuardar = () => {
    const cambios = comprasSinNumero.map((compra) => ({
      id: compra.id,
      numero_compra: numeroCompras[compra.id] || null,
    }));

    console.log('Datos enviados al servidor:', cambios); // Log para depuración
    dispatch(actualizarNumeroCompra(cambios));
  };

  return (
    <div className="container mt-5">
      <h2>Compras Sin Número de Compra</h2>
      <button className="btn btn-primary mb-3" onClick={handleMostrar} disabled={loading}>
        {loading ? 'Cargando...' : 'Mostrar'}
      </button>

      {comprasSinNumero.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Cantidad Pedida</th>
                <th>Pendiente</th>
                <th>Fecha de Envío</th>
                <th>Número de Compra</th>
              </tr>
            </thead>
            <tbody>
              {comprasSinNumero.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.nombre}</td>
                  <td>{compra.unidad}</td>
                  <td>{compra.cantidad_pedida}</td>
                  <td>{compra.pendiente}</td>
                  <td>{dayjs(compra.fecha_envio).format('YYYY-MM-DD')}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={numeroCompras[compra.id] || ''}
                      onChange={(e) => handleNumeroChange(compra.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <button className="btn btn-success mt-3" onClick={handleGuardar}>
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default Ximena;
