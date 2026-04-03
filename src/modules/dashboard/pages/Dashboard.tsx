import { useEffect, useState } from 'react';
import { obtenerResumenDashboard, type DashboardDTO } from '../services/dashboard.service';
import { FaHardHat, FaCheckDouble, FaPercentage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './styles/dashboard.scss';

const Dashboard = () => {
  const [proyectos, setProyectos] = useState<DashboardDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // Nuevo estado para el filtro: null (todos), 'ACTIVO' o 'CERRADO'
  const [filtro, setFiltro] = useState<'ACTIVO' | 'CERRADO' | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await obtenerResumenDashboard();
      setProyectos(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const totalActivos = proyectos.filter(p => p.estadoProyecto === 'ACTIVO').length;
  const completados = proyectos.filter(p => p.estadoProyecto === 'CERRADO').length;
  
  // El promedio se calcula sobre lo que se está viendo actualmente
  const proyectosFiltrados = filtro 
    ? proyectos.filter(p => p.estadoProyecto === filtro) 
    : proyectos;

  const promedioAvance = proyectosFiltrados.length > 0 
    ? (proyectosFiltrados.reduce((acc, p) => acc + (p.porcentajeAvance || 0), 0) / proyectosFiltrados.length).toFixed(1) 
    : "0.0";

  // Función para alternar filtros
  const toggleFiltro = (estado: 'ACTIVO' | 'CERRADO') => {
    setFiltro(filtro === estado ? null : estado);
    setExpandedId(null); // Colapsar tarjetas al filtrar para mejor UX
  };

  if (loading) return <div className="loading-state">Cargando panel de control...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h2>Panel de Control Proyectos</h2>
        <p className="text-muted">
          Resumen de avance basado en actividades y reportes
        </p>
      </div>

      <div className="kpi-grid">
        <div 
          className={`kpi-card ${filtro === 'ACTIVO' ? 'active-filter' : ''}`} 
          onClick={() => toggleFiltro('ACTIVO')}
          style={{ cursor: 'pointer' }}
        >
          <FaHardHat className="icon blue" />
          <div className="data">
            <span>Proyectos Activos</span>
            <h3>{totalActivos}</h3>
          </div>
        </div>
        <div 
          className={`kpi-card ${filtro === 'CERRADO' ? 'active-filter' : ''}`} 
          onClick={() => toggleFiltro('CERRADO')}
          style={{ cursor: 'pointer' }}
        >
          <FaCheckDouble className="icon green" />
          <div className="data">
            <span>Finalizados</span>
            <h3>{completados}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <FaPercentage className="icon orange" />
          <div className="data">
            <span>Avance Promedio</span>
            <h3>{promedioAvance}%</h3>
          </div>
        </div>
      </div>

      <div className="projects-section">
        <h3>
          {filtro === 'ACTIVO' ? 'Proyectos Activos' : filtro === 'CERRADO' ? 'Proyectos Finalizados' : 'Estado de Avance Detallado'}
        </h3>
        <div className="projects-grid">
          {proyectosFiltrados.map((proy) => (
            <div
              key={proy.idProyecto}
              className={`project-progress-card ${expandedId === proy.idProyecto ? "expanded" : ""}`}
            >
              <div
                className="card-header"
                onClick={() =>
                  setExpandedId(
                    expandedId === proy.idProyecto ? null : proy.idProyecto,
                  )
                }
              >
                <div className="info-group">
                  <h4>{proy.nombreProyecto || "Sin nombre"}</h4>
                  <span className="location">
                    {proy.ubicacion || "Sin ubicación"}
                  </span>
                </div>
                <div className="status-group">
                  <span
                    className={`status-badge ${(proy.estadoProyecto || "").toLowerCase()}`}
                  >
                    {proy.estadoProyecto === "CERRADO"
                      ? "FINALIZADO"
                      : proy.estadoProyecto}
                  </span>
                  {expandedId === proy.idProyecto ? (
                    <FaChevronUp className="arrow" />
                  ) : (
                    <FaChevronDown className="arrow" />
                  )}
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-info">
                  <span>Progreso General</span>
                  <span className="percentage">
                    {(proy.porcentajeAvance || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${proy.porcentajeAvance || 0}%`,
                      backgroundColor:
                        (proy.porcentajeAvance || 0) >= 100
                          ? "#22c55e"
                          : "#3b82f6",
                    }}
                  ></div>
                </div>

                {/* DESGLOSE DE ACTIVIDADES */}
                {expandedId === proy.idProyecto && (
                  <div className="activities-detail">
                    <p className="detail-title">Tareas del Proyecto</p>

                    {proy.actividades &&
                    proy.actividades.some((a) => a.nombreActividad) ? (
                      proy.actividades.map((act, idx) => {
                        const pAct = Number(act.nombreUnidad) || 0;
                        return (
                          <div key={idx} className="activity-item">
                            <div className="activity-info">
                              <span className="act-name">
                                {act.nombreActividad || "Tarea"}
                              </span>
                              <span className="act-perc">
                                {pAct.toFixed(1)}%
                              </span>
                            </div>
                            <div className="activity-bar-bg">
                              <div
                                className="activity-bar-fill"
                                style={{
                                  width: `${pAct}%`,
                                  backgroundColor:
                                    pAct >= 100 ? "#10b981" : "#94a3b8",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-tasks-message">
                        <small>
                          No hay ninguna tarea asignada a este proyecto todavía.
                        </small>
                      </div>
                    )}
                  </div>
                )}

                <div className="progress-footer">
                  <small>
                    {proy.avancesRegistrados || 0} avances reportados
                  </small>
                  <small>{proy.totalActividades || 0} actividades</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;