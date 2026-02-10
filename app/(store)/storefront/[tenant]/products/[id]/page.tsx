"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Check,
  AlertTriangle,
  Download,
  MessageCircle,
  Gamepad2,
  Package,
  ChevronRight,
  Minus,
  Plus,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { toast } from "sonner"

const deliveryLabels: Record<string, { label: string; description: string; icon: typeof Download }> = {
  download: {
    label: "Download digital",
    description: "Voce recebera o link de download apos a confirmacao do pagamento.",
    icon: Download,
  },
  manual: {
    label: "Entrega manual",
    description: "Um membro da equipe entregara o produto manualmente.",
    icon: Package,
  },
  discord: {
    label: "Entrega via Discord",
    description: "O produto sera entregue no seu Discord. Informe seu usuario no checkout.",
    icon: MessageCircle,
  },
  game: {
    label: "Entrega in-game",
    description: "O produto sera entregue dentro do jogo. Informe seus dados no checkout.",
    icon: Gamepad2,
  },
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>
}) {
  const { id } = use(params)
  const store = useStore()
  const router = useRouter()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const product = store.products.find((p) => p.id === id)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.variants[0]?.id,
  )
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <StorefrontShell theme={theme}>
        <StorefrontHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-20">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: theme.muted }}
          >
            <Package className="h-7 w-7" style={{ color: theme.mutedForeground }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: theme.foreground }}>
            Produto nao encontrado
          </p>
          <Link
            href={base}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
          >
            Voltar a loja
          </Link>
        </div>
        <StorefrontFooter />
      </StorefrontShell>
    )
  }

  const variant = product.variants.find((v) => v.id === selectedVariant)
  const price = variant?.price ?? product.price
  const category = store.categories.find((c) => c.id === product.categoryId)
  const delivery = product.delivery
  const deliveryInfo = delivery ? deliveryLabels[delivery.type] : null
  const DeliveryIcon = deliveryInfo?.icon ?? Package

  function handleAdd() {
    store.addToCart(product.id, qty, selectedVariant)
    toast.success(`${product.name} adicionado ao carrinho`)
  }

  function handleBuyNow() {
    store.addToCart(product.id, qty, selectedVariant)
    router.push(`${base}/checkout`)
  }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="py-8 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-sm">
            <Link href={base} className="transition-opacity hover:opacity-80" style={{ color: theme.primary }}>
              Loja
            </Link>
            <ChevronRight className="h-3.5 w-3.5" style={{ color: theme.mutedForeground }} />
            {category && (
              <>
                <Link
                  href={`${base}/categories/${category.slug}`}
                  className="transition-opacity hover:opacity-80"
                  style={{ color: theme.primary }}
                >
                  {category.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" style={{ color: theme.mutedForeground }} />
              </>
            )}
            <span className="truncate font-semibold" style={{ color: theme.foreground }}>
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Image */}
            <div
              className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border"
              style={{ borderColor: theme.border, backgroundColor: theme.muted }}
            >
              {product.images[0] ? (
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Package className="h-14 w-14 opacity-20" style={{ color: theme.mutedForeground }} />
                  <span className="text-sm" style={{ color: theme.mutedForeground }}>Sem imagem</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: hexAlpha(store.productCard.badgeBg, 0.15),
                        color: store.productCard.badgeBg,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h1
                  className="text-balance text-2xl font-extrabold tracking-tight lg:text-3xl"
                  style={{ color: theme.foreground }}
                >
                  {product.name}
                </h1>
                <p className="text-base leading-relaxed" style={{ color: theme.mutedForeground }}>
                  {product.description}
                </p>
              </div>

              {/* Benefits */}
              {product.benefits.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.mutedForeground }}>
                    Incluso
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm" style={{ color: theme.foreground }}>
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: hexAlpha(theme.primary, 0.12) }}
                        >
                          <Check className="h-3 w-3" style={{ color: theme.primary }} />
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delivery info */}
              {deliveryInfo && (
                <div
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ borderColor: theme.border, backgroundColor: hexAlpha(theme.card, 0.6) }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
                  >
                    <DeliveryIcon className="h-4 w-4" style={{ color: theme.primary }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold" style={{ color: theme.foreground }}>
                      {deliveryInfo.label}
                    </span>
                    <span className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
                      {deliveryInfo.description}
                    </span>
                  </div>
                </div>
              )}

              {/* Warning for required fields */}
              {(delivery?.requiresCityId || delivery?.requiresDiscord) && (
                <div
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ borderColor: hexAlpha("#eab308", 0.2), backgroundColor: hexAlpha("#eab308", 0.04) }}
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#eab308" }} />
                  <p className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
                    Este produto requer dados adicionais no checkout
                    {delivery?.requiresCityId && " (ID da cidade FiveM)"}
                    {delivery?.requiresDiscord && " (usuario Discord)"}
                    .
                  </p>
                </div>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.mutedForeground }}>
                    Variante
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const active = selectedVariant === v.id
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v.id)}
                          className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                          style={{
                            borderColor: active ? theme.primary : theme.border,
                            backgroundColor: active ? hexAlpha(theme.primary, 0.1) : "transparent",
                            color: active ? theme.primary : theme.foreground,
                          }}
                        >
                          {v.name} - {formatCurrency(v.price)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex flex-col gap-4 border-t pt-6" style={{ borderColor: theme.border }}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold" style={{ color: theme.primary }}>
                    {formatCurrency(price)}
                  </span>
                  {product.variants.length > 0 && (
                    <span className="text-xs" style={{ color: theme.mutedForeground }}>
                      / {variant?.name ?? "unidade"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center rounded-xl border"
                    style={{ borderColor: theme.border, backgroundColor: theme.card }}
                  >
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-12 w-12 items-center justify-center transition-opacity hover:opacity-70"
                      style={{ color: theme.foreground }}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span
                      className="flex h-12 min-w-[40px] items-center justify-center text-sm font-bold"
                      style={{ color: theme.foreground }}
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-12 w-12 items-center justify-center transition-opacity hover:opacity-70"
                      style={{ color: theme.foreground }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all duration-200"
                    style={{
                      borderColor: theme.border,
                      color: theme.foreground,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.25)
                      e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar ao carrinho
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:brightness-110"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                    boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.35)}`,
                  }}
                >
                  <Zap className="h-4 w-4" />
                  Comprar agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
