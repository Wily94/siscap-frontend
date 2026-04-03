import { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { listarUnidades, eliminarUnidad, type UnidadMedida } from '../services/unidadMedida.service';
import UnidadMedidaModal from './UnidadMedidaModal';
import './styles/UnidadMedidaList.scss';

const UnidadMedidaList = () => {
  const [data, setData] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadMedida | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarUnidades();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleOpenModal = (unidad: UnidadMedida | null = null) => {
    setSelectedUnidad(unidad);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarUnidad(id);
          cargar();
          Swal.fire('¡Eliminado!', 'El registro ha sido borrado.', 'success');
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
          <h2>Unidades de Medida</h2>
          <p className="text-muted">Gestión base de unidades del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> Crear Nueva Unidad
        </button>
      </div>

      <div className="list-body">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Nombre de Unidad</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Cargando...</td></tr>
            ) : (
              data.map((u) => (
                <tr key={u.idUnidad}>
                  <td className="font-bold">{u.idUnidad}</td>
                  <td>{u.nombre}</td>
                  <td>
                    <span className={`badge ${u.estado === 'A' ? 'active' : 'inactive'}`}>
                      {u.estado === 'A' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <button className="btn-icon btn-edit" onClick={() => handleOpenModal(u)}>
                        <FaEdit /> <span>Editar</span>
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleEliminar(u.idUnidad!)}>
                        <FaTrash /> <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* LA SOLUCIÓN AL ERROR DE ESLINT:
          Usamos el id o 'nuevo' como KEY. Esto destruye y recrea el modal 
          con el estado inicial correcto cada vez que cambia la selección.
      */}
      <UnidadMedidaModal 
        key={selectedUnidad?.idUnidad || 'nuevo'} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        unidadEdit={selectedUnidad}
        onSuccess={cargar}
      />
    </div>
  );
};

export default UnidadMedidaList;