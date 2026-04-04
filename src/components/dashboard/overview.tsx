"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Plus, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Cell
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white font-headline">Visão Geral</h2>
          <p className="text-muted-foreground">Monitore sua saúde financeira em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddTransactionModal onAdd={handleAddTransaction} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-morphism border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-headline">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent font-medium">+12.5%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Receitas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-headline">{formatCurrency(income)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado este mês</p>
          </CardContent>
        </Card>
        <Card className="glass-morphism border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Despesas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-headline">{formatCurrency(expense)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total gasto este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Chart */}
        <Card className="lg:col-span-4 glass-morphism border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Atividade Semanal</CardTitle>
            <CardDescription className="text-muted-foreground">Comparativo de ganhos e gastos nos últimos 7 dias.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
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
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Control */}
        <Card className="lg:col-span-3 glass-morphism border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Metas e Orçamentos</CardTitle>
            <CardDescription className="text-muted-foreground">Progresso do limite por categoria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {budgetData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-white/90">{item.category}</span>
                  </div>
                  <span className="text-muted-foreground">
                    <span className="text-white">{mounted ? `R$ ${item.spent}` : "R$ --"}</span> / {mounted ? `R$ ${item.limit}` : "R$ --"}
                  </span>
                </div>
                <Progress 
                  value={(item.spent / item.limit) * 100} 
                  className="h-2 bg-white/5" 
                  indicatorClassName={item.spent > item.limit * 0.9 ? "bg-destructive" : "bg-primary"}
                />
                {item.spent > item.limit * 0.9 && (
                  <div className="flex items-center gap-1 text-[10px] text-destructive font-semibold uppercase tracking-tight">
                    <AlertCircle className="h-3 w-3" /> Quase no limite!
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-xs">
              Configurar Novos Orçamentos
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Transaction History */}
        <div className="lg:col-span-4">
          <TransactionsTable transactions={transactions} />
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-3">
          <AIInsightsPanel transactions={transactions} />
        </div>
      </div>
    </div>
  )
}