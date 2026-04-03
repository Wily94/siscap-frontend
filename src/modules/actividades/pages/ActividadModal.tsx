import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { crearActividad, actualizarActividad, type Actividad } from '../services/actividad.service';
import api from '../../../core/api/axios'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  actEdit: Actividad | null;
  onSuccess: () => void;
}

// Interface para el combo de Procesos
interface ProcesoCombo {
  idProceso: number;
  nombre: string;
}

const ActividadModal = ({ isOpen, onClose, actEdit, onSuccess }: Props) => {
  const [act, setAct] = useState<Actividad>(
    actEdit || { 
      nombre: '', 
      descripcion: '', 
      estado: 'ACTIVO', 
      idProceso: 0 // Nota: Si en tu BD el campo cambió a idProceso, actualiza tu interface Actividad
    }
  );
  
  const [procesos, setProcesos] = useState<ProcesoCombo[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargamos la lista de PROCESOS para el selector
  useEffect(() => {
    const cargarProcesos = async () => {
      try {
        const res = await api.get<ProcesoCombo[]>('/procesos');
        setProcesos(res.data);
      } catch (error) {
        console.error("Error al cargar combo de procesos:", error);
      }
    };
    if (isOpen) cargarProcesos();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación: debe haber un proceso seleccionado
    if (!act.idProceso) { // Asumiendo que sigues usando idProceso como nombre de campo en el DTO por ahora
      return Swal.fire('Atención', 'Seleccione el proceso al que pertenece esta actividad', 'info');
    }

    try {
      setLoading(true);
      if (act.idActividad) {
        await actualizarActividad(act);
      } else {
        await crearActividad(act);
      }
      onSuccess();
      onClose();
      Swal.fire({ icon: 'success', title: 'Guardado', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      console.error("Error en submit:", error);
      Swal.fire('Error', 'No se pudo guardar la actividad', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{act.idActividad ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Actividad</label>
            <input 
              type="text" 
              value={act.nombre} 
              required 
              onChange={e => setAct({...act, nombre: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={act.descripcion || ''} 
              rows={2}
              onChange={e => setAct({...act, descripcion: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Proceso Responsable</label>
            <select 
              value={act.idProceso} // Cambiar a idProceso si actualizas el DTO/Interface
              required
              onChange={e => setAct({...act, idProceso: Number(e.target.value)})}
            >
              <option value={0}>Seleccione un proceso...</option>
              {procesos.map(p => (
                <option key={p.idProceso} value={p.idProceso}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select 
              value={act.estado} 
              onChange={e => setAct({...act, estado: e.target.value as 'ACTIVO' | 'INACTIVO'})}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Guardar Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActividadModal;