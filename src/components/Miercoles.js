import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductoTable';
import SelectedList from '../components/SelectedList';
import PurchaseList from '../components/PurchaseList';
import FilteredPurchases from '../components/FilteredPurchases'; // Importa el nuevo componente
import Navigation from '../components/Navigation'; // Componente de navegación
import '../Style/Miercoles.css';
import pelo2 from '../images/pelo2.png'; // Imagen que aparece y desaparece

const Miercoles = () => {
  const [view, setView] = useState('products'); // Manejar vistas
  const [simulatedDay, setSimulatedDay] = useState(null); // Simular el día miércoles
  const [showImage, setShowImage] = useState(false); // Mostrar/ocultar imagen
  const [position, setPosition] = useState({ top: 0, left: 0 }); // Posición aleatoria de la imagen
  const [imageCount, setImageCount] = useState(0); // Contador para limitar apariciones

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

  useEffect(() => {
    const maxAppearances = 5; // Límite de apariciones de la imagen
    if (todayName === 'miércoles' && imageCount < maxAppearances) {
      const interval = setInterval(() => {
        setShowImage(true); // Mostrar la imagen
        setPosition({
          top: Math.random() * window.innerHeight * 0.8,
          left: Math.random() * window.innerWidth * 0.8,
        });

        setTimeout(() => setShowImage(false), 1500); // Ocultar después de 1.5 segundos
        setImageCount((prevCount) => prevCount + 1);
      }, 1500); // Cambiar cada 1.5 segundos

      return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }
  }, [todayName, imageCount]);

  return (
    <div className="miercolesContainer">
      {/* Cambiar la posición de navegación solo en PurchaseList */}
      <Navigation
        view={view}
        onChangeView={handleViewChange}
        customClass={view === 'truck' ? 'topRight' : ''}
      />
      <h1 className="miercolesTitle">¡Bienvenida, Inés!</h1>
      <h2 className="miercolesSubtitle">Hoy es un lindo {todayName}</h2>

      {todayName === 'miércoles' && (
        <div className="miercolesAlert">
          ¡Hola Inés, hoy es miércoles de compras!
        </div>
      )}

      {showImage && todayName === 'miércoles' && imageCount < 5 && (
        <img
          className="miercolesImage"
          src={pelo2}
          alt="Pelo2"
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            opacity: showImage ? 1 : 0,
            transform: showImage ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        />
      )}

      <button className="miercolesButton" onClick={toggleSimulateMiercoles}>
        {simulatedDay === 3 ? 'Volver al día actual' : 'Simular miércoles'}
      </button>

      {view === 'products' && <ProductTable />}
      {view === 'selected' && <SelectedList />}
      {view === 'purchased' && <PurchaseList />}
      {view === 'truck' && <FilteredPurchases />} {/* Nueva vista para "Camión" */}
    </div>
  );
};

export default Miercoles;
