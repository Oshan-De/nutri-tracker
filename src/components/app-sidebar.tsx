'use client'

import * as React from 'react'
import { Bot, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import Logo from './logos/logo'
import LogoIcon from './logos/logo-icon'
import { AnimatePresence, motion } from 'framer-motion'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'logs',
      url: '/logs',
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center h-[80px]">
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
      <SidebarFooter className="flex items-center justify-center text-xs py-6">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key="footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-nowrap">Copyright © 2025</span>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
