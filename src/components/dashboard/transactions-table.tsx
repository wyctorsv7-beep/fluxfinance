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
    t.description?.toLowerCase().includes(filter.toLowerCase()) ||
    t.category?.toLowerCase().includes(filter.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    if (!mounted || !dateStr) return ""
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const formatCurrency = (amount: number) => {
    if (!mounted) return "--"
    return Math.abs(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Card className="glass-morphism border-white/5 w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-6">
        <div className="space-y-0.5">
          <CardTitle className="text-base md:text-lg font-semibold text-white">Transações</CardTitle>
          <CardDescription className="text-[10px] md:text-xs text-muted-foreground">Atividades recentes.</CardDescription>
        </div>
        <div className="relative w-full sm:max-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 h-8 text-xs bg-white/5 border-white/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-[10px] uppercase px-4 h-10">Item</TableHead>
                <TableHead className="text-muted-foreground font-medium text-[10px] uppercase px-4 h-10 hidden xs:table-cell">Categoria</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right text-[10px] uppercase px-4 h-10">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                  <TableCell className="py-2.5 px-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`h-7 w-7 md:h-8 md:w-8 shrink-0 rounded-full flex items-center justify-center ${
                        (Number(tx.amount) || 0) > 0 ? 'bg-accent/10' : 'bg-primary/10'
                      }`}>
                        {(Number(tx.amount) || 0) > 0 ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs md:text-sm font-medium text-white truncate max-w-[100px] sm:max-w-[180px] md:max-w-[250px]">
                          {tx.description}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                          {formatDate(tx.transactionDate || tx.date)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xs:table-cell px-4">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] md:text-[9px] text-muted-foreground font-normal px-1.5 py-0 h-4 md:h-5">
                      {tx.category || "Outros"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-2.5 px-4">
                    <span className={`text-xs md:text-sm font-bold whitespace-nowrap ${
                      (Number(tx.amount) || 0) > 0 ? 'text-accent' : 'text-white'
                    }`}>
                      {(Number(tx.amount) || 0) > 0 ? '+' : '-'} R$ {formatCurrency(tx.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-[10px]">
            Nenhuma transação encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  )
}