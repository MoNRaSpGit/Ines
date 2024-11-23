import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store'; // Asegúrate de que la ruta del store sea correcta
import Miercoles from './components/Miercoles';
import ProductTable from './components/ProductoTable';
import SelectedList from './components/SelectedList';
import Pamela from './components/Pamela';
import FilteredPurchases from './components/FilteredPurchases';


const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/Ines">
        <Routes>
          <Route path="/" element={<Miercoles />} />          
          <Route path="/productos" element={<ProductTable />} />
          <Route path="/seleccionados" element={<SelectedList />} />
          <Route path="/pamela" element={<Pamela />} />
          <Route path="/filtered-purchases" element={<FilteredPurchases />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;



