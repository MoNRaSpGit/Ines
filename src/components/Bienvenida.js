import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UploadExcel from './UploadExcel';
import Camion from './Camion';
import Compras from './Compras';
import ListaCompras from './ListaCompras';
import Stock from './Stock'; // Importar el componente Stock

const Bienvenida = () => {
  return (
    <div className="container mt-5">
      <h1>Bienvenido al Sistema</h1>
      <Routes>
        <Route path="/" element={<Navigate to="upload-excel" />} />
        <Route path="upload-excel" element={<UploadExcel />} />
        <Route path="camion" element={<Camion />} />
        <Route path="compras" element={<Compras />} />
        <Route path="lista-compras" element={<ListaCompras />} />
        <Route path="stock" element={<Stock />} /> {/* Nueva ruta para Stock */}
      </Routes>
    </div>
  );
};

export default Bienvenida;
