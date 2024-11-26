import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductoTable';
import SelectedList from '../components/SelectedList';
import PurchaseList from '../components/PurchaseList';
import FilteredPurchases from '../components/FilteredPurchases';
import Navigation from '../components/Navigation';
import '../Style/Miercoles.css';
import pelo2 from '../images/pelo2.png';
import WeatherInfo from '../components/WeatherInfo';


const Miercoles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Datos del usuario y autenticación
  const [view, setView] = useState('products');
  const [simulatedDay, setSimulatedDay] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [imageCount, setImageCount] = useState(0);

  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const currentDate = new Date();
  const today = simulatedDay !== null ? simulatedDay : currentDate.getDay();
  const todayName = daysOfWeek[today];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirigir al login si no está autenticado
    }
  }, [isAuthenticated, navigate]);

  const toggleSimulateMiercoles = () => {
    setSimulatedDay((prev) => (prev === 3 ? null : 3)); // 3 es miércoles
  };

  const handleViewChange = (newView) => {
    // Verificar acceso según el rol
    if (user.role === 'common' && newView !== 'pamela') {
      alert('No tienes acceso a esta vista.');
      return;
    }
    if (user.role === 'admin' && newView === 'pamela') {
      alert('No tienes acceso a esta vista.');
      return;
    }
    setView(newView);
  };

  useEffect(() => {
    const maxAppearances = 5;
    if (todayName === 'miércoles' && imageCount < maxAppearances) {
      const interval = setInterval(() => {
        setShowImage(true);
        setPosition({
          top: Math.random() * window.innerHeight * 0.8,
          left: Math.random() * window.innerWidth * 0.8,
        });

        setTimeout(() => setShowImage(false), 1500);
        setImageCount((prevCount) => prevCount + 1);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [todayName, imageCount]);

  return (
    <div className="miercolesContainer">
       <WeatherInfo />
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

      {/* Controlar las vistas según el rol */}
      {view === 'products' && user.role === 'admin' && <ProductTable />}
      {view === 'selected' && user.role === 'admin' && <SelectedList />}
      {view === 'purchased' && user.role === 'admin' && <PurchaseList />}
      {view === 'truck' && user.role === 'admin' && <FilteredPurchases />}
      {view === 'pamela' && user.role === 'common' && <div>Pamela - Vista para usuarios comunes</div>}
    </div>
  );
};

export default Miercoles;
