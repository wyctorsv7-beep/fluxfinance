
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Wallet, Coins } from "lucide-react"
import { GoalsList } from "./goals-list"
import { ContributionHistory } from "./contribution-history"

interface DashboardOverviewProps {
  goals: any[]
  contributions: any[]
}

export function DashboardOverview({ goals, contributions }: DashboardOverviewProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const totals = React.useMemo(() => {
    const initialSum = goals.reduce((acc, g) => acc + (Number(g.initialAmount) || 0), 0)
    const contributionSum = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0)
    const targetSum = goals.reduce((acc, g) => acc + (Number(g.targetAmount) || 0), 0)

    return {
      saved: initialSum + contributionSum,
      target: targetSum,
      active: goals.length
    }
  }, [goals, contributions])

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-headline">Minhas Metas</h2>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-morphism border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Guardado</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(totals.saved)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Soma de todos os objetivos</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Meta Geral</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(totals.target)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total planejado</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Objetivos Ativos</CardTitle>
            <Coins className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{totals.active}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Metas em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GoalsList goals={goals} contributions={contributions} />
        </div>
        <div className="lg:col-span-1">
          <ContributionHistory contributions={contributions} goals={goals} />
        </div>
      </div>
    </div>
  )
}
