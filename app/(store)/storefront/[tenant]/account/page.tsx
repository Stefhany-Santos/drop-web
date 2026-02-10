"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, LogOut, Eye, X, ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { OrderStatusBadge } from "@/components/storefront/order-status-badge"
import { toast } from "sonner"
import type { Order } from "@/lib/types"

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function AccountPage() {
  const store = useStore()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  // Mock login modal states
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [googleEmail, setGoogleEmail] = useState("")
  const [googleName, setGoogleName] = useState("")
  const [discordUsername, setDiscordUsername] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  function handleGoogleLogin() {
    if (!googleEmail.trim() || !googleName.trim()) {
      toast.error("Preencha email e nome.")
      return
    }
    store.loginWithGoogle(googleEmail.trim(), googleName.trim())
    setShowGoogleModal(false)
    toast.success("Login com Google realizado!")
  }

  function handleDiscordLogin() {
    if (!discordUsername.trim() || !discordId.trim()) {
      toast.error("Preencha usuario e ID do Discord.")
      return
    }
    store.loginWithDiscord(discordUsername.trim(), discordId.trim())
    setShowDiscordModal(false)
    toast.success("Login com Discord realizado!")
  }

  const inputClass = "w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all focus:ring-2"
  const inputStyle = { backgroundColor: theme.muted, borderColor: theme.border, color: theme.foreground }

  // Login screen
  if (!store.customerSession.isLoggedIn) {
    return (
      <StorefrontShell theme={theme}>
        <StorefrontHeader />
        <section className="flex flex-1 items-center justify-center py-16">
          <div className="mx-auto w-full max-w-sm px-4">
            <Link
              href={base}
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: theme.primary }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar a loja
            </Link>

            <div className="flex flex-col gap-5 rounded-2xl border p-6" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
              <div className="flex flex-col gap-1.5 text-center">
                <h1 className="text-xl font-extrabold" style={{ color: theme.foreground }}>Entrar na sua conta</h1>
                <p className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
                  Acesse seu historico de pedidos e acompanhe o status das suas compras.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Google button */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="flex items-center justify-center gap-3 rounded-xl border py-3 text-sm font-bold transition-all duration-200"
                  style={{ borderColor: theme.border, color: theme.foreground, backgroundColor: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.04) }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                >
                  <GoogleIcon />
                  Continuar com Google
                </button>

                {/* Discord button */}
                <button
                  type="button"
                  onClick={() => setShowDiscordModal(true)}
                  className="flex items-center justify-center gap-3 rounded-xl py-3 text-sm font-bold transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#5865F2", color: "#ffffff" }}
                >
                  <DiscordIcon />
                  Continuar com Discord
                </button>
              </div>

              <p className="text-center text-[10px] leading-relaxed" style={{ color: theme.mutedForeground }}>
                Ao continuar, voce concorda com os termos de uso e politica de privacidade.
              </p>
            </div>
          </div>
        </section>

        {/* Google mock modal */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="w-full max-w-sm rounded-2xl border p-6" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GoogleIcon size={20} />
                  <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Entrar com Google</h2>
                </div>
                <button type="button" onClick={() => setShowGoogleModal(false)} className="p-1" style={{ color: theme.mutedForeground }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Email</label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => { setGoogleEmail(e.target.value); if (!googleName) setGoogleName(e.target.value.split("@")[0]) }}
                    placeholder="seu@gmail.com"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Nome</label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Seu nome"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="mt-1 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discord mock modal */}
        {showDiscordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="w-full max-w-sm rounded-2xl border p-6" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ color: "#5865F2" }}>
                  <DiscordIcon size={20} />
                  <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Entrar com Discord</h2>
                </div>
                <button type="button" onClick={() => setShowDiscordModal(false)} className="p-1" style={{ color: theme.mutedForeground }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Username</label>
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    placeholder="jogador#1234"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Discord ID</label>
                  <input
                    type="text"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    placeholder="123456789012345678"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDiscordLogin}
                  className="mt-1 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#5865F2", color: "#ffffff" }}
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        )}

        <StorefrontFooter />
      </StorefrontShell>
    )
  }

  // Logged in -- show account + orders
  const userOrders = store.customerSession.email
    ? store.getOrdersByEmail(store.customerSession.email)
    : store.customerSession.userId
      ? store.getOrdersByUser(store.customerSession.userId)
      : []

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

          {/* Account header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {store.customerSession.avatarUrl ? (
                <img src={store.customerSession.avatarUrl || "/placeholder.svg"} alt="" className="h-12 w-12 rounded-full" />
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  {(store.customerSession.name ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-extrabold" style={{ color: theme.foreground }}>
                  {store.customerSession.name}
                </h1>
                <p className="text-xs" style={{ color: theme.mutedForeground }}>
                  {store.customerSession.email ?? store.customerSession.discordUsername}
                  {" "}
                  <span
                    className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: store.customerSession.provider === "google" ? hexAlpha("#4285F4", 0.1) : hexAlpha("#5865F2", 0.1),
                      color: store.customerSession.provider === "google" ? "#4285F4" : "#5865F2",
                    }}
                  >
                    {store.customerSession.provider}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { store.logoutCustomer(); toast.success("Voce saiu da conta.") }}
              className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ borderColor: theme.border, color: theme.foreground }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>

          <h2 className="mb-5 text-base font-bold" style={{ color: theme.foreground }}>
            Meus pedidos
          </h2>

          {userOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-20 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: theme.muted }}
              >
                <Package className="h-7 w-7" style={{ color: theme.mutedForeground }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-bold" style={{ color: theme.foreground }}>Voce ainda nao tem pedidos</p>
                <p className="text-xs" style={{ color: theme.mutedForeground }}>Quando fizer uma compra, seus pedidos aparecerão aqui.</p>
              </div>
              <Link
                href={base}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
              >
                Explorar produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderColor: theme.border, backgroundColor: theme.card }}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: theme.foreground }}>{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs" style={{ color: theme.mutedForeground }}>
                      {order.items.map((i) => i.productName).join(", ")}
                    </p>
                    <p className="text-[11px]" style={{ color: theme.mutedForeground }}>
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: theme.primary }}>{formatCurrency(order.total)}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{ borderColor: theme.border, color: theme.foreground }}
                    >
                      <Eye className="h-3 w-3" />
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order detail modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <div className="w-full max-w-lg rounded-2xl border p-6" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-base font-bold" style={{ color: theme.foreground }}>
                    Pedido {selectedOrder.id}
                  </h2>
                  <button type="button" onClick={() => setSelectedOrder(null)} className="p-1" style={{ color: theme.mutedForeground }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-3"><OrderStatusBadge status={selectedOrder.status} /></div>

                <div className="flex flex-col gap-2 border-t pt-3" style={{ borderColor: theme.border }}>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span style={{ color: theme.foreground }}>
                        {item.productName}{item.variantName ? ` (${item.variantName})` : ""} x{item.quantity}
                      </span>
                      <span style={{ color: theme.mutedForeground }}>{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {selectedOrder.discount > 0 && (
                  <div className="mt-2 flex justify-between text-xs">
                    <span style={{ color: theme.primary }}>Desconto</span>
                    <span style={{ color: theme.primary }}>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}

                <div className="mt-3 flex justify-between border-t pt-3 text-sm font-bold" style={{ borderColor: theme.border }}>
                  <span style={{ color: theme.foreground }}>Total</span>
                  <span style={{ color: theme.primary }}>{formatCurrency(selectedOrder.total)}</span>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-t pt-3 text-xs" style={{ borderColor: theme.border }}>
                  <div className="flex justify-between">
                    <span style={{ color: theme.mutedForeground }}>Pagamento</span>
                    <span style={{ color: theme.foreground }}>
                      {selectedOrder.paymentMethod === "pix" ? "PIX" : selectedOrder.paymentMethod === "card" ? "Cartao" : "Stripe"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.mutedForeground }}>Criado em</span>
                    <span style={{ color: theme.foreground }}>{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.paidAt && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.mutedForeground }}>Pago em</span>
                      <span style={{ color: theme.foreground }}>{formatDateTime(selectedOrder.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
