import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, Check, Clock, Plus, Search, Trash2, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDateBR } from '../shared/utils/formatters'

// TODO(dev): migrar para GET/POST /api/agenda quando o backend existir.
// Hoje os compromissos ficam em localStorage só para preencher a tela.

export type StatusCompromisso = 'agendado' | 'concluido' | 'cancelado'

export interface Compromisso {
  id: string
  titulo: string
  cliente: string
  data: string // yyyy-MM-dd
  hora: string // HH:mm
  status: StatusCompromisso
}

const STORAGE_KEY = 'crm:agenda'

function carregar(): Compromisso[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const statusConfig: Record<StatusCompromisso, { label: string; className: string }> = {
  agendado: { label: 'Agendado', className: 'border-sky-400/20 bg-sky-400/10 text-sky-400' },
  concluido: { label: 'Concluído', className: 'border-lime-400/20 bg-lime-400/10 text-lime-400/90' },
  cancelado: { label: 'Cancelado', className: 'border-red-400/20 bg-red-400/10 text-red-400' },
}

function novoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function AgendaPage() {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([])
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'todos' | StatusCompromisso>('todos')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [cliente, setCliente] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0])
  const [hora, setHora] = useState('09:00')
  const [erro, setErro] = useState('')

  useEffect(() => {
    setCompromissos(carregar())
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compromissos))
  }, [compromissos])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return [...compromissos]
      .filter((c) => filtro === 'todos' || c.status === filtro)
      .filter(
        (c) =>
          !termo ||
          c.titulo.toLowerCase().includes(termo) ||
          c.cliente.toLowerCase().includes(termo),
      )
      .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`))
  }, [compromissos, busca, filtro])

  const proximos = compromissos.filter((c) => c.status === 'agendado').length

  const abrirNovo = () => {
    setTitulo('')
    setCliente('')
    setData(new Date().toISOString().split('T')[0])
    setHora('09:00')
    setErro('')
    setDialogAberto(true)
  }

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) {
      setErro('Dê um título para o compromisso.')
      return
    }
    if (!data) {
      setErro('Escolha a data do compromisso.')
      return
    }
    setCompromissos((atual) => [
      ...atual,
      {
        id: novoId(),
        titulo: titulo.trim(),
        cliente: cliente.trim(),
        data,
        hora,
        status: 'agendado',
      },
    ])
    setDialogAberto(false)
  }

  const mudarStatus = (id: string, status: StatusCompromisso) => {
    setCompromissos((atual) => atual.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  const excluir = (id: string) => {
    if (!window.confirm('Excluir este compromisso?')) return
    setCompromissos((atual) => atual.filter((c) => c.id !== id))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
            <Badge variant="secondary" className="border-sky-400/20 bg-sky-400/10 text-sky-400">
              Beta
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {proximos === 0
              ? 'Você não tem compromissos agendados. Marque o próximo.'
              : `Você tem ${proximos} compromisso${proximos === 1 ? '' : 's'} agendado${proximos === 1 ? '' : 's'}.`}
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo compromisso
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['todos', 'agendado', 'concluido', 'cancelado'] as const).map((s) => (
            <Button
              key={s}
              variant={filtro === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltro(s)}
            >
              {s === 'todos' ? 'Todos' : statusConfig[s].label}
            </Button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-2">
            <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {busca ? 'Você não achou nenhum compromisso com este nome.' : 'Você não tem compromissos aqui.'}
            </p>
            <Button variant="outline" size="sm" onClick={abrirNovo}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Agendar agora
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map((c) => {
            const cfg = statusConfig[c.status]
            return (
              <Card key={c.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.titulo}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {c.cliente || 'Sem cliente vinculado'}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cfg.className}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateBR(c.data)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {c.hora}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {c.status === 'agendado' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => mudarStatus(c.id, 'concluido')}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Concluir
                      </Button>
                    )}
                    {c.status !== 'cancelado' && c.status !== 'concluido' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => mudarStatus(c.id, 'cancelado')}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancelar
                      </Button>
                    )}
                    {(c.status === 'concluido' || c.status === 'cancelado') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => mudarStatus(c.id, 'agendado')}
                      >
                        Reagendar
                      </Button>
                    )}
                    <button
                      onClick={() => excluir(c.id)}
                      className="ml-auto p-1.5 text-red-400/60 hover:text-red-400"
                      title="Excluir compromisso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialogAberto} onOpenChange={(open) => !open && setDialogAberto(false)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Novo compromisso</DialogTitle>
            <DialogDescription>
              Você guarda estes dados neste navegador por enquanto.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="flex flex-col gap-4">
            {erro && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {erro}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="agenda-titulo">Título</Label>
              <Input
                id="agenda-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Retorno da Maria"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agenda-cliente">Cliente (opcional)</Label>
              <Input
                id="agenda-cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agenda-data">Data</Label>
                <Input
                  id="agenda-data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda-hora">Hora</Label>
                <Input
                  id="agenda-hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
