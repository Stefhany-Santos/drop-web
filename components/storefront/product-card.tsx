"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Package, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { getCardShadow, hexAlpha } from "@/lib/storefront-theme"
import type { Product, ProductCardStyle, TenantTheme } from "@/lib/types"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

interface Props {
  product: Product
  cardStyle: ProductCardStyle
  theme: TenantTheme
  tenantSlug: string
}

export function ProductCard({ product, cardStyle, theme, tenantSlug }: Props) {
  const store = useStore()
  const router = useRouter()
  const cs = product.cardStyleOverride
    ? { ...cardStyle, ...product.cardStyleOverride }
    : cardStyle
  const base = `/storefront/${tenantSlug}`

  const categoryName =
    store.categories.find((c) => c.id === product.categoryId)?.name ?? "Produto"

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    store.addToCart(product.id, 1)
    toast.success(`${product.name} adicionado ao carrinho`)
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    store.addToCart(product.id, 1)
    router.push(`${base}/checkout`)
  }

  return (
    <Link
      href={`${base}/products/${product.id}`}
      className="group flex flex-col overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: cs.bgColor,
        borderColor: cs.borderColor,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: `${cs.radius}px`,
        boxShadow: getCardShadow(cs.shadow),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = getCardShadow("lg")
        e.currentTarget.style.borderColor = hexAlpha(theme.primary, 0.3)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = getCardShadow(cs.shadow)
        e.currentTarget.style.borderColor = cs.borderColor
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ backgroundColor: hexAlpha(cs.borderColor, 0.5) }}
      >
        {product.images[0] ? (
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <Package className="h-8 w-8 opacity-20" style={{ color: cs.textColor }} />
          </div>
        )}

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                style={{
                  backgroundColor: hexAlpha(cs.badgeBg, 0.9),
                  color: cs.badgeText,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category tag */}
        <span
          className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: theme.primary }}
        >
          {categoryName}
        </span>

        {/* Title */}
        <h3
          className="line-clamp-1 text-sm font-bold leading-snug"
          style={{ color: cs.titleColor }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
          style={{ color: cs.textColor }}
        >
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-auto flex flex-col pt-4">
          <div className="flex items-baseline gap-1.5">
            {product.variants.length > 0 && (
              <span className="text-[10px] font-medium" style={{ color: cs.textColor }}>
                a partir de
              </span>
            )}
          </div>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: cs.priceColor }}
          >
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Dual CTAs */}
        <div className="mt-4 flex gap-2">
          {/* Add to cart - Secondary */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1.5 border px-3 py-2.5 text-xs font-semibold transition-all duration-200"
            style={{
              borderColor: cs.borderColor,
              color: cs.titleColor,
              backgroundColor: "transparent",
              borderRadius: `${Math.max(cs.radius - 4, 6)}px`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.25)
              e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = cs.borderColor
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Carrinho</span>
          </button>

          {/* Buy now - Primary */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex flex-[2] items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-all duration-200"
            style={{
              backgroundColor: cs.buttonBg,
              color: cs.buttonText,
              borderRadius: `${Math.max(cs.radius - 4, 6)}px`,
              boxShadow: `0 2px 8px ${hexAlpha(cs.buttonBg, 0.3)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9"
              e.currentTarget.style.transform = "scale(1.02)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            Comprar agora
          </button>
        </div>
      </div>
    </Link>
  )
}
