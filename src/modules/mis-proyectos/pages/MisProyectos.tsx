import { useEffect, useState, useCallback } from 'react';
import { FaBriefcase, FaPlus } from 'react-icons/fa';
import { listarMisProyectos, type Proyecto } from '../service/proyecto.service';
import AsignarActividadModal from './AsignarActividadModal'; // Nombre corregido
import './styles/mis-proyectos.scss';

const MisProyectos = () => {
  const [data, setData] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      console.log("LLAMANDO A LISTAR PROYECTOS...");
      const res = await listarMisProyectos();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar mis proyectos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleOpenModal = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setIsModalOpen(true);
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-info">
          <h2><FaBriefcase /> Mis Proyectos Asignados</h2>
          <p className="text-muted">Gestiona las actividades de tus proyectos</p>
        </div>
      </div>

      <div className="list-body">
        {loading ? (
          <div className="text-center py-5">Cargando proyectos...</div>
        ) : (
          <div className="card-grid">
            {data.map((p) => (
              <div key={p.idProyecto} className="proyecto-card">
                <div className="card-header">
                  {/* Cambio de INACTIVO a FINALIZADO según el estado CERRADO */}
                  <span className={`badge ${p.estado === 'ACTIVO' ? 'active' : 'inactive'}`}>
                    {p.estado === 'ACTIVO' ? 'ACTIVO' : 'FINALIZADO'}
                  </span>
                </div>
                <div className="card-content">
                  <h3>{p.nombre}</h3>
                  <p><strong>Ubicación:</strong> {p.ubicacion}</p>
                  <p><strong>Empresa:</strong> {p.nombreEmpresa || 'N/A'}</p>
                </div>
                <div className="card-footer">
                  {/* Botón deshabilitado si el estado no es ACTIVO */}
                  <button 
                    className={`btn btn-primary ${p.estado !== 'ACTIVO' ? 'btn-disabled' : ''}`} 
                    onClick={() => handleOpenModal(p)}
                    disabled={p.estado !== 'ACTIVO'}
                  >
                    <FaPlus /> {p.estado === 'ACTIVO' ? 'Asignar Actividad' : 'Proyecto Cerrado'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AsignarActividadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proyecto={selectedProyecto}
        onSuccess={cargar} // Esto hará que la lista se refresque al guardar
      />
    </div>
  );
};

export default MisProyectos;