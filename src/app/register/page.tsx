
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { Wallet, Loader2, Mail, Lock, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      })
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Atualiza o perfil com o nome fornecido
      await updateProfile(userCredential.user, { displayName: name })
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[400px] z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary glow-primary text-white mb-4">
            <Wallet className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white font-headline">Flux Finance</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Smart Money Management</p>
        </div>

        <Card className="glass-morphism border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Criar Conta</CardTitle>
            <CardDescription>Junte-se ao Flux Finance hoje mesmo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Nome Completo" 
                    className="pl-10 bg-white/5 border-white/10" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    className="pl-10 bg-white/5 border-white/10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Senha" 
                    className="pl-10 bg-white/5 border-white/10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-accent font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Começar Agora"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Gestão financeira simplificada para você focar no que realmente importa.
          </p>
        </div>
      </div>
    </div>
  )
}
