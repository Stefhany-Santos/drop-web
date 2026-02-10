"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export function TabIdentity() {
  const { branding, updateBranding } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...branding })

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      updateBranding(form)
      setSaving(false)
      toast.success("Identidade salva com sucesso.")
    }, 400)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Identidade da loja</CardTitle>
        <CardDescription>
          Configure o nome, logo e favicon exibidos na sua loja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="displayName">Nome exibido</Label>
          <Input
            id="displayName"
            value={form.storeDisplayName}
            onChange={(e) => setForm((p) => ({ ...p, storeDisplayName: e.target.value }))}
            placeholder="Minha Loja"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="logoUrl">URL do logo</Label>
          <Input
            id="logoUrl"
            value={form.logoUrl}
            onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
            placeholder="https://exemplo.com/logo.png"
          />
          {form.logoUrl && (
            <div className="mt-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.logoUrl || "/placeholder.svg"}
                alt="Preview do logo"
                className="h-full w-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="faviconUrl">URL do favicon</Label>
          <Input
            id="faviconUrl"
            value={form.faviconUrl}
            onChange={(e) => setForm((p) => ({ ...p, faviconUrl: e.target.value }))}
            placeholder="https://exemplo.com/favicon.ico"
          />
          {form.faviconUrl && (
            <div className="mt-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.faviconUrl || "/placeholder.svg"}
                alt="Preview do favicon"
                className="h-full w-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            </div>
          )}
        </div>

        <Separator />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar identidade
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
