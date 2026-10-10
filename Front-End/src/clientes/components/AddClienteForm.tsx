import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCrm } from '../../crm/useCrm'
import { useClienteForm } from '../../crm/ClienteFormContext'
import { useToast } from '../../shared/components/Toast'
import { ApiError } from '../../shared/services/api'
import type { ClientePayload } from '../../shared/types'

function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

function parseMoney(value: string): number {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

export function AddClienteForm() {
  const { origens, addCliente, updateCliente } = useCrm()
  const { isOpen, clienteEmEdicao, closeClienteForm } = useClienteForm()
  const { showToast } = useToast()

  const [amount, setAmount] = useState('')
  const [nome, setNome] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [conhecidoDaOnde, setConhecidoDaOnde] = useState('')
  const [trabalhoFeito, setTrabalhoFeito] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setFieldErrors({})
    setFormError('')
    setAmount(clienteEmEdicao ? formatMoney(Number(clienteEmEdicao.valorCobrado || 0)) : '')
    setNome(clienteEmEdicao?.nome ?? '')
    setData(clienteEmEdicao?.data ?? new Date().toISOString().split('T')[0])
    setConhecidoDaOnde(clienteEmEdicao?.conhecidoDaOnde ?? '')
    setTrabalhoFeito(clienteEmEdicao?.trabalhoFeito ?? '')
  }, [isOpen, clienteEmEdicao])

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    if (!rawValue) { setAmount(''); return }
    const numberValue = parseInt(rawValue, 10) / 100
    setAmount(formatMoney(numberValue))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setFormError('')

    const numericAmount = parseMoney(amount)
    if (!nome.trim()) {
      setFieldErrors({ nome: 'Por favor preencha o nome corretamente.' })
      return
    }
    if (numericAmount <= 0) {
      setFieldErrors({ valorCobrado: 'Por favor preencha o valor cobrado.' })
      return
    }
    if (!data) {
      setFieldErrors({ data: 'Por favor preencha a data corretamente.' })
      return
    }

    const payload: ClientePayload = {
      nome: nome.trim(),
      conhecidoDaOnde: conhecidoDaOnde.trim(),
      valorCobrado: numericAmount,
      data,
      trabalhoFeito: trabalhoFeito.trim(),
    }

    setIsSubmitting(true)
    try {
      if (clienteEmEdicao) {
        await updateCliente(clienteEmEdicao.id, payload)
        showToast('Você atualizou o cliente.')
      } else {
        await addCliente(payload)
        showToast('Você salvou o cliente.')
      }
      closeClienteForm()
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.campos)
        setFormError(Object.keys(err.campos).length === 0 ? err.message : '')
      } else {
        setFormError(err instanceof Error ? err.message : 'Erro ao salvar o cliente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const erroDe = (campo: string) => fieldErrors[campo]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeClienteForm() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{clienteEmEdicao ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            {clienteEmEdicao ? 'Atualize os dados do atendimento.' : 'Registre um atendimento realizado.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <Label>Valor Cobrado</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">R$</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-14 text-3xl font-semibold h-14"
                required
              />
            </div>
            {erroDe('valorCobrado') && (
              <p className="text-[11px] text-red-500">{erroDe('valorCobrado')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                placeholder="Ex: Maria Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              {erroDe('nome') && <p className="text-[11px] text-red-500">{erroDe('nome')}</p>}
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
              {erroDe('data') && <p className="text-[11px] text-red-500">{erroDe('data')}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Conhecido de onde</Label>
            <Input
              list="origens-sugestoes"
              placeholder="Ex: Indicação de um amigo"
              value={conhecidoDaOnde}
              onChange={(e) => setConhecidoDaOnde(e.target.value)}
            />
            <datalist id="origens-sugestoes">
              {origens.map((origem) => (
                <option key={origem.id} value={origem.nome} />
              ))}
            </datalist>
            <p className="text-[11px] text-muted-foreground">Escolha uma origem já cadastrada ou digite outra.</p>
            {erroDe('conhecidoDaOnde') && (
              <p className="text-[11px] text-red-500">{erroDe('conhecidoDaOnde')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Trabalho Feito</Label>
            <Input
              placeholder="Ex: Corte e escova"
              value={trabalhoFeito}
              onChange={(e) => setTrabalhoFeito(e.target.value)}
            />
            {erroDe('trabalhoFeito') && (
              <p className="text-[11px] text-red-500">{erroDe('trabalhoFeito')}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                clienteEmEdicao ? 'Salvar Alterações' : 'Salvar Cliente'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
