'use client'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'
import { ThemeToggler } from '@/components/theme-toggler'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'

function Header() {
  const { user } = useUser()

  return (
    <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>

      <div className="flex items-center p-4">
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center md:hidden"></div>

            <h1 className="text-lg text-nowrap">
              {user.firstName} {user.lastName}
            </h1>
          </div>
        )}

        <div className="flex items-center px-5 ml-auto space-x-6">
          <ThemeToggler />

          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  formButtonPrimary: {
                    width: '64px',
                    height: '64px',
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Header
