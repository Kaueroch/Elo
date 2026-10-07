import { useState, useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCrm } from '../crm/useCrm'
import { useClienteForm } from '../crm/ClienteFormContext'
import { formatBRL, formatDateBR, formatMonthYear, getCurrentMonth, isSameMonth } from '../shared/utils/formatters'
import { achaOrigem, origemColor, origemNomeDoCliente } from '../shared/constants'
import { DonutChart } from './components/DonutChart'
import type { Tab, MonthFilter } from '../shared/types'

interface HomePageProps {
  setActiveTab?: (tab: Tab) => void;
}

export function HomePage({ setActiveTab }: HomePageProps = {}) {
  const { clientes, origens } = useCrm()
  const { openClienteForm } = useClienteForm()
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

  const filteredClientes = useMemo(() => {
    return clientes.filter(c => isSameMonth(c.data, selectedMonth.month, selectedMonth.year))
  }, [clientes, selectedMonth])

  const totalGanho = useMemo(
    () => filteredClientes.reduce((sum, item) => sum + Number(item.valorCobrado || 0), 0),
    [filteredClientes],
  )

  const ticketMedio = filteredClientes.length > 0 ? totalGanho / filteredClientes.length : 0

  const recentActivity = useMemo(() => {
    return [...filteredClientes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6)
  }, [filteredClientes])

  const chartData = useMemo(() => {
    const ganhoPorOrigem: Record<string, { name: string; value: number; color: string }> = {}
    filteredClientes.forEach(c => {
      const nome = origemNomeDoCliente(c.conhecidoDaOnde)
      if (!ganhoPorOrigem[nome]) {
        const origem = achaOrigem(origens, nome)
        ganhoPorOrigem[nome] = { name: nome, value: 0, color: origem ? origemColor(origem.id) : origemColor(undefined) }
      }
      ganhoPorOrigem[nome].value += Number(c.valorCobrado || 0)
    })
    return Object.values(ganhoPorOrigem)
  }, [filteredClientes, origens])

  return (
    <div className="p-6 lg:p-8 gap-6 flex flex-col max-w-[1400px] mx-auto w-full">
      <div className="bg-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-border relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Ganho</span>
          <h1 className="text-4xl font-bold tracking-tight">{formatBRL(totalGanho)}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => openClienteForm()}
              size="sm"
              className="rounded-full h-8"
            >
              <ArrowDownLeft className="mr-1.5 h-3.5 w-3.5" />
              Novo Cliente
            </Button>
            <Button
              onClick={() => setActiveTab?.('clientes')}
              variant="secondary"
              size="sm"
              className="rounded-full h-8"
            >
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
              Ver Clientes
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 border border-border">
            <Button variant="ghost" size="icon-xs" onClick={goToPrevMonth}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium px-2 min-w-[110px] text-center text-muted-foreground">
              {formatMonthYear(selectedMonth.month, selectedMonth.year)}
            </span>
            <Button variant="ghost" size="icon-xs" onClick={goToNextMonth}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-lime-400" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">Ganho no Mês</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(totalGanho)}</div>
            <p className="text-lime-400/90 text-xs mt-1 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              {formatMonthYear(selectedMonth.month, selectedMonth.year)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">Clientes Atendidos</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClientes.length}</div>
            <p className="text-muted-foreground text-xs mt-1 font-medium">Atendimentos no mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Wallet className="w-5 h-5 text-foreground" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">Ticket Médio</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(ticketMedio)}</div>
            <p className="text-muted-foreground text-xs mt-1 font-medium">Média por atendimento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Atividade Recente</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab?.('clientes')}
              className="text-xs"
            >
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum cliente atendido neste mês.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-lime-400/10">
                            <ArrowDownLeft className="w-3.5 h-3.5 text-lime-400" />
                          </div>
                          <span className="font-medium text-sm">{cliente.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDateBR(cliente.data)}</TableCell>
                      <TableCell className="font-medium">
                        {formatBRL(Number(cliente.valorCobrado || 0))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: origemColor(achaOrigem(origens, origemNomeDoCliente(cliente.conhecidoDaOnde))?.id) }}
                          />
                          <span className="text-muted-foreground text-sm">
                            {origemNomeDoCliente(cliente.conhecidoDaOnde)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-lime-400/10 text-lime-400/90 border-lime-400/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Atendido
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ganhos por Origem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <DonutChart data={chartData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
