import { useTenant } from '@/contexts/TenantContext'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Globe, LogOut, User } from 'lucide-react'

export function AppHeader() {
  const { session, switchCountry, logout } = useTenant()

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <h2 className="text-lg font-semibold hidden sm:block">Painel Administrativo</h2>
      </div>

      <div className="flex items-center gap-4">
        {session.perfil_admin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-dashed">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">País:</span>{' '}
                <span className="font-bold">{session.pais_ativo}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Alternar Região</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => switchCountry('BR')}
                className={session.pais_ativo === 'BR' ? 'bg-accent text-accent-foreground' : ''}
              >
                🇧🇷 Brasil (BRL)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchCountry('AR')}
                className={session.pais_ativo === 'AR' ? 'bg-accent text-accent-foreground' : ''}
              >
                🇦🇷 Argentina (ARS)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!session.perfil_admin && (
          <Badge
            variant="outline"
            className={`px-3 py-1 ${
              session.pais_ativo === 'BR'
                ? 'border-green-500 text-green-700 bg-green-50'
                : 'border-blue-400 text-blue-700 bg-blue-50'
            }`}
          >
            {session.pais_ativo === 'BR' ? '🇧🇷 Brasil' : '🇦🇷 Argentina'}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary">
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
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil (Ag. {session.id_agencia})</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
