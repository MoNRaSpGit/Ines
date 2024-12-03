import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComprasPorFecha, fetchComprasPorNumero } from '../slices/camionSlice';
import { agregarStockConfirmado } from '../slices/stockSlice'; // Importar acción del slice de stock
import dayjs from 'dayjs';

const Camion = () => {
  const dispatch = useDispatch();
  const { compras, loading, error } = useSelector((state) => state.camion);

  const [filtro, setFiltro] = useState('fecha');
  const [fechaEnvio, setFechaEnvio] = useState(dayjs().format('YYYY-MM-DD'));
  const [numeroCompra, setNumeroCompra] = useState('');
  const [valores, setValores] = useState({});

  // Manejar cambios en los valores de "Cuántos llegaron" y "Fecha de llegada"
  const handleValorChange = (id, field, value) => {
    setValores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Manejar confirmación de llegada
  const handleConfirmar = (id, pendiente, cuantosLlegaron) => {
    const llegada = parseInt(cuantosLlegaron, 10) || 0;
    if (llegada > pendiente) {
      alert('La cantidad llegada no puede superar a la cantidad pendiente.');
      return;
    }

    const nuevoPendiente = pendiente - llegada;

    // Construir el dato confirmado
    const compraConfirmada = {
      id,
      nombre: compras.find((compra) => compra.id === id).nombre,
      unidad: compras.find((compra) => compra.id === id).unidad,
      cantidad_pedida: compras.find((compra) => compra.id === id).cantidad_pedida,
      cuantos_llegaron: llegada, // Agregar cantidad llegada
      pendiente: nuevoPendiente,
      fecha_envio: dayjs(compras.find((compra) => compra.id === id).fecha_envio).format('YYYY-MM-DD'),
      numero_compra: compras.find((compra) => compra.id === id).numero_compra || 'Sin asignar',
      fecha_llegada: valores[id]?.fecha_llegada || dayjs().format('YYYY-MM-DD'),
    };

    // Despachar al slice de stock
    dispatch(agregarStockConfirmado(compraConfirmada));

    // Actualizar el estado local
    setValores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        pendiente: nuevoPendiente,
        cuantos_llegaron: 0, // Reinicia el valor de "cuántos llegaron" después de confirmar
      },
    }));
  };

  const handleFiltrar = () => {
    if (filtro === 'fecha') {
      dispatch(fetchComprasPorFecha(fechaEnvio));
    } else if (filtro === 'numero') {
      if (!numeroCompra) {
        alert('Por favor, ingresa un número de compra.');
        return;
      }
      dispatch(fetchComprasPorNumero(numeroCompra));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Filtrar Compras</h2>

      <div className="mb-3">
        <label className="form-label">Selecciona el filtro:</label>
        <select
          className="form-select"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="fecha">Filtrar por Fecha</option>
          <option value="numero">Filtrar por Número de Compra</option>
        </select>
      </div>

      {filtro === 'fecha' && (
        <div className="mb-3">
          <label htmlFor="fechaEnvio" className="form-label">Fecha de Envío</label>
          <input
            type="date"
            id="fechaEnvio"
            className="form-control"
            value={fechaEnvio}
            onChange={(e) => setFechaEnvio(e.target.value)}
          />
        </div>
      )}

      {filtro === 'numero' && (
        <div className="mb-3">
          <label htmlFor="numeroCompra" className="form-label">Número de Compra</label>
          <input
            type="text"
            id="numeroCompra"
            className="form-control"
            value={numeroCompra}
            onChange={(e) => setNumeroCompra(e.target.value)}
          />
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleFiltrar}
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Filtrar'}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {compras.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Cantidad Pedida</th>
                <th>Pendiente</th>
                <th>Fecha de Envío</th>
                <th>Número de Compra</th>
                <th>Cuántos Llegaron</th>
                <th>Fecha de Llegada</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.nombre}</td>
                  <td>{compra.unidad}</td>
                  <td>{compra.cantidad_pedida}</td>
                  <td>{valores[compra.id]?.pendiente ?? compra.pendiente}</td>
                  <td>{dayjs(compra.fecha_envio).format('YYYY/MM/DD')}</td>
                  <td>{compra.numero_compra || 'Sin asignar'}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={valores[compra.id]?.cuantos_llegaron || ''}
                      onChange={(e) => handleValorChange(compra.id, 'cuantos_llegaron', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={valores[compra.id]?.fecha_llegada || dayjs().format('YYYY-MM-DD')}
                      onChange={(e) => handleValorChange(compra.id, 'fecha_llegada', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleConfirmar(
                          compra.id,
                          valores[compra.id]?.pendiente ?? compra.pendiente,
                          valores[compra.id]?.cuantos_llegaron
                        )
                      }
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Camion;
