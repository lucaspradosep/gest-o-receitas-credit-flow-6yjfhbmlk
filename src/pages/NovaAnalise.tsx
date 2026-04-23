import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCredit } from '@/context/credit-context'
import { SubmissionModal } from '@/components/form/submission-modal'

const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

const formSchema = z.object({
  requesterEmail: z.string().email('Email inválido'),
  clientName: z.string().min(3, 'Nome do cliente é obrigatório'),
  document: z.string().min(14, 'CNPJ inválido (mín. 14 caracteres)'),
  empresa: z.string().min(1, 'Selecione a empresa'),
  uf: z.string().min(2, 'Selecione a UF'),
  cep: z.string().optional(),
  unidadeNegocio: z.string().min(1, 'Unidade de Negócio é obrigatória'),
  value: z.coerce.number().min(1, 'Valor deve ser maior que 0'),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser maior que 0'),
  deliveryAddress: z.string().min(5, 'Endereço é obrigatório'),
  documentation: z.any().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NovaAnalise() {
  const { addCredit } = useCredit()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterEmail: '',
      clientName: '',
      document: '',
      empresa: '',
      uf: '',
      cep: '',
      unidadeNegocio: '',
      value: undefined,
      quantity: 1,
      deliveryAddress: '',
      documentation: undefined,
      notes: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    let documentationUrl = undefined

    if (data.documentation && data.documentation instanceof File) {
      const file = data.documentation
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `solicitacoes/${fileName}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath)
        documentationUrl = publicUrlData.publicUrl
      }
    }

    const payload = {
      ...data,
      documentation: documentationUrl,
    }

    await addCredit(payload)
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
          Preencha os dados da solicitação para submeter à Gestão de Receitas.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Formulário de Solicitação</CardTitle>
          <CardDescription>
            A equipe de faturamento será notificada automaticamente ao enviar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Identificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requesterEmail"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>E-mail do Solicitante *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                          />
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
                    name="empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="JOHN">JOHN</SelectItem>
                            <SelectItem value="TUIM">TUIM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unidadeNegocio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade de Negócio *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Vendas Corporativas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="uf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF (Estado de Entrega) *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UFS.map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Endereço Completo de Entrega *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Número, Bairro, Cidade - UF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentation"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Documentação Complementar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg"
                            onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                            {...field}
                          />
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
                        <FormLabel>Observações Adicionais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Links para orçamento ou informações adicionais..."
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
                  disabled={isSubmitting}
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
