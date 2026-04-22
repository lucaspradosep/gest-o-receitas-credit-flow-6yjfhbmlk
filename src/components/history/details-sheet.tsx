import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CreditRequest, CreditStatus } from '@/types/credit'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRole } from '@/context/role-context'
import { useCredit } from '@/context/credit-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface DetailsSheetProps {
  credit: CreditRequest | null
  onClose: () => void
}

export function DetailsSheet({ credit, onClose }: DetailsSheetProps) {
  const { role } = useRole()
  const { updateCreditStatus } = useCredit()

  const [status, setStatus] = useState<CreditStatus>('Pendente')
  const [paymentCondition, setPaymentCondition] = useState('')
  const [denialReason, setDenialReason] = useState('')
  const [requiresFollowUp, setRequiresFollowUp] = useState(false)
  const [followUpPeriod, setFollowUpPeriod] = useState('')

  useEffect(() => {
    if (credit) {
      setStatus(credit.status)
      setPaymentCondition(credit.paymentCondition || '')
      setDenialReason(credit.denialReason || '')
      setRequiresFollowUp(credit.requiresFollowUp)
      setFollowUpPeriod(credit.followUpPeriod || '')
    }
  }, [credit])

  if (!credit) return null

  const handleSave = () => {
    if (status === 'Reprovado' && !denialReason) {
      toast.error('Informe o motivo da reprovação.')
      return
    }

    updateCreditStatus(credit.id, {
      status,
      paymentCondition: status === 'Aprovado' ? paymentCondition : undefined,
      denialReason: status === 'Reprovado' ? denialReason : undefined,
      requiresFollowUp: status === 'Aprovado' ? requiresFollowUp : false,
      followUpPeriod: status === 'Aprovado' && requiresFollowUp ? followUpPeriod : undefined,
    })

    toast.success('Análise atualizada com sucesso', {
      description: 'Notificação enviada para faturamento@johnrichard.com.br',
    })
    onClose()
  }

  const getStatusBadgeVariant = (s: string) => {
    if (s === 'Aprovado') return 'default'
    if (s === 'Reprovado') return 'destructive'
    return 'secondary'
  }

  const isRevenueMgmt = role === 'Revenue Management'

  return (
    <Sheet open={!!credit} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{credit.clientName}</SheetTitle>
          <SheetDescription>Solicitação: {credit.id}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status Atual</h4>
              <Badge variant={getStatusBadgeVariant(credit.status)} className="text-sm py-1">
                {credit.status}
              </Badge>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data</h4>
              <p className="text-sm font-medium">{formatDate(credit.createdAt)}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <DetailItem
              label="Valor Solicitado"
              value={formatCurrency(credit.value)}
              valueClass="text-2xl font-bold text-primary"
            />
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Quantidade" value={`${credit.quantity} itens`} />
              <DetailItem label="CNPJ" value={credit.document} />
            </div>
            <DetailItem label="Endereço de Entrega" value={credit.deliveryAddress} />
            <DetailItem label="Solicitante" value={credit.requesterName} />
          </div>

          {(credit.notes || credit.documentation) && (
            <div className="space-y-4">
              {credit.documentation && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Documentação Complementar</Label>
                  <div className="text-sm p-3 rounded-md border bg-muted/50 flex items-center gap-2">
                    <span className="truncate">
                      {credit.documentation.split('\\').pop()?.split('/').pop() ||
                        'Documento anexado'}
                    </span>
                  </div>
                </div>
              )}
              {credit.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="text-sm bg-muted/50 p-3 rounded-md border">{credit.notes}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          {isRevenueMgmt ? (
            <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
              <h3 className="font-semibold">Parecer da Análise</h3>

              <div className="space-y-2">
                <Label>Resultado</Label>
                <Select value={status} onValueChange={(v: CreditStatus) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === 'Aprovado' && (
                <>
                  <div className="space-y-2 animate-fade-in-up">
                    <Label>Condição de Pagamento</Label>
                    <Input
                      placeholder="Ex: 30/60/90 dias"
                      value={paymentCondition}
                      onChange={(e) => setPaymentCondition(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 animate-fade-in-up">
                    <Checkbox
                      id="followUp"
                      checked={requiresFollowUp}
                      onCheckedChange={(c) => setRequiresFollowUp(!!c)}
                    />
                    <Label htmlFor="followUp" className="font-normal cursor-pointer">
                      Requer acompanhamento (Follow-up)
                    </Label>
                  </div>
                  {requiresFollowUp && (
                    <div className="space-y-2 animate-fade-in-up">
                      <Label>Período de Monitoramento</Label>
                      <Input
                        placeholder="Ex: Quinzenal, Mensal"
                        value={followUpPeriod}
                        onChange={(e) => setFollowUpPeriod(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              {status === 'Reprovado' && (
                <div className="space-y-2 animate-fade-in-up">
                  <Label className="text-destructive">Motivo da Reprovação *</Label>
                  <Select value={denialReason} onValueChange={setDenialReason}>
                    <SelectTrigger className="border-destructive/50 focus:ring-destructive">
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Score Baixo">Score Baixo</SelectItem>
                      <SelectItem value="Suspeita de Fraude">Suspeita de Fraude</SelectItem>
                      <SelectItem value="Endereço Inconsistente">Endereço Inconsistente</SelectItem>
                      <SelectItem value="Restrição Financeira">Restrição Financeira</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Análise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {credit.status === 'Aprovado' && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                  <h4 className="font-medium text-primary">Detalhes da Aprovação</h4>
                  <DetailItem
                    label="Condição de Pagamento"
                    value={credit.paymentCondition || 'Não informada'}
                  />
                  {credit.requiresFollowUp && (
                    <DetailItem label="Monitoramento" value={credit.followUpPeriod || 'Ativo'} />
                  )}
                </div>
              )}
              {credit.status === 'Reprovado' && (
                <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20 space-y-3">
                  <h4 className="font-medium text-destructive">Detalhes da Reprovação</h4>
                  <DetailItem label="Motivo" value={credit.denialReason || 'Não informado'} />
                </div>
              )}
              {credit.status === 'Pendente' && (
                <p className="text-sm text-muted-foreground text-center p-4 border rounded-lg bg-muted/20">
                  Aguardando parecer do time de Revenue Management.
                </p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailItem({
  label,
  value,
  valueClass = 'text-sm font-medium text-foreground',
}: {
  label: string
  value: string | number
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
