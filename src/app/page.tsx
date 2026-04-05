
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { DashboardOverview } from "@/components/dashboard/overview"
import { Loader2, LogOut, User, Settings, Wallet } from "lucide-react"
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
      <header className="flex h-16 shrink-0 items-center border-b border-white/5 px-4 md:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        {/* Coluna Esquerda: Espaçador */}
        <div className="flex-1" />

        {/* Coluna Central: Nome do Aplicativo Centralizado */}
        <div className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tighter text-white font-headline">
            Flux Finance
          </span>
        </div>

        {/* Coluna Direita: Perfil do Usuário com Nome visível */}
        <div className="flex items-center justify-end flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 outline-none group hover:bg-white/5 p-1.5 rounded-full transition-all pr-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden group-hover:border-primary/50 transition-colors">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-transparent text-xs font-bold text-primary-foreground uppercase">
                      {(user.displayName?.[0] || user.email?.[0] || "U")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate max-w-[150px]">
                    {user.displayName || "Usuário"}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10 text-white">
              <DropdownMenuLabel className="font-headline">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="focus:bg-destructive/20 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <DashboardOverview />
      </main>
    </div>
  )
}
