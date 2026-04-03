import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/auth/pages/Login';
import Dashboard from './modules/dashboard/pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import Layout from './layout/Layout';
import Proyectos from './modules/proyectos/pages/Proyectos.tsx';
import Actividades from './modules/actividades/pages/Actividades.tsx';
import Usuarios from './modules/usuarios/pages/Usuarios.tsx';
import Empresas from './modules/empresas/pages/Empresas.tsx';
import Procesos from './modules/procesos/pages/Procesos.tsx';
import UnidadMedidaList from './modules/unidad-medida/pages/UnidadMedidaList.tsx';
import MisProyectos from './modules/mis-proyectos/pages/MisProyectos.tsx';
import MiUsuario from './modules/mi-usuario/pages/MiUsuario.tsx';
import MisAvances from './modules/mis-avances/pages/MisAvances.tsx';

// Componente auxiliar para la redirección inteligente al entrar a "/"
const HomeRedirect = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (user.rolSistema || user.rol_sistema || "").toUpperCase();

  if (!token) return <Login />;
  
  // Redirección por rol
  return <Navigate to={userRole === 'ADMIN' ? "/dashboard" : "/mis-proyectos"} replace />;
};

function App() {
  return (
    <Routes>
      {/* 🔓 LOGIN / HOME: Ahora es dinámico */}
      <Route path="/" element={<HomeRedirect />} />

      {/* 🔐 RUTAS EXCLUSIVAS PARA ADMIN */}
      {[
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/proyectos', element: <Proyectos /> },
        { path: '/actividades', element: <Actividades /> },
        { path: '/usuarios', element: <Usuarios /> },
        { path: '/empresas', element: <Empresas /> },
        { path: '/procesos', element: <Procesos /> },
        { path: '/unidades', element: <UnidadMedidaList /> },
      ].map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>{route.element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* 🔐 RUTAS EXCLUSIVAS PARA USER/TÉCNICO */}
      {[
        { path: '/mis-proyectos', element: <MisProyectos /> },
        { path: '/mis-avances', element: <MisAvances /> },
        { path: '/mi-perfil', element: <MiUsuario /> },
      ].map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <Layout>{route.element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* 🔄 Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;