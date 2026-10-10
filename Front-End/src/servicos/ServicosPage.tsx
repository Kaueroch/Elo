import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Briefcase, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatBRL } from '../shared/utils/formatters'

// TODO(dev): migrar para GET/POST /api/servicos quando o backend existir.
// Hoje o catálogo fica em localStorage só para preencher a tela.

export interface Servico {
  id: string
  nome: string
  descricao: string
  precoBase: number
}

const STORAGE_KEY = 'crm:servicos'

const SEED: Servico[] = [
  {
    id: 'seed-1',
    nome: 'Atendimento padrão',
    descricao: 'Exemplo. Você edita ou apaga quando quiser.',
    precoBase: 150,
  },
  {
    id: 'seed-2',
    nome: 'Atendimento premium',
    descricao: 'Exemplo com preço maior para você testar.',
    precoBase: 300,
  },
]

function carregar(): Servico[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return SEED
    // Normaliza registros antigos que ainda tinham duracaoMin.
    return parsed.map((s) => ({
      id: String(s.id ?? novoId()),
      nome: String(s.nome ?? ''),
      descricao: String(s.descricao ?? ''),
      precoBase: Number(s.precoBase ?? 0),
    }))
  } catch {
    return SEED
  }
}

function novoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [busca, setBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Servico | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    setServicos(carregar())
  }, [])

  useEffect(() => {
    if (servicos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos))
    }
  }, [servicos])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return servicos.filter(
      (s) =>
        !termo ||
        s.nome.toLowerCase().includes(termo) ||
        s.descricao.toLowerCase().includes(termo),
    )
  }, [servicos, busca])

  const abrirNovo = () => {
    setEditando(null)
    setNome('')
    setDescricao('')
    setPreco('')
    setErro('')
    setDialogAberto(true)
  }

  const abrirEdicao = (s: Servico) => {
    setEditando(s)
    setNome(s.nome)
    setDescricao(s.descricao)
    setPreco(String(s.precoBase).replace('.', ','))
    setErro('')
    setDialogAberto(true)
  }

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) {
      setErro('Dê um nome para o serviço.')
      return
    }
    const precoNum = Number(preco.replace(/\./g, '').replace(',', '.'))
    if (!precoNum || precoNum <= 0) {
      setErro('Informe um preço base válido.')
      return
    }

    if (editando) {
      setServicos((atual) =>
        atual.map((s) =>
          s.id === editando.id
            ? { ...s, nome: nome.trim(), descricao: descricao.trim(), precoBase: precoNum }
            : s,
        ),
      )
    } else {
      setServicos((atual) => [
        ...atual,
        { id: novoId(), nome: nome.trim(), descricao: descricao.trim(), precoBase: precoNum },
      ])
    }
    setDialogAberto(false)
  }

  const excluir = (id: string, nomeServico: string) => {
    if (!window.confirm(`Excluir o serviço "${nomeServico}"?`)) return
    setServicos((atual) => atual.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
            <Badge variant="secondary" className="border-violet-400/20 bg-violet-400/10 text-violet-300">
              Beta
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Você salva nome, descrição e preço para reutilizar no cadastro.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar serviço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-2">
            <Briefcase className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {busca ? 'Você não achou nenhum serviço com este nome.' : 'Você ainda não cadastrou serviços.'}
            </p>
            <Button variant="outline" size="sm" onClick={abrirNovo}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Cadastrar o primeiro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-violet-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{s.nome}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {s.descricao || 'Sem descrição.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight">{formatBRL(s.precoBase)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => abrirEdicao(s)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <button
                    onClick={() => excluir(s.id, s.nome)}
                    className="ml-auto p-1.5 text-red-400/60 hover:text-red-400"
                    title="Excluir serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogAberto} onOpenChange={(open) => !open && setDialogAberto(false)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar serviço' : 'Novo serviço'}</DialogTitle>
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
              <Label htmlFor="servico-nome">Nome</Label>
              <Input
                id="servico-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Corte + barba"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servico-desc">Descrição</Label>
              <Textarea
                id="servico-desc"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="O que está incluso..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servico-preco">Preço base (R$)</Label>
              <Input
                id="servico-preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="150,00"
                inputMode="decimal"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editando ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
