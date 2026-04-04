"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "./add-transaction-modal"
import { TransactionsTable } from "./transactions-table"
import { AIInsightsPanel } from "./ai-insights-panel"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Progress } from "@/components/ui/progress"

const mockChartData = [
  { name: "Seg", income: 240, expense: 120 },
  { name: "Ter", income: 150, expense: 300 },
  { name: "Qua", income: 200, expense: 80 },
  { name: "Qui", income: 320, expense: 150 },
  { name: "Sex", income: 280, expense: 220 },
  { name: "Sab", income: 400, expense: 100 },
  { name: "Dom", income: 180, expense: 190 },
]

const budgetData = [
  { category: "Alimentação", limit: 800, spent: 540, color: "hsl(var(--primary))" },
  { category: "Transporte", limit: 300, spent: 285, color: "hsl(var(--accent))" },
  { category: "Lazer", limit: 400, spent: 120, color: "hsl(var(--chart-3))" },
]

export function DashboardOverview() {
  const [mounted, setMounted] = React.useState(false)
  const [transactions, setTransactions] = React.useState<any[]>([
    { id: 1, date: "2024-05-20", description: "Supermercado Mix", amount: -150.50, category: "Alimentação", type: "expense" },
    { id: 2, date: "2024-05-19", description: "Salário Mensal", amount: 5500.00, category: "Salário", type: "income" },
    { id: 3, date: "2024-05-18", description: "Uber Viagem", amount: -45.90, category: "Transporte", type: "expense" },
    { id: 4, date: "2024-05-17", description: "Restaurante Central", amount: -85.00, category: "Alimentação", type: "expense" },
  ])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0)
  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0)

  const handleAddTransaction = (newTx: any) => {
    setTransactions([ { ...newTx, id: Date.now() }, ...transactions ])
  }

  const formatCurrency = (value: number) => {
    if (!mounted) return "R$ --"
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-headline">Visão Geral</h2>
          <p className="text-sm text-muted-foreground">Saúde financeira em tempo real.</p>
        </div>
        <div className="flex items-center">
          <AddTransactionModal onAdd={handleAddTransaction} />
        </div>
      </div>

      {/* Stats Cards */}
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
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent font-medium">+12.5%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Receitas</CardTitle>
            <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-headline">{formatCurrency(income)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Acumulado este mês</p>
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
            <p className="text-[10px] text-muted-foreground mt-1">Gasto total este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-7">
        {/* Weekly Chart */}
        <Card className="xl:col-span-4 glass-morphism border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Atividade Semanal</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Ganhos e gastos nos últimos 7 dias.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pr-2">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData} margin={{ left: -10, right: 10 }}>
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
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={15} />
                  <Bar dataKey="expense" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Control */}
        <Card className="xl:col-span-3 glass-morphism border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Metas</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Limite por categoria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {budgetData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-white/90">{item.category}</span>
                  </div>
                  <span className="text-muted-foreground">
                    <span className="text-white font-semibold">{mounted ? `R$ ${item.spent}` : "R$ --"}</span> / {mounted ? `R$ ${item.limit}` : "R$ --"}
                  </span>
                </div>
                <Progress 
                  value={(item.spent / item.limit) * 100} 
                  className="h-1.5 bg-white/5" 
                  indicatorClassName={item.spent > item.limit * 0.9 ? "bg-destructive" : "bg-primary"}
                />
                {item.spent > item.limit * 0.9 && (
                  <div className="flex items-center gap-1 text-[9px] text-destructive font-bold uppercase tracking-tight">
                    <AlertCircle className="h-2.5 w-2.5" /> Atenção ao limite
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-[10px] h-8">
              Ajustar Orçamentos
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-7">
        {/* Transaction History */}
        <div className="xl:col-span-4 order-2 xl:order-1 overflow-x-auto">
          <TransactionsTable transactions={transactions} />
        </div>

        {/* AI Insights Sidebar */}
        <div className="xl:col-span-3 order-1 xl:order-2">
          <AIInsightsPanel transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
