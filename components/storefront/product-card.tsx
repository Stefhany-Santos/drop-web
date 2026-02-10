"use client"

import React from "react"
import Link from "next/link"
import { ShoppingCart, Package } from "lucide-react"
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
  const cs = product.cardStyleOverride
    ? { ...cardStyle, ...product.cardStyleOverride }
    : cardStyle
  const base = `/storefront/${tenantSlug}`

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    store.addToCart(product.id, 1)
    toast.success(`${product.name} adicionado ao carrinho`)
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
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Category hint */}
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: cs.textColor }}
        >
          {store.categories.find((c) => c.id === product.categoryId)?.name ?? "Produto"}
        </span>

        <h3
          className="line-clamp-1 text-sm font-bold leading-snug"
          style={{ color: cs.titleColor }}
        >
          {product.name}
        </h3>

        <p
          className="line-clamp-2 text-xs leading-relaxed"
          style={{ color: cs.textColor }}
        >
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col">
            {product.variants.length > 0 && (
              <span className="text-[10px] font-medium" style={{ color: cs.textColor }}>
                a partir de
              </span>
            )}
            <span className="text-lg font-extrabold tracking-tight" style={{ color: cs.priceColor }}>
              {formatCurrency(product.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all duration-200"
            style={{
              backgroundColor: cs.buttonBg,
              color: cs.buttonText,
              borderRadius: `${Math.max(cs.radius - 4, 6)}px`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85"
              e.currentTarget.style.transform = "scale(1.03)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Comprar
          </button>
        </div>
      </div>
    </Link>
  )
}
