export type CreditStatus = 'Pendente' | 'Aprovado' | 'Reprovado' | 'Mais Documentações'

export interface CreditRequest {
  id: string
  clientName: string
  document: string
  value: number
  quantity: number
  deliveryAddress: string
  requesterEmail: string

  empresa: string
  uf: string
  cep?: string
  unidadeNegocio: string

  status: CreditStatus
  requiresFollowUp: boolean
  denialReasons?: string[]
  denialReason?: string
  additionalInfo?: string
  infoRequestDate?: string
  analysisDate?: string
  createdAt: string

  documentation?: string
  notes?: string
}
