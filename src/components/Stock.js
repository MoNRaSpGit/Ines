import React from 'react';
import { useSelector } from 'react-redux';

const Stock = () => {
  const confirmados = useSelector((state) => state.stock.confirmados) || []; // Datos confirmados
  const comprasData = useSelector((state) => state.compras.comprasData) || []; // Datos globales de compras
  console.log("Datos de Compras:", comprasData);

  // Combinar confirmados con cantidadTotal comparando por nombre
  const datosCombinados = confirmados.map((confirmado) => {
    const compra = comprasData.find((compra) => compra.nombre === confirmado.nombre); // Comparar por nombre
    const cantidadPedida = confirmado.cantidad_pedida || 0;
    const cuantosLlegaron = confirmado.cuantos_llegaron || 0;
    return {
      ...confirmado,
      cantidadTotal: compra?.cantidadTotal || 0, // Agregar cantidadTotal del slice de compras
      pendiente: cantidadPedida - cuantosLlegaron, // Calcular pendiente
    };
  });

  // Función para simular guardar datos y mostrarlos en la consola
  const handleGuardarDatos = () => {
    console.log('Datos guardados:', datosCombinados);
    alert('Datos guardados. Revisa la consola para ver los detalles.');
  };

  return (
    <div className="container mt-5">
      <h2>Stock Confirmado</h2>
      {datosCombinados.length === 0 ? (
        <p>No hay datos confirmados en el stock.</p>
      ) : (
        <>
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
                  <th>Pendiente</th> {/* Nueva columna */}
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
                    <td>{item.cantidadTotal}</td>
                    <td>{item.cantidad_pedida}</td>
                    <td>{item.cuantos_llegaron}</td>
                    <td>{item.pendiente}</td> {/* Mostrar pendiente */}
                    <td>{item.fecha_envio}</td>
                    <td>{item.fecha_llegada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleGuardarDatos}>
            Guardar Datos
          </button>
        </>
      )}
    </div>
  );
};

export default Stock;
