import { Outlet } from 'react-router-dom'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { CreditProvider } from '@/context/credit-context'
import { RoleProvider } from '@/context/role-context'

export default function Layout() {
  return (
    <RoleProvider>
      <CreditProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex min-h-screen flex-col w-full">
            <AppHeader />
            <main className="flex-1 p-6 overflow-y-auto bg-muted/10">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </CreditProvider>
    </RoleProvider>
  )
}
