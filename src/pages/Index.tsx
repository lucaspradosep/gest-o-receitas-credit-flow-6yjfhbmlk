import { Link, Navigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCredit } from '@/context/credit-context'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useRole } from '@/context/role-context'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

export default function Index() {
  const { credits } = useCredit()
  const { role } = useRole()

  const currentYear = new Date().getFullYear().toString()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [statusFilter, setStatusFilter] = useState('Todos')

  if (role === 'Comercial') {
    return <Navigate to="/nova-analise" replace />
  }

  const filteredCredits = credits.filter((c) => {
    const date = new Date(c.createdAt)
    const matchYear = date.getFullYear().toString() === selectedYear
    const matchMonth = selectedMonth === 'all' || date.getMonth().toString() === selectedMonth
    const matchStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Aprovados' && c.status === 'Aprovado') ||
      (statusFilter === 'Reprovados' && c.status === 'Reprovado') ||
      (statusFilter === 'Pendentes' && c.status === 'Pendente')
    return matchYear && matchMonth && matchStatus
  })

  const totalAnalyses = filteredCredits.length
  const totalApprovedOnly = filteredCredits.filter(
    (c) => c.status === 'Aprovado' && !c.requiresFollowUp,
  ).length
  const approvedFollowUp = filteredCredits.filter(
    (c) => c.status === 'Aprovado' && c.requiresFollowUp,
  ).length
  const totalApproved = totalApprovedOnly + approvedFollowUp
  const denied = filteredCredits.filter((c) => c.status === 'Reprovado').length
  const pending = filteredCredits.filter((c) => c.status === 'Pendente').length

  const totalValueApproved = filteredCredits
    .filter((c) => c.status === 'Aprovado')
    .reduce((sum, c) => sum + c.value, 0)

  const totalValueDenied = filteredCredits
    .filter((c) => c.status === 'Reprovado')
    .reduce((sum, c) => sum + c.value, 0)

  const pieData = [
    { name: 'Aprovados', value: totalApprovedOnly, fill: 'hsl(var(--primary))' },
    { name: 'Aprovados (Acomp.)', value: approvedFollowUp, fill: 'hsl(var(--chart-4))' },
    { name: 'Reprovados', value: denied, fill: 'hsl(var(--destructive))' },
    { name: 'Pendentes', value: pending, fill: 'hsl(var(--muted-foreground))' },
  ].filter((d) => d.value > 0)

  const chartConfig = {
    Aprovados: { label: 'Aprovados', color: 'hsl(var(--primary))' },
    'Aprovados (Acomp.)': { label: 'Aprovados (Acomp.)', color: 'hsl(var(--chart-4))' },
    Reprovados: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
    Pendentes: { label: 'Pendentes', color: 'hsl(var(--muted-foreground))' },
  }

  const denialReasons = filteredCredits
    .filter((c) => c.status === 'Reprovado' && (c.denialReasons || c.denialReason))
    .flatMap((c) => c.denialReasons || (c.denialReason ? [c.denialReason] : []))
    .reduce(
      (acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const barData = Object.entries(denialReasons).map(([name, value]) => ({ name, value }))
  const followUpQueue = filteredCredits.filter((c) => c.status === 'Aprovado' && c.requiresFollowUp)

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h2>
          <p className="text-muted-foreground">
            Métricas de aprovação e monitoramento de crédito (Uso Interno).
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Meses</SelectItem>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i)
                    .toLocaleString('pt-BR', { month: 'long' })
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Análises</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">Solicitações filtradas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAnalyses > 0 ? Math.round((totalApproved / totalAnalyses) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={formatCurrency(totalValueApproved)}>
              {formatCurrency(totalValueApproved)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Crédito concedido</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reprovados</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denied}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAnalyses > 0 ? Math.round((denied / totalAnalyses) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Reprovado</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={formatCurrency(totalValueDenied)}>
              {formatCurrency(totalValueDenied)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Crédito declinado</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-muted-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SLA Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando análise</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Aprovações vs Reprovações</CardTitle>
            <CardDescription>Distribuição de status no período</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                Nenhum dado para exibir.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Motivos de Reprovação</CardTitle>
            <CardDescription>Visão interna de métricas de recusa</CardDescription>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={110}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--destructive))"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="value"
                        position="right"
                        fontSize={12}
                        fill="currentColor"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                Nenhum dado de reprovação no período.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Fila de Acompanhamento</CardTitle>
            <CardDescription>Clientes aprovados com ressalvas</CardDescription>
          </CardHeader>
          <CardContent>
            {followUpQueue.length > 0 ? (
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                {followUpQueue.map((c) => (
                  <div key={c.id} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm truncate pr-2">{c.clientName}</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {formatCurrency(c.value)} • {c.requesterEmail}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                Nenhum cliente em acompanhamento.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(statusFilter === 'Aprovados' || statusFilter === 'Reprovados') && (
        <Card className="shadow-sm animate-fade-in-up">
          <CardHeader>
            <CardTitle>Detalhamento: {statusFilter}</CardTitle>
            <CardDescription>
              Lista de solicitações com status {statusFilter.toLowerCase()} no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDateTime(credit.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">{credit.clientName}</TableCell>
                        <TableCell>{credit.document}</TableCell>
                        <TableCell>{formatCurrency(credit.value)}</TableCell>
                        <TableCell>
                          <Badge variant={credit.status === 'Aprovado' ? 'default' : 'destructive'}>
                            {credit.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
