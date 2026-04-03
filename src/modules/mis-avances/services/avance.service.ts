import api from '../../../core/api/axios';

export interface AvanceActividad {
  idAvance?: number;
  idActividadProyecto: number;
  idUsuario?: number;
  fecha?: string;
  cantidad: number;
  descripcion: string;
  estado?: string;
  // Campos extras que vienen del DTO
  nombreActividad?: string;
  nombreProyecto?: string;
  cantidadObjetivo: number;
  cantidadAcumulada: number;
}

export const listarMisPendientes = () => 
  api.get<AvanceActividad[]>('proyectos/mis-actividades-pendientes');

export const registrarAvance = (data: Partial<AvanceActividad>) => 
  api.post('/proyectos/reportar-avance', data);