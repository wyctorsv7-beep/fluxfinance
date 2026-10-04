
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { Loader2, LogOut, Wallet, Plus, Home, Target, Coins, User as UserIcon, Settings, Clock, ChevronLeft } from "lucide-react"
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
import { AddGoalModal } from "@/components/dashboard/add-goal-modal"
import { AddContributionModal } from "@/components/dashboard/add-contribution-modal"
import { ProfileSettingsModal } from "@/components/dashboard/profile-settings-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ContributionsPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()

  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false)
  const [isContributionModalOpen, setIsContributionModalOpen] = React.useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)

  const goalsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null
    return query(collection(firestore, "users", user.uid, "goals"))
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

  const getGoalTitle = (goalId: string) => {
    return goals?.find(g => g.id === goalId)?.title || "Meta Removida"
  }

  const formatDate = (dateValue: any) => {
    if (!dateValue) return ""
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString('pt-BR')
    }
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? dateValue : date.toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-lg transition-colors group"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary hidden sm:block">Voltar</span>
          </button>
        </div>

        <div className="flex-[2] flex items-center justify-center">
          <span className="text-base font-bold tracking-tighter text-white font-headline">
            Histórico de Aportes
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none group hover:bg-white/5 p-1 rounded-full transition-all">
                <div className="h-9 w-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-transparent text-xs font-bold text-primary uppercase">
                      {(user.displayName?.[0] || user.email?.[0] || <UserIcon className="h-4 w-4" />)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10 text-white" sideOffset={8}>
              <DropdownMenuLabel className="font-headline text-xs">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onSelect={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer focus:bg-white/10"
              >
                <Settings className="h-4 w-4 text-primary" />
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

      <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full pb-32">
        <Card className="glass-morphism border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Todos os Aportes
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Acompanhe cada centavo investido nos seus objetivos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {contributions && contributions.length > 0 ? (
              <div className="space-y-4">
                {contributions.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Coins className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {getGoalTitle(c.goalId)}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[9px] px-1.5 h-4 bg-white/5 text-muted-foreground font-normal border-white/10">
                            {formatDate(c.date)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-accent">
                        + {formatCurrency(c.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <Coins className="h-12 w-12 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nenhum aporte realizado ainda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modais Controlados */}
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
      <ProfileSettingsModal 
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        showTrigger={false}
      />

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-white/5 h-20 z-50 px-6 flex items-center justify-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] md:h-16">
        <div className="max-w-[400px] w-full flex items-center justify-between gap-4">
          <button 
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-all active:scale-90"
          >
            <Home className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-tighter">Início</span>
          </button>
          
          <div className="flex flex-col items-center justify-center -mt-10 md:-mt-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary glow-primary flex items-center justify-center text-white border-4 border-background shadow-2xl active:scale-95 transition-all cursor-pointer">
                  <Plus className="h-7 w-7 md:h-8 md:w-8" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 mb-4 glass-morphism border-white/10 text-white" sideOffset={10}>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">Ações Rápidas</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onSelect={() => {
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
                  className="flex items-center gap-2 cursor-pointer focus:bg-primary/20"
                >
                  <Coins className="h-4 w-4 text-primary" />
                  <span>Novo Aporte</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button 
            onClick={() => router.push("/contributions")}
            className="flex flex-col items-center gap-1 text-primary transition-all active:scale-90"
          >
            <Clock className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-tighter">Aportes</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
