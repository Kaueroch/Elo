import { useMemo, useState } from 'react'
import { Briefcase, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Download, Info, Plus, Search, Users, Wallet } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
      <span className={`font-semibold ${value >= 0 ? 'text-lime-400' : 'text-red-400'}`}>{texto}</span>
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
    return clientes.filter(c => isSameMonth(c.data, selectedMonth.month, selectedMonth.year))
  }, [clientes, selectedMonth])

  const prevClientes = useMemo(() => {
    return clientes.filter(c => isSameMonth(c.data, prevMonth.month, prevMonth.year))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes, selectedMonth])

  const soma = (lista: Cliente[]) => lista.reduce((s, c) => s + Number(c.valorCobrado || 0), 0)
  const totalGanho = soma(filteredClientes)
  const ganhoAnterior = soma(prevClientes)
  const ticketMedio = filteredClientes.length > 0 ? totalGanho / filteredClientes.length : 0
  const ticketAnterior = prevClientes.length > 0 ? ganhoAnterior / prevClientes.length : 0

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
  const topOrigens = statsOrigem.slice(0, 3)
  const outrasOrigens = statsOrigem.slice(3)
  const outrasCount = outrasOrigens.reduce((s, o) => s + o.count, 0)

  const recentes = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return [...filteredClientes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .filter(c => !termo || c.nome.toLowerCase().includes(termo))
      .slice(0, 6)
  }, [filteredClientes, busca])

  const nomeArquivo = `clientes-${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}.csv`

  return (
    <div className="p-4 lg:p-6 gap-4 flex flex-col w-full">
      {/* Titulo + periodo + exportar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold tracking-tight">Painel do CRM</h1>
        <div className="flex items-center gap-2">
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
          <Button size="sm" onClick={() => exportarCSV(filteredClientes, nomeArquivo)}>
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-[13px] font-semibold">Sua meta está incompleta</span>
          <div className="flex items-center gap-3">
            <GoalRing value={pctMeta} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Você atingiu <span className="font-semibold text-foreground">{Math.round(pctMeta)}%</span> da
              sua melhor marca ({formatBRL(melhorMarca)}). Confira seu progresso.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Total de clientes</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[28px] font-bold leading-none tracking-tight">{filteredClientes.length}</div>
          <DeltaLine value={deltaPct(filteredClientes.length, prevClientes.length)} />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Ticket médio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[28px] font-bold leading-none tracking-tight">{formatBRL(ticketMedio)}</div>
          <DeltaLine value={deltaPct(ticketMedio, ticketAnterior)} />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">Faturamento</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[28px] font-bold leading-none tracking-tight">{formatBRL(totalGanho)}</div>
          <DeltaLine value={deltaPct(totalGanho, ganhoAnterior)} />
        </Card>
      </div>

      {/* Linha do meio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Clientes por origem</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => exportarCSV(filteredClientes, nomeArquivo)}>
              <Download className="h-3 w-3" />
              Exportar
            </Button>
          </div>
          <div className="h-44">
            <DonutChart
              data={donutData}
              formatValue={v => v.toLocaleString('pt-BR')}
              centerLabel="Clientes"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {topOrigens.map(o => (
              <div key={o.nome} className="flex flex-col items-center gap-1 min-w-0">
                <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: o.cor }} />
                  <span className="truncate">{o.nome}</span>
                </span>
                <span className="text-sm font-bold">{o.count}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 min-w-0">
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-white/20" />
                Outras
              </span>
              <span className="text-sm font-bold">{outrasCount}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              Atendimentos recentes
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openClienteForm()}>
              <Plus className="h-3 w-3" />
              Novo
            </Button>
          </div>
          {recentes.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nenhum cliente atendido neste mês.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentes.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {iniciais(c.nome)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.nome}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c.trabalhoFeito || 'Sem descrição'}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold">{formatBRL(Number(c.valorCobrado || 0))}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDateBR(c.data)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            Origens
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
          {statsOrigem.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Sem origens neste mês.
            </div>
          ) : (
            <>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
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
              <div className="flex flex-col gap-3.5">
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
            </>
          )}
        </Card>
      </div>

      {/* Tabela */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold">Clientes</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filtrar clientes..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="h-8 w-52 pl-8 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setActiveTab?.('clientes')}>
              Ver tudo
            </Button>
          </div>
        </div>
        {recentes.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente atendido neste mês.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentes.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                        {iniciais(c.nome)}
                      </span>
                      <span className="text-sm font-medium">{c.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: origemColor(achaOrigem(origens, origemNomeDoCliente(c.conhecidoDaOnde))?.id) }}
                      />
                      <span className="text-sm text-muted-foreground">{origemNomeDoCliente(c.conhecidoDaOnde)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateBR(c.data)}</TableCell>
                  <TableCell className="font-medium">{formatBRL(Number(c.valorCobrado || 0))}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="border-lime-400/20 bg-lime-400/10 text-lime-400/90">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Atendido
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
