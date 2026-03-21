import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth()
  const { session, loadingTenant } = useTenant()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('admin@now.com')
  const [password, setPassword] = useState('Teste123!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (!authLoading && !loadingTenant && user && session) {
      navigate(from, { replace: true })
    }
  }, [user, session, authLoading, loadingTenant, navigate, from])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('Credenciais inválidas. Verifique o e-mail e a senha.')
      setLoading(false)
      return
    }

    // Sucesso: os hooks vão atualizar e o useEffect de redirect será disparado
  }

  const selectUser = (mail: string) => {
    setEmail(mail)
    setPassword('Teste123!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200/60">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-primary">Now Assistance</CardTitle>
          <CardDescription>Faça login para acessar o painel de comissões</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            <Button
              className="w-full h-11 text-base"
              type="submit"
              disabled={loading || authLoading}
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3 text-center uppercase tracking-wider">
              Acesso de Demonstração
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => selectUser('admin@now.com')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
              >
                <div>
                  <div className="text-sm font-medium text-slate-800">Administrador</div>
                  <div className="text-xs text-slate-500 font-mono">admin@now.com</div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  Master
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => selectUser('teste_br@now.com')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
              >
                <div>
                  <div className="text-sm font-medium text-slate-800">Regional Brasil</div>
                  <div className="text-xs text-slate-500 font-mono">teste_br@now.com</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  BR Lock
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => selectUser('teste_ar@now.com')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
              >
                <div>
                  <div className="text-sm font-medium text-slate-800">Regional Argentina</div>
                  <div className="text-xs text-slate-500 font-mono">teste_ar@now.com</div>
                </div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                  AR Lock
                </Badge>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
