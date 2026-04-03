import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  listarActividades, 
  listarUnidades, 
  asignarActividadAProyecto, 
  type Proyecto, 
  type Actividad, 
  type UnidadMedida 
} from '../service/proyecto.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  onSuccess: () => void;
}

const AsignarActividadModal = ({ isOpen, onClose, proyecto, onSuccess }: Props) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  
  const [formData, setFormData] = useState({
    idActividad: '',
    idUnidad: '',
    cantidadObjetivo: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [resAct, resUni] = await Promise.all([listarActividades(), listarUnidades()]);
        setActividades(resAct.data);
        setUnidades(resUni.data);
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };

    if (isOpen) {
      cargarCatalogos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ idActividad: '', idUnidad: '', cantidadObjetivo: '', fechaInicio: '', fechaFin: '' });
    }
  }, [isOpen]);

  if (!isOpen || !proyecto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica de fechas
    if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      Swal.fire('Atención', 'La fecha de fin no puede ser anterior a la de inicio', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await asignarActividadAProyecto({
        idProyecto: proyecto.idProyecto,
        idActividad: Number(formData.idActividad),
        idUnidad: Number(formData.idUnidad),
        cantidadObjetivo: Number(formData.cantidadObjetivo),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin
      });

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Actividad asignada correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo procesar la asignación', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Asignar Actividad a Proyecto</h2>
          <p className="text-muted">{proyecto.nombre}</p>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Actividad */}
          <div className="form-group">
            <label>Actividad</label>
            <select
              required
              value={formData.idActividad}
              onChange={(e) => setFormData({ ...formData, idActividad: e.target.value })}
            >
              <option value="">-- Seleccione --</option>
              {actividades.map((a) => (
                <option key={a.idActividad} value={a.idActividad}>{a.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fila 2: Unidad y Cantidad */}
          <div className="form-row" style={{ display: "flex", gap: "10px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Unidad</label>
              <select
                required
                value={formData.idUnidad}
                onChange={(e) => setFormData({ ...formData, idUnidad: e.target.value })}
              >
                <option value="">-- Und --</option>
                {unidades.map((u) => (
                  <option key={u.idUnidad} value={u.idUnidad}>{u.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Cantidad Objetivo</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.cantidadObjetivo}
                onChange={(e) => setFormData({ ...formData, cantidadObjetivo: e.target.value })}
              />
            </div>
          </div>

          {/* Fila 3: Fechas (Separadas de la fila anterior) */}
          <div className="form-row" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Fecha Inicio</label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Fecha Fin</label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: "20px" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Asignar Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarActividadModal;