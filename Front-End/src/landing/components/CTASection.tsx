import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from './Reveal'
import { finalCta } from '../content'

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.07] blur-[130px]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="max-w-2xl">
          <p className="flex items-center gap-3 text-sm text-zinc-500">
            <span aria-hidden className="h-px w-8 bg-zinc-700" />
            {finalCta.kicker}
          </p>
          <h2 className="mt-4 max-w-[20ch] text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {finalCta.headline}
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">{finalCta.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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