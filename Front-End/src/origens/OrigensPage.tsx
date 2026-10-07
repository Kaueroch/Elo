import { useState, useMemo } from 'react'
import { useCrm } from '../crm/useCrm'
import type { Origem } from '../shared/types'
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'motion/react'
import { formatBRL, formatDateBR } from '../shared/utils/formatters'
import { origemColor, origemNomeDoCliente } from '../shared/constants'
import { ApiError } from '../shared/services/api'

export function OrigensPage() {
  const { origens, clientes, addOrigem, deleteOrigem, totalGanho, loading } = useCrm()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newOrigemName, setNewOrigemName] = useState('')

  // Clientes agrupados pelo nome da origem (campo livre do cliente).
  const grouped = useMemo(() => clientes.reduce((acc, cliente) => {
    const nome = origemNomeDoCliente(cliente.conhecidoDaOnde)
    if (!acc[nome]) {
      acc[nome] = { total: 0, items: [] }
    }
    acc[nome].total += Number(cliente.valorCobrado || 0)
    acc[nome].items.push(cliente)
    return acc
  }, {} as Record<string, { total: number; items: typeof clientes }>), [clientes])

  // Envia a nova origem para o backend e atualiza a lista
  const handleAdd = async () => {
    if (!newOrigemName.trim()) return
    if (origens.some(o => o.nome.toLowerCase() === newOrigemName.trim().toLowerCase())) {
      alert('Já existe uma origem com este nome.')
      return
    }
    try {
      await addOrigem(newOrigemName.trim())
      setNewOrigemName('')
      setIsAdding(false)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : ''
      alert(message || 'Erro ao criar origem. Verifique se o backend está rodando.')
    }
  }

  const handleDelete = async (origem: Origem) => {
    if (!window.confirm(`Tem certeza que deseja excluir a origem "${origem.nome}"?`)) return

    try {
      await deleteOrigem(origem.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir origem.')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-5 bg-muted rounded w-20" />
                    <div className="h-3 bg-muted rounded w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && (
        <>
          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Origens</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                  Gerencie de onde vêm seus clientes e veja o ganho de cada origem
                </p>
              </div>
              <Button onClick={() => setIsAdding(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Origem
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-border rounded-2xl p-4 sm:p-5 bg-card flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs text-muted-foreground font-medium">Nome da Origem</label>
                  <Input
                    value={newOrigemName}
                    onChange={(e) => setNewOrigemName(e.target.value)}
                    placeholder="Ex: Indicação de amigos"
                    autoFocus
                  />
                </div>
                <Button onClick={handleAdd}>Criar</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {origens.map((origem) => {
              const data = grouped[origem.nome] || { total: 0, items: [] }
              const percent = totalGanho > 0 ? Math.round((data.total / totalGanho) * 100) : 0
              const isExpanded = expandedId === origem.id
              const initial = origem.nome.charAt(0).toUpperCase()
              const color = origemColor(origem.id)

              return (
                <Card key={origem.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 group">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-base font-bold text-black"
                          style={{ backgroundColor: color }}
                        >
                          {initial}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm sm:text-base flex items-center gap-2 truncate">
                            {origem.nome}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(origem) }}
                              className="p-1 text-red-400/60 hover:text-red-400"
                              title="Excluir origem"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {data.items.length} cliente{data.items.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 cursor-pointer justify-between sm:justify-end" onClick={() => setExpandedId(isExpanded ? null : origem.id)}>
                        <div className="flex flex-col items-end">
                          <p className="text-lg font-semibold">{formatBRL(data.total)}</p>
                          <span className="text-muted-foreground text-xs">{percent}% do total</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-border"
                        >
                          <div className="flex flex-col p-4 gap-3 max-h-64 overflow-y-auto bg-muted/20">
                            {data.items.length === 0 ? (
                              <div className="text-center text-muted-foreground text-sm py-4">Nenhum cliente nesta origem.</div>
                            ) : (
                              data.items
                                .slice()
                                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                                .map(item => (
                                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{item.nome}</span>
                                      <span className="text-xs text-muted-foreground">{formatDateBR(item.data)}</span>
                                    </div>
                                    <span className="font-medium text-sm">{formatBRL(Number(item.valorCobrado || 0))}</span>
                                  </div>
                                ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              )
            })}

            {origens.length === 0 && (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhuma origem cadastrada. Crie a primeira para sugerir no formulário de clientes.
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
