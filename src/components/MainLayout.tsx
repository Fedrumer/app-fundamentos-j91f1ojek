import { Outlet, Link, useLocation } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useTenant } from '@/contexts/TenantContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Globe, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Simulador', path: '/simulador' },
  { name: 'Vendas', path: '/vendas' },
  { name: 'Agências', path: '/agencias' },
  { name: 'Produtos', path: '/produtos' },
  { name: 'Faturamento', path: '/financeiro' },
  { name: 'Pré-Venda', path: '/pre-venda' },
  { name: 'Valores a Receber', path: '/valores-a-receber' },
  { name: 'Cortesias', path: '/cortesias' },
]

const adminLinks = [
  { name: 'Campanhas', path: '/admin/campanhas' },
  { name: 'TPA / Parâmetros', path: '/admin/tpa' },
]

export default function MainLayout() {
  const { session, switchCountry, logout } = useTenant()
  const location = useLocation()
  const allLinks = session?.perfil_admin ? [...navLinks, ...adminLinks] : navLinks

  if (!session) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col bg-slate-50">
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6 print:hidden">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-primary">
                    Now Assistance
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2">
                  {allLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100',
                        location.pathname === link.path
                          ? 'bg-slate-100 text-primary'
                          : 'text-slate-600',
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-primary">Now Assistance</span>
            </Link>

            <nav className="hidden md:ml-6 md:flex md:items-center md:gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900',
                    location.pathname === link.path
                      ? 'bg-slate-100 text-primary font-semibold'
                      : 'text-slate-600',
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                'hidden px-2.5 py-0.5 text-xs font-semibold sm:inline-flex',
                session.pais_ativo === 'BR'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
              )}
            >
              {session.pais_ativo === 'BR' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative ml-2 h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {getInitials(session.usuario)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.usuario}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.nivel}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.perfil_admin && (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Mudar Região</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => switchCountry('BR')}
                            className={
                              session.pais_ativo === 'BR' ? 'bg-slate-100 font-medium' : ''
                            }
                          >
                            🇧🇷 Brasil (BRL)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => switchCountry('AR')}
                            className={
                              session.pais_ativo === 'AR' ? 'bg-slate-100 font-medium' : ''
                            }
                          >
                            🇦🇷 Argentina (ARS)
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto print:overflow-visible">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-4 md:p-6 lg:p-8 print:p-0 print:max-w-none">
            <Outlet key={session.pais_ativo} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
