import React, { useEffect, useState } from 'react';
import { type Proyecto, crearProyecto, actualizarProyecto } from '../services/proyecto.service';
import { listarEmpresas, type Empresa } from '../../empresas/services/empresa.service';
import { listarUsuarios, type Usuario } from '../../usuarios/services/usuario.service';
import { asignarUsuario } from '../services/proyectoUsuario.service';
import { FaSave, FaBuilding, FaUserShield, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import './styles/proyectos.scss'; 
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  proyectoEdit?: Proyecto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProyectoModal: React.FC<Props> = ({ isOpen, proyectoEdit, onClose, onSuccess }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<Proyecto>({
    nombre: '',
    idEmpresa: 0,
    ubicacion: '',
    estado: 'ACTIVO'
  });

  const [idResponsable, setIdResponsable] = useState<number>(0);
  const [idRol, setIdRol] = useState<number>(1); 

  useEffect(() => {
    if (isOpen) {
      if (proyectoEdit) {
        setForm(proyectoEdit);
        setIdResponsable(0); // Reset por si se va a asignar uno nuevo
      } else {
        setForm({
          nombre: '',
          idEmpresa: 0,
          ubicacion: '',
          estado: 'ACTIVO'
        });
        setIdResponsable(0);
      }
      
      const cargarCatalogos = async () => {
        try {
          const [resEmp, resUsu] = await Promise.all([
            listarEmpresas(),
            listarUsuarios()
          ]);
          
          const dataEmpresas = resEmp.data || resEmp; 
          const dataUsuarios = resUsu.data || resUsu;

          setEmpresas(Array.isArray(dataEmpresas) ? dataEmpresas.filter(e => e.estado === 'ACTIVO') : []);
          setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
        } catch (err) {
          console.error("Error catálogos:", err);
          Swal.fire('Error', 'No se pudieron cargar los catálogos', 'error');
        }
      };
      cargarCatalogos();
    }
  }, [isOpen, proyectoEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.idEmpresa === 0) {
      return Swal.fire('Atención', 'Debe seleccionar una empresa cliente', 'warning');
    }

    setLoading(true);
    // Variable para rastrear si el proyecto se llegó a crear/existe
    let idProyectoExistente: number | undefined = proyectoEdit?.idProyecto;

    try {
      if (proyectoEdit?.idProyecto) {
        // --- MODO EDICIÓN ---
        await actualizarProyecto(form);

        // Si no tenía responsable y el admin seleccionó uno ahora:
        if (!proyectoEdit.responsable && idResponsable > 0) {
          await asignarUsuario({
            idProyecto: proyectoEdit.idProyecto,
            idUsuario: idResponsable,
            idRolProyecto: idRol
          });
        }
        
        await Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Cambios guardados.', timer: 1500, showConfirmButton: false });
      } else {
        // --- MODO CREACIÓN ---
        const resProyecto = await crearProyecto(form);
        const proyectoCreado = resProyecto.data;
        idProyectoExistente = proyectoCreado.idProyecto;

        if (idResponsable > 0 && idProyectoExistente) {
          // Intentar asignar. Si falla, saltará al catch con idProyectoExistente definido
          await asignarUsuario({
            idProyecto: idProyectoExistente,
            idUsuario: idResponsable,
            idRolProyecto: idRol
          });
        }
        await Swal.fire({ icon: 'success', title: 'Creado', text: 'Proyecto y responsable asignados.', timer: 1500, showConfirmButton: false });
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Error en proceso:", err);
      let mensajeError = "Error al procesar la solicitud";

      if (axios.isAxiosError(err)) {
        mensajeError = err.response?.data || err.message;
      }

      // MANEJO DE CASO CRÍTICO: Proyecto existe pero asignación falló
      if (idProyectoExistente && !proyectoEdit) {
        await Swal.fire({
          icon: 'warning',
          title: 'Proyecto creado con advertencia',
          text: `El proyecto se creó correctamente, pero el usuario no pudo ser asignado: ${mensajeError}`,
          confirmButtonColor: '#3085d6'
        });
        // Cerramos y refrescamos de todas formas porque el proyecto YA está en la BD
        onSuccess();
        onClose();
      } else {
        // Error general (falló la creación del proyecto mismo o la edición de datos básicos)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensajeError,
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{proyectoEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title"><FaBuilding /> Información General</h3>
            
            <div className="form-group">
              <label>Nombre del Proyecto</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre descriptivo"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cliente</label>
                <select
                  value={form.idEmpresa}
                  onChange={e => setForm({ ...form, idEmpresa: Number(e.target.value) })}
                  required
                >
                  <option value={0}>-- Seleccione --</option>
                  {empresas.map(emp => (
                    <option key={emp.idEmpresa} value={emp.idEmpresa}>{emp.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Estado</label>
                <select
                  value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value as 'ACTIVO' | 'CERRADO' })}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="CERRADO">CERRADO (FINALIZADO)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><FaMapMarkerAlt /> Ubicación</label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                placeholder="Dirección del proyecto"
              />
            </div>
          </div>

          {/* ASIGNACIÓN: Se muestra si es nuevo O si editamos uno que no tiene responsable */}
          {(!proyectoEdit || (proyectoEdit && !proyectoEdit.responsable)) && (
            <div className="form-section highlight-section">
              <h3 className="section-title">
                <FaUserShield /> {proyectoEdit ? 'Asignar Responsable (Pendiente)' : 'Asignación Responsable'}
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Técnico / Encargado</label>
                  <select 
                    value={idResponsable} 
                    onChange={e => setIdResponsable(Number(e.target.value))}
                    required={!proyectoEdit?.responsable}
                  >
                    <option value={0}>-- Seleccionar --</option>
                    {usuarios.map(u => (
                      <option key={u.idUsuario} value={u.idUsuario}>{u.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select value={idRol} onChange={e => setIdRol(Number(e.target.value))}>
                    <option value={1}>ENCARGADO</option>
                    <option value={2}>TÉCNICO LÍDER</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'Procesando...' : (proyectoEdit ? 'Guardar Cambios' : 'Crear y Asignar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};