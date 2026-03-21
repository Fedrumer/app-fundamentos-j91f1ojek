import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTenant } from '@/contexts/TenantContext'
import { IAgencia } from '@/domain/contracts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome_fantasia: z.string().min(1, 'Nome fantasia é obrigatório'),
  nome_legal: z.string().min(1, 'Razão social é obrigatória'),
  nivel: z.string(),
  id_agencia_pai: z.string().optional(),
  comissao: z.coerce.number().min(0, 'Comissão mínima é 0').max(100, 'Comissão máxima é 100'),
})

interface AgencyFormProps {
  isOpen: boolean
  onClose: () => void
  agency: IAgencia | null
  agencies: IAgencia[]
  onSave: (data: Partial<IAgencia>) => void
}

export function AgencyForm({ isOpen, onClose, agency, agencies, onSave }: AgencyFormProps) {
  const { session } = useTenant()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: '',
      nome_fantasia: '',
      nome_legal: '',
      nivel: '1',
      id_agencia_pai: 'none',
      comissao: 0,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (agency) {
        form.reset({
          codigo: agency.codigo,
          nome_fantasia: agency.nome_fantasia,
          nome_legal: agency.nome_legal,
          nivel: agency.nivel.toString(),
          id_agencia_pai: agency.id_agencia_pai?.toString() || 'none',
          comissao: agency.comissao,
        })
      } else {
        form.reset({
          codigo: '',
          nome_fantasia: '',
          nome_legal: '',
          nivel: '1',
          id_agencia_pai: 'none',
          comissao: 0,
        })
      }
    }
  }, [isOpen, agency, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const nivel = parseInt(values.nivel)
    const parentId = values.id_agencia_pai === 'none' ? null : values.id_agencia_pai

    if (nivel > 1 && !parentId) {
      form.setError('id_agencia_pai', {
        message: 'Agência Pai é obrigatória para níveis 2 ou superior',
      })
      return
    }

    if (parentId) {
      const parent = agencies.find((a) => a.id.toString() === parentId)
      if (parent && values.comissao > parent.comissao) {
        form.setError('comissao', {
          message: `Máximo permitido para esta hierarquia: ${parent.comissao}% (Herdado do Pai)`,
        })
        return
      }
    }

    onSave({
      codigo: values.codigo,
      nome_fantasia: values.nome_fantasia,
      nome_legal: values.nome_legal,
      nivel,
      id_agencia_pai: parentId,
      comissao: values.comissao,
      moeda: session?.moeda_padrao || 'BRL',
      pais_ativo: session?.pais_ativo || 'BR',
      status: agency?.status || 'Ativa',
    })
  }

  const currentNivel = parseInt(form.watch('nivel') || '1')
  const validParents = agencies.filter((a) => a.nivel < currentNivel && a.id !== agency?.id)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{agency ? 'Editar Agência Parceira' : 'Adicionar Nova Agência'}</DialogTitle>
          <DialogDescription>
            Configure as informações da agência e estabeleça sua posição na árvore de distribuição.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">País / Região</label>
                <Input
                  value={session?.pais_ativo === 'BR' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'}
                  disabled
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Moeda Padrão</label>
                <Input
                  value={session?.moeda_padrao}
                  disabled
                  className="bg-slate-50 border-slate-200 text-slate-500 font-mono"
                />
              </div>

              <FormField
                control={form.control}
                name="nome_fantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fantasia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Viagens Now" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nome_legal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social / Nome Legal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Viagens Now S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Único</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: AG-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nivel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível Hierárquico</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            Nível {n} {n === 1 && '(Master)'}
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
                name="id_agencia_pai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agência Pai</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={currentNivel === 1}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a agência pai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma (Apenas Nível 1)</SelectItem>
                        {validParents.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.nome_fantasia} (Nível {p.nivel})
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
                name="comissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comissão (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Agência</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
