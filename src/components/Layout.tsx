import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { RevenueProvider } from '@/context/revenue-context'

export default function Layout() {
  return (
    <RevenueProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RevenueProvider>
  )
}
