
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MonthlySummaryProps {
  transactions: any[]
  budgets: any[]
}

export function MonthlySummary({ transactions, budgets }: MonthlySummaryProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentMonthData = React.useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyTxs = transactions.filter(t => {
      const d = new Date(t.transactionDate || t.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const income = monthlyTxs
      .filter(t => Number(t.amount) > 0)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)

    const expenses = monthlyTxs
      .filter(t => Number(t.amount) < 0)
      .reduce((acc, curr) => acc + Math.abs(Number(curr.amount)), 0)

    const salary = monthlyTxs
      .filter(t => (t.category === "Salário" || t.categoryId === "Salário") && Number(t.amount) > 0)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)

    const savings = income - expenses
    const savingsPercent = income > 0 ? (savings / income) * 100 : 0

    return {
      income,
      expenses,
      salary,
      savings,
      savingsPercent,
      monthlyTxs
    }
  }, [transactions])

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (!mounted) return null

  const isOverSalary = currentMonthData.salary > 0 && currentMonthData.expenses > currentMonthData.salary
  const isOverIncome = currentMonthData.income > 0 && currentMonthData.expenses > currentMonthData.income

  return (
    <Card className="glass-morphism border-white/5 h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-md bg-primary/20">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-headline font-bold text-white">Fechamento Mensal</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">Análise de desempenho do mês atual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Economia Real</p>
            <div className={`text-xl font-bold font-headline ${currentMonthData.savings >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {formatCurrency(currentMonthData.savings)}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">% de Retenção</p>
            <div className="text-xl font-bold font-headline text-white">
              {currentMonthData.savingsPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isOverSalary && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase">Alerta de Gastos</AlertTitle>
              <AlertDescription className="text-[10px]">
                Suas despesas ultrapassaram o valor do seu Salário!
              </AlertDescription>
            </Alert>
          )}

          {currentMonthData.savings < 0 && !isOverSalary && (
            <Alert className="bg-orange-500/10 border-orange-500/20 text-orange-500 py-2">
              <TrendingDown className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase">Saldo Negativo</AlertTitle>
              <AlertDescription className="text-[10px]">
                Você gastou mais do que recebeu este mês.
              </AlertDescription>
            </Alert>
          )}

          {currentMonthData.savings > 0 && (
            <Alert className="bg-accent/10 border-accent/20 text-accent py-2">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase">Bom Trabalho!</AlertTitle>
              <AlertDescription className="text-[10px]">
                Você economizou {formatCurrency(currentMonthData.savings)} até agora.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Saúde do Orçamento</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/70">Gastos vs Salário</span>
                <span className="text-muted-foreground">
                  {currentMonthData.salary > 0 
                    ? `${((currentMonthData.expenses / currentMonthData.salary) * 100).toFixed(0)}%` 
                    : 'Salário não registrado'}
                </span>
              </div>
              <Progress 
                value={currentMonthData.salary > 0 ? (currentMonthData.expenses / currentMonthData.salary) * 100 : 0} 
                className="h-1 bg-white/5"
                indicatorClassName={isOverSalary ? "bg-destructive" : "bg-primary"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/70">Gastos vs Receita Total</span>
                <span className="text-muted-foreground">
                  {currentMonthData.income > 0 
                    ? `${((currentMonthData.expenses / currentMonthData.income) * 100).toFixed(0)}%` 
                    : '0%'}
                </span>
              </div>
              <Progress 
                value={currentMonthData.income > 0 ? (currentMonthData.expenses / currentMonthData.income) * 100 : 0} 
                className="h-1 bg-white/5"
                indicatorClassName={isOverIncome ? "bg-destructive" : "bg-accent"}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-[9px] text-muted-foreground">
          <PiggyBank className="h-3 w-3 text-accent" />
          <span>Mantenha sua retenção acima de 20% para uma vida saudável.</span>
        </div>
      </CardContent>
    </Card>
  )
}
