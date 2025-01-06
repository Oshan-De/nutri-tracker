import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { RootProvider } from '@/providers/root-provider'
import { Toaster } from '@/components/ui/toaster'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Nutri Tracker',
  description: 'A web app for tracking your Calories and Macros',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} antialiased`}>
        <RootProvider>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </RootProvider>
      </body>
    </html>
  )
}
