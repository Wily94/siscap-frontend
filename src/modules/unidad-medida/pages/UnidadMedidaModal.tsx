import { useState } from 'react';
import Swal from 'sweetalert2';
import { crearUnidad, actualizarUnidad, type UnidadMedida } from '../services/unidadMedida.service';
import './styles/unidadMedidaForm.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unidadEdit: UnidadMedida | null;
  onSuccess: () => void;
}

const UnidadMedidaModal = ({ isOpen, onClose, unidadEdit, onSuccess }: Props) => {
  // Inicializamos el estado directamente. El 'key' en el padre asegura que esto se resetee.
  const [unidad, setUnidad] = useState<UnidadMedida>(
    unidadEdit || { nombre: '', estado: 'A' }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unidad.nombre.trim()) return;

    try {
      setIsSubmitting(true);
      if (unidad.idUnidad) {
        await actualizarUnidad(unidad);
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Registro modificado.', timer: 2000, showConfirmButton: false });
      } else {
        await crearUnidad(unidad);
        Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Nuevo registro guardado.', timer: 2000, showConfirmButton: false });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar la información.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{unidad.idUnidad ? 'Editar Unidad de Medida' : 'Nueva Unidad de Medida'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={guardar}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={unidad.nombre}
              onChange={(e) => setUnidad({ ...unidad, nombre: e.target.value })}
              placeholder="Ej. Metro Lineal, Punto de Red..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              value={unidad.estado}
              onChange={(e) => setUnidad({ ...unidad, estado: e.target.value as 'A' | 'I' })}
            >
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnidadMedidaModal;