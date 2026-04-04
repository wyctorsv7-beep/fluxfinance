"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Loader2, Lightbulb, ChevronRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { personalizeSpendingInsights, type PersonalizedSpendingInsightsOutput } from "@/ai/flows/personalized-spending-insights-flow"

export function AIInsightsPanel({ transactions }: { transactions: any[] }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [insights, setInsights] = React.useState<PersonalizedSpendingInsightsOutput | null>(null)
  const { toast } = useToast()

  async function generateInsights() {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "Dados insuficientes",
        description: "Adicione algumas transações primeiro para que possamos analisá-las.",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await personalizeSpendingInsights({
        transactions: transactions.map(t => ({
          date: t.transactionDate || t.date || new Date().toISOString().split('T')[0],
          description: t.description || "Sem descrição",
          amount: Number(t.amount) || 0,
          type: t.type || (Number(t.amount) >= 0 ? 'income' : 'expense'),
          category: t.category || t.categoryId || "Geral"
        }))
      })
      setInsights(result)
    } catch (error: any) {
      console.error("AI Error:", error)
      toast({
        variant: "destructive",
        title: "Erro no Advisor",
        description: "Não conseguimos analisar seus dados agora. Tente novamente em instantes.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass-morphism border-accent/20 h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-md bg-accent glow-accent">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
          </div>
          <CardTitle className="text-lg font-headline font-bold text-white">Assistente de Insights</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">Analise seus padrões com Inteligência Artificial.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!insights ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <Lightbulb className="h-8 w-8 text-accent animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Pronto para otimizar?</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">Clique no botão abaixo para receber dicas personalizadas sobre seus gastos.</p>
            </div>
            <Button 
              onClick={generateInsights} 
              disabled={isLoading}
              className="w-full bg-accent glow-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando dados...
                </>
              ) : (
                "Gerar Insights com IA"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Sumário Geral</h4>
              <p className="text-sm text-white/90 leading-relaxed italic border-l-2 border-accent/50 pl-3">
                "{insights.overallSummary}"
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Dicas de Economia</h4>
              <div className="grid gap-2">
                {insights.savingSuggestions.slice(0, 3).map((suggestion, idx) => (
                  <div key={idx} className="flex gap-2 p-3 rounded-lg bg-white/5 border border-white/5 items-start group hover:border-accent/30 transition-colors">
                    <TrendingUp className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Otimização de Orçamento</h4>
              <div className="grid gap-2">
                {insights.budgetOptimizationTips.slice(0, 2).map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                    <ChevronRight className="h-3 w-3 text-accent" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setInsights(null)} 
              className="w-full border-white/10 hover:bg-white/5 text-xs text-muted-foreground"
            >
              Nova Análise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
