import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../core/api/axios';
import { useAuth } from '../../../core/context/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './Login.scss';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub?: string; // Aquí vendrá la identificación según tu JwtUtil
  rolSistema?: string;
}

interface AxiosErrorResponse {
  response?: { data?: { message?: string } };
  message?: string;
}

const Login = () => {
  // Ahora solo manejamos identificación
  const [identificacion, setIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Enviamos 'identificacion' al backend
      const res = await api.post<LoginResponse>('/auth/login', {
        identificacion,
        password
      });

      const { token } = res.data;

      if (!token) throw new Error('No se recibió el token');

      const decoded = jwtDecode<JwtPayload>(token);
      
      // Extraemos el rol (usando la clave que definiste en Java: claims.put("rolSistema", role))
      const userRole = (decoded.rolSistema || "USER").replace('ROLE_', '').toUpperCase();
      
      // El nombre a mostrar será la identificación (sub) si no hay campo nombre en el token
      const userToSave = { 
        identificacion: decoded.sub, 
        rolSistema: userRole 
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToSave));

      login(token);

      // Redirección por rol
      if (userRole === 'ADMIN') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/mis-proyectos', { replace: true });
      }

    } catch (err: unknown) {
      const axiosError = err as AxiosErrorResponse;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <div className="text-container">
          <p>SISTEMA DE CONTROL DE PROYECTOS</p>
        </div>
      </div>
      <div className="login-form-container">
        <img src="/src/assets/idelcom-logo1.ico" alt="Logo" className="logo" />
        <h2>SISCAP</h2>
        <form onSubmit={handleLogin}>
          <div className="form-fields">
            {/* INPUT DE IDENTIFICACIÓN */}
            <input
              type="text"
              placeholder="Número de Identificación"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
          {error && <p className="error" style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;