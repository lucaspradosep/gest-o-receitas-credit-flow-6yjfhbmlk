import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard Geral',
  '/nova-receita': 'Cadastrar Nova Receita',
  '/historico': 'Histórico de Envios',
}

export function AppHeader() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'Portal Comercial'

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar receitas..."
            className="w-full bg-card pl-9 shadow-none"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden text-right text-sm md:block">
            <p className="font-medium leading-none">Carlos Silva</p>
            <p className="text-xs text-muted-foreground">Representante Comercial</p>
          </div>
          <Avatar>
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=12" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
