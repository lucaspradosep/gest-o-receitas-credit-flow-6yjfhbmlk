import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useRole } from '@/context/role-context'

interface SubmissionModalProps {
  isOpen: boolean
  onSuccessComplete: () => void
}

export function SubmissionModal({ isOpen, onSuccessComplete }: SubmissionModalProps) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { role } = useRole()

  useEffect(() => {
    if (!isOpen) {
      setStep(0)
      return
    }

    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3500),
      setTimeout(() => setStep(4), 4500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [isOpen])

  const progressValue = step === 0 ? 10 : step === 1 ? 30 : step === 2 ? 65 : step === 3 ? 90 : 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        {step < 4 ? (
          <>
            <DialogHeader>
              <DialogTitle>Processando Envio</DialogTitle>
              <DialogDescription>
                Por favor, aguarde enquanto automatizamos o processo.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <Progress value={progressValue} className="h-2" />
              <div className="space-y-3">
                <StepItem
                  label="Validando dados do formulário..."
                  active={step >= 0}
                  done={step >= 1}
                />
                <StepItem
                  label="Registrando solicitação de crédito..."
                  active={step >= 1}
                  done={step >= 2}
                />
                <StepItem
                  label="Enviando e-mail para faturamento@johnrichard.com.br..."
                  active={step >= 2}
                  done={step >= 3}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
            <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-secondary" />
            </div>
            <DialogTitle className="text-2xl">Sucesso!</DialogTitle>
            <DialogDescription className="text-base">
              Solicitação enviada com sucesso!
            </DialogDescription>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={onSuccessComplete}>
                Enviar outra solicitação
              </Button>
              {role === 'Gestão de Receitas' && (
                <Button
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  onClick={() => {
                    onSuccessComplete()
                    navigate('/historico')
                  }}
                >
                  Ver Histórico
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StepItem({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40'}`}
    >
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-secondary" />
      ) : active ? (
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-muted" />
      )}
      <span
        className={`text-sm ${done ? 'font-medium text-foreground' : active ? 'font-medium text-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
    </div>
  )
}
