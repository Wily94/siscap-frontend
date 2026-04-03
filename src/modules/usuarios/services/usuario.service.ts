import api from '../../../core/api/axios'

export type Usuario = {
  idUsuario?: number
  identificacion : string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  username: string
  email: string
  password?: string // Opcional para cuando editamos
  rolSistema: 'ADMIN' | 'USER'
  estado: 'A' | 'I' | 'ACTIVO' | 'INACTIVO'
  
}

export const listarUsuarios = () =>
  api.get<Usuario[]>('/usuarios')

export const crearUsuario = (data: Usuario) =>
  api.post('/usuarios', data)

export const actualizarUsuario = (data: Usuario) =>
  api.put(`/usuarios/${data.idUsuario}`, data)

export const eliminarUsuario = (id: number) =>
  api.delete(`/usuarios/${id}`)

export const obtenerUsuarioPorId = (id: number) =>
  api.get<Usuario>(`/usuarios/${id}`)

export const obtenerPerfil = () => 
  api.get<Usuario>('/usuarios/perfil');
