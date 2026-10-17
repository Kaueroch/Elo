import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from './Reveal'
import { hero, statStrip } from '../content'
import { motion, useReducedMotion } from 'motion/react'

function formatBRLDemo(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function parseValorDemo(texto: string): number {
  const digits = texto.replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

function formatValorInput(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const ORIGENS_DEMO = [
  { nome: 'Indicação', cor: '#a3e635' },
  { nome: 'Instagram', cor: '#38bdf8' },
  { nome: 'Google', cor: '#fb923c' },
  { nome: 'Outros', cor: '#c084fc' },
]

function FichaDemo() {
  const reduce = useReducedMotion()
  const [nome, setNome] = useState('Maria Silva')
  const [valorTexto, setValorTexto] = useState('120,00')
  const [origem, setOrigem] = useState('Indicação')
  const [total, setTotal] = useState(8400)
  const [ultimo, setUltimo] = useState<number | null>(null)

  const valor = parseValorDemo(valorTexto)
  const podeAnotar = nome.trim().length > 0 && valor > 0

  const anotar = () => {
    if (!podeAnotar) return
    setTotal(t => t + valor)
    setUltimo(valor)
    setValorTexto('')
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Ficha de balcão</p>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          Demonstração — sem conta
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Quem você atendeu</span>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome do cliente"
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Quanto pagou</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <input
                value={valorTexto}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '')
                  if (!digits) { setValorTexto(''); return }
                  setValorTexto(formatValorInput(parseInt(digits, 10) / 100))
                }}
                inputMode="numeric"
                placeholder="0,00"
                aria-label="Valor pago"
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Quem indicou</span>
            <select
              value={origem}
              onChange={e => setOrigem(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {ORIGENS_DEMO.map(o => (
                <option key={o.nome} value={o.nome}>{o.nome}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={anotar}
          disabled={!podeAnotar}
          className="h-10 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Anotar atendimento
        </button>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Total do mês soma na hora</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p aria-live="polite" className="text-2xl font-bold tracking-tight tabular-nums text-amber-200">
            {formatBRLDemo(total)}
          </p>
          {ultimo !== null && (
            reduce ? (
              <span className="text-xs font-semibold text-amber-400">+{formatBRLDemo(ultimo)}</span>
            ) : (
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-semibold text-amber-400"
              >
                +{formatBRLDemo(ultimo)}
              </motion.span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-400/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              {hero.badge}
            </span>

            <h1 className="mt-6 max-w-[16ch] text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              {hero.titleTop} {hero.titleAccent}
            </h1>

            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={hero.ctaHref} size="lg">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#como-funciona" variant="outline" size="lg">
                {hero.secondaryCta}
              </Button>
            </div>

            <ul className="mt-5 flex flex-col gap-1.5 text-sm text-muted-foreground">
              {hero.trustLine.split('·').map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  {item.trim()}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <FichaDemo />
          </motion.div>
        </div>

        <Reveal delay={0.2} className="mt-16">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-8 md:grid-cols-4">
            {statStrip.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 text-left">
                <dd className="order-1 text-xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
                <dt className="order-2 text-[13px] leading-snug text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
