import { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { listarProcesos, eliminarProceso, type Proceso } from '../services/proceso.service';
import ProcesoModal from './ProcesoModal';
import './styles/procesos.scss';

const Procesos = () => {
  const [data, setData] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState<Proceso | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarProcesos();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleOpenModal = (proceso: Proceso | null = null) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: '¿Eliminar proceso?',
      text: "Se borrarán los datos permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarProceso(id);
          cargar();
          Swal.fire('¡Eliminado!', 'El proceso ha sido borrado.', 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'No se pudo eliminar.', 'error');
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-info">
          <h2>Gestión de Procesos</h2>
          <p className="text-muted">Definición de etapas operativas</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> Crear Nuevo Proceso
        </button>
      </div>

      <div className="list-body">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Nombre del Proceso</th>
              <th style={{ width: '150px' }}>Estado</th>
              <th style={{ width: '200px' }} className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-5">Cargando...</td></tr>
            ) : data.map((p) => (
              <tr key={p.idProceso}>
                <td className="font-bold">{p.idProceso}</td>
                <td>{p.nombre}</td>
                <td>
                  <span className={`badge ${p.estado === 'A' ? 'active' : 'inactive'}`}>
                    {p.estado === 'A' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-group">
                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal(p)}>
                      <FaEdit /> <span>Editar</span>
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleEliminar(p.idProceso!)}>
                      <FaTrash /> <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProcesoModal 
        key={selectedProceso?.idProceso || 'nuevo-proceso'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        procesoEdit={selectedProceso}
        onSuccess={cargar}
      />
    </div>
  );
};

export default Procesos;