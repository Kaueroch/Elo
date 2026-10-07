import { BarChart3, UserPlus, Wallet, type LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'
import { howItWorks } from '../content'

const icons: LucideIcon[] = [UserPlus, Wallet, BarChart3]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-border bg-[#0c0c0c]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime-400/90">{howItWorks.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{howItWorks.kicker}</h2>
        </Reveal>

        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block" aria-hidden />
          {howItWorks.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <div key={step.title}>
                <Reveal delay={i * 0.08}>
                  <div className="relative flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <span className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}