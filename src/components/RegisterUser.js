import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearState } from '../slices/registerSlice';
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.register);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [countdown, setCountdown] = useState(3); // Cuenta regresiva

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        navigate('/login'); // Redirigir al login después de 3 segundos
      }, 3000);

      return () => clearInterval(timer); // Limpiar el intervalo al desmontar
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const handleReset = () => {
    dispatch(clearState());
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
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
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
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
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={handleReset}>
          Reset
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && (
        <div className="alert alert-success mt-3">
          Usuario registrado con éxito. Redirigiendo al login en {countdown}...
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
