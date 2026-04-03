import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerUnidad, crearUnidad, actualizarUnidad, type UnidadMedida } from '../services/unidadMedida.service'
import './styles/unidadMedidaForm.scss'

const UnidadMedidaForm = () => {
  const { id } = useParams<{ id: string }>()
  const [unidad, setUnidad] = useState<UnidadMedida>({ nombre: '', estado: 'A' })
  const navigate = useNavigate() // Cambio de useHistory a useNavigate

  useEffect(() => {
    if (id) {
      const cargarUnidad = async () => {
        const res = await obtenerUnidad(Number(id))
        setUnidad(res.data)
      }
      cargarUnidad()
    }
  }, [id])

  const guardar = async () => {
    if (id) {
      await actualizarUnidad(unidad)
    } else {
      await crearUnidad(unidad)
    }
    navigate('/unidades') // Usando navigate en lugar de history.push
  }

  return (
    <div className="unidad-medida-form">
      <h2>{id ? 'Editar Unidad de Medida' : 'Crear Unidad de Medida'}</h2>

      <form onSubmit={(e) => { e.preventDefault(); guardar() }}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={unidad.nombre}
            onChange={(e) => setUnidad({ ...unidad, nombre: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            className="form-control"
            value={unidad.estado}
            onChange={(e) => setUnidad({ ...unidad, estado: e.target.value as 'A' | 'I' })} // Asegurando el tipo 'A' | 'I'
            required
          >
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  )
}

export default UnidadMedidaForm