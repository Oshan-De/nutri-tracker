'use client'

import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/components/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { memo } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { StoreProvider } from '@/providers/store-provider'
import { StoreErrorBoundary } from '@/components/store-error-boundary'

function MainLayout({ children }: { children: React.ReactNode }) {
  useAuthRedirect()

  return (
    <StoreProvider>
      <StoreErrorBoundary>
        <SidebarProvider defaultOpen suppressHydrationWarning>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </StoreErrorBoundary>
    </StoreProvider>
  )
}

export default memo(MainLayout)
