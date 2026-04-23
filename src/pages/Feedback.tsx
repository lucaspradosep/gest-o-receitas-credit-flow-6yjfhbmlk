import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCredit } from '@/context/credit-context'
import { CreditRequest, CreditStatus } from '@/types/credit'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Navigate } from 'react-router-dom'
import { useRole } from '@/context/role-context'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Send, FileText, ExternalLink } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'

export default function Feedback() {
  const { credits, updateCreditStatus } = useCredit()
  const { role } = useRole()

  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null)
  const [status, setStatus] = useState<CreditStatus | ''>('')
  const [requiresFollowUp, setRequiresFollowUp] = useState(false)
  const [denialReasons, setDenialReasons] = useState<string[]>([])
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [infoRequestDate, setInfoRequestDate] = useState('')
  const [creditValue, setCreditValue] = useState<number>(0)
  const [sendEmail, setSendEmail] = useState(true)

  if (role === 'Comercial') {
    return <Navigate to="/nova-analise" replace />
  }

  const pendingCredits = credits.filter((c) => c.status === 'Pendente')
  const selectedCredit = credits.find((c) => c.id === selectedCreditId)

  const handleSelect = (credit: CreditRequest) => {
    setSelectedCreditId(credit.id)
    setStatus(credit.status === 'Pendente' ? '' : credit.status)
    setRequiresFollowUp(credit.requiresFollowUp || false)
    setDenialReasons([])
    setAdditionalInfo(credit.additionalInfo || '')
    setInfoRequestDate(credit.infoRequestDate || '')
    setCreditValue(credit.value || 0)
  }

  const handleSubmit = async () => {
    if (!selectedCredit) return

    if (!status || status === 'Pendente') {
      toast.error('Selecione Aprovado ou Reprovado para prosseguir.')
      return
    }

    if (status === 'Reprovado' && denialReasons.length === 0) {
      toast.error('Selecione ao menos um motivo da reprovação.')
      return
    }

    await supabase.from('devolutivas').insert([
      {
        solicitacao_id: selectedCredit.id,
        client_name: selectedCredit.clientName,
        requester_email: selectedCredit.requesterEmail,
        status,
        value: creditValue,
        requires_follow_up: status === 'Aprovado' ? requiresFollowUp : false,
        denial_reasons: status === 'Reprovado' ? denialReasons : [],
        additional_info: additionalInfo || null,
        info_request_date: infoRequestDate || null,
        analysis_date: new Date().toISOString(),
      },
    ])

    updateCreditStatus(selectedCredit.id, {
      status,
      denialReasons: status === 'Reprovado' ? denialReasons : undefined,
      requiresFollowUp: status === 'Aprovado' ? requiresFollowUp : false,
      additionalInfo,
      infoRequestDate,
      value: creditValue,
      analysisDate: new Date().toISOString(),
    })

    if (sendEmail) {
      toast.success('Devolutiva enviada!', {
        description: `E-mail de confirmação enviado para ${selectedCredit.requesterEmail}.`,
      })
    } else {
      toast.success('Status atualizado com sucesso (sem e-mail).')
    }

    setSelectedCreditId(null)
    setStatus('')
    setDenialReasons([])
    setAdditionalInfo('')
    setInfoRequestDate('')
    setCreditValue(0)
    setRequiresFollowUp(false)
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Aba Devolutiva</h2>
        <p className="text-muted-foreground">
          Gerencie e forneça parecer para as solicitações pendentes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="shadow-sm h-[650px] flex flex-col md:col-span-5 lg:col-span-4">
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
                    <span className="font-semibold truncate pr-2">{credit.clientName}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {formatDateTime(credit.createdAt).split(' ')[0]}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(credit.value)}</span>
                    <span className="truncate pl-2">{credit.requesterEmail}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm h-[650px] flex flex-col md:col-span-7 lg:col-span-8">
          <CardHeader className="pb-3 border-b">
            <CardTitle>Parecer de Análise Interna</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {!selectedCredit ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-center">
                Selecione uma solicitação pendente para fornecer a devolutiva.
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data da Solicitação (Automática)</Label>
                      <Input
                        value={formatDateTime(selectedCredit.createdAt)}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Solicitação Informações (Opcional)</Label>
                      <Input
                        type="date"
                        value={infoRequestDate}
                        onChange={(e) => setInfoRequestDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data (Análise Atual)</Label>
                      <Input
                        value={new Date().toISOString().split('T')[0]}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor do Pedido / Aprovado (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={creditValue}
                        onChange={(e) => setCreditValue(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Input
                      value={selectedCredit.clientName}
                      readOnly
                      className="bg-muted text-muted-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input
                        value={selectedCredit.document}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Empresa / Unidade</Label>
                      <Input
                        value={`${selectedCredit.empresa} - ${selectedCredit.unidadeNegocio}`}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                  </div>

                  {selectedCredit.notes && (
                    <div className="space-y-2">
                      <Label>Observações do Pedido</Label>
                      <Textarea
                        value={selectedCredit.notes}
                        readOnly
                        className="bg-muted text-muted-foreground resize-none h-auto min-h-[60px]"
                      />
                    </div>
                  )}

                  {selectedCredit.documentation && (
                    <div className="space-y-2">
                      <Label>Documentação Complementar</Label>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        asChild
                      >
                        <a
                          href={selectedCredit.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Visualizar / Baixar Documento Anexo
                          <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-base font-semibold">Status da Análise *</Label>
                    <RadioGroup
                      value={status}
                      onValueChange={(v: CreditStatus) => setStatus(v)}
                      className="flex flex-wrap gap-6 pt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Aprovado" id="status-aprovado" />
                        <Label htmlFor="status-aprovado" className="font-medium cursor-pointer">
                          Aprovado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Reprovado" id="status-reprovado" />
                        <Label htmlFor="status-reprovado" className="font-medium cursor-pointer">
                          Reprovado
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {status === 'Aprovado' && (
                    <div className="flex items-center space-x-3 bg-primary/5 p-4 rounded-md border border-primary/20 animate-in fade-in duration-200">
                      <Switch
                        id="requires-followup"
                        checked={requiresFollowUp}
                        onCheckedChange={setRequiresFollowUp}
                      />
                      <Label
                        htmlFor="requires-followup"
                        className="cursor-pointer font-medium text-primary"
                      >
                        Aprovado com acompanhamento
                      </Label>
                    </div>
                  )}

                  {status === 'Reprovado' && (
                    <div className="space-y-3 p-4 bg-destructive/5 rounded-md border border-destructive/20 animate-in fade-in duration-200">
                      <Label className="text-destructive font-semibold">
                        Motivos da Reprovação (Uso Interno) *
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {[
                          'Score Baixo',
                          'Score Negativo',
                          'Endereço',
                          'Inadimplência na Praça',
                          'Possível Fraude',
                          'Documentação Incompleta',
                          'Outros',
                        ].map((reason) => (
                          <div className="flex items-center space-x-2" key={reason}>
                            <Checkbox
                              id={`reason-${reason}`}
                              checked={denialReasons.includes(reason)}
                              onCheckedChange={(c) => {
                                if (c) setDenialReasons([...denialReasons, reason])
                                else setDenialReasons(denialReasons.filter((r) => r !== reason))
                              }}
                            />
                            <Label
                              htmlFor={`reason-${reason}`}
                              className="text-sm font-normal cursor-pointer leading-none"
                            >
                              {reason}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        O Comercial verá apenas um aviso padrão LGPD.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <Label>Retorno / Notas Internas</Label>
                    <Textarea
                      placeholder="Observações adicionais para gestão..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch id="sendEmail" checked={sendEmail} onCheckedChange={setSendEmail} />
                    <Label htmlFor="sendEmail" className="font-normal cursor-pointer text-sm">
                      Enviar e-mail de notificação para{' '}
                      <span className="font-semibold">{selectedCredit.requesterEmail}</span>
                    </Label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!status || status === 'Pendente'}
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
