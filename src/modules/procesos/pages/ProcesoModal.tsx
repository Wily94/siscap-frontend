import { useState } from 'react';
import Swal from 'sweetalert2';
import { crearProceso, actualizarProceso, type Proceso } from '../services/proceso.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  procesoEdit: Proceso | null;
  onSuccess: () => void;
}

const ProcesoModal = ({ isOpen, onClose, procesoEdit, onSuccess }: Props) => {
  const [proceso, setProceso] = useState<Proceso>(
    procesoEdit || { nombre: '', estado: 'A' }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (proceso.idProceso) {
        await actualizarProceso(proceso);
        Swal.fire({ icon: 'success', title: '¡Actualizado!', showConfirmButton: false, timer: 1500 });
      } else {
        await crearProceso(proceso);
        Swal.fire({ icon: 'success', title: '¡Creado!', showConfirmButton: false, timer: 1500 });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      Swal.fire('Error', 'No se pudo guardar la información.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{proceso.idProceso ? 'Editar Proceso' : 'Nuevo Proceso'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={guardar}>
          <div className="form-group">
            <label>Nombre del Proceso</label>
            <input 
              type="text" 
              value={proceso.nombre} 
              onChange={(e) => setProceso({ ...proceso, nombre: e.target.value })}
              placeholder="Ej: Instalación Eléctrica"
              required 
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select 
              value={proceso.estado}
              onChange={(e) => setProceso({ ...proceso, estado: e.target.value as 'A' | 'I' })}
            >
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Proceso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcesoModal;