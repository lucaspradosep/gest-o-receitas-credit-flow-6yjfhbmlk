import { createContext, useContext, useState, ReactNode } from 'react'
import { Revenue } from '@/types/revenue'

interface RevenueContextType {
  revenues: Revenue[]
  addRevenue: (revenue: Omit<Revenue, 'id' | 'status' | 'createdAt'>) => void
}

const mockData: Revenue[] = [
  {
    id: 'REV-001',
    clientName: 'Tech Solutions Ltda',
    document: '12.345.678/0001-90',
    segment: 'Tecnologia',
    value: 125000.0,
    date: '2023-10-25',
    category: 'Software',
    rep: 'Carlos Silva',
    status: 'Concluído',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'REV-002',
    clientName: 'Comercial Albuquerque',
    document: '98.765.432/0001-10',
    segment: 'Varejo',
    value: 45000.0,
    date: '2023-10-26',
    category: 'Consultoria',
    rep: 'Ana Paula',
    status: 'Concluído',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'REV-003',
    clientName: 'Indústrias Mendes',
    document: '45.123.890/0001-55',
    segment: 'Indústria',
    value: 320000.0,
    date: '2023-10-27',
    category: 'Equipamentos',
    rep: 'Marcos Santos',
    status: 'Aguardando Processamento',
    createdAt: new Date().toISOString(),
  },
]

const RevenueContext = createContext<RevenueContextType | undefined>(undefined)

export function RevenueProvider({ children }: { children: ReactNode }) {
  const [revenues, setRevenues] = useState<Revenue[]>(mockData)

  const addRevenue = (revenueData: Omit<Revenue, 'id' | 'status' | 'createdAt'>) => {
    const newRevenue: Revenue = {
      ...revenueData,
      id: `REV-${String(revenues.length + 1).padStart(3, '0')}`,
      status: 'Concluído', // Automated flow simulates immediate processing
      createdAt: new Date().toISOString(),
    }
    setRevenues((prev) => [newRevenue, ...prev])
  }

  return (
    <RevenueContext.Provider value={{ revenues, addRevenue }}>{children}</RevenueContext.Provider>
  )
}

export function useRevenue() {
  const context = useContext(RevenueContext)
  if (!context) {
    throw new Error('useRevenue must be used within a RevenueProvider')
  }
  return context
}
