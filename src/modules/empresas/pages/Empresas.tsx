import { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { listarEmpresas, eliminarEmpresa, type Empresa } from '../services/empresa.service';
import EmpresaModal from './EmpresaModal'; // Lo crearemos a continuación
import './styles/Empresas.scss';

const Empresas = () => {
  const [data, setData] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarEmpresas();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleOpenModal = (empresa: Empresa | null = null) => {
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: '¿Eliminar empresa?',
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
          await eliminarEmpresa(id);
          cargar();
          Swal.fire('¡Eliminado!', 'La empresa ha sido borrada.', 'success');
        } catch {
          Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-info">
          <h2>Mantenimiento de Empresas</h2>
          <p className="text-muted">Gestión de clientes y proveedores del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> Crear Nueva Empresa
        </button>
      </div>

      <div className="list-body">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Nombre / Razón Social</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-5">Cargando empresas...</td></tr>
            ) : data.map((e) => (
              <tr key={e.idEmpresa}>
                <td className="font-bold">{e.idEmpresa}</td>
                <td>{e.nombre}</td>
                <td>{e.email}</td>
                <td>{e.telefono}</td>
                <td>
                  <span className={`badge ${e.estado === 'ACTIVO' ? 'active' : 'inactive'}`}>
                    {e.estado === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td>
                  <div className="action-group">
                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal(e)}>
                      <FaEdit /> <span>Editar</span>
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleEliminar(e.idEmpresa!)}>
                      <FaTrash /> <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmpresaModal 
        key={selectedEmpresa?.idEmpresa || 'nuevo-empresa'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        empresaEdit={selectedEmpresa}
        onSuccess={cargar}
      />
    </div>
  );
};

export default Empresas;