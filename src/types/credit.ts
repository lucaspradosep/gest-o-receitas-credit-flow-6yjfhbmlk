export type CreditStatus = 'Pendente' | 'Aprovado' | 'Aprovado com acompanhamento' | 'Reprovado'

export interface CreditRequest {
  id: string
  clientName: string
  document: string
  value: number
  quantity: number
  deliveryAddress: string
  requesterEmail: string
  documentation?: string
  notes?: string
  status: CreditStatus
  paymentCondition?: string
  denialReason?: string
  requiresFollowUp: boolean
  followUpPeriod?: string
  createdAt: string
  analysisDate?: string
  additionalInfo?: string
}
