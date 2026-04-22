export type RevenueStatus = 'Concluído' | 'Aguardando Processamento' | 'Erro'

export interface Revenue {
  id: string
  clientName: string
  document: string
  segment: string
  value: number
  date: string
  category: string
  rep: string
  notes?: string
  status: RevenueStatus
  createdAt: string
}
