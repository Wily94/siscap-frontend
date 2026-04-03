import api from '../../../core/api/axios';

export type Proyecto = {
  idProyecto?: number;
  nombre: string;
  idEmpresa: number;
  nombreEmpresa?: string; // Viene del JOIN
  ubicacion: string;
  responsable?: string;// ID del usuario responsable
  estado: 'ACTIVO' | 'CERRADO';
};

export const listarProyectos = () => 
  api.get<Proyecto[]>('/proyectos');

export const crearProyecto = (data: Proyecto) => 
  api.post('/proyectos', data);

export const actualizarProyecto = (data: Proyecto) => 
  api.put(`/proyectos/${data.idProyecto}`, data);

export const eliminarProyecto = (id: number) => 
  api.delete(`/proyectos/${id}`);