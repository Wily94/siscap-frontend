import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import './layout.scss' 

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="layout-container">
      {/* 1. Navbar arriba de todo */}
      <Navbar />
      
      {/* 2. Cuerpo que contiene Sidebar + Contenido */}
      <div className="layout-body">
        <Sidebar />
        
        {/* 3. El contenido principal es el que tendrá el scroll */}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout