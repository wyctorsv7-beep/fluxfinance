"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Settings,
  Target,
  Sparkles,
  Wallet,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Receitas", icon: ArrowUpRight, isActive: false },
  { title: "Despesas", icon: ArrowDownRight, isActive: false },
  { title: "Orçamentos", icon: Target, isActive: false },
  { title: "Relatórios", icon: PieChart, isActive: false },
  { title: "IA Insights", icon: Sparkles, isActive: false, isAi: true },
]

export function AppSidebar() {
  const { user } = useUser()
  const auth = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  return (
    <Sidebar className="border-r border-white/5">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tighter text-white font-headline">Flux Finance</span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">Smart Finance</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarMenu className="mt-4 gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
                className={`transition-all duration-200 hover:scale-[1.02] ${
                  item.isActive 
                    ? "bg-primary/20 text-white font-medium border border-primary/20" 
                    : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                }`}
              >
                <a href="#" className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${item.isAi ? "text-accent animate-pulse" : ""}`} />
                  <span className="text-sm">{item.title}</span>
                  {item.isAi && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-accent animate-ping" />
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator className="bg-white/5 mx-4" />
      <SidebarFooter className="p-4 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2 mb-2 overflow-hidden">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                {user.displayName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {user.displayName || "Usuário"}
              </span>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
