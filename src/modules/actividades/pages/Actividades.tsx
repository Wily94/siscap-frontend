import { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCogs } from 'react-icons/fa'; // Cambiamos icono a Cogs (Procesos)
import Swal from 'sweetalert2';
import { listarActividades, eliminarActividad, type Actividad } from '../services/actividad.service';
import ActividadModal from './ActividadModal';
import './styles/actividades.scss';

const Actividades = () => {
  const [data, setData] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAct, setSelectedAct] = useState<Actividad | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarActividades();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleOpenModal = (act: Actividad | null = null) => {
    setSelectedAct(act);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: '¿Eliminar actividad?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#dc2626',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarActividad(id);
          cargar();
          Swal.fire('Eliminado', 'La actividad ha sido borrada.', 'success');
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire('Error', 'No se pudo eliminar la actividad.', 'error');
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-info">
          <h2>Gestión de Actividades</h2>
          <p className="text-muted">Listado de tareas vinculadas a procesos operativos</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> Nueva Actividad
        </button>
      </div>

      <div className="list-body">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Actividad / Tarea</th>
              <th>Proceso Relacionado</th>
              <th style={{ width: '150px' }}>Estado</th>
              <th style={{ width: '180px' }} className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-5">Cargando actividades...</td></tr>
            ) : data.map(a => (
              <tr key={a.idActividad}>
                <td className="font-bold">{a.idActividad}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{a.nombre}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {a.descripcion || 'Sin descripción adicional'}
                  </div>
                </td>
                <td>
                  {/* Cambiamos la visualización para que muestre el Proceso */}
                  <div className="process-tag" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#2563eb',
                    fontWeight: 500 
                  }}>
                    <FaCogs />
                    {/* nombreProceso debe venir del JOIN en tu SQL del backend */}
                    <span>{a.nombreProceso || `Proceso ID: ${a.idProceso}`}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${a.estado === 'A' || a.estado === 'ACTIVO' ? 'active' : 'inactive'}`}>
                    {a.estado === 'A' || a.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-group">
                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal(a)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleEliminar(a.idActividad!)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ActividadModal 
        key={selectedAct?.idActividad || 'nueva-act'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actEdit={selectedAct}
        onSuccess={cargar}
      />
    </div>
  );
};

export default Actividades;