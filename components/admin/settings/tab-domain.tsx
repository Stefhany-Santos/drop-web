"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { Copy, ExternalLink, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

function getStoreUrl(tenant: string, customDomain?: string) {
  if (customDomain) return `https://${customDomain}`
  return `/storefront/${tenant}`
}

export function TabDomain() {
  const { tenant, domains, updateDomains, branding, themeTokens, productCard, copy } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...domains })
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const storeUrl = getStoreUrl(tenant, form.customDomain)
  const previewUrl = `/storefront/${tenant}?preview=1`

  function handleSave() {
    if (form.subdomain && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.subdomain)) {
      toast.error("Subdominio invalido. Use apenas letras minusculas, numeros e hifens.")
      return
    }
    setSaving(true)
    setTimeout(() => {
      updateDomains(form)
      setSaving(false)
      toast.success("Dominio salvo com sucesso.")
    }, 400)
  }

  function handleCopyLink() {
    const url = form.customDomain
      ? `https://${form.customDomain}`
      : `https://${form.subdomain}.nexshop.com.br`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!")
  }

  // Send live preview updates to the iframe
  const sendPreviewUpdate = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      {
        type: "NEXSHOP_THEME_PREVIEW",
        payload: { theme: themeTokens, branding, productCard, copy },
      },
      "*",
    )
  }, [themeTokens, branding, productCard, copy])

  useEffect(() => {
    sendPreviewUpdate()
  }, [sendPreviewUpdate])

  // Also send after iframe loads
  function handleIframeLoad() {
    // Small delay to ensure the storefront listener is ready
    setTimeout(sendPreviewUpdate, 300)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dominio e Subdominio</CardTitle>
          <CardDescription>
            Gerencie o endereco da sua loja.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subdomain">Subdominio</Label>
            <div className="flex items-center gap-2">
              <Input
                id="subdomain"
                value={form.subdomain}
                onChange={(e) => setForm((p) => ({ ...p, subdomain: e.target.value.toLowerCase() }))}
                placeholder="minha-loja"
              />
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                .nexshop.com.br
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customDomain">Dominio personalizado (opcional)</Label>
            <Input
              id="customDomain"
              value={form.customDomain ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, customDomain: e.target.value || undefined }))}
              placeholder="loja.meusite.com.br"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-medium">
              {form.customDomain || `${form.subdomain}.nexshop.com.br`}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5 bg-transparent">
                <Copy className="h-3.5 w-3.5" />
                Copiar
              </Button>
              <Button size="sm" asChild className="gap-1.5">
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Abrir loja
                </a>
              </Button>
            </div>
          </div>

          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar dominio
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview da loja</CardTitle>
          <CardDescription>
            Visualize as alteracoes em tempo real. Mudancas nao salvas sao refletidas automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/40" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                <div className="h-3 w-3 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 rounded bg-background px-3 py-1 text-xs text-muted-foreground font-mono">
                {form.customDomain || `${form.subdomain}.nexshop.com.br`}
              </div>
            </div>
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Preview da loja"
              className="h-[480px] w-full bg-background"
              onLoad={handleIframeLoad}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
