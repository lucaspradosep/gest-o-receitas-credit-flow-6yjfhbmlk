import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocation } from 'react-router-dom'
import { useRole } from '@/context/role-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard Executivo',
  '/nova-analise': 'Nova Análise de Crédito',
  '/historico': 'Histórico de Solicitações',
}

export function AppHeader() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'CreditFlow'
  const { role, setRole } = useRole()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-48 hidden md:block">
          <Select value={role} onValueChange={(v: any) => setRole(v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comercial">Perfil: Comercial</SelectItem>
              <SelectItem value="Revenue Management">Perfil: Revenue Mgt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative hidden w-48 lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar análises..."
            className="w-full bg-card pl-9 shadow-none"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden text-right text-sm md:block">
            <p className="font-medium leading-none">
              {role === 'Comercial' ? 'Usuário Público' : 'Administrador'}
            </p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <Avatar>
            <AvatarImage
              src={
                role === 'Comercial'
                  ? 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2'
                  : 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=12'
              }
            />
            <AvatarFallback>{role === 'Comercial' ? 'UP' : 'AD'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
