"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Clock,
  Send,
  Loader2,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  ExternalLink,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { toast } from "sonner"

// ── FAQ Data ──
const FAQ_ITEMS = [
  {
    q: "Como recebo meu produto?",
    a: "Apos a confirmacao do pagamento, voce recebera o acesso por download, Discord ou in-game, dependendo do produto. O link de download fica disponivel na pagina do pedido.",
  },
  {
    q: "Posso solicitar reembolso?",
    a: "Sim, reembolsos podem ser solicitados em ate 7 dias apos a compra atraves deste formulario de suporte ou diretamente pelo Discord.",
  },
  {
    q: "Como ativo meu script?",
    a: "Cada produto inclui instrucoes detalhadas de instalacao. Apos o download, siga o guia incluido. Em caso de duvida, entre em contato com nosso suporte.",
  },
  {
    q: "Preciso de um servidor FiveM?",
    a: "Sim, a maioria dos nossos scripts requer um servidor FiveM com ESX ou QBCore instalado. Verifique os requisitos na pagina do produto antes de comprar.",
  },
  {
    q: "Meu pagamento foi aprovado mas nao recebi o produto.",
    a: "Verifique sua caixa de spam e a pagina de pedidos na sua conta. Caso o problema persista, entre em contato conosco informando o numero do pedido.",
  },
]

