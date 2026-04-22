import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCredit } from '@/context/credit-context'
import { CreditRequest, CreditStatus } from '@/types/credit'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Navigate } from 'react-router-dom'
import { useRole } from '@/context/role-context'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function Feedback() {
  const { credits, updateCreditStatus } = useCredit()
  const { role } = useRole()

  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null)
  const [status, setStatus] = useState<CreditStatus>('Pendente')
  const [denialReason, setDenialReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [sendEmail, setSendEmail] = useState(true)

  if (role === 'Comercial') {
    return <Navigate to="/nova-analise" replace />
  }

  const pendingCredits = credits.filter((c) => c.status === 'Pendente')
  const selectedCredit = credits.find((c) => c.id === selectedCreditId)

  const handleSelect = (credit: CreditRequest) => {
    setSelectedCreditId(credit.id)
    setStatus('Pendente')
    setDenialReason('')
    setAdditionalInfo('')
  }

  const handleSubmit = () => {
    if (!selectedCredit) return

    if (status === 'Pendente') {
      toast.error('Selecione Aprovado, Aprovado com acompanhamento ou Reprovado para prosseguir.')
      return
    }

    if (status === 'Reprovado' && !denialReason) {
      toast.error('Selecione o motivo da reprovação.')
      return
    }

    const isFollowUp = status === 'Aprovado com acompanhamento'

    updateCreditStatus(selectedCredit.id, {
      status,
      denialReason: status === 'Reprovado' ? denialReason : undefined,
      requiresFollowUp: isFollowUp,
      analysisDate: new Date().toISOString(),
      additionalInfo,
    })

    if (sendEmail) {
      toast.success('Devolutiva enviada!', {
        description: `E-mail de confirmação enviado para ${selectedCredit.requesterEmail}.`,
      })
    } else {
      toast.success('Status atualizado com sucesso (sem e-mail).')
    }

    setSelectedCreditId(null)
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Aba Devolutiva</h2>
        <p className="text-muted-foreground">
          Gerencie e forneça parecer para as solicitações pendentes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Solicitações Pendentes</CardTitle>
            <CardDescription>{pendingCredits.length} aguardando análise</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2">
            {pendingCredits.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Nenhuma solicitação pendente.
              </div>
            ) : (
              pendingCredits.map((credit) => (
                <div
                  key={credit.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCreditId === credit.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(credit)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{credit.clientName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(credit.createdAt)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(credit.value)}</span>
                    <span>{credit.requesterEmail}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm h-[600px] flex flex-col">
          <CardHeader className="pb-3 border-b">
            <CardTitle>Parecer de Análise</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {!selectedCredit ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-center">
                Selecione uma solicitação pendente para fornecer a devolutiva.
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Data Solicitação</span>
                      <p className="font-medium text-sm">{formatDate(selectedCredit.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Data da Análise</span>
                      <p className="font-medium text-sm">{formatDate(new Date().toISOString())}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Nome do Cliente</span>
                    <p className="font-medium text-sm">{selectedCredit.clientName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Valor</span>
                    <p className="font-medium text-sm">{formatCurrency(selectedCredit.value)}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Status da Análise *</Label>
                    <Select value={status} onValueChange={(v: CreditStatus) => setStatus(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Aprovado com acompanhamento">
                          Aprovado com acompanhamento
                        </SelectItem>
                        <SelectItem value="Reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {status === 'Reprovado' && (
                    <div className="space-y-2 animate-fade-in-up">
                      <Label className="text-destructive">Motivo da Reprovação (Interno) *</Label>
                      <Select value={denialReason} onValueChange={setDenialReason}>
                        <SelectTrigger className="border-destructive/50 focus:ring-destructive">
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Score Negativo">Score Negativo</SelectItem>
                          <SelectItem value="Endereço">Endereço</SelectItem>
                          <SelectItem value="Fraude">Fraude</SelectItem>
                          <SelectItem value="Inadimplência na Praça">
                            Inadimplência na Praça
                          </SelectItem>
                          <SelectItem value="Documentação Incompleta">
                            Documentação Incompleta
                          </SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        O Comercial verá apenas um aviso padrão LGPD.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 animate-fade-in-up">
                    <Label>Informações Complementares</Label>
                    <Textarea
                      placeholder="Observações internas adicionais..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch id="sendEmail" checked={sendEmail} onCheckedChange={setSendEmail} />
                    <Label htmlFor="sendEmail" className="font-normal cursor-pointer text-sm">
                      Enviar e-mail automático com o resultado para{' '}
                      <span className="font-semibold">{selectedCredit.requesterEmail}</span>
                    </Label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={status === 'Pendente'}
                  >
                    <Send className="h-4 w-4" />
                    Registrar Devolutiva
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
