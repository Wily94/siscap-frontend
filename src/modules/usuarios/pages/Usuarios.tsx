import { useEffect, useState, useCallback, useContext } from "react";
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  listarUsuarios,
  eliminarUsuario,
  type Usuario,
} from "../services/usuario.service";
import UsuarioModal from "./UsuarioModal";
import "./styles/usuario.scss";
import { AuthContext } from "../../../core/context/auth.context";

const Usuarios = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // 1. Extraemos el contexto completo
  const authContext = useContext(AuthContext);
  
  // 2. Obtenemos el rol de forma segura para TS
  const rolDelUsuarioLogueado = authContext?.user?.rolSistema || 'USER';

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listarUsuarios();
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleOpenModal = (usuario: Usuario | null = null) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "El usuario perderá acceso al sistema",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarUsuario(id);
          cargar();
          Swal.fire("Eliminado", "Usuario borrado correctamente", "success");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire(
            "Error",
            "No se pudo eliminar el usuario. Es posible que tenga registros asociados.",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-info">
          <h2>Gestión de Usuarios</h2>
          <p className="text-muted">Control de accesos y roles del personal</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal(null)}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="list-body">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              data.map((u) => (
                <tr key={u.idUsuario}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.nombre}</div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {`${u.apellidoPaterno} ${u.apellidoMaterno}`}
                    </div>
                  </td>
                  <td className="font-bold">{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-tag ${u.rolSistema.toLowerCase()}`}>
                      {u.rolSistema === "ADMIN" ? <FaUserShield /> : <FaUser />}{" "}
                      {u.rolSistema}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${u.estado === "A" || u.estado === "ACTIVO" ? "active" : "inactive"}`}
                    >
                      {u.estado === "A" || u.estado === "ACTIVO"
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleOpenModal(u)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleEliminar(u.idUsuario!)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <UsuarioModal
        key={selectedUser?.idUsuario || "nuevo"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEdit={selectedUser}
        onSuccess={cargar}
        // 3. Pasamos la variable segura
        currentUserRol={rolDelUsuarioLogueado}
      />
    </div>
  );
};

export default Usuarios;