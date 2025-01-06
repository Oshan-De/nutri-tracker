import { Loader2 } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'

interface ButtonWithSpinnerProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function ButtonWithSpinner({
  loading,
  loadingText,
  children,
  ...props
}: ButtonWithSpinnerProps) {
  return (
    <Button
      {...props}
      disabled={props.disabled || loading}
      className={`w-full ${props.className || ''}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </Button>
  )
}
