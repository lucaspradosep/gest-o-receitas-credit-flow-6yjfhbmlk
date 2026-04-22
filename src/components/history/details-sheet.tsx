import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CreditRequest } from '@/types/credit'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRole } from '@/context/role-context'
import { Label } from '@/components/ui/label'

interface DetailsSheetProps {
  credit: CreditRequest | null
  onClose: () => void
}

export function DetailsSheet({ credit, onClose }: DetailsSheetProps) {
  const { role } = useRole()

  if (!credit) return null

  const isRevenueMgmt = role === 'Gestão de Receitas'

  const getStatusBadgeVariant = (s: string) => {
    if (s === 'Aprovado' || s === 'Aprovado com acompanhamento') return 'default'
    if (s === 'Reprovado') return 'destructive'
    return 'secondary'
  }

  const displayStatus = (status: string) => {
    if (!isRevenueMgmt) {
      if (status === 'Pendente') return 'Ainda está pendente'
      if (status === 'Aprovado com acompanhamento') return 'Aprovado'
    }
    return status
  }

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
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
              <Badge variant={getStatusBadgeVariant(credit.status)} className="text-sm py-1">
                {displayStatus(credit.status)}
              </Badge>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data Solicitação</h4>
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
            <DetailItem label="E-mail Solicitante" value={credit.requesterEmail} />
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

          <div className="space-y-4">
            {credit.status === 'Aprovado' && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                <h4 className="font-medium text-primary">Detalhes da Aprovação</h4>
                <p className="text-sm">O crédito foi aprovado para este cliente.</p>
              </div>
            )}

            {credit.status === 'Aprovado com acompanhamento' && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                <h4 className="font-medium text-primary">Aprovado</h4>
                {isRevenueMgmt && (
                  <p className="text-sm text-yellow-600 font-medium">
                    Atenção: Cliente em acompanhamento.
                  </p>
                )}
                <p className="text-sm">O crédito foi aprovado.</p>
              </div>
            )}

            {credit.status === 'Reprovado' && (
              <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20 space-y-3">
                <h4 className="font-medium text-destructive">Detalhes da Reprovação</h4>
                {isRevenueMgmt ? (
                  <>
                    <DetailItem
                      label="Motivo (Uso Interno)"
                      value={credit.denialReason || 'Não informado'}
                    />
                    {credit.additionalInfo && (
                      <div className="mt-2">
                        <DetailItem
                          label="Informações Complementares"
                          value={credit.additionalInfo}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-foreground p-2 bg-destructive/10 rounded border border-destructive/20">
                    Favor declinar, por motivos de resguardo legal e em virtude da lei da LGPD, não
                    divulgamos maiores informações.
                  </p>
                )}
              </div>
            )}

            {credit.status === 'Pendente' && (
              <p className="text-sm text-muted-foreground text-center p-4 border rounded-lg bg-muted/20">
                {isRevenueMgmt
                  ? 'Aguardando parecer da sua equipe na aba Devolutiva.'
                  : 'A solicitação ainda está em análise pela Gestão de Receitas.'}
              </p>
            )}

            {isRevenueMgmt && credit.analysisDate && (
              <div className="text-right pt-4">
                <span className="text-xs text-muted-foreground">
                  Analisado em: {formatDate(credit.analysisDate)}
                </span>
              </div>
            )}
          </div>
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
