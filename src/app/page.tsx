"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardOverview } from "@/components/dashboard/overview"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-accent" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-foreground/90 font-headline uppercase">Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              {user.displayName || user.email || "Convidado"}
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-xs font-bold text-primary-foreground uppercase">
                {(user.displayName?.[0] || user.email?.[0] || "U")}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-8 p-4 md:p-8">
          <DashboardOverview />
        </main>
      </SidebarInset>
    </div>
  )
}
