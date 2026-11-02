import { useMemo, useState } from 'react'
import { Briefcase, Calendar, ChevronLeft, ChevronRight, Download, Plus, Search, Users, Wallet } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCrm } from '../crm/useCrm'
import { useClienteForm } from '../crm/ClienteFormContext'
import { formatBRL, formatDateBR, formatMonthYear, getCurrentMonth, isSameMonth } from '../shared/utils/formatters'
import { achaOrigem, origemColor, origemNomeDoCliente } from '../shared/constants'
import { DonutChart } from './components/DonutChart'
import type { Cliente, MonthFilter, Tab } from '../shared/types'

interface HomePageProps {
  setActiveTab?: (tab: Tab) => void;
}

/** Variacao percentual do mes atual contra o anterior (0/0 vira 0). */
function deltaPct(atual: number, anterior: number): number {
  if (!anterior) return atual > 0 ? 100 : 0
  return ((atual - anterior) / anterior) * 100
}

function DeltaLine({ value }: { value: number }) {
  const texto = `${value >= 0 ? '+' : ''}${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
  return (
    <p className="text-xs text-muted-foreground">
      <span className={`font-semibold ${value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{texto}</span>
      {' '}em relação ao mês anterior
    </p>
  )
}

/** Anel de progresso (meta do mes). */
function GoalRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 52 52" className="w-14 h-14 -rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" className="stroke-white/10" />
        <circle
          cx="26" cy="26" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
          className="stroke-white transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">
        {Math.round(pct)}%
      </span>
    </div>
  )
}

function iniciais(nome: string): string {
  return nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

/** Baixa os clientes do mes em CSV (separador ; para abrir direto no Excel). */
function exportarCSV(rows: Cliente[], nomeArquivo: string) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const linhas = rows.map(c => [
    c.nome,
    c.data,
    origemNomeDoCliente(c.conhecidoDaOnde),
    String(c.valorCobrado ?? 0).replace('.', ','),
    c.trabalhoFeito,
  ].map(esc).join(';'))
  const csv = '﻿' + [['nome', 'data', 'origem', 'valor_cobrado', 'trabalho_feito'].join(';'), ...linhas].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = nomeArquivo
  a.click()
  URL.revokeObjectURL(a.href)
}

