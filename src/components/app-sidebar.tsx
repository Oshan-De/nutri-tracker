'use client'

import * as React from 'react'
import { Logs, LayoutDashboard } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import Logo from '@/components/logos/logo'
import LogoIcon from '@/components/logos/logo-icon'
import { AnimatePresence, motion } from 'framer-motion'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Dietary Logs',
      url: '/dietary-logs',
      icon: Logs,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="pt-6 pb-4"
      suppressHydrationWarning
    >
      <SidebarHeader className="flex items-center justify-center h-[80px] pb-8">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Logo width={140} height={70} />
            </motion.div>
          ) : (
            <motion.div
              key="logoIcon"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LogoIcon width={32} height={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="pt-6">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key="footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <span className="text-nowrap text-xs">Copyright © 2025</span>
                <br />
                <span className="text-nowrap text-xs">Dev by Oshan</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
