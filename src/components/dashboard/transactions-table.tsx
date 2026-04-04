"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TransactionsTable({ transactions }: { transactions: any[] }) {
  const [filter, setFilter] = React.useState("")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) ||
    t.category.toLowerCase().includes(filter.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    if (!mounted) return ""
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (amount: number) => {
    if (!mounted) return "--"
    return Math.abs(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  return (
    <Card className="glass-morphism border-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-white">Transações Recentes</CardTitle>
          <CardDescription className="text-muted-foreground">Últimas atividades registradas.</CardDescription>
        </div>
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 bg-white/5 border-white/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Transação</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Categoria</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tx) => (
              <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-accent/10' : 'bg-primary/10'
                    }`}>
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{tx.description}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-muted-foreground font-normal">
                    {tx.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-accent' : 'text-white'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'} R$ {formatCurrency(tx.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            Nenhuma transação encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  )
}