export function HomePage({ setActiveTab }: HomePageProps = {}) {
  const { clientes, origens } = useCrm()
  const { openClienteForm } = useClienteForm()
  const [selectedMonth, setSelectedMonth] = useState<MonthFilter>(getCurrentMonth())
  const [busca, setBusca] = useState('')
  const [verTodos, setVerTodos] = useState(false)

  const goToPrevMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 0) return { month: 11, year: prev.year - 1 }
      return { month: prev.month - 1, year: prev.year }
    })
  }

  const goToNextMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 11) return { month: 0, year: prev.year + 1 }
      return { month: prev.month + 1, year: prev.year }
    })
  }

  const prevMonth: MonthFilter = selectedMonth.month === 0
    ? { month: 11, year: selectedMonth.year - 1 }
    : { month: selectedMonth.month - 1, year: selectedMonth.year }

  const filteredClientes = useMemo(() => {
    if (verTodos) return clientes
    return clientes.filter(c => isSameMonth(c.data, selectedMonth.month, selectedMonth.year))
  }, [clientes, selectedMonth, verTodos])

  const prevClientes = useMemo(() => {
    if (verTodos) return []
    return clientes.filter(c => isSameMonth(c.data, prevMonth.month, prevMonth.year))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes, selectedMonth, verTodos])

  const soma = (lista: Cliente[]) => lista.reduce((s, c) => s + Number(c.valorCobrado || 0), 0)
  const totalGanho = soma(filteredClientes)
  const ganhoAnterior = soma(prevClientes)
  const ticketMedio = filteredClientes.length > 0 ? totalGanho / filteredClientes.length : 0
  const ticketAnterior = prevClientes.length > 0 ? ganhoAnterior / prevClientes.length : 0
  // Totais gerais (independente do mes selecionado).
  const totalClientesAtendidos = clientes.length
  const valorTotalGeral = clientes.reduce((s, c) => s + Number(c.valorCobrado || 0), 0)

  /** Melhor marca mensal (base da meta): maior faturamento de um mes. */
  const melhorMarca = useMemo(() => {
    const porMes = new Map<string, number>()
    clientes.forEach(c => {
      const chave = c.data.slice(0, 7)
      porMes.set(chave, (porMes.get(chave) ?? 0) + Number(c.valorCobrado || 0))
    })
    let max = 0
    porMes.forEach(v => { if (v > max) max = v })
    return max
  }, [clientes])

  /** Quantidade de meses com pelo menos um atendimento (usado em labels do modo "Todos"). */
  const mesesAtivos = useMemo(() => {
    const meses = new Set(clientes.map(c => c.data.slice(0, 7)))
    return meses.size
  }, [clientes])


  const pctMeta = melhorMarca > 0 ? Math.min(100, (totalGanho / melhorMarca) * 100) : 0

  const statsOrigem = useMemo(() => {
    const mapa = new Map<string, { nome: string; count: number; receita: number; cor: string }>()
    filteredClientes.forEach(c => {
      const nome = origemNomeDoCliente(c.conhecidoDaOnde)
      const atual = mapa.get(nome) ?? { nome, count: 0, receita: 0, cor: origemColor(achaOrigem(origens, nome)?.id) }
      atual.count += 1
      atual.receita += Number(c.valorCobrado || 0)
      mapa.set(nome, atual)
    })
    return [...mapa.values()].sort((a, b) => b.count - a.count)
  }, [filteredClientes, origens])

  const totalAtendimentos = statsOrigem.reduce((s, o) => s + o.count, 0)
  const donutData = statsOrigem.map(o => ({
    name: o.nome,
    value: o.count,
    color: o.cor,
    percent: totalAtendimentos > 0 ? Math.round((o.count / totalAtendimentos) * 100) : 0,
  }))

  const recentes = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return [...filteredClientes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .filter(c => !termo || c.nome.toLowerCase().includes(termo))
      .slice(0, 5)
  }, [filteredClientes, busca])

  const nomeArquivo = `clientes-${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}.csv`

  return (
    <div className="p-4 lg:p-6 gap-4 flex flex-col w-full">
      {/* Titulo + periodo + exportar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Painel do CRM</h1>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {verTodos ? 'Visão geral' : 'Por mês'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted p-1">
            <Button
              variant={verTodos ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setVerTodos(true)}
            >
              Todos
            </Button>
            <Button
              variant={!verTodos ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setVerTodos(false)}
            >
              Por mês
            </Button>
          </div>
          {!verTodos && (
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card py-1 pl-1 pr-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevMonth} aria-label="Mês anterior">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground capitalize">
                <Calendar className="h-3.5 w-3.5" />
                {formatMonthYear(selectedMonth.month, selectedMonth.year)}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth} aria-label="Próximo mês">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          <Button size="sm" onClick={() => exportarCSV(filteredClientes, nomeArquivo)}>
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Faturamento hero + meta */}
      <Card className="border-emerald-400/20 bg-emerald-400/[0.03] p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="text-[13px] font-medium text-muted-foreground">{verTodos ? 'Faturamento total' : 'Faturamento do mês'}</span>
            <div className="mt-1 text-4xl font-bold leading-none tracking-tight tabular-nums text-emerald-200 sm:text-[2.75rem]">
              {formatBRL(totalGanho)}
            </div>
            <div className="mt-2">
              {verTodos ? (
                <p className="text-xs text-muted-foreground">
                  Soma de todos os valores cobrados · {mesesAtivos} {mesesAtivos === 1 ? 'mês ativo' : 'meses ativos'}.
                </p>
              ) : (
                <DeltaLine value={deltaPct(totalGanho, ganhoAnterior)} />
              )}
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
              <GoalRing value={verTodos ? 100 : pctMeta} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {verTodos ? (
                  <>Sua melhor marca mensal foi <span className="font-semibold text-foreground">{formatBRL(melhorMarca)}</span>.</>
                ) : (
                  <>Você fez <span className="font-semibold text-foreground">{Math.round(pctMeta)}%</span> da sua melhor marca ({formatBRL(melhorMarca)}).</>
                )}
              </p>
            </div>
          </div>
          <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 sm:flex">
            <Wallet className="h-7 w-7" />
          </span>
        </div>
      </Card>

      {!verTodos && (
      <>
      {/* Ticket + clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">{verTodos ? 'Total de clientes' : 'Total de clientes do mês'}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold leading-none tracking-tight tabular-nums">{filteredClientes.length}</div>
          <div className="mt-1.5">
            {verTodos ? (
              <p className="text-xs text-muted-foreground">Em {mesesAtivos} {mesesAtivos === 1 ? 'mês ativo' : 'meses ativos'}.</p>
            ) : (
              <DeltaLine value={deltaPct(filteredClientes.length, prevClientes.length)} />
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Ticket médio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold leading-none tracking-tight tabular-nums">{formatBRL(ticketMedio)}</div>
          <div className="mt-1.5">
            {verTodos ? (
              <p className="text-xs text-muted-foreground">Média de todos os atendimentos.</p>
            ) : (
              <DeltaLine value={deltaPct(ticketMedio, ticketAnterior)} />
            )}
          </div>
        </Card>
      </div>

      </>
      )}

      {/* Resumo geral (todos os tempos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Total de clientes já atendidos</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold leading-none tracking-tight tabular-nums">{totalClientesAtendidos}</div>
          <p className="mt-1.5 text-xs text-muted-foreground">{mesesAtivos} {mesesAtivos === 1 ? 'mês ativo' : 'meses ativos'} · todos os atendimentos.</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Valor total</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold leading-none tracking-tight tabular-nums">{formatBRL(valorTotalGeral)}</div>
          <p className="mt-1.5 text-xs text-muted-foreground">Soma de todos os valores cobrados.</p>
        </Card>
      </div>

      {/* Origem + recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">De onde veio</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => setActiveTab?.('origens')}>
              Ver origens
            </Button>
          </div>
          {statsOrigem.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Você não tem origens neste mês.
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-5">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5" aria-hidden>
                {statsOrigem.map(o => (
                  <div
                    key={o.nome}
                    className="h-full"
                    style={{
                      width: `${totalAtendimentos > 0 ? (o.count / totalAtendimentos) * 100 : 0}%`,
                      backgroundColor: o.cor,
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="h-44 flex-1">
                  <DonutChart
                    data={donutData}
                    formatValue={v => v.toLocaleString('pt-BR')}
                    centerLabel="Clientes"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3.5">
                  {statsOrigem.slice(0, 5).map(o => {
                    const pct = totalAtendimentos > 0 ? Math.round((o.count / totalAtendimentos) * 100) : 0
                    return (
                      <div key={o.nome} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: o.cor }} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{o.nome}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {o.count} atendimentos · {formatBRL(o.receita)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: o.cor }} />
                          </div>
                          <span className="w-9 text-right text-[11px] text-muted-foreground">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Atendimentos recentes</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openClienteForm()}>
              <Plus className="h-3 w-3" />
              Novo
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtrar clientes..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="h-8 w-full pl-8 text-xs"
            />
          </div>
          {recentes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {busca ? 'Você não achou ninguém com este nome.' : 'Você não atendeu ninguém neste mês.'}
              </p>
              {!busca && (
                <Button size="sm" onClick={() => openClienteForm()}>
                  <Plus className="h-3.5 w-3.5" />
                  Anotar atendimento
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2.5">
              {recentes.map(c => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {iniciais(c.nome)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.nome}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c.trabalhoFeito || 'Sem descrição'}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold tabular-nums">{formatBRL(Number(c.valorCobrado || 0))}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDateBR(c.data)}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-1 h-8 w-full text-xs" onClick={() => setActiveTab?.('clientes')}>
                Ver tudo
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
