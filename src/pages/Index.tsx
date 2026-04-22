import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCredit } from '@/context/credit-context'
import { formatCurrency } from '@/lib/utils'
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
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Navigate } from 'react-router-dom'
import { useRole } from '@/context/role-context'
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
  const [selectedMonth, setSelectedMonth] = useState('all')

  if (role === 'Comercial') {
    return <Navigate to="/nova-analise" replace />
  }

  const filteredCredits =
    selectedMonth === 'all'
      ? credits
      : credits.filter((c) => new Date(c.createdAt).getMonth() === parseInt(selectedMonth))

  const totalAnalyses = filteredCredits.length
  const approved = filteredCredits.filter((c) => c.status === 'Aprovado').length
  const approvedFollowUp = filteredCredits.filter(
    (c) => c.status === 'Aprovado com acompanhamento',
  ).length
  const totalApproved = approved + approvedFollowUp
  const denied = filteredCredits.filter((c) => c.status === 'Reprovado').length
  const pending = filteredCredits.filter((c) => c.status === 'Pendente').length

  const pieData = [
    { name: 'Aprovados', value: approved, fill: 'hsl(var(--primary))' },
    { name: 'Aprovados (Acomp.)', value: approvedFollowUp, fill: 'hsl(var(--chart-4))' },
    { name: 'Reprovados', value: denied, fill: 'hsl(var(--destructive))' },
    { name: 'Pendentes', value: pending, fill: 'hsl(var(--muted-foreground))' },
  ]

  const chartConfig = {
    Aprovados: { label: 'Aprovados', color: 'hsl(var(--primary))' },
    'Aprovados (Acomp.)': { label: 'Aprovados (Acomp.)', color: 'hsl(var(--chart-4))' },
    Reprovados: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
    Pendentes: { label: 'Pendentes', color: 'hsl(var(--muted-foreground))' },
  }

  const denialReasons = filteredCredits
    .filter((c) => c.status === 'Reprovado' && c.denialReason)
    .reduce(
      (acc, curr) => {
        acc[curr.denialReason!] = (acc[curr.denialReason!] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const barData = Object.entries(denialReasons).map(([name, value]) => ({ name, value }))
  const followUpQueue = filteredCredits.filter(
    (c) => c.status === 'Aprovado com acompanhamento' || c.requiresFollowUp,
  )

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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtro de Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Meses</SelectItem>
              <SelectItem value="0">Janeiro</SelectItem>
              <SelectItem value="1">Fevereiro</SelectItem>
              <SelectItem value="2">Março</SelectItem>
              <SelectItem value="3">Abril</SelectItem>
              <SelectItem value="4">Maio</SelectItem>
              <SelectItem value="5">Junho</SelectItem>
              <SelectItem value="6">Julho</SelectItem>
              <SelectItem value="7">Agosto</SelectItem>
              <SelectItem value="8">Setembro</SelectItem>
              <SelectItem value="9">Outubro</SelectItem>
              <SelectItem value="10">Novembro</SelectItem>
              <SelectItem value="11">Dezembro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">Solicitações processadas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprovados (Total)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAnalyses > 0 ? Math.round((totalApproved / totalAnalyses) * 100) : 0}% do total
            </p>
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
                      width={100}
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
                    />
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
                      <span className="font-semibold text-sm">{c.clientName}</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span className="text-xs text-muted-foreground">
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
    </div>
  )
}
