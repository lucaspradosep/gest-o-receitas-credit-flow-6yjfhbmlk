import { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'Comercial' | 'Gestão de Receitas'

interface RoleContextType {
  role: Role
  isAuthenticated: boolean
  setRole: (role: Role) => void
  setIsAuthenticated: (auth: boolean) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Comercial')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <RoleContext.Provider value={{ role, setRole, isAuthenticated, setIsAuthenticated }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole must be used within RoleProvider')
  return context
}
