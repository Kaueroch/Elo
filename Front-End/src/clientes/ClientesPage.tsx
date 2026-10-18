import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'motion/react'
import { useCrm } from '../crm/useCrm'
import { useClienteForm } from '../crm/ClienteFormContext'
import { useToast } from '../shared/components/Toast'
import { formatBRL, formatDateBR, formatMonthYear, getCurrentMonth, isSameMonth } from '../shared/utils/formatters'
import { achaOrigem, origemColor, origemNomeDoCliente, SEM_ORIGEM } from '../shared/constants'
import type { MonthFilter } from '../shared/types'

interface ClienteAlvo {
  id: number
  nome: string
  data: string
  valor: number
}

export function ClientesPage() {
  const { clientes, origens, deleteCliente } = useCrm()
  const { openClienteForm } = useClienteForm()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOrigem, setFilterOrigem] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<MonthFilter>(getCurrentMonth())
  const [verTodos, setVerTodos] = useState(false)
  const [alvoExclusao, setAlvoExclusao] = useState<ClienteAlvo | null>(null)
  const [excluindo, setExcluindo] = useState(false)

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

  const origemGroups = useMemo(() => {
    const filtered = clientes.filter(c => {
      const nomeOrigem = origemNomeDoCliente(c.conhecidoDaOnde)
      const matchSearch = c.nome.toLowerCase().includes(searchQuery.toLowerCase())
      const matchOrigem = filterOrigem === 'all' || nomeOrigem === filterOrigem
      const matchMonth = verTodos || isSameMonth(c.data, selectedMonth.month, selectedMonth.year)
      return matchSearch && matchOrigem && matchMonth
    })

    const groups: Record<string, { total: number; maxCliente: typeof filtered[0] | null; items: typeof filtered }> = {}

    for (const cliente of filtered) {
      const nomeOrigem = origemNomeDoCliente(cliente.conhecidoDaOnde)
      if (!groups[nomeOrigem]) {
        groups[nomeOrigem] = { total: 0, maxCliente: null, items: [] }
      }
      const group = groups[nomeOrigem]
      group.total += Number(cliente.valorCobrado || 0)
      group.items.push(cliente)
      if (!group.maxCliente || Number(cliente.valorCobrado) > Number(group.maxCliente.valorCobrado)) {
        group.maxCliente = cliente
      }
    }

    Object.values(groups).forEach(g => {
      g.items.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    })

    return Object.entries(groups).map(([nome, data]) => ({
      id: nome,
      ...data
    })).sort((a, b) => b.total - a.total)
  }, [clientes, searchQuery, filterOrigem, selectedMonth, verTodos])

  // Abre o primeiro grupo por padrão apenas na primeira carga, para não
  // exigir um clique extra. Depois disso o usuário controla a expansão,
  // inclusive recolhendo todos os grupos.
  const inicializado = useRef(false)
  useEffect(() => {
    if (!inicializado.current && origemGroups.length > 0) {
      inicializado.current = true
      setExpandedId(origemGroups[0].id)
    }
  }, [origemGroups])

  const temFiltro = searchQuery.trim() !== '' || filterOrigem !== 'all'

  const limparFiltros = () => {
    setSearchQuery('')
    setFilterOrigem('all')
    setVerTodos(false)
    setSelectedMonth(getCurrentMonth())
  }

  const confirmarExclusao = async () => {
    if (!alvoExclusao) return
    setExcluindo(true)
    try {
      await deleteCliente(alvoExclusao.id)
      showToast(`Você excluiu ${alvoExclusao.nome}.`)
      setAlvoExclusao(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao excluir cliente.')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto w-full space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">Você vê quem atendeu e quanto cobrou.</p>
        </div>
        <Button onClick={() => openClienteForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Buscar cliente"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filterOrigem} onValueChange={(v) => setFilterOrigem(v)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por origem">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {origens.map((origem) => (
                <SelectItem key={origem.id} value={origem.nome}>{origem.nome}</SelectItem>
              ))}
              <SelectItem value={SEM_ORIGEM}>{SEM_ORIGEM}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-muted p-1">
              <Button
                variant={verTodos ? 'default' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setVerTodos(true)}
              >
                Todos
              </Button>
              <Button
                variant={!verTodos ? 'default' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setVerTodos(false)}
              >
                Por mês
              </Button>
            </div>
            {!verTodos && (
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 bg-muted rounded-lg p-1 border border-border">
                <Button variant="ghost" size="icon-sm" onClick={goToPrevMonth} aria-label="Mês anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2 min-w-[120px] text-center capitalize">
                  {formatMonthYear(selectedMonth.month, selectedMonth.year)}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={goToNextMonth} aria-label="Próximo mês">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {origemGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">
              {temFiltro ? 'Você não achou ninguém com este filtro.' : (verTodos ? 'Você ainda não tem clientes cadastrados.' : 'Você não atendeu ninguém neste mês.')}
            </p>
            {temFiltro ? (
              <Button variant="outline" size="sm" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            ) : (
              <Button size="sm" onClick={() => openClienteForm()}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Anotar atendimento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {origemGroups.map(({ id, total, items }) => {
            const origem = achaOrigem(origens, id)
            const color = origem ? origemColor(origem.id) : origemColor(undefined)
            const isExpanded = expandedId === id

            return (
              <Card key={id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} origem ${id}`}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{id}</span>
                    <span className="block text-xs text-muted-foreground">
                      {items.length} cliente{items.length === 1 ? '' : 's'}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold tracking-tight tabular-nums">
                    {formatBRL(total)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <ul className="flex flex-col gap-2 p-3 max-h-80 overflow-y-auto bg-muted/20">
                        {items.map(cliente => (
                          <li
                            key={cliente.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border"
                          >
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-medium truncate">{cliente.nome}</span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1">
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: origemColor(achaOrigem(origens, origemNomeDoCliente(cliente.conhecidoDaOnde))?.id) }}
                                    aria-hidden
                                  />
                                  {origemNomeDoCliente(cliente.conhecidoDaOnde)}
                                </span>
                                <span>· {formatDateBR(cliente.data)}</span>
                                {cliente.trabalhoFeito ? <span>· {cliente.trabalhoFeito}</span> : null}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="mr-1 text-sm font-semibold tabular-nums">
                                {formatBRL(Number(cliente.valorCobrado || 0))}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openClienteForm(cliente)}
                                aria-label={`Editar ${cliente.nome}`}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setAlvoExclusao({
                                  id: cliente.id,
                                  nome: cliente.nome,
                                  data: cliente.data,
                                  valor: Number(cliente.valorCobrado || 0),
                                })}
                                aria-label={`Excluir ${cliente.nome}`}
                                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={alvoExclusao !== null} onOpenChange={(open) => { if (!open) setAlvoExclusao(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir {alvoExclusao?.nome}?</DialogTitle>
            <DialogDescription>
              {alvoExclusao && (
                <>Você apaga o atendimento de {formatDateBR(alvoExclusao.data)} ({formatBRL(alvoExclusao.valor)}). Não dá para desfazer.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlvoExclusao(null)} disabled={excluindo}>
              Manter
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              disabled={excluindo}
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
