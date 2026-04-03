import { useAuth } from '../core/context/useAuth'
import './Navbar.scss'

const Navbar = () => {
  const { user, logout } = useAuth()

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ')
    if (names.length > 1) {
      const firstName = names[0]
      const lastName = names[1]
      // Mostramos Nombre + Inicial del apellido para que no ocupe tanto espacio
      return `${firstName} ${lastName.charAt(0)}.`
    }
    return fullName
  }

  return (
    <nav className="navbar">
      {/* Grupo Izquierda: Logo alineado con el ancho del Sidebar */}
      <div className="navbar-left">
        <img src="/idelcom-logo1.svg" alt="IDELCOM" className="logo" />
      </div>

      {/* Grupo Centro: Título del sistema */}
      <div className="navbar-center">
        <h1 className="system-title">SISTEMA DE CONTROL DE AVANCE DE PROYECTOS</h1>
      </div>

      {/* Grupo Derecha: Info de usuario y Logout */}
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-welcome">Bienvenido,</span>
          <span className="user-name">{user?.username ? getInitials(user.username) : 'Usuario'}</span>
        </div>
        <button className="logout-btn" onClick={logout}>Salir</button>
      </div>
    </nav>
  )
}

export default Navbar