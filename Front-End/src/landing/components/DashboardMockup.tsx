import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Minus, Plus, Users, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

const stats = [
  { label: 'Ganho no Mês', value: 'R$ 8.400,00', accent: 'text-lime-400/90', icon: ArrowDownLeft, chip: 'bg-lime-400/10 text-lime-400/90', note: 'agosto 2026' },
  { label: 'Clientes Atendidos', value: '12', accent: 'text-sky-400', icon: Users, chip: 'bg-sky-400/10 text-sky-400', note: 'Atendimentos no mês' },
  { label: 'Ticket Médio', value: 'R$ 700,00', accent: '', icon: Wallet, chip: 'bg-muted text-foreground', note: 'Média por atendimento' },
]

const donut = [
  { label: 'Indicação', value: 34, color: '#a3e635', amount: 'R$ 2.856,00' },
  { label: 'Instagram', value: 26, color: '#3b82f6', amount: 'R$ 2.184,00' },
  { label: 'Google', value: 22, color: '#f97316', amount: 'R$ 1.848,00' },
  { label: 'Outros', value: 18, color: '#8b5cf6', amount: 'R$ 1.512,00' },
]

const segments = [
  { dash: 72.6, offset: 0, color: '#a3e635' },
  { dash: 47, offset: -72.6, color: '#f97316' },
  { dash: 55.5, offset: -119.6, color: '#3b82f6' },
  { dash: 38.5, offset: -175.1, color: '#8b5cf6' },
]

const activity = [
  { name: 'Maria Silva', type: 'income', category: 'Indicação', color: '#a3e635', amount: '+R$ 2.400,00' },
  { name: 'João Pereira', type: 'income', category: 'Instagram', color: '#3b82f6', amount: '+R$ 486,90' },
  { name: 'Ana Souza', type: 'income', category: 'Google', color: '#f97316', amount: '+R$ 210,00' },
  { name: 'Carlos Lima', type: 'income', category: 'Indicação', color: '#a3e635', amount: '+R$ 1.250,00' },
]

function windowFrame(children: ReactNode) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[28px] bg-lime-400/[0.06] blur-2xl" aria-hidden />
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-[#0a0a0a]">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <div className="mx-auto flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            crm.kauezao.com.br/dashboard
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export function DashboardMockup() {
  return windowFrame(
    <div className="space-y-4 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground"><Minus className="h-3.5 w-3.5" /></span>
          <span className="px-2 text-[11px] font-medium text-muted-foreground">agosto 2026</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground"><Plus className="h-3.5 w-3.5" /></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Total ganho:</span>
          <span className="font-semibold text-lime-400/90">R$ 4.200,00</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Ganho</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">R$ 4.200,00</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-[11px] font-medium text-primary-foreground">
                <ArrowDownLeft className="h-3 w-3" /> Novo Cliente
              </span>
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-secondary px-3 text-[11px] font-medium text-secondary-foreground">
                <ArrowUpRight className="h-3 w-3" /> Ver Clientes
              </span>
            </div>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
            <Wallet className="h-6 w-6 text-zinc-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-border bg-card p-4 ${i === 2 ? 'col-span-2' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted">
                <s.icon className={s.accent || 'text-foreground'} />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight">{s.label}</span>
            </div>
            <p className="mt-3 text-lg font-bold tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card md:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Atividade Recente</span>
            <span className="text-[11px] text-muted-foreground">Ver todas</span>
          </div>
          <div>
            {activity.map((t, i) => (
              <div key={t.name} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-border/60' : ''}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${t.type === 'income' ? 'bg-lime-400/10 text-lime-400/90' : 'bg-muted text-muted-foreground'}`}>
                  {t.type === 'income' ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium">{t.name}</span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-[11px] text-muted-foreground">{t.category}</span>
                </span>
                <span className={`text-xs font-semibold ${t.type === 'income' ? 'text-lime-400/90' : ''}`}>{t.amount}</span>
                <span className="hidden items-center gap-1 rounded-full border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-[10px] font-medium text-lime-400/90 lg:flex">
                  <CheckCircle2 className="h-3 w-3" /> Concluído
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 md:col-span-2">
          <p className="text-sm font-semibold">Ganhos por Origem</p>
          <div className="mt-2 flex items-center justify-center">
            <div className="relative h-[132px] w-[132px]">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                {segments.map((s, i) => (
                  <circle
                    key={i}
                    cx="70"
                    cy="70"
                    r="34"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="12"
                    strokeDasharray={`${s.dash} 213.6`}
                    strokeDashoffset={s.offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Wallet className="h-5 w-5 text-zinc-300" />
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            {donut.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.label}</span>
                <span className="ml-auto font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
  )
}