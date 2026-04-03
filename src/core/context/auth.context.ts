import { createContext } from 'react'

export type User = {
  username: string;
  rolSistema: string; // 👈 Agregamos el rol aquí para que sea global
}

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null)