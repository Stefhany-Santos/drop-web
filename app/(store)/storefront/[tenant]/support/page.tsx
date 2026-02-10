"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Clock, Send, Loader2, MessageCircle, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { toast } from "sonner"

const FAQ_ITEMS = [
  { q: "Como recebo meu produto?", a: "Apos a confirmacao do pagamento, voce recebera o acesso por download, Discord ou in-game, dependendo do produto." },
  { q: "Posso solicitar reembolso?", a: "Sim, reembolsos podem ser solicitados em ate 7 dias apos a compra atraves do suporte." },
  { q: "Como ativo meu script?", a: "Cada produto inclui instrucoes de instalacao. Em caso de duvida, entre em contato com nosso suporte." },
  { q: "Preciso de um servidor FiveM?", a: "Sim, a maioria dos nossos scripts requer um servidor FiveM com ESX ou QBCore instalado." },
]

export default function SupportPage() {
  const store = useStore()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const [name, setName] = useState(store.customerSession.name ?? "")
  const [email, setEmail] = useState(store.customerSession.email ?? "")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Preencha todos os campos.")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    toast.success("Mensagem enviada! Responderemos em breve.")
    setMessage("")
  }

  const inputClass = "w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all focus:ring-2"
  const inputStyle = { backgroundColor: theme.muted, borderColor: theme.border, color: theme.foreground }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <Link
            href={base}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: theme.primary }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar a loja
          </Link>

          <div className="mb-10 flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl" style={{ color: theme.foreground }}>
              Suporte
            </h1>
            <p className="text-sm" style={{ color: theme.mutedForeground }}>
              Precisa de ajuda? Estamos aqui para voce.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-2xl border p-6 lg:col-span-3"
              style={{ borderColor: theme.border, backgroundColor: theme.card }}
            >
              <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Enviar mensagem</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Nome</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className={inputClass} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Mensagem</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva como podemos ajudar..."
                  rows={5}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </form>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
                <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Contato</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
                    >
                      <Mail className="h-4 w-4" style={{ color: theme.primary }} />
                    </div>
                    <a href={`mailto:${store.copy.supportEmail}`} className="text-sm underline" style={{ color: theme.foreground }}>
                      {store.copy.supportEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
                    >
                      <Clock className="h-4 w-4" style={{ color: theme.primary }} />
                    </div>
                    <span className="text-sm" style={{ color: theme.mutedForeground }}>Seg-Sex, 9h-18h (BRT)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
                    >
                      <MessageCircle className="h-4 w-4" style={{ color: theme.primary }} />
                    </div>
                    <span className="text-sm" style={{ color: theme.mutedForeground }}>Discord da comunidade</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="flex flex-col gap-2 rounded-2xl border p-5" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
                <h2 className="mb-1 text-sm font-bold" style={{ color: theme.foreground }}>Perguntas frequentes</h2>
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs font-semibold transition-colors"
                      style={{
                        color: theme.foreground,
                        backgroundColor: expandedFaq === i ? hexAlpha(theme.foreground, 0.04) : "transparent",
                      }}
                    >
                      {item.q}
                      <ChevronRight
                        className="h-3 w-3 shrink-0 transition-transform"
                        style={{
                          color: theme.mutedForeground,
                          transform: expandedFaq === i ? "rotate(90deg)" : "rotate(0)",
                        }}
                      />
                    </button>
                    {expandedFaq === i && (
                      <p className="px-2.5 pb-2 text-[11px] leading-relaxed" style={{ color: theme.mutedForeground }}>
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
