import { createContext, useContext, useState, ReactNode } from 'react'
import { CreditRequest } from '@/types/credit'

interface CreditContextType {
  credits: CreditRequest[]
  addCredit: (
    credit: Omit<CreditRequest, 'id' | 'status' | 'createdAt' | 'requiresFollowUp'> & {
      requiresFollowUp?: boolean
    },
  ) => void
  updateCreditStatus: (id: string, updates: Partial<CreditRequest>) => void
}

const mockData: CreditRequest[] = [
  {
    id: 'CRD-001',
    clientName: 'Tech Solutions Ltda',
    document: '12.345.678/0001-90',
    value: 125000.0,
    quantity: 10,
    deliveryAddress: 'Av. Paulista, 1000 - SP',
    requesterEmail: 'carlos@vendas.com',
    empresa: 'JOHN',
    uf: 'SP',
    unidadeNegocio: 'Vendas Corporativas',
    status: 'Aprovado',
    requiresFollowUp: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    analysisDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'CRD-002',
    clientName: 'Comercial Albuquerque',
    document: '98.765.432/0001-10',
    value: 45000.0,
    quantity: 2,
    deliveryAddress: 'Rua do Comércio, 500 - RJ',
    requesterEmail: 'ana@vendas.com',
    empresa: 'TUIM',
    uf: 'RJ',
    unidadeNegocio: 'Varejo',
    status: 'Reprovado',
    denialReasons: ['Score Baixo', 'Inadimplência na Praça'],
    requiresFollowUp: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    analysisDate: new Date().toISOString(),
  },
  {
    id: 'CRD-003',
    clientName: 'Indústrias Mendes',
    document: '45.123.890/0001-55',
    value: 320000.0,
    quantity: 5,
    deliveryAddress: 'Distrito Industrial, S/N - MG',
    requesterEmail: 'marcos@vendas.com',
    empresa: 'JOHN',
    uf: 'MG',
    unidadeNegocio: 'Indústria',
    status: 'Pendente',
    requiresFollowUp: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'CRD-004',
    clientName: 'Alpha Services',
    document: '33.123.456/0001-88',
    value: 85000.0,
    quantity: 12,
    deliveryAddress: 'Av. Brasil, 200 - SP',
    requesterEmail: 'joao@vendas.com',
    empresa: 'TUIM',
    uf: 'SP',
    unidadeNegocio: 'Serviços',
    status: 'Aprovado',
    requiresFollowUp: true,
    additionalInfo: 'Monitorar pagamentos dos primeiros 3 meses.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    analysisDate: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
]

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<CreditRequest[]>(mockData)

  const addCredit = (creditData: any) => {
    const newCredit: CreditRequest = {
      ...creditData,
      id: `CRD-${String(credits.length + 1).padStart(3, '0')}`,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
      requiresFollowUp: false,
    }
    setCredits((prev) => [newCredit, ...prev])
  }

  const updateCreditStatus = (id: string, updates: Partial<CreditRequest>) => {
    setCredits((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  return (
    <CreditContext.Provider value={{ credits, addCredit, updateCreditStatus }}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredit() {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error('useCredit must be used within a CreditProvider')
  }
  return context
}
