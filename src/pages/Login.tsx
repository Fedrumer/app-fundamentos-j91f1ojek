import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRepositories } from '@/contexts/RepositoryContext'
import { useTenant } from '@/contexts/TenantContext'
import { Building2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState<'BR' | 'AR'>('BR')
  const [isLoading, setIsLoading] = useState(false)

  const { usersRepo } = useRepositories()
  const { setSession } = useTenant()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isAdmin = email.toLowerCase().trim() === 'admin@now.com'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const session = await usersRepo.login(email, password, isAdmin ? country : undefined)
      setSession(session)
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Falha na autenticação',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/90 rounded-b-[100px] shadow-lg -z-10 animate-fade-in-down" />

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-slide-up">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-inner">
            <Building2 className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-slate-500">
            Acesse o painel administrativo da sua região
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@now.com"
                value={email}
                onChange={(e) => setEmail(e.target.onChange ? e.target.value : e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            {isAdmin && (
              <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-300 ease-out pt-2">
                <Label htmlFor="country">Região de Acesso (Modo Admin)</Label>
                <Select value={country} onValueChange={(v) => setCountry(v as 'BR' | 'AR')}>
                  <SelectTrigger
                    id="country"
                    className="bg-white border-primary/20 ring-primary/20 focus:ring-primary/40"
                  >
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6 h-11 text-base font-semibold active:scale-[0.98] transition-transform"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500 mt-4 border-t pt-6 bg-slate-50/50 rounded-b-xl">
          <p>Credenciais de teste:</p>
          <div className="grid grid-cols-2 gap-2 w-full text-xs">
            <div className="bg-white p-2 rounded border">
              <strong className="block mb-1 text-slate-700">Admin Global</strong>
              admin@now.com
              <br />
              senha123
            </div>
            <div className="bg-white p-2 rounded border">
              <strong className="block mb-1 text-slate-700">Operadores</strong>
              teste_br@now.com
              <br />
              teste_ar@now.com
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
