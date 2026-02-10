"use client"

import { useState } from "react"
import { Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { DEFAULT_TENANT_THEME } from "@/lib/mock-data"
import type { TenantTheme } from "@/lib/types"
import { toast } from "sonner"

const THEME_FIELDS: { key: keyof TenantTheme; label: string }[] = [
  { key: "primary", label: "Primaria" },
  { key: "primaryForeground", label: "Texto primario" },
  { key: "background", label: "Fundo" },
  { key: "foreground", label: "Texto" },
  { key: "card", label: "Card" },
  { key: "cardForeground", label: "Texto do card" },
  { key: "muted", label: "Muted" },
  { key: "mutedForeground", label: "Texto muted" },
  { key: "border", label: "Borda" },
  { key: "ring", label: "Ring" },
]

export function TabTheme() {
  const { themeTokens, updateThemeTokens } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<TenantTheme>({ ...themeTokens })

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      updateThemeTokens(form)
      setSaving(false)
      toast.success("Cores do site salvas com sucesso.")
    }, 400)
  }

  function handleReset() {
    setForm({ ...DEFAULT_TENANT_THEME })
    toast.info("Cores resetadas para o padrao.")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Cores do site</CardTitle>
            <CardDescription>
              Personalize as cores do tema da sua loja.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar padrao
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {THEME_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`theme-${key}`} className="text-xs">
                {label}
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
                />
                <Input
                  id={`theme-${key}`}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="font-mono text-xs"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar cores
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
