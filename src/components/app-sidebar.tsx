"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Settings,
  Target,
  Sparkles,
  Wallet
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

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Receitas", icon: ArrowUpRight, isActive: false },
  { title: "Despesas", icon: ArrowDownRight, isActive: false },
  { title: "Orçamentos", icon: Target, isActive: false },
  { title: "Relatórios", icon: PieChart, isActive: false },
  { title: "IA Insights", icon: Sparkles, isActive: false, isAi: true },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/5">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tighter text-white font-headline">Meu Bolso</span>
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
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}