
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Wallet, Coins } from "lucide-react"
import { GoalsList } from "./goals-list"

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
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white font-headline">Minhas Metas</h2>
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-morphism border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Guardado</CardTitle>
            <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-lg md:text-2xl font-bold text-white font-headline truncate">{formatCurrency(totals.saved)}</div>
            <p className="text-[8px] md:text-[10px] text-muted-foreground mt-0.5">Soma de todos os objetivos</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Meta Geral</CardTitle>
            <Target className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-lg md:text-2xl font-bold text-white font-headline truncate">{formatCurrency(totals.target)}</div>
            <p className="text-[8px] md:text-[10px] text-muted-foreground mt-0.5">Total planejado</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Objetivos Ativos</CardTitle>
            <Coins className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-lg md:text-2xl font-bold text-white font-headline">{totals.active}</div>
            <p className="text-[8px] md:text-[10px] text-muted-foreground mt-0.5">Metas em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <GoalsList goals={goals} contributions={contributions} />
      </div>
    </div>
  )
}
