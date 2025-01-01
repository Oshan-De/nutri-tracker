'use client'

import Logo from '@/components/logos/logo'
import { ThemeToggler } from '@/components/theme/theme-toggler'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Button } from '@/components/ui/button'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export default function Home() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const motionProps = {
    initial: { opacity: 0.0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeInOut' },
    className: 'relative flex flex-col gap-4 items-center justify-center px-4',
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute flex items-start bg-transparent inset-0 px-8 py-4 h-fit z-10">
        <div className="w-fit">
          <Logo />
        </div>
        <div className="flex items-center w-fit ml-auto space-x-6 pt-4">
          <ThemeToggler />

          <UserButton
            appearance={{
              elements: {
                formButtonPrimary: {
                  width: '64px',
                  height: '64px',
                },
                userButtonPopoverMain: {
                  baseTheme: resolvedTheme === 'dark' ? dark : undefined,
                },
              },
            }}
          />
        </div>
      </div>

      <AuroraBackground>
        <motion.div
          {...motionProps}
          transition={{ ...motionProps.transition, delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Track Your Health, Effortlessly.
          </h1>
        </motion.div>
        <motion.div
          {...motionProps}
          transition={{ ...motionProps.transition, delay: 0.4 }}
        >
          <p className="font-extralight text-base md:text-4xl dark:text-neutral-200 pt-4 pb-12">
            Log your meals, monitor your calories, and stay on top of your
            goals.
          </p>
        </motion.div>

        <SignedOut>
          <motion.div
            {...motionProps}
            transition={{ ...motionProps.transition, delay: 0.5 }}
          >
            <SignUpButton>
              <Button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black text-2xl px-10 py-8">
                Get Started
              </Button>
            </SignUpButton>
          </motion.div>
          <motion.div
            {...motionProps}
            transition={{ ...motionProps.transition, delay: 0.6 }}
          >
            <p className="dark:text-white font-extralight text-xl py-4">or</p>
          </motion.div>
          <motion.div
            {...motionProps}
            transition={{ ...motionProps.transition, delay: 0.7 }}
          >
            <SignInButton>
              <Button
                variant="link"
                className="rounded-full w-fit text-black dark:text-white text-2xl"
              >
                Sign In
              </Button>
            </SignInButton>
          </motion.div>
        </SignedOut>

        <SignedIn>
          <motion.div
            {...motionProps}
            transition={{ ...motionProps.transition, delay: 0.5 }}
          >
            <Button
              className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black text-2xl px-10 py-8"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </SignedIn>
      </AuroraBackground>
    </div>
  )
}
