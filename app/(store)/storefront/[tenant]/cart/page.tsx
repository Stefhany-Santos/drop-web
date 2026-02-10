"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Trash2,
  ShoppingBag,
  Tag,
  Minus,
  Plus,
  ShieldCheck,
  Package,
  ArrowRight,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { toast } from "sonner"

export default function CartPage() {
  const store = useStore()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const [couponInput, setCouponInput] = useState("")

  const subtotal = store.getCartSubtotal()
  const total = store.getCartTotal()
  const discountAmount = subtotal - total

  function handleApplyCoupon() {
    if (!couponInput.trim()) return
    const result = store.applyCoupon(couponInput.trim())
    if (result.success) {
      toast.success(result.message)
      setCouponInput("")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="py-8 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <Link
            href={base}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: theme.primary }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continuar comprando
          </Link>

          <h1 className="mb-8 text-2xl font-extrabold tracking-tight lg:text-3xl" style={{ color: theme.foreground }}>
            Carrinho
          </h1>

          {store.cart.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{ backgroundColor: theme.muted }}
              >
                <ShoppingBag className="h-9 w-9" style={{ color: theme.mutedForeground }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-bold" style={{ color: theme.foreground }}>
                  Seu carrinho esta vazio
                </p>
                <p className="text-sm" style={{ color: theme.mutedForeground }}>
                  Adicione produtos para comecar suas compras.
                </p>
              </div>
              <Link
                href={base}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.3)}`,
                }}
              >
                Explorar produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="flex flex-col gap-3 lg:col-span-2">
                {store.cart.map((item) => {
                  const product = store.products.find((p) => p.id === item.productId)
                  if (!product) return null
                  const variant = item.variantId
                    ? product.variants.find((v) => v.id === item.variantId)
                    : undefined
                  const unitPrice = variant?.price ?? product.price

                  return (
                    <div
                      key={`${item.productId}-${item.variantId ?? ""}`}
                      className="flex gap-4 rounded-xl border p-4"
                      style={{ borderColor: theme.border, backgroundColor: theme.card }}
                    >
                      <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{ backgroundColor: theme.muted }}
                      >
                        {product.images[0] ? (
                          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 opacity-30" style={{ color: theme.mutedForeground }} />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: theme.foreground }}>
                              {product.name}
                            </h3>
                            {variant && (
                              <span className="text-xs" style={{ color: theme.mutedForeground }}>
                                Variante: {variant.name}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => store.removeFromCart(item.productId, item.variantId)}
                            className="rounded-lg p-1.5 transition-opacity hover:opacity-60"
                            style={{ color: theme.mutedForeground }}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div
                            className="flex items-center rounded-lg border"
                            style={{ borderColor: theme.border, backgroundColor: theme.muted }}
                          >
                            <button
                              type="button"
                              onClick={() => store.updateCartQty(item.productId, item.quantity - 1, item.variantId)}
                              className="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70"
                              style={{ color: theme.foreground }}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span
                              className="flex h-8 min-w-[28px] items-center justify-center text-xs font-bold"
                              style={{ color: theme.foreground }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => store.updateCartQty(item.productId, item.quantity + 1, item.variantId)}
                              className="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70"
                              style={{ color: theme.foreground }}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-bold" style={{ color: theme.primary }}>
                            {formatCurrency(unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-5">
                <div
                  className="flex flex-col gap-4 rounded-xl border p-5"
                  style={{ borderColor: theme.border, backgroundColor: theme.card }}
                >
                  <h2 className="text-base font-bold" style={{ color: theme.foreground }}>
                    Resumo do pedido
                  </h2>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Codigo do cupom"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className="flex-1 rounded-lg border px-3 py-2.5 text-xs outline-none transition-all focus:ring-1"
                      style={{
                        backgroundColor: theme.muted,
                        borderColor: theme.border,
                        color: theme.foreground,
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{ borderColor: theme.border, color: theme.foreground }}
                    >
                      <Tag className="h-3 w-3" />
                      Aplicar
                    </button>
                  </div>

                  {store.cartCouponCode && (
                    <div
                      className="rounded-lg px-3 py-2 text-xs font-semibold"
                      style={{ backgroundColor: hexAlpha(theme.primary, 0.08), color: theme.primary }}
                    >
                      Cupom {store.cartCouponCode} aplicado ({store.cartDiscount}% off)
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: theme.border }}>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: theme.mutedForeground }}>Subtotal</span>
                      <span style={{ color: theme.foreground }}>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: theme.primary }}>Desconto</span>
                        <span style={{ color: theme.primary }}>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div
                      className="flex items-center justify-between border-t pt-3 text-lg font-extrabold"
                      style={{ borderColor: theme.border }}
                    >
                      <span style={{ color: theme.foreground }}>Total</span>
                      <span style={{ color: theme.primary }}>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Link
                    href={`${base}/checkout`}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: theme.primary,
                      color: theme.primaryForeground,
                      boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.3)}`,
                    }}
                  >
                    Ir para checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-2 px-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: theme.mutedForeground }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: theme.mutedForeground }}>
                    Pagamento seguro e compra protegida.
                  </p>
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
