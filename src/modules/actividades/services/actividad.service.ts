import api from '../../../core/api/axios'

export type Actividad = {
  idActividad?: number
  nombre: string
  descripcion?: string
  estado: 'A' | 'I' | 'ACTIVO' | 'INACTIVO'
  idProceso: number       // Cambiado: Refleja la realidad (vinculado a proceso)
  nombreProceso?: string  // Cambiado: Para el JOIN con la tabla procesos
}

export const listarActividades = () =>
  api.get<Actividad[]>('/actividades')

export const crearActividad = (data: Actividad) =>
  api.post('/actividades', data)

// Usamos el ID de la actividad para la URL REST
export const actualizarActividad = (data: Actividad) =>
  api.put(`/actividades/${data.idActividad}`, data)

export const eliminarActividad = (id: number) =>
  api.delete(`/actividades/${id}`)