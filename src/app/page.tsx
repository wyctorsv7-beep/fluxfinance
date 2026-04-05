
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
import { ProfileSettingsModal } from "@/components/dashboard/profile-settings-modal"

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

        <div className="flex-none flex items-center justify-center">
          <span className="text-sm font-bold tracking-tighter text-white font-headline">
            Flux Finance
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none group hover:bg-white/5 p-1 rounded-full transition-all md:pr-4">
                <div className="flex flex-col items-end text-right hidden sm:flex">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate max-w-[120px]">
                    {user.displayName || "Usuário"}
                  </span>
                </div>
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
              
              <ProfileSettingsModal 
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-white/10 cursor-pointer text-xs">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                }
              />
              
              <ProfileSettingsModal 
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-white/10 cursor-pointer text-xs">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                }
              />
              
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
      <main className="flex-1 space-y-4 md:space-y-6 p-3 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <DashboardOverview />
      </main>
    </div>
  )
}
