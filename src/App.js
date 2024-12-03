import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store/store';

import NavigationBar from './components/NavigationBar'; // Importar la barra de navegación
import Miercoles from './components/Miercoles';
import ProductTable from './components/ProductoTable';
import SelectedList from './components/SelectedList';
import FilteredPurchases from './components/FilteredPurchases';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser';
import UploadExcel from './components/UploadExcel';
import Compras from './components/Compras';
import ListaCompras from './components/ListaCompras';
import Ximena from './components/Ximena';
import Camion from './components/Camion';
import Bienvenida from './components/Bienvenida'; // Importar Bienvenida

// Ruta protegida con verificación de autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/Ines">
        {/* Barra de navegación global */}
        <NavigationBar />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<RegisterUser />} />

          {/* Rutas protegidas */}
          <Route
            path="/bienvenida/*"
            element={
              <ProtectedRoute>
                <Bienvenida />
              </ProtectedRoute>
            }
          />
          <Route
            path="/miercoles"
            element={
              <ProtectedRoute>
                <Miercoles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <ProductTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seleccionados"
            element={
              <ProtectedRoute>
                <SelectedList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filtered-purchases"
            element={
              <ProtectedRoute>
                <FilteredPurchases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-excel"
            element={
              <ProtectedRoute>
                <UploadExcel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compras"
            element={
              <ProtectedRoute>
                <Compras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista-compras"
            element={
              <ProtectedRoute>
                <ListaCompras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ximena"
            element={
              <ProtectedRoute>
                <Ximena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/camion"
            element={
              <ProtectedRoute>
                <Camion />
              </ProtectedRoute>
            }
          />

          {/* Redirigir raíz según autenticación */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/bienvenida" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
