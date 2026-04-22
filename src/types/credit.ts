export type CreditStatus = 'Pendente' | 'Aprovado' | 'Negado'

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
}
