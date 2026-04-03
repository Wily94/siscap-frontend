import { useEffect, useState, useCallback } from 'react';
import { FaTasks, FaPlusCircle } from 'react-icons/fa';
import { listarMisPendientes, type AvanceActividad } from '../services/avance.service';
import MisAvancesModal from './MisAvancesModal'; // Importamos el nuevo modal
import './styles/mis-avances.scss';

const MisAvances = () => {
  const [actividades, setActividades] = useState<AvanceActividad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<AvanceActividad | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarMisPendientes();
      setActividades(res.data);
    } catch (error) {
      console.error("Error al cargar pendientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const abrirModalReporte = (act: AvanceActividad) => {
    setActividadSeleccionada(act);
    setIsModalOpen(true);
  };

  return (
    <div className="list-container advances-view">
      <div className="list-header">
        <div className="header-info">
          <h2><FaTasks /> Mis Tareas Pendientes</h2>
          <p className="text-muted">Reporta el progreso de tus actividades asignadas</p>
        </div>
      </div>

      <div className="list-body">
        {loading ? (
          <div className="text-center py-5">Cargando tareas...</div>
        ) : (
          <div className="card-grid">
            {actividades.map((act) => {
              const cantAcumulada = act.cantidadAcumulada || 0;
              const cantObjetivo = act.cantidadObjetivo || 0;
              const porcentaje = cantObjetivo > 0 ? Math.min((cantAcumulada / cantObjetivo) * 100, 100) : 0;

              return (
                <div key={act.idActividadProyecto} className="proyecto-card advance-card">
                  <div className="card-content">
                    <span className="project-tag">{act.nombreProyecto}</span>
                    <h3>{act.nombreActividad}</h3>
                    <div className="progress-container">
                      <div className="progress-info">
                        <span>{cantAcumulada} / {cantObjetivo}</span>
                        <span>{porcentaje.toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${porcentaje}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-primary" onClick={() => abrirModalReporte(act)}>
                      <FaPlusCircle /> Reportar Avance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL REFACTORIZADO */}
      <MisAvancesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actividad={actividadSeleccionada}
        onSuccess={cargarDatos}
      />
    </div>
  );
};

export default MisAvances;