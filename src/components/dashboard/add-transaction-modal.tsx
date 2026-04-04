
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Sparkles, Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { extractTransactionDetails } from "@/ai/flows/smart-transaction-entry-flow"
import { useUser, useFirestore } from "@/firebase"
import { collection, serverTimestamp, doc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const formSchema = z.object({
  description: z.string().min(2, "Descrição curta demais"),
  amount: z.string().refine((val) => !isNaN(Number(val)), "Valor inválido"),
  category: z.string().min(1, "Selecione uma categoria"),
  type: z.enum(["income", "expense"]),
  date: z.string(),
})

export function AddTransactionModal() {
  const { user } = useUser()
  const firestore = useFirestore()
  const [open, setOpen] = React.useState(false)
  const [isAiLoading, setIsAiLoading] = React.useState(false)
  const [smartInput, setSmartInput] = React.useState("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "Outros",
      type: "expense",
      date: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      form.setValue("date", new Date().toISOString().split('T')[0])
    }
  }, [open, form])

  async function handleSmartEntry() {
    if (!smartInput) return
    setIsAiLoading(true)
    try {
      const result = await extractTransactionDetails({ transactionDescription: smartInput })
      if (result) {
        form.setValue("description", result.description)
        form.setValue("amount", Math.abs(result.amount).toString())
        form.setValue("category", result.suggestedCategory || "Outros")
        form.setValue("type", result.amount > 0 ? "income" : "expense")
        toast({
          title: "Inteligência Artificial aplicada!",
          description: "Dados extraídos com sucesso do seu texto.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na IA",
        description: "Não conseguimos processar o texto agora.",
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.uid || !firestore) return

    const amountValue = values.type === 'expense' ? -Math.abs(Number(values.amount)) : Math.abs(Number(values.amount))
    
    const transactionsRef = collection(firestore, "users", user.uid, "transactions")
    
    addDocumentNonBlocking(transactionsRef, {
      userId: user.uid,
      description: values.description,
      amount: amountValue,
      categoryId: values.category,
      category: values.category, // Storing both for flexibility
      type: values.type,
      transactionDate: values.date,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    setOpen(false)
    form.reset()
    setSmartInput("")
    toast({
      title: "Transação adicionada!",
      description: "Seu saldo foi atualizado em tempo real.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary glow-primary text-white hover:bg-primary/90 flex gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold">Adicionar Transação</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escolha o método manual ou deixe a IA fazer por você.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="manual" className="data-[state=active]:bg-primary/20">Manual</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-accent/20 flex gap-2">
              <Sparkles className="h-3 w-3 text-accent" /> Inteligente
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-4 space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-white/10">
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input placeholder="0,00" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Supermercado, Aluguel..." {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-white/10">
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Moradia">Moradia</SelectItem>
                          <SelectItem value="Salário">Salário</SelectItem>
                          <SelectItem value="Investimento">Investimento</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Salvar Transação</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ai" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-xs text-accent font-medium mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Wand2 className="h-3 w-3" /> Como funciona?
                </p>
                <p className="text-sm text-muted-foreground">
                  Digite algo como: "Gastei 50 reais com pizza ontem à noite" ou "Recebi 3000 de salário hoje".
                </p>
              </div>
              <Textarea 
                placeholder="Descreva sua transação..." 
                className="bg-white/5 border-white/10 min-h-[100px] text-white"
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
              />
              <Button 
                onClick={handleSmartEntry} 
                disabled={isAiLoading || !smartInput}
                className="w-full bg-accent glow-accent text-accent-foreground font-semibold hover:bg-accent/90"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Processar com IA
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                A IA irá preencher o formulário manual para sua conferência.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
