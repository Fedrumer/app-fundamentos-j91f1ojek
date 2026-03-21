import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BarChart3, Building2, Package, Ticket, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
  { title: 'Usuários', url: '/usuarios', icon: Users },
  { title: 'Agências', url: '/agencias', icon: Building2 },
  { title: 'Vouchers', url: '/vouchers', icon: Ticket },
  { title: 'Produtos', url: '/produtos', icon: Package },
  { title: 'Financeiro', url: '/financeiro', icon: BarChart3 },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="sidebar" className="border-r-0">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-2 px-2 text-sidebar-primary-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <span className="text-lg font-bold">App Fundamentos</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      to={item.url}
                      className={cn('text-base', location.pathname === item.url && 'font-semibold')}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
