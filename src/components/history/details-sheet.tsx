import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Revenue } from '@/types/revenue'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface DetailsSheetProps {
  revenue: Revenue | null
  onClose: () => void
}

export function DetailsSheet({ revenue, onClose }: DetailsSheetProps) {
  if (!revenue) return null

  return (
    <Sheet open={!!revenue} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{revenue.clientName}</SheetTitle>
          <SheetDescription>ID do Lançamento: {revenue.id}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Status da Automação</h4>
            <Badge
              variant={revenue.status === 'Concluído' ? 'default' : 'secondary'}
              className={`text-sm py-1 ${revenue.status === 'Concluído' ? 'bg-secondary' : ''}`}
            >
              {revenue.status}
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4">
            <DetailItem
              label="Valor da Venda"
              value={formatCurrency(revenue.value)}
              valueClass="text-2xl font-bold text-primary"
            />
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Data da Venda" value={formatDate(revenue.date)} />
              <DetailItem label="Registrado em" value={formatDate(revenue.createdAt)} />
              <DetailItem label="CNPJ/CPF" value={revenue.document} />
              <DetailItem label="Segmento" value={revenue.segment} />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <DetailItem label="Vendedor Responsável" value={revenue.rep} />
            <DetailItem label="Categoria / Produto" value={revenue.category} />
          </div>

          {revenue.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Observações</span>
                <p className="text-sm bg-muted/50 p-4 rounded-md border leading-relaxed">
                  {revenue.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailItem({
  label,
  value,
  valueClass = 'text-base font-medium',
}: {
  label: string
  value: string | number
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
