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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRevenue } from '@/context/revenue-context'
import { SubmissionModal } from '@/components/form/submission-modal'

const formSchema = z.object({
  clientName: z.string().min(3, 'Nome do cliente é obrigatório'),
  document: z.string().min(11, 'Documento inválido'),
  segment: z.string().min(2, 'Segmento é obrigatório'),
  value: z.coerce.number().min(1, 'Valor deve ser maior que 0'),
  date: z.string().min(1, 'Data é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  rep: z.string().min(1, 'Vendedor é obrigatório'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NovaReceita() {
  const { addRevenue } = useRevenue()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      document: '',
      segment: '',
      value: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      rep: 'Carlos Silva',
      notes: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true)
    // Data is saved to context after the success animation in the modal completes,
    // but to prevent losing context, we save it immediately or pass it.
    // Actually, passing it to addRevenue immediately is fine, the modal just blocks UI.
    setTimeout(() => {
      addRevenue(data)
    }, 4000) // Simulate API call ending right before success step
  }

  const handleSuccessClose = () => {
    setIsSubmitting(false)
    form.reset()
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Receita</h2>
        <p className="text-muted-foreground">
          Preencha os dados abaixo para registrar uma nova venda.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Formulário de Lançamento</CardTitle>
          <CardDescription>
            Os dados serão enviados automaticamente para a planilha financeira.
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
                        <FormLabel>Nome do Cliente / Razão Social</FormLabel>
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
                        <FormLabel>CNPJ / CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0001-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="segment"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Segmento de Atuação</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Tecnologia, Varejo, Indústria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Detalhes da Negociação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Venda</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria / Produto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Software">Software ERP</SelectItem>
                            <SelectItem value="Consultoria">Consultoria Estratégica</SelectItem>
                            <SelectItem value="Equipamentos">Equipamentos Industriais</SelectItem>
                            <SelectItem value="Servicos">Serviços Continuados</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendedor Responsável</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o vendedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
                            <SelectItem value="Ana Paula">Ana Paula</SelectItem>
                            <SelectItem value="Marcos Santos">Marcos Santos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Observações Adicionais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalhes importantes para o time financeiro..."
                            className="resize-none"
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
                  Enviar Dados
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
