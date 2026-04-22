import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRevenue } from '@/context/revenue-context'
import { formatCurrency } from '@/lib/utils'

export default function Index() {
  const { revenues } = useRevenue()

  const totalSent = revenues
    .filter((r) => r.status === 'Concluído')
    .reduce((acc, curr) => acc + curr.value, 0)

  const pendingCount = revenues.filter((r) => r.status === 'Aguardando Processamento').length

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Acompanhe os envios de receitas e status das automações.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-secondary hover:bg-secondary/90 text-white w-full md:w-auto"
        >
          <Link to="/nova-receita">Cadastrar Nova Receita</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enviado (Mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSent)}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Processamento</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Sincronização pendente na planilha</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notificações Gestão</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenues.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Alertas enviados com sucesso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5 shadow-sm">
          <CardHeader>
            <CardTitle>Últimas Receitas Enviadas</CardTitle>
            <CardDescription>Você tem {revenues.length} registros recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenues.slice(0, 5).map((rev) => (
                <div
                  key={rev.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{rev.clientName}</span>
                    <span className="text-xs text-muted-foreground">
                      {rev.rep} • {rev.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm">{formatCurrency(rev.value)}</span>
                    <Badge
                      variant={rev.status === 'Concluído' ? 'default' : 'secondary'}
                      className={
                        rev.status === 'Concluído' ? 'bg-secondary hover:bg-secondary' : ''
                      }
                    >
                      {rev.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" asChild className="mt-4 px-0">
              <Link to="/historico">
                Ver todo o histórico <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Status da Automação</CardTitle>
            <CardDescription>Sistemas integrados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Planilha Financeira</p>
                <p className="text-xs text-muted-foreground">Online e Sincronizando</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Notificações Slack/Email</p>
                <p className="text-xs text-muted-foreground">Operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Sistema ERP ERP-John</p>
                <p className="text-xs text-muted-foreground">Manutenção Programada</p>
              </div>
              <AlertCircle className="h-4 w-4 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
