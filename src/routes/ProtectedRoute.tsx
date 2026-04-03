import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation(); // 👈 Importante para saber dónde estamos
  
  // 1. 🔐 Si no hay sesión -> Al Login
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userStr);
  const userRole = (user.rolSistema || "").toString().trim().toUpperCase();

  // 2. 🛡️ Verificación de Roles
  if (allowedRoles && allowedRoles.length > 0) {
    // Comparamos limpiando cualquier espacio extra
    const isAuthorized = allowedRoles.some(role => role.trim().toUpperCase() === userRole);

    if (!isAuthorized) {
      console.warn(`⛔ ACCESO DENEGADO: El rol "${userRole}" no tiene permiso para ${location.pathname}`);

      // DETERMINAR DESTINO PARA EVITAR BUCLES
      const targetPath = userRole === 'ADMIN' ? "/dashboard" : "/mis-proyectos";

      // 🚨 CRÍTICO: Si ya estamos en el destino, NO volver a navegar (detiene el bucle)
      if (location.pathname === targetPath) {
        return <>{children}</>;
      }

      return <Navigate to={targetPath} replace />;
    }
  }

  // ✅ Todo OK
  return <>{children}</>;
};

export default ProtectedRoute;