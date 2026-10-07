import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'
import type { ComponentProps } from 'react'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
        outline: 'border border-border bg-background hover:bg-muted/60',
        ghost: 'hover:bg-muted/60 text-foreground',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-[0.8rem]',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'a'> &
  VariantProps<typeof buttonVariants> & { href: string }

export function Button({ className, variant, size, href, ...props }: ButtonProps) {
  return (
    <a href={href} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}