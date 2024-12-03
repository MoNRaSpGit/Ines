import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { setComprasData } from '../slices/comprasSlice'; // Ajusta la ruta
import Navigation from './Navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extender dayjs con plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);

const UploadExcel = ({ view, onChangeView }) => {
  const [mesesData, setMesesData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Usar dispatch de Redux

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('Por favor, selecciona un archivo.', {
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const mesesDataExtracted = jsonData
        .slice(4)
        .filter((row) => row[0] !== "N°")
        .map((row) => ({
          numero: row[0] || '',
          codigoInsumo: row[2] || '',
          nombreInsumo: row[3] || '',
          unidad: row[4] || '',
          mes01: row[5] || 0,
          mes02: row[6] || 0,
        }))
        .filter((row) => row.mes01 || row.mes02);

      setMesesData(mesesDataExtracted);
      toast.success('Archivo procesado exitosamente.', {
        position: 'top-right',
        icon: '📊',
      });
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      toast.error('Error al leer el archivo.', {
        position: 'top-right',
        icon: '⚠️',
      });
    };

    reader.readAsBinaryString(file);
  };

  const handleComprar = () => {
    // Preparar los datos para el store
    const comprasData = mesesData.map((item) => ({
      nombre: item.nombreInsumo,
      cantidadTotal: item.mes01 + item.mes02,
      unidad: item.unidad,
      totalComprado: 0,
      totalEntregado: 0,
      pendiente: item.mes01 + item.mes02,
      fechaCompra: dayjs().tz('America/Montevideo').format('YYYY-MM-DD'), // Fecha actual en formato YYYY-MM-DD
    }));

   
    // Guardar los datos en el store global
    dispatch(setComprasData(comprasData));
    console.log("soy la compra comp nuevo" , comprasData);
    

    // Redirigir al componente Compras
    navigate('/compras');
  };

  return (
    <div className="container-fluid mt-5">
      <Navigation view={view} onChangeView={onChangeView} />
      <ToastContainer />
      <h2>Sube tu Excel para ver las Cantidades</h2>

      <div className="mb-4">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      {mesesData.length > 0 && (
        <>
          <div className="table-responsive w-100">
            <table className="table table-striped table-hover w-100">
              <thead className="table-primary">
                <tr>
                  <th>N°</th>
                  <th>Código del Insumo</th>
                  <th>Nombre del Insumo</th>
                  <th>Unidad</th>
                  <th>Mes 01</th>
                  <th>Mes 02</th>
                </tr>
              </thead>
              <tbody>
                {mesesData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.numero}</td>
                    <td>{row.codigoInsumo}</td>
                    <td>{row.nombreInsumo}</td>
                    <td>{row.unidad}</td>
                    <td>{row.mes01}</td>
                    <td>{row.mes02}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleComprar}>
            Comprar
          </button>
        </>
      )}
    </div>
  );
};

export default UploadExcel;
