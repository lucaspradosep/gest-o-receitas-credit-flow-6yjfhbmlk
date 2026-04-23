import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CreditRequest } from '@/types/credit'
import { supabase } from '@/lib/supabase/client'

interface CreditContextType {
  credits: CreditRequest[]
  addCredit: (
    credit: Omit<CreditRequest, 'id' | 'status' | 'createdAt' | 'requiresFollowUp'> & {
      requiresFollowUp?: boolean
    },
  ) => Promise<void>
  updateCreditStatus: (id: string, updates: Partial<CreditRequest>) => void
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<CreditRequest[]>([])

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: solicitacoes } = await supabase.from('solicitacoes_credito').select('*')
      const { data: devolutivas } = await supabase.from('devolutivas').select('*')

      if (solicitacoes && solicitacoes.length > 0) {
        const mapped = solicitacoes.map((s) => {
          const devolutiva = devolutivas?.find((d) => d.solicitacao_id === s.id)
          return {
            id: s.id,
            clientName: s.client_name || '',
            document: s.document || '',
            value: Number(s.value) || 0,
            quantity: s.quantity || 1,
            deliveryAddress: s.delivery_address || '',
            requesterEmail: s.requester_email || '',
            empresa: s.empresa || '',
            uf: s.uf || '',
            cep: s.cep || undefined,
            unidadeNegocio: s.unidade_negocio || '',
            notes: s.notes || undefined,
            documentation: s.documentation || undefined,
            status: devolutiva ? devolutiva.status : 'Pendente',
            requiresFollowUp: devolutiva ? devolutiva.requires_follow_up : false,
            createdAt: s.created_at || new Date().toISOString(),
            analysisDate: devolutiva ? devolutiva.analysis_date : undefined,
            denialReasons: devolutiva ? devolutiva.denial_reasons : undefined,
            additionalInfo: devolutiva ? devolutiva.additional_info : undefined,
            infoRequestDate: devolutiva ? devolutiva.info_request_date : undefined,
          } as CreditRequest
        })

        setCredits(
          mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        )
      }
    }

    fetchCredits()
  }, [])

  const addCredit = async (creditData: any) => {
    const { data, error } = await supabase
      .from('solicitacoes_credito')
      .insert([
        {
          client_name: creditData.clientName,
          document: creditData.document,
          value: creditData.value,
          quantity: creditData.quantity,
          delivery_address: creditData.deliveryAddress,
          requester_email: creditData.requesterEmail,
          empresa: creditData.empresa,
          uf: creditData.uf,
          cep: creditData.cep || null,
          unidade_negocio: creditData.unidadeNegocio,
          notes: creditData.notes || null,
          documentation: creditData.documentation || null,
        },
      ])
      .select()
      .single()

    if (data) {
      const newCredit: CreditRequest = {
        id: data.id,
        clientName: data.client_name || '',
        document: data.document || '',
        value: Number(data.value) || 0,
        quantity: data.quantity || 1,
        deliveryAddress: data.delivery_address || '',
        requesterEmail: data.requester_email || '',
        empresa: data.empresa || '',
        uf: data.uf || '',
        cep: data.cep || undefined,
        unidadeNegocio: data.unidade_negocio || '',
        notes: data.notes || undefined,
        documentation: data.documentation || undefined,
        status: 'Pendente',
        createdAt: data.created_at || new Date().toISOString(),
        requiresFollowUp: false,
      }
      setCredits((prev) => [newCredit, ...prev])
    }
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
