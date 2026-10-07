import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from './Reveal'
import { finalCta } from '../content'

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/[0.07] blur-[130px]" />
      </div>
      <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-lime-400/90">{finalCta.kicker}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted-foreground leading-relaxed">{finalCta.subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={finalCta.href} size="lg" className="w-full sm:w-auto">
              {finalCta.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}