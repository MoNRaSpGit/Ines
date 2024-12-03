import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductoTable';
import SelectedList from '../components/SelectedList';
import PurchaseList from '../components/PurchaseList';
import FilteredPurchases from '../components/FilteredPurchases';
import UploadExcel from '../components/UploadExcel';
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

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirigir al componente Ximena si el usuario tiene rol "common"
  useEffect(() => {
    if (user?.role === 'common') {
      navigate('/ximena');
    }
  }, [user, navigate]);

  const toggleSimulateMiercoles = () => {
    setSimulatedDay((prev) => (prev === 3 ? null : 3)); // 3 es miércoles
  };

  const handleViewChange = (newView) => {
    // Verificar acceso según el rol
    if (user?.role === 'common') {
      alert('No tienes acceso a otras vistas.');
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
      {view === 'products' && user?.role === 'admin' && <ProductTable />}
      {view === 'selected' && user?.role === 'admin' && <SelectedList />}
      {view === 'purchased' && user?.role === 'admin' && <PurchaseList />}
      {view === 'truck' && user?.role === 'admin' && <FilteredPurchases />}
      {view === 'uploadExcel' && <UploadExcel />}
    </div>
  );
};

export default Miercoles;
