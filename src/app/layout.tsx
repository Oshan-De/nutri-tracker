import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme/theme-provider'

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700'],
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${roboto.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
