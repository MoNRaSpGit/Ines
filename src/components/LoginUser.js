import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: 'Ines',
    password: 'admin',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleSetDefault = () => {
    setFormData({
      username: 'maria',
      password: '123456',
    });
  };

  // Usar useEffect para manejar la navegación después de la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'admin') {
        navigate('/miercoles');
      } else {
        navigate('/pamela'); // Ejemplo para usuarios comunes
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRegisterRedirect = () => {
    navigate('/register'); // Cambia '/register' por la ruta real de tu página de registro
  };

  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
      <button className="btn btn-secondary mt-3" onClick={handleSetDefault}>
        Usar credenciales predeterminadas: "maria / 123456"
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <div className="mt-4">
        <p>No tienes usuario? <button className="btn btn-link p-0" onClick={handleRegisterRedirect}>Regístrate aquí</button></p>
      </div>
    </div>
  );
};

export default LoginUser;
