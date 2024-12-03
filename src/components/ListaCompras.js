import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { enviarCompras } from '../slices/comprasBddSlice'; // Importar el thunk
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const ListaCompras = () => {
  const dispatch = useDispatch();
  const registrosFromStore = useSelector((state) => state.registroCompras.registros);
  const { status, error } = useSelector((state) => state.comprasBdd); // Estado del slice
  const [registros, setRegistros] = useState(
    registrosFromStore.map((registro) => ({
      ...registro,
      fechaEnvio: dayjs().tz('America/Montevideo').format('YYYY/MM/DD'),
      numeroCompra: registro.numeroCompra || null,
    }))
  );

  const handleFechaEnvioChange = (index, fecha) => {
    setRegistros((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              fechaEnvio: fecha,
            }
          : row
      )
    );
  };

  const handleNumeroCompraChange = (index, numero) => {
    setRegistros((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              numeroCompra: numero || null,
            }
          : row
      )
    );
  };

  const handleEnviarDatos = () => {
    const registrosTransformados = registros.map((registro) => ({
      nombre: registro.nombre,
      unidad: registro.unidad,
      cantidad_pedida: registro.totalComprado,
      pendiente: registro.pendiente,
      fecha_envio: registro.fecha_envio || dayjs().tz('America/Montevideo').format('YYYY-MM-DD'), // Aseguramos que fecha_envio esté presente
      numero_compra: registro.numeroCompra,
    }));
  
    dispatch(enviarCompras({ registros: registrosTransformados }));
  
    console.log("Datos enviados al backend:", { registros: registrosTransformados });
  };
  
  

  return (
    <div className="container-fluid mt-5">
      <h2>Lista de Compras</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={handleEnviarDatos}
        disabled={status === 'loading'} // Deshabilitar el botón mientras se envían los datos
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar Datos'}
      </button>
      {status === 'failed' && <p className="text-danger">Error: {error}</p>}
      {status === 'succeeded' && <p className="text-success">Datos enviados exitosamente.</p>}
      <div className="table-responsive w-100">
        <table className="table table-striped table-hover w-100">
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
            {registros.map((row, index) => (
              <tr key={index}>
                <td>{row.nombre}</td>
                <td>{row.unidad}</td>
                <td>{row.totalComprado}</td>
                <td>{row.pendiente}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={row.fechaEnvio}
                    onChange={(e) => handleFechaEnvioChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Número de Compra"
                    value={row.numeroCompra || ''}
                    onChange={(e) => handleNumeroCompraChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaCompras;
