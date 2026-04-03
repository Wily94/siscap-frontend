import api from '../../../core/api/axios';

export interface Proyecto {
  idProyecto: number;
  nombre: string;
  nombreEmpresa?: string;
  ubicacion: string;
  estado: string;
}

export interface Actividad {
  idActividad: number;
  nombre: string;
}

export interface UnidadMedida {
  idUnidad: number;
  nombre: string;
  abreviatura: string;
}

export interface AsignarActividadDTO {
  idProyecto: number;
  idActividad: number;
  idUnidad: number;
  cantidadObjetivo: number;
  fechaInicio: string; // Nuevo
  fechaFin: string; // Nuevo
}

export const listarMisProyectos = () => api.get<Proyecto[]>('/proyectos/mis-proyectos');
export const listarActividades = () => api.get<Actividad[]>('/actividades');
export const listarUnidades = () => api.get<UnidadMedida[]>('/unidades'); // Necesitarás este endpoint
export const asignarActividadAProyecto = (data: AsignarActividadDTO) => 
  api.post('/proyectos/asignar-actividad', data);