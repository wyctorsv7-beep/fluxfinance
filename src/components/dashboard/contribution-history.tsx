
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUpRight, Clock } from "lucide-react"

export function ContributionHistory({ contributions, goals }: { contributions: any[], goals: any[] }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getGoalTitle = (goalId: string) => {
    return goals.find(g => g.id === goalId)?.title || "Meta Removida"
  }

  const formatDate = (dateValue: any) => {
    if (!mounted || !dateValue) return ""
    // Handle Firestore Timestamps
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString('pt-BR')
    }
    // Fallback for string dates
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? dateValue : date.toLocaleDateString('pt-BR')
  }

  return (
    <Card className="glass-morphism border-white/5 h-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-headline font-bold text-white">Últimos Aportes</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">Histórico de depósitos recentes.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-4">
          {contributions.length > 0 ? (
            contributions.slice(0, 10).map((c) => (
              <div key={c.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white group-hover:text-accent transition-colors">
                      {getGoalTitle(c.goalId)}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase">
                      {formatDate(c.date)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">
                    + {formatCurrency(c.amount)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Sem histórico</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
