import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i)),
        )
      }
    }
  }

  throw lastError
}

interface AngleRange {
  startAngle: number
  endAngle: number
}

export const calculateStartEndAngles = (
  min: number,
  max: number,
  value: number,
): AngleRange => {
  const range = max - min
  const normalizedValue = (value - min) / range

  const startAngle = 90 + normalizedValue * 180
  const endAngle = 90 - normalizedValue * 180

  return { startAngle, endAngle }
}
