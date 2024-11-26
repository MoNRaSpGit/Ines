import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { Provider, useSelector } from 'react-redux'; 
import store from './store/store';
import Miercoles from './components/Miercoles';
import ProductTable from './components/ProductoTable';
import SelectedList from './components/SelectedList';
import Pamela from './components/Pamela';
import FilteredPurchases from './components/FilteredPurchases';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser';

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
      <Router basename="/Ines" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<RegisterUser />} />

          {/* Rutas protegidas */}
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
            path="/pamela"
            element={
              <ProtectedRoute>
                <Pamela />
              </ProtectedRoute>
            }
          />

          {/* Redirigir raíz según autenticación */}
          <Route
            path="/"
            element={<Navigate to="/miercoles" />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
