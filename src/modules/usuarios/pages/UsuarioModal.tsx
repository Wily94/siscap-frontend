import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // Importante para validar el tipo de error
import { crearUsuario, actualizarUsuario, type Usuario } from '../services/usuario.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEdit: Usuario | null;
  onSuccess: () => void;
  currentUserRol: string;
}

// Interfaz para la estructura de error que suele devolver Spring Boot
interface BackendError {
  message?: string;
  status?: number;
}

const UsuarioModal: React.FC<Props> = ({ isOpen, onClose, userEdit, onSuccess, currentUserRol }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Usuario>({
    identificacion: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    username: '',
    email: '',
    password: '',
    rolSistema: 'USER',
    estado: 'A'
  });

  const canEditRol = currentUserRol?.toUpperCase() === 'ADMIN';

  // Efecto para cargar datos al editar o limpiar al crear nuevo
  useEffect(() => {
    if (isOpen) {
      if (userEdit) {
        setUser({ ...userEdit, password: '' }); // Limpiamos password por seguridad al editar
      } else {
        setUser({
          identificacion: '',
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          username: '',
          email: '',
          password: '',
          rolSistema: 'USER',
          estado: 'A'
        });
      }
    }
  }, [userEdit, isOpen]);

  // Lógica de generación automática de username (Inicial nombre + Apellido Paterno)
  useEffect(() => {
    if (user.nombre && user.apellidoPaterno) {
      const inicial = user.nombre.trim().charAt(0).toLowerCase();
      const apellido = user.apellidoPaterno.trim().toLowerCase().replace(/\s+/g, '');
      const nuevoUsername = `${inicial}${apellido}`;
      
      if (user.username !== nuevoUsername) {
        setUser(prev => ({ ...prev, username: nuevoUsername }));
      }
    }
  }, [user.nombre, user.apellidoPaterno]);

  if (!isOpen) return null;

  // Manejador de cambios genérico para inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user.idUsuario) {
        await actualizarUsuario(user);
        await Swal.fire({ icon: 'success', title: 'Usuario Actualizado', timer: 1500, showConfirmButton: false });
      } else {
        await crearUsuario(user);
        await Swal.fire({ icon: 'success', title: 'Usuario Creado', timer: 1500, showConfirmButton: false });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      // ELIMINAMOS EL 'ANY' DEL ERROR
      let mensajeError = "Hubo un problema al procesar la solicitud";

      if (axios.isAxiosError(err)) {
        // Error proveniente de la API (Axios)
        const data = err.response?.data as BackendError;
        mensajeError = data?.message || err.message;
      } else if (err instanceof Error) {
        // Error genérico de JavaScript
        mensajeError = err.message;
      }

      console.error("Error en el guardado:", mensajeError);
      Swal.fire('Error', mensajeError, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <h2>{user.idUsuario ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
          <button className="close-btn" type="button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                name="nombre"
                value={user.nombre} 
                required 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Apellido Paterno</label>
              <input 
                type="text" 
                name="apellidoPaterno"
                value={user.apellidoPaterno} 
                required 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Apellido Materno</label>
              <input 
                type="text" 
                name="apellidoMaterno"
                value={user.apellidoMaterno} 
                required 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>DNI / Identificación</label>
              <input 
                type="text" 
                name="identificacion"
                value={user.identificacion} 
                required 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Username (Automático)</label>
              <input 
                type="text" 
                value={user.username} 
                readOnly 
                style={{ backgroundColor: '#eeeeee', color: '#666', fontWeight: 'bold' }} 
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={user.email} 
                required 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>{user.idUsuario ? 'Cambiar Contraseña (Opcional)' : 'Contraseña'}</label>
              <input 
                type="password" 
                name="password"
                value={user.password || ''}
                required={!user.idUsuario} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Rol {!canEditRol && <span style={{color: 'red'}}> (Bloqueado)</span>}</label>
              <select 
                name="rolSistema"
                value={user.rolSistema} 
                disabled={!canEditRol}
                onChange={handleInputChange}
              >
                <option value="USER">Usuario (USER)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={user.estado} onChange={handleInputChange}>
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;