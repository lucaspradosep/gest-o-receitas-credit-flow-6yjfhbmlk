import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRole } from '@/context/role-context'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function LoginDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setIsAuthenticated, setRole } = useRole()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'faturamento@johnrichard.com.br' && password === 'john@123') {
      setIsAuthenticated(true)
      setRole('Gestão de Receitas')
      toast.success('Login realizado com sucesso!')
      onClose()
      navigate('/')
    } else {
      toast.error('Credenciais inválidas.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acesso Restrito</DialogTitle>
          <DialogDescription>
            Insira suas credenciais de Gestão de Receitas para acessar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="faturamento@johnrichard.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Entrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
