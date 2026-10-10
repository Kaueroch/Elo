import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '../shared/components/Toast'
import { authApi } from '../shared/services/authApi'
import type { ConfigMotivo } from '../shared/types'

interface VerificarCodigoPageProps {
  motivo: ConfigMotivo
  email: string
  onBack: () => void
  onVerified: (trocaToken: string) => void
}

const REENVIO_ESPERA = 60

export function VerificarCodigoPage({ motivo, email, onBack, onVerified }: VerificarCodigoPageProps) {
  const { showToast } = useToast()
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [conferindo, setConferindo] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [espera, setEspera] = useState(REENVIO_ESPERA)

  useEffect(() => {
    if (espera <= 0) return
    const id = setInterval(() => setEspera((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [espera])

  const conferir = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!/^\d{6}$/.test(codigo.trim())) {
      setErro('Digite os 6 dígitos do código.')
      return
    }
    setConferindo(true)
    try {
      const trocaToken = await authApi.confirmarCodigo(motivo, codigo.trim())
      onVerified(trocaToken)
    } catch (error) {
      setErro(error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.')
    } finally {
      setConferindo(false)
    }
  }

  const reenviar = async () => {
    setErro('')
    setReenviando(true)
    try {
      await authApi.solicitarCodigo(motivo)
      setEspera(REENVIO_ESPERA)
      showToast('Enviamos outro código.')
    } catch (error) {
      setErro(error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.')
    } finally {
      setReenviando(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-md mx-auto w-full space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2 pl-0">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div>
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-muted-foreground" />
          Conferir código
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enviamos um código de 6 dígitos para {email || 'o seu e-mail'}. Ele vale por 15 minutos.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={conferir} className="space-y-4">
            {erro && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {erro}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="text-center text-xl tracking-[0.5em]"
              />
            </div>
            <Button type="submit" disabled={conferindo} className="w-full">
              {conferindo ? 'Conferindo...' : 'Conferir'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={reenviar}
              disabled={reenviando || espera > 0}
            >
              {espera > 0 ? `Pedir outro em ${espera}s` : reenviando ? 'Enviando...' : 'Pedir outro código'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
