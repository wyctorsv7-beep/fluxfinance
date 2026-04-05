"use client"

import * as React from "react"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Loader2 } from "lucide-react"
import { AddTransactionModal } from "./add-transaction-modal"
import { AddBudgetModal } from "./add-budget-modal"
import { TransactionsTable } from "./transactions-table"
import { MonthlySummary } from "./monthly-summary"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Progress } from "@/components/ui/progress"

export function DashboardOverview() {
  const { user } = useUser()
  const firestore = useFirestore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null
    return query(
      collection(firestore, "users", user.uid, "transactions"),
      orderBy("transactionDate", "desc")
    )
  }, [firestore, user?.uid])

  const budgetsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null
    return collection(firestore, "users", user.uid, "budgets")
  }, [firestore, user?.uid])

  const { data: transactions, isLoading: isTxLoading } = useCollection(transactionsQuery)
  const { data: budgets, isLoading: isBudgetsLoading } = useCollection(budgetsQuery)

  const balance = React.useMemo(() => {
    if (!transactions) return 0
    return transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  }, [transactions])

  const income = React.useMemo(() => {
    if (!transactions) return 0
    return transactions
      .filter(t => (Number(t.amount) || 0) > 0)
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  }, [transactions])

  const expense = React.useMemo(() => {
    if (!transactions) return 0
    return transactions
      .filter(t => (Number(t.amount) || 0) < 0)
      .reduce((acc, curr) => acc + Math.abs(Number(curr.amount) || 0), 0)
  }, [transactions])

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (isTxLoading && !transactions) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const chartData = [
    { name: "Total", income: income, expense: expense }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-headline">Visão Geral</h2>
          <p className="text-sm text-muted-foreground">Saúde financeira baseada em seus dados reais.</p>
        </div>
        <div className="flex items-center">
          <AddTransactionModal />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-morphism border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(balance)}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary font-medium">Atualizado agora</span>
            </p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Receitas</CardTitle>
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(income)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Despesas</CardTitle>
            <div className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(expense)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total de gastos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="glass-morphism border-white/5 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Resumo Financeiro</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Comparativo entre ganhos e gastos.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0 pr-2">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => mounted ? `R$${value}` : ""}
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="income" name="Receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="expense" name="Despesa" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <MonthlySummary 
            transactions={transactions || []} 
            budgets={budgets || []} 
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionsTable transactions={transactions || []} />
        </div>
        <div className="lg:col-span-1">
          <Card className="glass-morphism border-white/5 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Orçamentos</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Controle de limites por categoria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {budgets && budgets.length > 0 ? budgets.map((budget) => {
                const spentInCategory = transactions?.filter(t => (t.category === budget.categoryId || t.categoryId === budget.categoryId) && (Number(t.amount) || 0) < 0)
                  .reduce((acc, curr) => acc + Math.abs(Number(curr.amount) || 0), 0) || 0;
                const budgetAmount = Number(budget.amount) || 1;
                const percent = Math.min((spentInCategory / budgetAmount) * 100, 100);

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="font-medium text-white/90">{budget.categoryId}</span>
                      </div>
                      <span className="text-muted-foreground">
                        <span className="text-white font-semibold">{formatCurrency(spentInCategory)}</span> / {formatCurrency(budgetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={percent} 
                      className="h-1.5 bg-white/5" 
                      indicatorClassName={(spentInCategory / budgetAmount) > 0.9 ? "bg-destructive" : "bg-primary"}
                    />
                    {(spentInCategory / budgetAmount) > 0.9 && (
                      <div className="flex items-center gap-1 text-[9px] text-destructive font-bold uppercase tracking-tight">
                        <AlertCircle className="h-2.5 w-2.5" /> Atenção ao limite
                      </div>
                    )}
                  </div>
                )
              }) : (
                <div className="text-center py-10">
                  <p className="text-xs text-muted-foreground">Nenhum orçamento definido.</p>
                </div>
              )}
              <AddBudgetModal />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
