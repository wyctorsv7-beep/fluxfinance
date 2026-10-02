
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Target, Loader2, Plus } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const formSchema = z.object({
  title: z.string().min(2, "Título curto demais"),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Meta deve ser maior que zero"),
  initialAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Valor inicial não pode ser negativo"),
})

export function AddGoalModal() {
  const { user } = useUser()
  const firestore = useFirestore()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetAmount: "",
      initialAmount: "0",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.uid || !firestore) return

    setIsSubmitting(true)
    const goalsRef = collection(firestore, "users", user.uid, "goals")
    
    addDocumentNonBlocking(goalsRef, {
      userId: user.uid,
      title: values.title,
      targetAmount: Number(values.targetAmount),
      initialAmount: Number(values.initialAmount),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).then(() => {
      setOpen(false)
      form.reset()
      toast({ title: "Meta criada!", description: `${values.title} foi adicionada aos seus objetivos.` })
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary glow-primary text-white hover:bg-primary/90 flex gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold">Criar Nova Meta</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Defina o que você quer conquistar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem, Carro, Reserva..." {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Meta (R$)</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quanto você já tem? (R$)</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Começar Meta"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
