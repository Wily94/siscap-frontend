import { useEffect, useState, useCallback, useContext } from 'react';
import { FaUserCircle, FaEnvelope, FaIdCard, FaShieldAlt, FaEdit, FaUserTag } from 'react-icons/fa';
import { obtenerPerfil, type Usuario } from '../../usuarios/services/usuario.service';
import UsuarioModal from '../../usuarios/pages/UsuarioModal';
import './styles/mi-usuario.scss'; 
import { AuthContext } from '../../../core/context/auth.context';

const MiUsuario = () => {
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Obtenemos el contexto completo para evitar el error "Property user does not exist"
  const authContext = useContext(AuthContext);
  
  // 2. Extraemos el rol del usuario autenticado de forma segura
  const rolActual = authContext?.user?.rolSistema || 'USER';

  const cargarPerfil = useCallback(async () => {
    try {
      setLoading(true);
      const res = await obtenerPerfil();
      setPerfil(res.data);
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando información de perfil...</p>
      </div>
    );
  }

  return (
    <div className="list-container profile-view">
      <div className="list-header">
        <div className="header-info">
          <h2>
            <FaUserCircle /> Mi Perfil
          </h2>
          <p className="text-muted">
            Información de tu cuenta en el sistema SISCAP
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <FaEdit /> Actualizar Mis Datos
        </button>
      </div>

      <div className="list-body">
        {perfil && (
          <div className="profile-details-grid">
            <div className="detail-card">
              <label>
                <FaIdCard /> Nombre Completo
              </label>
              <p>{`${perfil.nombre} ${perfil.apellidoPaterno} ${perfil.apellidoMaterno}`}</p>
            </div>

            <div className="detail-card">
              <label>
                <FaUserTag /> Nombre de Usuario
              </label>
              <p>@{perfil.username}</p>
            </div>

            <div className="detail-card">
              <label>
                <FaEnvelope /> Correo Electrónico
              </label>
              <p>{perfil.email}</p>
            </div>

            <div className="detail-card">
              <label>
                <FaShieldAlt /> Rol Asignado
              </label>
              <div>
                <span
                  className={`role-tag ${perfil.rolSistema.toLowerCase()}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  {perfil.rolSistema === "ADMIN" ? <FaShieldAlt /> : <FaUserCircle />}
                  {perfil.rolSistema}
                </span>
              </div>
            </div>

            <div className="detail-card">
              <label>
                <FaShieldAlt /> Estado de la Cuenta
              </label>
              <div>
                <span
                  className={`badge ${perfil.estado === "A" || perfil.estado === "ACTIVO" ? "active" : "inactive"}`}
                >
                  {perfil.estado === "A" || perfil.estado === "ACTIVO"
                    ? "ACTIVO"
                    : "INACTIVO"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Modal con la validación de rol inyectada */}
      {perfil && (
        <UsuarioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userEdit={perfil}
          onSuccess={cargarPerfil}
          currentUserRol={rolActual} 
        />
      )}
    </div>
  );
};

export default MiUsuario;