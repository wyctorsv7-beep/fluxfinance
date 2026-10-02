
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, CheckCircle2 } from "lucide-react"

interface GoalsListProps {
  goals: any[]
  contributions: any[]
}

export function GoalsList({ goals, contributions }: GoalsListProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (goals.length === 0) {
    return (
      <Card className="glass-morphism border-white/5 py-12 flex flex-col items-center justify-center text-center">
        <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold text-white">Nenhuma meta definida</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mt-1">Crie seu primeiro objetivo para começar a poupar.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1">
      {goals.map((goal) => {
        const goalContributions = contributions
          .filter(c => c.goalId === goal.id)
          .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
        
        const currentAmount = (Number(goal.initialAmount) || 0) + goalContributions
        const targetAmount = Number(goal.targetAmount) || 1
        const percent = Math.min((currentAmount / targetAmount) * 100, 100)
        const isCompleted = currentAmount >= targetAmount

        return (
          <Card key={goal.id} className="glass-morphism border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-accent/20' : 'bg-primary/20'}`}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <Target className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-white group-hover:text-primary transition-colors">{goal.title}</CardTitle>
                    <CardDescription className="text-[10px] md:text-xs text-muted-foreground">
                      Criada em {new Date(goal.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-lg font-bold text-white font-headline">{percent.toFixed(0)}%</span>
                  {percent > 0 && percent < 100 && (
                    <div className="flex items-center gap-1 text-[9px] text-accent font-bold animate-pulse mt-0.5">
                      <TrendingUp className="h-3 w-3" />
                      <span>EVOLUINDO</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2">
              <div className="space-y-6">
                <div className="flex justify-between text-xs md:text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Acumulado</span>
                    <span className="text-white font-semibold">{formatCurrency(currentAmount)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Objetivo</span>
                    <span className="text-white/60">{formatCurrency(targetAmount)}</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={percent} 
                    className="h-2.5 bg-white/5" 
                    indicatorClassName={isCompleted ? "bg-accent" : "bg-primary"}
                  />
                </div>
                {isCompleted && (
                  <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-accent font-bold uppercase tracking-widest bg-accent/5 py-1 rounded-md">
                    <CheckCircle2 className="h-3 w-3" />
                    Meta Atingida!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
