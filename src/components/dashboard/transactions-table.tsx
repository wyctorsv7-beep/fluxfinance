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
    <Card className="glass-morphism border-white/5 w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-white">Transações</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Atividades recentes.</CardDescription>
        </div>
        <div className="relative w-full sm:max-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 h-9 text-sm bg-white/5 border-white/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-xs">Item</TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right text-xs">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                  <TableCell className="py-3 px-4 sm:px-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                        tx.type === 'income' ? 'bg-accent/10' : 'bg-primary/10'
                      }`}>
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-accent" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate max-w-[120px] xs:max-w-[200px]">{tx.description}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {formatDate(tx.date)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] text-muted-foreground font-normal px-2 py-0 h-5">
                      {tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-3 px-4 sm:px-0">
                    <span className={`text-sm font-bold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-accent' : 'text-white'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} R$ {formatCurrency(tx.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            Nenhuma transação encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
