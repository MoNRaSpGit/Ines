import React from 'react';
import { useSelector } from 'react-redux';

const Stock = () => {
  const confirmados = useSelector((state) => state.stock.confirmados) || []; // Datos confirmados
  const comprasData = useSelector((state) => state.compras.comprasData) || []; // Datos globales de compras

  // Combinar confirmados con cantidadTotal comparando por nombre
  const datosCombinados = confirmados.map((confirmado) => {
    const compra = comprasData.find((compra) => compra.nombre === confirmado.nombre); // Comparar por nombre
    return {
      ...confirmado,
      cantidadTotal: compra?.cantidadTotal || 0, // Agregar cantidadTotal del slice de compras
    };
  });

  return (
    <div className="container mt-5">
      <h2>Stock Confirmado</h2>
      {datosCombinados.length === 0 ? (
        <p>No hay datos confirmados en el stock.</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Número de Compra</th>
                <th>Cantidad Inicial</th>
                <th>Cantidad Pedida</th>
                <th>Cuántos Llegaron</th>
                <th>Fecha de Envío</th>
                <th>Fecha de Llegada</th>
              </tr>
            </thead>
            <tbody>
              {datosCombinados.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.unidad}</td>
                  <td>{item.numero_compra}</td>
                  <td>{item.cantidadTotal}</td> {/* Cambiado a "Cantidad Inicial" en el encabezado */}
                  <td>{item.cantidad_pedida}</td>
                  <td>{item.cuantos_llegaron}</td>
                  <td>{item.fecha_envio}</td>
                  <td>{item.fecha_llegada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stock;
