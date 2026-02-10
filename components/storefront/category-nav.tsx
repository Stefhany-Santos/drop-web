"use client"

import Link from "next/link"
import type { Category, TenantTheme } from "@/lib/types"
import { hexAlpha } from "@/lib/storefront-theme"

interface Props {
  categories: Category[]
  activeSlug?: string
  theme: TenantTheme
  tenantSlug: string
}

export function CategoryNav({ categories, activeSlug, theme, tenantSlug }: Props) {
  const base = `/storefront/${tenantSlug}`

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={base}
        className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200"
        style={{
          backgroundColor: !activeSlug ? theme.primary : "transparent",
          color: !activeSlug ? theme.primaryForeground : theme.mutedForeground,
          borderColor: !activeSlug ? theme.primary : theme.border,
        }}
        onMouseEnter={(e) => {
          if (activeSlug) {
            e.currentTarget.style.borderColor = theme.primary
            e.currentTarget.style.color = theme.foreground
            e.currentTarget.style.backgroundColor = hexAlpha(theme.primary, 0.08)
          }
        }}
        onMouseLeave={(e) => {
          if (activeSlug) {
            e.currentTarget.style.borderColor = theme.border
            e.currentTarget.style.color = theme.mutedForeground
            e.currentTarget.style.backgroundColor = "transparent"
          }
        }}
      >
        Todos
      </Link>
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug
        return (
          <Link
            key={cat.id}
            href={`${base}/categories/${cat.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: isActive ? theme.primary : "transparent",
              color: isActive ? theme.primaryForeground : theme.mutedForeground,
              borderColor: isActive ? theme.primary : theme.border,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = theme.primary
                e.currentTarget.style.color = theme.foreground
                e.currentTarget.style.backgroundColor = hexAlpha(theme.primary, 0.08)
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = theme.border
                e.currentTarget.style.color = theme.mutedForeground
                e.currentTarget.style.backgroundColor = "transparent"
              }
            }}
          >
            {cat.name}
            <span
              className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{
                backgroundColor: isActive ? theme.primaryForeground : hexAlpha(theme.foreground, 0.08),
                color: isActive ? theme.primary : theme.mutedForeground,
              }}
            >
              {cat.productCount}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
