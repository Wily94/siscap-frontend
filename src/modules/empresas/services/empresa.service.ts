import api from '../../../core/api/axios'

export type Empresa = {
  idEmpresa?: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  estado: 'ACTIVO' | 'INACTIVO'// Activo / Inactivo
}

export const listarEmpresas = () =>
  api.get<Empresa[]>('/empresas')

export const crearEmpresa = (data: Empresa) =>
  api.post('/empresas', data)

export const eliminarEmpresa = (id: number) =>
  api.delete(`/empresas/${id}`)

export const actualizarEmpresa = (data: Empresa) =>
  api.put(`/empresas/${data.idEmpresa}`, data)