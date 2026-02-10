"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Headphones,
  Gamepad2,
  Server,
  Package,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { cn } from "@/lib/utils"

const storeTypes = [
  { id: "digital", label: "Produtos digitais", icon: FileText },
  { id: "services", label: "Serviços", icon: Headphones },
  { id: "game-accounts", label: "Contas de jogos", icon: Gamepad2 },
  { id: "fivem", label: "FiveM / GTA RP", icon: Server },
  { id: "other", label: "Outros", icon: Package },
]

export default function OnboardingStorePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    type: "",
  })

  function handleNameChange(value: string) {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
    setForm((prev) => ({
      ...prev,
      name: value,
      subdomain: slug,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Placeholder: integrate with backend
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    router.push("/onboarding/success")
  }

  return (
    <>
      <OnboardingStepper currentStep={1} />
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Configure sua loja
          </h1>
          <p className="mt-2 text-muted-foreground">
            Defina as informações básicas da sua loja.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="storeName">Nome da loja</Label>
            <Input
              id="storeName"
              placeholder="Minha Loja Digital"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subdomain">Subdomínio</Label>
            <div className="flex items-center gap-0">
              <Input
                id="subdomain"
                value={form.subdomain}
                onChange={(e) => setForm((prev) => ({ ...prev, subdomain: e.target.value }))}
                className="rounded-r-none"
                required
              />
              <span className="flex h-9 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                .nexshop.com.br
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="currency">Moeda</Label>
            <Input id="currency" value="BRL (R$)" disabled className="bg-muted" />
          </div>

          <div className="flex flex-col gap-3">
            <Label>Tipo da loja</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {storeTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: type.id }))}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-sm",
                    form.type === type.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <type.icon className="h-6 w-6" />
                  <span className="text-xs font-medium leading-tight">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => router.push("/onboarding/plan")}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" className="gap-2" disabled={loading || !form.name || !form.type}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Criar loja
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
