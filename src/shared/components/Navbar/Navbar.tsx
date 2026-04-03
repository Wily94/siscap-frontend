import { useAuth } from '../../../core/context/useAuth'
import './Navbar.css'

const Navbar = () => {

  const { logout } = useAuth()

  const user = {
    nombre: 'Usuario', // luego lo sacamos del token o backend
  }

  return (
    <div className="navbar">

      {/* IZQUIERDA */}
      <div className="navbar-left">
        <div className="logo">SISCAP</div>
        <div className="title">
          SISTEMA DE CONTROL DE AVANCE DEL PERSONAL
        </div>
      </div>

      {/* DERECHA */}
      <div className="navbar-right">
        <span className="user">{user.nombre}</span>

        <button onClick={logout}>
          Cerrar sesión
        </button>
      </div>

    </div>
  )
}

export default Navbar