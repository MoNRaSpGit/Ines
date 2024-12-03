import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import { agregarRegistro, actualizarRegistro } from '../slices/registroComprasSlice';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const Compras = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Usar navegación
  const comprasDataFromStore = useSelector((state) => state.compras.comprasData);

  const [comprasData, setComprasData] = useState(
    comprasDataFromStore.map((item) => ({
      ...item,
      fecha_envio: dayjs().tz('America/Montevideo').format('YYYY-MM-DD'), // Aseguramos que fecha_envio esté correctamente definida
      totalComprado: 0,
      pendiente: 0,
    }))
  );

  const handleAccionChange = (index, cantidad) => {
    setComprasData((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            totalComprado: cantidad,
            pendiente: cantidad,
          }
          : row
      )
    );
  };

  const handleCantidadBlur = (index, cantidad) => {
    const parsedCantidad = parseInt(cantidad, 10) || 0;
    if (parsedCantidad > comprasData[index].cantidadTotal) {
      alert('La cantidad ingresada no puede ser mayor a la cantidad total.');
      return;
    }

    setComprasData((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            totalComprado: parsedCantidad,
            pendiente: parsedCantidad,
          }
          : row
      )
    );
  };

  const handleListaCompras = () => {
    navigate('/lista-compras'); // Redirige al componente ListaCompras
  };

  const handleFechaChange = (index, fecha) => {
    const parsedFecha = dayjs(fecha, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('YYYY-MM-DD'); // Validar y transformar la fecha
    setComprasData((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            fechaCompra: parsedFecha,
          }
          : row
      )
    );
  };
  

  const handleComprar = (index) => {
    const compra = comprasData[index];
    dispatch(agregarRegistro(compra));
    //alert('Compra guardada exitosamente.');
  };

  const handleRestablecer = (index) => {
    setComprasData((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            totalComprado: 0,
            pendiente: 0,
            fechaCompra: dayjs().tz('America/Montevideo').format('YYYY-MM-DD'), // Restablecer al formato correcto
          }
          : row
      )
    );
  };
  

  return (
    <div className="container-fluid mt-5">
      <h2>Compras</h2>
      <div className="table-responsive w-100">
        <table className="table table-striped table-hover w-100">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Cantidad Total</th>
              <th>Unidad</th>
              <th>Total Comprado</th>
              <th>Total Entregado</th>
              <th>Pendiente</th>
              <th>Fecha de Compra</th>
              <th>Acciones</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {comprasData.map((row, index) => (
              <tr key={index}>
                <td>{row.nombre}</td>
                <td>{row.cantidadTotal}</td>
                <td>{row.unidad}</td>
                <td>{row.totalComprado}</td>
                <td>{row.totalEntregado}</td>
                <td>{row.pendiente}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={row.fechaCompra}
                    onChange={(e) => handleFechaChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cantidad"
                    onBlur={(e) => handleCantidadBlur(index, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleComprar(index)}
                  >
                    Comprar
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleRestablecer(index)}
                  >
                    Restablecer
                  </button>
                  <button className="btn btn-primary mb-3" onClick={handleListaCompras}>
                    Ir a Lista de Compras
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compras;
