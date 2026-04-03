import api from '../../../core/api/axios';

export type ProyectoUsuario = {
  idProyectoUsuario?: number;
  idProyecto: number;
  idUsuario: number;
  idRolProyecto: number;
  // Campos informativos (JOINs)
  nombreUsuario?: string;
  nombreProyecto?: string;
  nombreRol?: string;
};

export const listarAsignaciones = () => 
  api.get<ProyectoUsuario[]>('/proyecto-usuario');

export const listarPorProyecto = (idProyecto: number) => 
  api.get<ProyectoUsuario[]>(`/proyecto-usuario/proyecto/${idProyecto}`);

export const asignarUsuario = (data: ProyectoUsuario) => 
  api.post('/proyecto-usuario', data);

export const eliminarAsignacion = (id: number) => 
  api.delete(`/proyecto-usuario/${id}`);