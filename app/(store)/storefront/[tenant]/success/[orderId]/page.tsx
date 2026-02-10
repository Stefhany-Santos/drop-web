"use client"

import { use } from "react"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { OrderStatusBadge } from "@/components/storefront/order-status-badge"

export default function SuccessPage({ params }: { params: Promise<{ tenant: string; orderId: string }> }) {
  const { orderId } = use(params)
  const store = useStore()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const order = store.getOrderById(orderId)

  if (!order) {
    return (
      <StorefrontShell theme={theme}>
        <StorefrontHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <Package className="h-10 w-10" style={{ color: theme.mutedForeground }} />
          <p style={{ color: theme.mutedForeground }}>Pedido nao encontrado.</p>
          <Link
            href={base}
            className="rounded-xl px-5 py-2.5 text-sm font-bold"
            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
          >
            Voltar a loja
          </Link>
        </div>
        <StorefrontFooter />
      </StorefrontShell>
    )
  }

  const paymentLabels: Record<string, string> = {
    pix: "PIX",
    card: "Cartao de credito/debito",
    stripe: "Stripe",
  }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="flex flex-1 items-center justify-center py-16">
        <div className="mx-auto max-w-xl px-4 text-center lg:px-6">
          {/* Success icon with glow */}
          <div className="mb-6 flex justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: theme.primary }} />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold" style={{ color: theme.foreground }}>
            Pedido realizado!
          </h1>
          <p className="mt-2 text-sm" style={{ color: theme.mutedForeground }}>
            Obrigado, {order.customerName}. Seu pedido {order.id} foi recebido com sucesso.
          </p>

          {/* Order summary card */}
          <div
            className="mt-8 rounded-2xl border p-5 text-left"
            style={{ borderColor: theme.border, backgroundColor: theme.card }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" style={{ color: theme.primary }} />
                <span className="text-sm font-bold" style={{ color: theme.foreground }}>{order.id}</span>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-col gap-2.5 border-t pt-3" style={{ borderColor: theme.border }}>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: theme.foreground }}>
                    {item.productName}{item.variantName ? ` (${item.variantName})` : ""} x{item.quantity}
                  </span>
                  <span style={{ color: theme.mutedForeground }}>{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            {order.discount > 0 && (
              <div className="mt-2 flex justify-between text-xs">
                <span style={{ color: theme.primary }}>Desconto</span>
                <span style={{ color: theme.primary }}>-{formatCurrency(order.discount)}</span>
              </div>
            )}

            <div className="mt-3 flex justify-between border-t pt-3 text-sm font-extrabold" style={{ borderColor: theme.border }}>
              <span style={{ color: theme.foreground }}>Total</span>
              <span style={{ color: theme.primary }}>{formatCurrency(order.total)}</span>
            </div>

            <div className="mt-4 flex flex-col gap-1.5 border-t pt-3 text-xs" style={{ borderColor: theme.border }}>
              <div className="flex justify-between">
                <span style={{ color: theme.mutedForeground }}>Pagamento</span>
                <span style={{ color: theme.foreground }}>{paymentLabels[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.mutedForeground }}>Data</span>
                <span style={{ color: theme.foreground }}>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {store.customerSession.isLoggedIn && (
              <Link
                href={`${base}/account`}
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.3)}`,
                }}
              >
                Ver meus pedidos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <Link
              href={base}
              className="flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ borderColor: theme.border, color: theme.foreground }}
            >
              Voltar a loja
            </Link>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
