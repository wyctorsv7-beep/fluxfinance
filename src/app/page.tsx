
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { Loader2, LogOut, Wallet, Plus, Home, Target, Coins } from "lucide-react"
import { signOut } from "firebase/auth"
import { collection, query, orderBy } from "firebase/firestore"
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
import { AddGoalModal } from "@/components/dashboard/add-goal-modal"
import { AddContributionModal } from "@/components/dashboard/add-contribution-modal"

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()

  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false)
  const [isContributionModalOpen, setIsContributionModalOpen] = React.useState(false)

  const goalsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null
    return query(
      collection(firestore, "users", user.uid, "goals"),
      orderBy("createdAt", "desc")
    )
  }, [firestore, user?.uid])

  const contributionsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null
    return query(
      collection(firestore, "users", user.uid, "contributions"),
      orderBy("date", "desc")
    )
  }, [firestore, user?.uid])

  const { data: goals, isLoading: isGoalsLoading } = useCollection(goalsQuery)
  const { data: contributions, isLoading: isContLoading } = useCollection(contributionsQuery)

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

  if (isUserLoading || !user || isGoalsLoading || isContLoading) {
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
        <DashboardOverview goals={goals || []} contributions={contributions || []} />
      </main>

      {/* Modais Controlados - Renderizados fora do menu para evitar conflitos de foco */}
      <AddGoalModal 
        open={isGoalModalOpen} 
        onOpenChange={setIsGoalModalOpen} 
        showTrigger={false} 
      />
      <AddContributionModal 
        goals={goals || []} 
        open={isContributionModalOpen} 
        onOpenChange={setIsContributionModalOpen} 
        showTrigger={false} 
      />

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-white/5 h-20 z-50 px-6 flex items-center justify-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <div className="max-w-md w-full flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 text-primary transition-all active:scale-90">
            <Home className="h-6 w-6" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Início</span>
          </button>
          
          <div className="flex flex-col items-center justify-center -mt-12">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-16 w-16 rounded-full bg-primary glow-primary flex items-center justify-center text-white border-4 border-background shadow-2xl active:scale-95 transition-all cursor-pointer">
                  <Plus className="h-8 w-8" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 mb-4 glass-morphism border-white/10 text-white" sideOffset={10}>
                <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">O que deseja fazer?</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onSelect={() => {
                    // Timeout garante que o menu feche antes do modal abrir, evitando travamento da UI
                    setTimeout(() => setIsGoalModalOpen(true), 150)
                  }}
                  className="flex items-center gap-2 cursor-pointer focus:bg-primary/20"
                >
                  <Target className="h-4 w-4 text-primary" />
                  <span>Nova Meta</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => {
                    setTimeout(() => setIsContributionModalOpen(true), 150)
                  }}
                  className="flex items-center gap-2 cursor-pointer focus:bg-accent/20"
                >
                  <Coins className="h-4 w-4 text-accent" />
                  <span>Novo Aporte</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
