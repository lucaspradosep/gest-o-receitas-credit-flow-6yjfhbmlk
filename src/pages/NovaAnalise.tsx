import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCredit } from '@/context/credit-context'
import { SubmissionModal } from '@/components/form/submission-modal'

const formSchema = z.object({
  clientName: z.string().min(3, 'Nome do cliente é obrigatório'),
  document: z.string().min(14, 'CNPJ inválido (mín. 14 caracteres)'),
  value: z.coerce.number().min(1, 'Valor deve ser maior que 0'),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser maior que 0'),
  deliveryAddress: z.string().min(5, 'Endereço é obrigatório'),
  rep: z.string().min(1, 'Vendedor é obrigatório'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NovaAnalise() {
  const { addCredit } = useCredit()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      document: '',
      value: 0,
      quantity: 1,
      deliveryAddress: '',
      rep: 'Carlos Silva',
      notes: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true)
    setTimeout(() => {
      addCredit({ ...data, requiresFollowUp: false })
    }, 4000)
  }

  const handleSuccessClose = () => {
    setIsSubmitting(false)
    form.reset()
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Análise de Crédito</h2>
        <p className="text-muted-foreground">
          Preencha os dados do cliente para submeter ao Revenue Management.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Formulário de Solicitação</CardTitle>
          <CardDescription>
            A equipe de faturamento será notificada automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente / Razão Social *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0001-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Detalhes do Pedido</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total (R$) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Itens *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Endereço de Entrega *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Número, Bairro, Cidade - UF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Documentação e Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Links para orçamento, docs complementares, ou observações..."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t gap-4">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Limpar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                >
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SubmissionModal isOpen={isSubmitting} onSuccessComplete={handleSuccessClose} />
    </div>
  )
}
