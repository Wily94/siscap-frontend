import api from '../../../core/api/axios'

export type UnidadMedida = {
  idUnidad?: number
  nombre: string
  estado: 'A' | 'I'
}

export const listarUnidades = () =>
  api.get<UnidadMedida[]>('/unidades')

export const obtenerUnidad = (id: number) =>
  api.get<UnidadMedida>(`/unidades/${id}`)

export const crearUnidad = (data: UnidadMedida) =>
  api.post('/unidades', data)

export const actualizarUnidad = (data: UnidadMedida) =>
  api.put('/unidades', data)

export const eliminarUnidad = (id: number) =>
  api.delete(`/unidades/${id}`)