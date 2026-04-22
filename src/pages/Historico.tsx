import { useState } from 'react'
import { Download, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useRevenue } from '@/context/revenue-context'
import { Revenue } from '@/types/revenue'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DetailsSheet } from '@/components/history/details-sheet'

export default function Historico() {
  const { revenues } = useRevenue()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null)

  const filteredRevenues = revenues.filter(
    (r) =>
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rep.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Envios</h2>
          <p className="text-muted-foreground">
            Consulte todos os lançamentos e seus respectivos status.
          </p>
        </div>
        <Button variant="outline" className="w-full md:w-auto gap-2">
          <Download className="h-4 w-4" /> Baixar Relatório
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-muted">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <CardTitle className="text-lg">Todos os Registros</CardTitle>
            <div className="flex w-full md:w-auto items-center gap-2">
              <Input
                placeholder="Buscar cliente ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Button variant="secondary" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Data Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="pr-6">Status da Automação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRevenues.map((revenue) => (
                  <TableRow
                    key={revenue.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRevenue(revenue)}
                  >
                    <TableCell className="pl-6 font-medium">{formatDate(revenue.date)}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{revenue.clientName}</div>
                      <div className="text-xs text-muted-foreground">{revenue.category}</div>
                    </TableCell>
                    <TableCell>{revenue.rep}</TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatCurrency(revenue.value)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant={revenue.status === 'Concluído' ? 'default' : 'secondary'}
                        className={
                          revenue.status === 'Concluído' ? 'bg-secondary hover:bg-secondary' : ''
                        }
                      >
                        {revenue.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DetailsSheet revenue={selectedRevenue} onClose={() => setSelectedRevenue(null)} />
    </div>
  )
}
