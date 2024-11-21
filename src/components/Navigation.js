import React from 'react';
import '../Style/Navigation.css';

const Navigation = ({ view, onChangeView }) => (
  <div className="navigation">
    <button
      className={`navButton ${view === 'products' ? 'active' : ''}`}
      onClick={() => onChangeView('products')}
    >
      Productos
    </button>
    <button
      className={`navButton ${view === 'selected' ? 'active' : ''}`}
      onClick={() => onChangeView('selected')}
    >
      Seleccionados
    </button>
    <button
      className={`navButton ${view === 'purchased' ? 'active' : ''}`}
      onClick={() => onChangeView('purchased')}
    >
      Comprados
    </button>
  </div>
);

export default Navigation;
