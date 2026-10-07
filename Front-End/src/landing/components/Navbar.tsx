import { useState } from 'react'
import { ArrowRight, Menu, Wallet, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../utils'
import { nav } from '../content'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight">CRM Kauezao</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href={nav.loginHref} variant="ghost" size="sm">
            {nav.loginLabel}
          </Button>
          <Button href={nav.ctaHref} size="sm">
            {nav.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden',
          open ? 'grid-rows-[1fr] border-t border-border' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Navegação móvel">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button href={nav.loginHref} variant="outline" onClick={() => setOpen(false)}>
                {nav.loginLabel}
              </Button>
              <Button href={nav.ctaHref} onClick={() => setOpen(false)}>
                {nav.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}