import { ArrowRight, Check, CirclePlay } from 'lucide-react'
import { Button } from '../ui/Button'
import { DashboardMockup } from './DashboardMockup'
import { Reveal } from './Reveal'
import { hero, statStrip } from '../content'
import { motion } from 'motion/react'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-lime-400/[0.06] blur-[130px]" />
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[460px] w-[460px] rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              {hero.badge}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {hero.titleTop}
              <br />
              <span className="text-muted-foreground">{hero.titleAccent}</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={hero.ctaHref} size="lg">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#recursos" variant="outline" size="lg">
                <CirclePlay className="h-4 w-4" />
                {hero.secondaryCta}
              </Button>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-lime-400/90" />
              {hero.trustLine.split('·').map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  {item.trim()}
                </span>
              ))}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <DashboardMockup />
          </motion.div>
        </div>

        <Reveal delay={0.2} className="mt-16">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {statStrip.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 bg-card px-6 py-5">
                <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
                <dd className="order-1 text-xl font-bold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}