import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/bienvenida">
          Inicio
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/bienvenida/compras">
                Compras
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bienvenida/lista-compras">
                Lista Compras
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bienvenida/camion">
                Camión
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bienvenida/stock">
                Stock
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
