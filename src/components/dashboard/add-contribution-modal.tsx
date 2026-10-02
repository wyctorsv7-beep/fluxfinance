
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Coins, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const formSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  goalId: z.string().min(1, "Selecione uma meta"),
})

export function AddContributionModal({ goals }: { goals: any[] }) {
  const { user } = useUser()
  const firestore = useFirestore()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0,00",
      goalId: "",
    },
  })

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const numberValue = parseInt(digits || "0")
    return (numberValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })
  }

  const parseCurrency = (value: string) => {
    return Number(value.replace(/\./g, "").replace(",", "."))
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.uid || !firestore) return

    const amount = parseCurrency(values.amount)
    if (amount <= 0) {
      form.setError("amount", { message: "Valor deve ser maior que zero" })
      return
    }

    setIsSubmitting(true)
    const contributionsRef = collection(firestore, "users", user.uid, "contributions")
    
    addDocumentNonBlocking(contributionsRef, {
      userId: user.uid,
      goalId: values.goalId,
      amount: amount,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    }).then(() => {
      setOpen(false)
      form.reset()
      toast({ title: "Aporte registrado!", description: "Seu progresso foi atualizado." })
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 flex gap-2">
          <Coins className="h-4 w-4" />
          Novo Aporte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold">Adicionar Valor</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Quanto você deseja somar à sua meta hoje?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="goalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha a Meta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder={goals.length > 0 ? "Selecione uma meta" : "Nenhuma meta criada"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-white/10">
                      {goals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                      ))}
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
                  <FormLabel>Valor do Aporte (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                      className="bg-white/5 border-white/10" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4" disabled={isSubmitting || goals.length === 0}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Somar à Meta"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
