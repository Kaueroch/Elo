import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Grid, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import { formatBRL, formatDateBR, formatMonthYear, getCurrentMonth, isSameMonth } from '../shared/utils/formatters'
import { achaOrigem, origemColor, origemNomeDoCliente, SEM_ORIGEM } from '../shared/constants'
import type { MonthFilter } from '../shared/types'

export function ClientesPage() {
  const { clientes, origens, deleteCliente } = useCrm()
  const { openClienteForm } = useClienteForm()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOrigem, setFilterOrigem] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<MonthFilter>(getCurrentMonth())

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
      const matchMonth = isSameMonth(c.data, selectedMonth.month, selectedMonth.year)
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
  }, [clientes, searchQuery, filterOrigem, selectedMonth])

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) return
    try {
      await deleteCliente(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir cliente.')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">Você vê quem atendeu e quanto cobrou.</p>
        </div>
        <Button onClick={() => openClienteForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterOrigem} onValueChange={(v) => setFilterOrigem(v)}>
            <SelectTrigger className="w-[180px]">
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
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1 border border-border">
            <Button variant="ghost" size="icon-sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[120px] text-center">
              {formatMonthYear(selectedMonth.month, selectedMonth.year)}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {origemGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Você não achou ninguém com este filtro.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {origemGroups.map(({ id, total, maxCliente, items }) => {
            const origem = achaOrigem(origens, id)
            const color = origem ? origemColor(origem.id) : origemColor(undefined)
            const isExpanded = expandedId === id

            return (
              <Card
                key={id}
                className={`cursor-pointer transition-all ${isExpanded ? 'ring-1 ring-ring' : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Grid className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
                      </div>
                      <span className="font-semibold">{id}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight mb-3">
                    {formatBRL(total)}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {maxCliente && (
                      <p className="truncate">
                        Maior valor:{' '}
                        <span className="font-medium text-foreground/60">
                          {formatBRL(Number(maxCliente.valorCobrado || 0))}
                        </span>{' '}
                        ({maxCliente.nome})
                      </p>
                    )}
                    <p>{items.length} cliente{items.length === 1 ? '' : 's'}</p>
                  </div>
                </CardContent>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-4 flex flex-col gap-3 max-h-72 overflow-y-auto bg-muted/20">
                        {items.map(cliente => (
                          <div
                            key={cliente.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">{cliente.nome}</span>
                              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                                {formatDateBR(cliente.data)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-medium">
                                {formatBRL(Number(cliente.valorCobrado || 0))}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); openClienteForm(cliente) }}
                                className="p-1 text-muted-foreground hover:text-foreground"
                                title="Editar cliente"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(cliente.id, cliente.nome) }}
                                className="p-1 text-red-400/60 hover:text-red-400"
                                title="Excluir cliente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
