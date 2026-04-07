
"use client"

import * as React from "react"
import { Wallet, UserX, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[400px] z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-white/5 text-muted-foreground mb-4">
            <UserX className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white font-headline text-muted-foreground">Flux Finance</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Registros Encerrados</p>
        </div>

        <Card className="glass-morphism border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-white">Novas Contas Desativadas</CardTitle>
            <CardDescription>
              A criação de novas contas para o Flux Finance não está mais disponível.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-white/80 leading-relaxed">
                Este ambiente de testes foi finalizado. O banco de dados e os serviços de autenticação foram migrados para uma versão privada.
              </p>
            </div>
            
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
              <Link href="/login">Ir para Login</Link>
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t border-white/5 pt-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Flux Finance • Versão Experimental
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
