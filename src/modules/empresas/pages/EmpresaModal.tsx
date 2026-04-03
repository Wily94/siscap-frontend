import { useState } from 'react';
import Swal from 'sweetalert2';
import { crearEmpresa, actualizarEmpresa, type Empresa } from '../services/empresa.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  empresaEdit: Empresa | null;
  onSuccess: () => void;
}

const EmpresaModal = ({ isOpen, onClose, empresaEdit, onSuccess }: Props) => {
  const [empresa, setEmpresa] = useState<Empresa>(
    empresaEdit || { nombre: '', direccion: '', telefono: '', email: '', estado: 'ACTIVO' }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (empresa.idEmpresa) {
        await actualizarEmpresa(empresa);
        Swal.fire({ icon: 'success', title: '¡Actualizado!', showConfirmButton: false, timer: 1500 });
      } else {
        await crearEmpresa(empresa);
        Swal.fire({ icon: 'success', title: '¡Registrado!', showConfirmButton: false, timer: 1500 });
      }
      onSuccess();
      onClose();
    } catch (error) {
      // AQUÍ SE CORRIGE EL ERROR DE ESLINT
      console.error("Error al procesar empresa:", error);
      Swal.fire('Error', 'No se pudo guardar la información de la empresa.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>{empresa.idEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={guardar}>
          <div className="form-group">
            <label>Nombre / Razón Social</label>
            <input 
              type="text" 
              value={empresa.nombre} 
              onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
              placeholder="Nombre de la empresa"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Teléfono</label>
              <input 
                type="text" 
                value={empresa.telefono} 
                onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })}
                placeholder="Central telefónica"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Email Corporativo</label>
              <input 
                type="email" 
                value={empresa.email}
                onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                placeholder="correo@empresa.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              value={empresa.direccion}
              onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
              placeholder="Av. Principal 123..."
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select 
              value={empresa.estado}
              onChange={(e) => setEmpresa({ ...empresa, estado: e.target.value as 'ACTIVO' | 'INACTIVO' })}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpresaModal;