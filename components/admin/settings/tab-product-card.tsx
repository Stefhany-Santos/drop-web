"use client"

import { useState } from "react"
import { Loader2, RotateCcw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { DEFAULT_PRODUCT_CARD_STYLE } from "@/lib/mock-data"
import type { ProductCardStyle } from "@/lib/types"
import { toast } from "sonner"

function CardPreview({ style }: { style: ProductCardStyle }) {
  return (
    <div
      className="w-full max-w-xs overflow-hidden transition-all"
      style={{
        backgroundColor: style.bgColor,
        borderColor: style.borderColor,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: `${style.radius}px`,
        boxShadow:
          style.shadow === "none"
            ? "none"
            : style.shadow === "sm"
              ? "0 1px 2px rgba(0,0,0,.15)"
              : style.shadow === "md"
                ? "0 4px 6px rgba(0,0,0,.2)"
                : "0 10px 15px rgba(0,0,0,.3)",
      }}
    >
      <div
        className="flex aspect-video items-center justify-center"
        style={{ backgroundColor: style.borderColor }}
      >
        <span style={{ color: style.textColor }} className="text-xs opacity-60">
          600 x 400
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {style.badgeBg && (
          <span
            className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
          >
            Mais vendido
          </span>
        )}
        <h3
          className="text-sm font-semibold leading-tight"
          style={{ color: style.titleColor }}
        >
          Sistema de Empregos v3
        </h3>
        <p className="text-xs" style={{ color: style.textColor }}>
          Sistema completo de empregos para FiveM com 15+ profissoes.
        </p>
        <p className="text-lg font-bold" style={{ color: style.priceColor }}>
          R$ 49,90
        </p>
        <button
          type="button"
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: style.buttonBg,
            color: style.buttonText,
            borderRadius: `${Math.max(style.radius - 4, 4)}px`,
          }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Comprar
        </button>
      </div>
    </div>
  )
}

const COLOR_FIELDS: { key: keyof ProductCardStyle; label: string }[] = [
  { key: "bgColor", label: "Fundo" },
  { key: "textColor", label: "Texto" },
  { key: "titleColor", label: "Titulo" },
  { key: "priceColor", label: "Preco" },
  { key: "borderColor", label: "Borda" },
  { key: "buttonBg", label: "Fundo botao" },
  { key: "buttonText", label: "Texto botao" },
  { key: "badgeBg", label: "Fundo badge" },
  { key: "badgeText", label: "Texto badge" },
]

export function TabProductCard() {
  const { productCard, updateProductCard } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ProductCardStyle>({ ...productCard })

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      updateProductCard(form)
      setSaving(false)
      toast.success("Estilo do card salvo com sucesso.")
    }, 400)
  }

  function handleReset() {
    setForm({ ...DEFAULT_PRODUCT_CARD_STYLE })
    toast.info("Estilo do card resetado para o padrao.")
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_280px]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Card do produto</CardTitle>
              <CardDescription>
                Personalize a aparencia dos cards de produto na loja.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
              <RotateCcw className="h-3.5 w-3.5" />
              Resetar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label htmlFor={`card-${key}`} className="text-xs">
                  {label}
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form[key] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    id={`card-${key}`}
                    value={form[key] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="font-mono text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-shadow" className="text-xs">Sombra</Label>
              <Select
                value={form.shadow}
                onValueChange={(v) => setForm((p) => ({ ...p, shadow: v as ProductCardStyle["shadow"] }))}
              >
                <SelectTrigger id="card-shadow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="sm">Pequena</SelectItem>
                  <SelectItem value="md">Media</SelectItem>
                  <SelectItem value="lg">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-radius" className="text-xs">
                Raio da borda ({form.radius}px)
              </Label>
              <Input
                id="card-radius"
                type="range"
                min={0}
                max={32}
                value={form.radius}
                onChange={(e) => setForm((p) => ({ ...p, radius: Number(e.target.value) }))}
                className="h-9"
              />
            </div>
          </div>

          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar card
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Preview do card</p>
        <CardPreview style={form} />
      </div>
    </div>
  )
}
