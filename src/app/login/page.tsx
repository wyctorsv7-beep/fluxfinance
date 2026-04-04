"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth"
import { Wallet, Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)
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

  const handleEmailAuth = async (mode: 'login' | 'register') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha e-mail e senha.",
      })
      return
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na autenticação",
        description: error.message || "Ocorreu um erro ao tentar entrar.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousAuth = async () => {
    setIsLoading(true)
    try {
      await signInAnonymously(auth)
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível entrar como convidado.",
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
      {/* Background Decorative Elements */}
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
            <CardTitle className="text-xl font-bold text-white">Bem-vindo</CardTitle>
            <CardDescription>Escolha como deseja acessar sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-0">
                <div className="space-y-4">
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
                    className="w-full bg-primary hover:bg-primary/90 glow-primary" 
                    onClick={() => handleEmailAuth('login')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acessar Dashboard"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-0">
                <div className="space-y-4">
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
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-accent font-semibold" 
                    onClick={() => handleEmailAuth('register')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Minha Conta"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:bg-white/5 text-muted-foreground"
              onClick={handleAnonymousAuth}
              disabled={isLoading}
            >
              Entrar como Convidado
            </Button>
          </CardFooter>
        </Card>

        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Flux Finance utiliza <span className="text-accent font-medium">Inteligência Artificial</span> para categorizar seus gastos e oferecer insights personalizados para sua saúde financeira.
          </p>
        </div>
      </div>
    </div>
  )
}
