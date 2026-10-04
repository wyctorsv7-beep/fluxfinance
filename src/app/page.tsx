
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { Loader2, LogOut, Wallet, LayoutDashboard, Target, Home } from "lucide-react"
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
import { DashboardOverview } from "@/components/dashboard/overview"

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
    <div className="flex min-h-screen w-full flex-col bg-background overflow-x-hidden relative">
      <header className="flex h-16 shrink-0 items-center border-b border-white/5 px-4 md:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex-1 flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-base font-bold tracking-tighter text-white font-headline">
            Flux Finance
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none group hover:bg-white/5 p-1 rounded-full transition-all">
                <span className="text-xs font-medium text-white/70 hidden sm:block group-hover:text-white transition-colors">
                  {user.displayName || user.email}
                </span>
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
                className="focus:bg-destructive/20 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-32">
        <DashboardOverview />
      </main>

      {/* Fixed Bottom Header */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-white/5 h-20 z-50 px-6 flex items-center justify-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <div className="max-w-md w-full flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 text-primary transition-all active:scale-90">
            <Home className="h-6 w-6" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Início</span>
          </button>
          
          <div className="flex flex-col items-center justify-center -mt-10">
            <div className="h-14 w-14 rounded-full bg-primary glow-primary flex items-center justify-center text-white border-4 border-background shadow-2xl active:scale-90 transition-all cursor-pointer">
              <Target className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter mt-2 text-white">Minhas Metas</span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-all active:scale-90"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Sair</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
