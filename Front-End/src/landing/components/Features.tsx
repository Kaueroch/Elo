import { PieChart, Tags, Plus, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { features } from '../content'
import { cn } from '../utils'

const iconMap: Record<string, LucideIcon> = {
  chart: PieChart,
  tags: Tags,
  plus: Plus,
}

const origens = [
  { name: 'Indicação', amount: 'R$ 2.856,00', color: '#a3e635' },
  { name: 'Instagram', amount: 'R$ 2.184,00', color: '#3b82f6' },
  { name: 'Google', amount: 'R$ 1.848,00', color: '#f97316' },
  { name: 'Outros', amount: 'R$ 1.512,00', color: '#8b5cf6' },
]

function GastosVisual() {
  return (
    <div className="mt-6 flex items-center gap-6 rounded-xl border border-border bg-background p-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r="34" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray="72.6 213.6" />
          <circle cx="70" cy="70" r="34" fill="none" stroke="#a3e635" strokeWidth="14" strokeDasharray="47 213.6" strokeDashoffset="-72.6" />
          <circle cx="70" cy="70" r="34" fill="none" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="38.5 213.6" strokeDashoffset="-119.6" />
          <circle cx="70" cy="70" r="34" fill="none" stroke="#f97316" strokeWidth="14" strokeDasharray="55.5 213.6" strokeDashoffset="-158.1" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">R$</div>
      </div>
      <div className="flex-1 space-y-2">
        {[
          ['Indicação', '#a3e635', '34%'],
          ['Instagram', '#3b82f6', '26%'],
          ['Google', '#f97316', '22%'],
          ['Outros', '#8b5cf6', '18%'],
        ].map(([label, color, pct]) => (
          <div key={label as string} className="flex items-center gap-2 text-[11px]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color as string }} />
            <span className="text-muted-foreground">{label}</span>
            <span className="ml-auto font-semibold">{pct}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrigensVisual() {
  return (
    <div className="mt-6 space-y-3 rounded-xl border border-border bg-background p-4">
      {origens.map((c) => (
        <div key={c.name} className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: c.color }} />
          <span className="text-xs font-medium">{c.name}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">{c.amount}</span>
        </div>
      ))}
    </div>
  )
}

const registro = [
  { name: 'Maria Silva', amount: 'R$ 2.400,00', category: 'Indicação', color: '#a3e635' },
  { name: 'João Pereira', amount: 'R$ 486,90', category: 'Instagram', color: '#f97316' },
]

function RegistroVisual() {
  return (
    <div className="mt-6 rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex flex-1 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-[11px] text-muted-foreground">
          <Plus className="h-3 w-3" /> Novo cliente
        </span>
        <span className="rounded-lg bg-orange-500/10 px-2.5 py-2 text-[11px] font-medium text-orange-400">+R$ 0,00</span>
      </div>
      <div className="space-y-2">
        {registro.map((r) => (
          <div key={r.name} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 border border-border/60">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="text-[11px] font-medium">{r.name}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">{r.category}</span>
            <span className="text-[11px] font-semibold">{r.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="recursos" className="relative border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="flex items-center gap-3 text-sm text-zinc-500">
            <span aria-hidden className="h-px w-8 bg-zinc-700" />
            {features.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[22ch] text-3xl font-semibold tracking-tight sm:text-4xl">{features.kicker}</h2>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{features.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal delay={0.05} className="lg:col-span-2">
            <FeatureCard item={features.items[0]} excerpt={<GastosVisual />} />
          </Reveal>
          <Reveal delay={0.1}>
            <FeatureCard item={features.items[1]} excerpt={<OrigensVisual />} />
          </Reveal>
          <Reveal delay={0.05}>
            <FeatureCard item={features.items[2]} excerpt={<RegistroVisual />} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ item, excerpt }: { item: typeof features.items[number]; excerpt: ReactNode }) {
  const Icon = iconMap[item.icon] ?? Tags
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:bg-card/80">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-4.5 w-4.5 text-muted-foreground" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">{item.highlight}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      <div className="mt-auto">{excerpt}</div>
    </article>
  )
}