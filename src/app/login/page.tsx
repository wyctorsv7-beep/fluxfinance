
"use client"

import * as React from "react"
import { Wallet, Lock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[400px] z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-white/5 text-muted-foreground mb-4">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white font-headline text-muted-foreground">Flux Finance</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Acesso Suspenso</p>
        </div>

        <Card className="glass-morphism border-destructive/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold text-white">Login Indisponível</CardTitle>
            <CardDescription className="text-muted-foreground">
              O período de demonstração deste projeto foi encerrado. Não é mais possível realizar login nesta aplicação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-sm text-center text-white/70">
              Agradecemos o interesse no Flux Finance. Para mais informações, entre em contato com o desenvolvedor.
            </div>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
              <Link href="https://github.com">Voltar ao Portfólio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
