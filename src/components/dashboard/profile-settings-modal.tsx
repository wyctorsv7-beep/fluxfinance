
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
  newPassword: z.string().transform(val => val === "" ? undefined : val).pipe(z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional()),
})

interface ProfileSettingsModalProps {
  trigger?: React.ReactNode
}

export function ProfileSettingsModal({ trigger }: ProfileSettingsModalProps) {
  const { user } = useUser()
  const auth = useAuth()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
    },
  })

  // Sincroniza os valores quando o modal abre
  React.useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        newPassword: "",
      })
    }
  }, [open, user, form])

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    const currentUser = auth.currentUser
    if (!currentUser) return

    setIsLoading(true)
    try {
      const promises = []

      // Atualiza nome
      if (values.name && values.name !== currentUser.displayName) {
        promises.push(updateProfile(currentUser, { displayName: values.name }))
      }

      // Atualiza email
      if (values.email && values.email !== currentUser.email) {
        promises.push(updateEmail(currentUser, values.email))
      }

      // Atualiza senha
      if (values.newPassword) {
        promises.push(updatePassword(currentUser, values.newPassword))
      }

      if (promises.length > 0) {
        await Promise.all(promises)
        toast({
          title: "Perfil atualizado!",
          description: "Suas alterações foram salvas com sucesso.",
        })
      } else {
        toast({
          description: "Nenhuma alteração foi detectada.",
        })
      }
      
      setOpen(false)
      form.setValue("newPassword", "") // Limpa campo de senha
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      let description = "Ocorreu um erro ao salvar as alterações."
      
      if (error.code === 'auth/requires-recent-login') {
        description = "Por segurança, esta ação requer que você faça login novamente antes de alterar e-mail ou senha."
      } else if (error.message) {
        description = error.message
      }

      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="w-full justify-start gap-2 text-xs h-8 px-2 font-normal">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] glass-morphism border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold">Configurações de Perfil</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Altere seus dados de acesso e identificação.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input {...field} className="pl-10 bg-white/5 border-white/10" />
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
                      <Input type="email" {...field} className="pl-10 bg-white/5 border-white/10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
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
                        value={field.value || ""}
                        className="pl-10 bg-white/5 border-white/10" 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
