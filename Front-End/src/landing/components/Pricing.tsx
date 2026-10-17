import { ArrowRight, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from './Reveal'
import { pricing } from '../content'

export function Pricing() {
  return (
    <section id="precos" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="flex items-center gap-3 text-sm text-zinc-500">
            <span aria-hidden className="h-px w-8 bg-zinc-700" />
            {pricing.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[22ch] text-3xl font-semibold tracking-tight sm:text-4xl">{pricing.kicker}</h2>
        </Reveal>

        <Reveal className="mt-12 max-w-md" delay={0.05}>
          <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">{pricing.free.name}</h3>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 border border-amber-400/25">
                Disponível agora
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{pricing.free.tagline}</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">{pricing.free.price}</span>
              <span className="text-xs text-muted-foreground">{pricing.free.priceSuffix}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {pricing.free.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button href={pricing.free.href} size="lg" className="mt-8 w-full">
              {pricing.free.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            {pricing.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}