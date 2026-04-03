import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartPie, FaFolder, FaTasks, FaUsers, 
  FaBuilding, FaCogs, /*FaFileAlt,*/ FaRulerCombined,
  FaUserCircle, FaBriefcase, FaCalendarCheck // Nuevos iconos para USER
} from 'react-icons/fa';
import './sidebar.scss';

const Sidebar = () => {
  const location = useLocation();

  // Obtenemos el usuario del localStorage (ajusta según tu clave de guardado)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = (user.rolSistema || "").toUpperCase() === 'ADMIN'; // 1 para ADMIN, puedes usar nombres si prefieres

  // --- FILTRO DE MENÚ POR ROL ---
  const menuItems = isAdmin ? [
    // Menú para ADMINISTRADOR
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartPie /> },
    { path: '/proyectos', label: 'Proyectos', icon: <FaFolder /> },
    { path: '/actividades', label: 'Actividades', icon: <FaTasks /> },
    { path: '/usuarios', label: 'Usuarios', icon: <FaUsers /> },
    { path: '/empresas', label: 'Empresas', icon: <FaBuilding /> },
    { path: '/procesos', label: 'Procesos', icon: <FaCogs /> },
    //{ path: '/reportes', label: 'Reportes', icon: <FaFileAlt /> },
    { path: '/unidades', label: 'Unidades de Medida', icon: <FaRulerCombined /> },
  ] : [
    // Menú para USUARIO TÉCNICO (USER)
    { path: '/mis-proyectos', label: 'Mis Proyectos', icon: <FaBriefcase /> },
    { path: '/mis-avances', label: 'Mis Avances', icon: <FaCalendarCheck /> },
    { path: '/mi-perfil', label: 'Mi Usuario', icon: <FaUserCircle /> },
  ];

  return (
    <aside className="sidebar" style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      <div className="logo-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', margin: 0, letterSpacing: '2px' }}>
          SISCAP
        </h2>
        {/* Etiqueta de rol para saber quién está logueado */}
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginTop: '5px', textTransform: 'uppercase' }}>
           Modo {isAdmin ? 'Administrador' : 'Técnico'}
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 15px' }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={active ? 'active' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                backgroundColor: active ? '#2563eb' : 'transparent',
                color: active ? '#ffffff' : '#1e293b', 
                transition: 'all 0.2s'
              }}
            >
              <span style={{ 
                display: 'flex', 
                fontSize: '1.2rem', 
                color: active ? '#ffffff' : '#475569' 
              }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;