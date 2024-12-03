import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar para manejar navegación
import '../Style/Navigation.css';

const Navigation = ({ view, onChangeView, customClass = '' }) => {
  const navigate = useNavigate(); // Hook de navegación

  const handleNavigation = (targetView) => {
    if (targetView === 'truck') {
      navigate('/camion'); // Redirigir al componente Camion
    } else {
      onChangeView(targetView); // Cambiar vista en otros casos
    }
  };

  return (
    <div className={`navigation ${customClass}`}>
      <button
        className={`navButton ${view === 'products' ? 'active' : ''}`}
        onClick={() => handleNavigation('products')}
      >
        Productos
      </button>
      <button
        className={`navButton ${view === 'selected' ? 'active' : ''}`}
        onClick={() => handleNavigation('selected')}
      >
        Seleccionados
      </button>
      <button
        className={`navButton ${view === 'purchased' ? 'active' : ''}`}
        onClick={() => handleNavigation('purchased')}
      >
        Comprados
      </button>
      <button
        className={`navButton ${view === 'truck' ? 'active' : ''}`}
        onClick={() => handleNavigation('truck')}
      >
        Camión
      </button>
      <button
        className={`navButton ${view === 'uploadExcel' ? 'active' : ''}`}
        onClick={() => handleNavigation('uploadExcel')}
      >
        Subir Excel
      </button>
    </div>
  );
};

export default Navigation;
