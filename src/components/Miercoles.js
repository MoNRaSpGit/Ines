import React, { useState } from 'react';
import ProductTable from '../components/ProductoTable'; // Ruta correcta según tu estructura
import SelectedList from '../components/SelectedList'; // Ruta correcta según tu estructura
import PurchaseList from '../components/PurchaseList'; // Nuevo componente
import '../Style/Miercoles.css'; // Ruta correcta del CSS

const Miercoles = () => {
  const [view, setView] = useState('products'); // Manejar vistas: 'products', 'selected', 'purchased'
  const [simulatedDay, setSimulatedDay] = useState(null);

  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const currentDate = new Date();
  const today = simulatedDay !== null ? simulatedDay : currentDate.getDay();
  const todayName = daysOfWeek[today];

  const toggleSimulateMiercoles = () => {
    setSimulatedDay((prev) => (prev === 3 ? null : 3)); // 3 es miércoles
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="miercolesContainer">
      <h1 className="miercolesTitle">¡Bienvenida, Inés!</h1>
      <h2 className="miercolesSubtitle">hoy es un lindo {todayName}</h2>

      {todayName === 'miércoles' && (
        <div className="miercolesAlert">
          ¡Hola Inés, hoy es miércoles de compras!!
        </div>
      )}

      <button className="miercolesButton" onClick={toggleSimulateMiercoles}>
        {simulatedDay === 3 ? 'Volver al día actual' : 'Simular miércoles'}
      </button>

      {view === 'products' && (
        <>
          <ProductTable />
          <button className="miercolesButton" onClick={() => handleViewChange('selected')}>
            Enviar
          </button>
          <button className="miercolesButton" onClick={() => handleViewChange('selected')}>
            Ir a seleccionados
          </button>
        </>
      )}

      {view === 'selected' && (
        <>
          <SelectedList />
          <button className="miercolesButton" onClick={() => handleViewChange('products')}>
            Volver a productos
          </button>
          <button className="miercolesButton" onClick={() => handleViewChange('purchased')}>
            Ver productos comprados
          </button>
        </>
      )}

      {view === 'purchased' && (
        <>
          <PurchaseList />
          <button className="miercolesButton" onClick={() => handleViewChange('products')}>
            Volver a productos
          </button>
          <button className="miercolesButton" onClick={() => handleViewChange('selected')}>
            Ver seleccionados
          </button>
        </>
      )}
    </div>
  );
};

export default Miercoles;
