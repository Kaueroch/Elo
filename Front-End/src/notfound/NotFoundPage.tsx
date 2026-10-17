import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export function NotFoundPage({ onHome }: { onHome?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold tracking-tight text-amber-400">404</p>
        <h1 className="text-xl font-semibold">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground">
          O endereço que você tentou abrir não existe no Elo.
        </p>
      </div>
      <Button onClick={onHome}>
        <Home className="mr-2 h-4 w-4" />
        Voltar para o painel
      </Button>
    </div>
  )
}