// ── FAQ Accordion Item ──
function FaqItem({
  item,
  isOpen,
  onToggle,
  theme,
}: {
  item: { q: string; a: string }
  isOpen: boolean
  onToggle: () => void
  theme: ReturnType<typeof useStore>["themeTokens"]
}) {
  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: hexAlpha(theme.border, 0.6) }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold transition-colors"
        style={{ color: theme.foreground }}
        aria-expanded={isOpen}
      >
        <span className="leading-snug">{item.q}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-200"
          style={{
            color: theme.mutedForeground,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <p
            className="pb-4 text-[13px] leading-relaxed"
            style={{ color: theme.mutedForeground }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Contact Row ──
function ContactRow({
  icon: Icon,
  theme,
  children,
  badge,
  href,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  theme: ReturnType<typeof useStore>["themeTokens"]
  children: React.ReactNode
  badge?: string
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: hexAlpha(theme.primary, 0.08) }}
      >
        <Icon className="h-4 w-4" style={{ color: theme.primary }} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm" style={{ color: theme.foreground }}>
          {children}
        </span>
        {badge && (
          <span
            className="text-[10px] font-medium"
            style={{ color: theme.mutedForeground }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:")
    if (isExternal) {
      return (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-150"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.03)
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
          }}
        >
          {content}
          <ExternalLink
            className="h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{ color: theme.mutedForeground }}
          />
        </a>
      )
    }
  }

  return <div className="px-3 py-2.5">{content}</div>
}

// ── Main Page ──
export default function SupportPage() {
  const store = useStore()
  const theme = store.themeTokens
  const copy = store.copy
  const base = `/storefront/${store.tenant}`

  const [name, setName] = useState(store.customerSession.name ?? "")
  const [email, setEmail] = useState(store.customerSession.email ?? "")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim() || !email.trim() || !message.trim()) {
        toast.error("Preencha todos os campos obrigatorios.")
        return
      }
      setLoading(true)
      await new Promise((r) => setTimeout(r, 1200))
      setLoading(false)
      toast.success("Mensagem enviada com sucesso! Responderemos em breve.")
      setSubject("")
      setMessage("")
    },
    [name, email, message],
  )

  const inputBaseClass =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-150 placeholder:text-opacity-40 focus:ring-2"

  const inputStyle = {
    backgroundColor: theme.muted,
    borderColor: theme.border,
    color: theme.foreground,
    ringColor: theme.ring,
  }

  const focusRingStyle = `focus:ring-[${theme.ring}]/30`

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      {/* ── Page Header ── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid pattern (matches landing hero) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              `linear-gradient(${hexAlpha(theme.border, 0.25)} 1px, transparent 1px)`,
              `linear-gradient(90deg, ${hexAlpha(theme.border, 0.25)} 1px, transparent 1px)`,
            ].join(", "),
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              `linear-gradient(to right, ${theme.background} 0%, transparent 15%, transparent 85%, ${theme.background} 100%)`,
              `linear-gradient(to bottom, transparent 40%, ${theme.background} 100%)`,
            ].join(", "),
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "500px",
            height: "300px",
            background: `radial-gradient(ellipse, ${hexAlpha(theme.primary, 0.05)} 0%, transparent 65%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-10 lg:px-6 lg:pb-14 lg:pt-14">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: theme.mutedForeground }}>
            <Link
              href={base}
              className="transition-colors duration-150 hover:underline"
              style={{ color: theme.mutedForeground }}
              onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
              onMouseLeave={(e) => { e.currentTarget.style.color = theme.mutedForeground }}
            >
              Loja
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span style={{ color: theme.foreground }} className="font-medium">
              Suporte
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
                >
                  <HelpCircle className="h-5 w-5" style={{ color: theme.primary }} />
                </div>
                <h1
                  className="text-2xl font-extrabold tracking-tight lg:text-3xl"
                  style={{ color: theme.foreground }}
                >
                  Central de Suporte
                </h1>
              </div>
              <p
                className="max-w-md text-sm leading-relaxed"
                style={{ color: theme.mutedForeground }}
              >
                Precisa de ajuda? Envie uma mensagem ou consulte as perguntas frequentes abaixo.
              </p>
            </div>

            {/* Secondary CTA */}
            <a
              href={`mailto:${copy.supportEmail}`}
              className="inline-flex items-center gap-2 self-start rounded-xl border px-5 py-2.5 text-xs font-semibold transition-colors duration-150 sm:self-auto"
              style={{
                borderColor: theme.border,
                color: theme.mutedForeground,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.2)
                e.currentTarget.style.color = theme.foreground
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border
                e.currentTarget.style.color = theme.mutedForeground
              }}
            >
              <Mail className="h-3.5 w-3.5" />
              Enviar email direto
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <div className="h-px" style={{ backgroundColor: theme.border }} />
      </div>

      {/* ── Content Grid ── */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* ─── Form Card ─── */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-2xl border p-6 lg:col-span-3 lg:p-7"
              style={{ borderColor: theme.border, backgroundColor: theme.card }}
            >
              <div className="flex flex-col gap-1">
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.foreground }}
                >
                  Enviar mensagem
                </h2>
                <p className="text-xs" style={{ color: theme.mutedForeground }}>
                  Preencha o formulario e responderemos o mais rapido possivel.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sf-support-name"
                    className="text-xs font-semibold"
                    style={{ color: theme.mutedForeground }}
                  >
                    Nome <span style={{ color: theme.primary }}>*</span>
                  </label>
                  <input
                    id="sf-support-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className={inputBaseClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sf-support-email"
                    className="text-xs font-semibold"
                    style={{ color: theme.mutedForeground }}
                  >
                    Email <span style={{ color: theme.primary }}>*</span>
                  </label>
                  <input
                    id="sf-support-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className={inputBaseClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sf-support-subject"
                  className="text-xs font-semibold"
                  style={{ color: theme.mutedForeground }}
                >
                  Assunto
                </label>
                <input
                  id="sf-support-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Resumo do problema (opcional)"
                  className={inputBaseClass}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="sf-support-message"
                    className="text-xs font-semibold"
                    style={{ color: theme.mutedForeground }}
                  >
                    Mensagem <span style={{ color: theme.primary }}>*</span>
                  </label>
                  <span
                    className="text-[10px] tabular-nums"
                    style={{
                      color: message.length > 1000
                        ? "#ef4444"
                        : theme.mutedForeground,
                    }}
                  >
                    {message.length}/1000
                  </span>
                </div>
                <textarea
                  id="sf-support-message"
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) setMessage(e.target.value)
                  }}
                  placeholder="Descreva como podemos ajudar, inclua numero de pedido se aplicavel..."
                  rows={5}
                  required
                  className={inputBaseClass}
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold transition-shadow duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  boxShadow: `0 1px 12px ${hexAlpha(theme.primary, 0.25)}`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${hexAlpha(theme.primary, 0.15)}, 0 4px 20px ${hexAlpha(theme.primary, 0.35)}`
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 1px 12px ${hexAlpha(theme.primary, 0.25)}`
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>

            {/* ─── Sidebar ─── */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Contact card */}
              <div
                className="flex flex-col gap-1 rounded-2xl border p-5"
                style={{ borderColor: theme.border, backgroundColor: theme.card }}
              >
                <h2
                  className="mb-3 text-sm font-bold"
                  style={{ color: theme.foreground }}
                >
                  Contato
                </h2>
                <div className="flex flex-col gap-0.5">
                  <ContactRow
                    icon={Mail}
                    theme={theme}
                    href={`mailto:${copy.supportEmail}`}
                    badge="Resposta em ate 24h"
                  >
                    {copy.supportEmail}
                  </ContactRow>
                  <ContactRow
                    icon={Clock}
                    theme={theme}
                    badge="Seg-Sex 9h-18h BRT"
                  >
                    Horario de atendimento
                  </ContactRow>
                  <ContactRow
                    icon={MessageCircle}
                    theme={theme}
                    badge="Comunidade e suporte rapido"
                  >
                    Discord
                  </ContactRow>
                </div>
              </div>

              {/* FAQ card */}
              <div
                className="flex flex-col rounded-2xl border p-5"
                style={{ borderColor: theme.border, backgroundColor: theme.card }}
              >
                <h2
                  className="mb-2 text-sm font-bold"
                  style={{ color: theme.foreground }}
                >
                  Perguntas frequentes
                </h2>
                <div className="flex flex-col">
                  {FAQ_ITEMS.map((item, i) => (
                    <FaqItem
                      key={i}
                      item={item}
                      isOpen={openFaq === i}
                      onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
