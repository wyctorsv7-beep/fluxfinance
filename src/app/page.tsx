
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { Loader2, LogOut, Wallet, Lock, AlertCircle } from "lucide-react"
import { signOut } from "firebase/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background overflow-x-hidden">
      <header className="flex h-16 shrink-0 items-center border-b border-white/5 px-4 md:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex-1 flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-bold tracking-tighter text-white font-headline">
            Flux Finance
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none group hover:bg-white/5 p-1 rounded-full transition-all">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden group-hover:border-primary/50 transition-colors">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-transparent text-xs font-bold text-primary-foreground uppercase">
                      {(user.displayName?.[0] || user.email?.[0] || "U")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10 text-white">
              <DropdownMenuLabel className="font-headline">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="focus:bg-destructive/20 text-destructive focus:text-destructive cursor-pointer text-xs"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-[450px] glass-morphism border-white/10 shadow-2xl relative z-10 text-center py-8">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 mb-2">
              <Lock className="h-10 w-10 text-destructive animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-white font-headline">Acesso Encerrado</CardTitle>
            <CardDescription className="text-muted-foreground text-base px-4">
              O período de teste gratuito do Flux Finance chegou ao fim para esta conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-start gap-3 text-left">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-white/80 leading-relaxed">
                Agradecemos por utilizar nossa plataforma. Para continuar gerenciando suas finanças com inteligência, entre em contato com o administrador ou aguarde novas atualizações.
              </p>
            </div>
            
            <Button 
              onClick={handleLogout}
              className="w-full bg-primary hover:bg-primary/90 glow-primary font-bold h-12 text-base"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair da Conta
            </Button>
            
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pt-4">
              Flux Finance • Smart Management
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
