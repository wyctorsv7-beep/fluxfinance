
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Settings, Loader2, User, Mail, Lock } from "lucide-react"
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
import { useAuth, useUser } from "@/firebase"
import { updateProfile, updateEmail, updatePassword } from "firebase/auth"

const profileFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional(),
})

interface ProfileSettingsModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  trigger?: React.ReactNode
}

export function ProfileSettingsModal({ open, onOpenChange, showTrigger = true, trigger }: ProfileSettingsModalProps) {
  const { user } = useUser()
  const auth = useAuth()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  React.useEffect(() => {
    if (isOpen && user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        password: "",
      })
    }
  }, [isOpen, user, form])

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    const currentUser = auth.currentUser
    if (!currentUser) {
      toast({ variant: "destructive", title: "Erro", description: "Usuário não autenticado." })
      return
    }

    setIsLoading(true)
    try {
      const promises = []

      if (values.name !== currentUser.displayName) {
        promises.push(updateProfile(currentUser, { displayName: values.name }))
      }

      if (values.email !== currentUser.email) {
        promises.push(updateEmail(currentUser, values.email))
      }

      if (values.password && values.password.length >= 6) {
        promises.push(updatePassword(currentUser, values.password))
      }

      if (promises.length > 0) {
        await Promise.all(promises)
        toast({ title: "Sucesso", description: "Dados atualizados com sucesso!" })
      }
      
      setIsOpen(false)
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      let msg = "Erro ao salvar alterações."
      if (error.code === 'auth/requires-recent-login') {
        msg = "Por segurança, faça login novamente para alterar e-mail ou senha."
      } else {
        msg = error.message || msg
      }
      toast({ variant: "destructive", title: "Erro", description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" className="w-full justify-start gap-2 text-xs h-8 px-2 font-normal">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[400px] glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold">Configurações de Perfil</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Mantenha seus dados atualizados para uma melhor experiência.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input 
                        {...field} 
                        className="pl-10 bg-white/5 border-white/10" 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="pl-10 bg-white/5 border-white/10" 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha (opcional)</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Mínimo 6 caracteres" 
                        {...field} 
                        className="pl-10 bg-white/5 border-white/10" 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2 font-bold" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
