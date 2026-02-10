"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export function TabCopy() {
  const { copy, updateCopy } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...copy })

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      updateCopy(form)
      setSaving(false)
      toast.success("Textos salvos com sucesso.")
    }, 400)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Textos do site</CardTitle>
        <CardDescription>
          Configure os textos exibidos na pagina inicial da sua loja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="headline">Titulo principal</Label>
          <Input
            id="headline"
            value={form.headline}
            onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
            placeholder="Os melhores produtos digitais..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="subheadline">Subtitulo</Label>
          <Textarea
            id="subheadline"
            value={form.subheadline}
            onChange={(e) => setForm((p) => ({ ...p, subheadline: e.target.value }))}
            rows={2}
            placeholder="Scripts, veiculos, mapas..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ctaPrimary">Texto CTA primario</Label>
            <Input
              id="ctaPrimary"
              value={form.ctaPrimaryText}
              onChange={(e) => setForm((p) => ({ ...p, ctaPrimaryText: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ctaSecondary">Texto CTA secundario</Label>
            <Input
              id="ctaSecondary"
              value={form.ctaSecondaryText}
              onChange={(e) => setForm((p) => ({ ...p, ctaSecondaryText: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="footerText">Texto do rodape</Label>
          <Input
            id="footerText"
            value={form.footerText}
            onChange={(e) => setForm((p) => ({ ...p, footerText: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="supportEmail">Email de suporte</Label>
          <Input
            id="supportEmail"
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))}
          />
        </div>

        <Separator />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar textos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
