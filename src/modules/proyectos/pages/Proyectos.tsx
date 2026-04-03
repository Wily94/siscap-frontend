import React, { useEffect, useState, useCallback } from 'react';
import { type Proyecto, listarProyectos } from '../services/proyecto.service';
import { ProyectoModal } from './ProyectoModal';
import { FaProjectDiagram, FaUserTie, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/proyectos.scss'; // Asegúrate que este archivo use los mismos nombres que UnidadMedidaList.scss

export const Proyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

  // Usamos useCallback como en Unidades para mantener consistencia
  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarProyectos();
      setProyectos(res.data);
    } catch (error) {
      console.error("Error al obtener proyectos", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const handleOpenModal = (proyecto: Proyecto | null = null) => {
    setProyectoSeleccionado(proyecto);
    setShowModal(true);
  };

  return (
    <div className="list-container"> {/* Clase igual a Unidades */}
      <div className="list-header"> {/* Clase igual a Unidades */}
        <div className="header-info">
          <h2><FaProjectDiagram /> Gestión de Proyectos</h2>
          <p className="text-muted">Administración y asignación de responsables</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> Nuevo Proyecto
        </button>
      </div>

      <div className="list-body"> {/* Clase igual a Unidades */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Cliente (Empresa)</th>
              <th>Ubicación</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Cargando...</td></tr>
            ) : proyectos.length > 0 ? (
              proyectos.map(p => (
                <tr key={p.idProyecto}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.nombreEmpresa}</td>
                  <td><FaMapMarkerAlt /> {p.ubicacion || 'No definida'}</td>
                  <td>
                    <div className="responsible-cell">
                      <FaUserTie /> 
                      <span>{p.responsable || <em className="text-muted">Sin asignar</em>}</span>
                    </div>
                  </td>
                  <td>
                    {/* Ajustado a 'active' e 'inactive' como en tu componente funcional */}
                    <span className={`badge ${p.estado === 'ACTIVO' ? 'active' : 'inactive'}`}>
                      {p.estado === 'ACTIVO' ? 'Activo' : 'Cerrado'}
                    </span>
                  </td>
                  <td>
                    <div className="action-group"> {/* Clase igual a Unidades */}
                      <button className="btn-icon btn-edit" onClick={() => handleOpenModal(p)}>
                        <FaEdit /> <span>Editar</span>
                      </button>
                      <button className="btn-icon btn-delete">
                        <FaTrash /> <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No hay proyectos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProyectoModal 
        key={proyectoSeleccionado?.idProyecto || 'nuevo'} 
        onClose={() => setShowModal(false)} 
        proyectoEdit={proyectoSeleccionado}
        onSuccess={fetchProyectos}
        // Agregamos isOpen si tu Modal lo requiere como el de Unidades
        isOpen={showModal} 
      />
    </div>
  );
};

export default Proyectos;