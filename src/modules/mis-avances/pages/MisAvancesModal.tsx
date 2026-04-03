import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { registrarAvance, type AvanceActividad } from '../services/avance.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  actividad: AvanceActividad | null;
  onSuccess: () => void;
}

// Definimos la interfaz para el error del backend para evitar el 'any'
interface AxiosErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

const MisAvancesModal: React.FC<Props> = ({ isOpen, onClose, actividad, onSuccess }) => {
  const [cantidad, setCantidad] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCantidad('');
      setDescripcion('');
    }
  }, [isOpen]);

  if (!isOpen || !actividad) return null;

  const acumulado = actividad.cantidadAcumulada || 0;
  const objetivo = actividad.cantidadObjetivo || 0;
  const pendiente = objetivo - acumulado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = parseFloat(cantidad);

    if (isNaN(cantNum) || cantNum <= 0) {
      return Swal.fire('Error', 'Ingresa una cantidad válida mayor a 0', 'error');
    }
    if (cantNum > pendiente) {
      return Swal.fire('Error', `No puedes exceder el pendiente (${pendiente.toFixed(2)})`, 'error');
    }

    try {
      setLoading(true);
      await registrarAvance({
        idActividadProyecto: actividad.idActividadProyecto,
        cantidad: cantNum,
        descripcion: descripcion
      });

      await Swal.fire('¡Éxito!', 'Avance registrado correctamente', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      // Tipado correcto del error para ESLint
      const error = err as AxiosErrorResponse;
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al registrar avance";
      Swal.fire('Error', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header">
          <h3><FaSave /> Reportar Avance</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body p-4">
          <div className="info-summary mb-3" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
            <p className="mb-1"><strong>Actividad:</strong> {actividad.nombreActividad}</p>
            <p className="mb-0 text-primary"><strong>Pendiente actual:</strong> {pendiente.toFixed(2)}</p>
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Cantidad trabajada:</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej: 10.50"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Descripción / Observaciones:</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe lo realizado..."
              rows={3}
              required
            ></textarea>
          </div>

          <div className="modal-footer mt-4 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Confirmar Avance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MisAvancesModal;