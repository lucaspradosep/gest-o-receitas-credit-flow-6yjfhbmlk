import { useState } from 'react'
import { Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCredit } from '@/context/credit-context'
import { CreditRequest } from '@/types/credit'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DetailsSheet } from '@/components/history/details-sheet'
import { useRole } from '@/context/role-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Historico() {
  const { credits } = useCredit()
  const { role } = useRole()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [selectedCredit, setSelectedCredit] = useState<CreditRequest | null>(null)

  const isComercial = role === 'Comercial'

  const filteredCredits = credits.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.document.includes(searchTerm)

    if (statusFilter === 'Todos') return matchesSearch
    if (statusFilter === 'Aprovados')
      return (
        matchesSearch && (c.status === 'Aprovado' || c.status === 'Aprovado com acompanhamento')
      )
    if (statusFilter === 'Reprovados') return matchesSearch && c.status === 'Reprovado'
    if (statusFilter === 'Pendentes') return matchesSearch && c.status === 'Pendente'

    return matchesSearch
  })

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Aprovado' || status === 'Aprovado com acompanhamento') return 'default'
    if (status === 'Reprovado') return 'destructive'
    return 'secondary'
  }

  const displayStatus = (status: string) => {
    if (isComercial) {
      if (status === 'Pendente') return 'Ainda está pendente'
      if (status === 'Aprovado com acompanhamento') return 'Aprovado'
    }
    return status
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Solicitações</h2>
          <p className="text-muted-foreground">
            {isComercial
              ? 'Acompanhe o status das suas solicitações de análise de crédito.'
              : 'Consulte todas as análises passadas e em andamento (Visão de Gestão).'}
          </p>
        </div>
        {!isComercial && (
          <Button variant="outline" className="w-full md:w-auto gap-2">
            <Download className="h-4 w-4" /> Baixar Relatório
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-muted">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <CardTitle className="text-lg">Todos os Registros</CardTitle>
            <div className="flex w-full md:w-auto flex-col sm:flex-row items-center gap-3">
              <Input
                placeholder="Buscar cliente ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Aprovados">Aprovados</SelectItem>
                  <SelectItem value="Reprovados">Reprovados</SelectItem>
                  <SelectItem value="Pendentes">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCredits.map((credit) => (
                  <TableRow
                    key={credit.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedCredit(credit)}
                  >
                    <TableCell className="pl-6 font-medium">
                      {formatDate(credit.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{credit.clientName}</div>
                      <div className="text-xs text-muted-foreground">{credit.requesterEmail}</div>
                    </TableCell>
                    <TableCell>{credit.document}</TableCell>
                    <TableCell>
                      <div className="font-medium text-primary">{formatCurrency(credit.value)}</div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant={getStatusBadgeVariant(credit.status)}>
                        {displayStatus(credit.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DetailsSheet credit={selectedCredit} onClose={() => setSelectedCredit(null)} />
    </div>
  )
}
