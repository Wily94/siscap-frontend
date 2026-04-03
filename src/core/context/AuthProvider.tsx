import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth.context'
import type { User } from './auth.context'
import { jwtDecode } from 'jwt-decode'

// 1. Extendemos el Payload para incluir lo que configuramos en Java
type JwtPayload = {
  sub: string;
  rolSistema?: string; // El campo que añadimos en el Backend
}

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      // Si ambos existen, devolvemos el objeto usuario guardado
      return JSON.parse(storedUser);
    }

    return null;
  })

  const login = (newToken: string) => {
    // 1. Decodificar el token para obtener la "verdad" del servidor
    const decoded = jwtDecode<JwtPayload>(newToken);
    
    // 2. Normalizar el rol
    const userRole = (decoded.rolSistema || "USER").toUpperCase();

    const userData: User = { 
      username: decoded.sub,
      rolSistema: userRole 
    };

    // 3. Guardar en Storage (Persistencia)
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // 4. Actualizar Estado (Reactividad)
    setToken(newToken);
    setUser(userData);
  }

  const logout = () => {
    // 🧹 Limpieza total
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ¡Importante eliminar ambos!
    
    setToken(null);
    setUser(null);
    
    // Redirigir al inicio
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}