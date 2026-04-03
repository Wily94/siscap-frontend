import api from '../../../core/api/axios'

export type Proceso = {
  idProceso?: number
  nombre: string
  estado: 'A' | 'I' // Usando los strings del backend
}

export const listarProcesos = () =>
  api.get<Proceso[]>('/procesos')

export const obtenerProceso = (id: number) =>
  api.get<Proceso>(`/procesos/${id}`)

export const crearProceso = (data: Proceso) =>
  api.post('/procesos', data)

// Corregido: Incluimos el ID en la URL para evitar el 403/Forbidden
export const actualizarProceso = (data: Proceso) =>
  api.put(`/procesos/${data.idProceso}`, data)

export const eliminarProceso = (id: number) =>
  api.delete(`/procesos/${id}`)