"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowRight, Sparkles, Package, Loader2, ShieldCheck, Zap, Headphones } from "lucide-react"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { CategoryNav } from "@/components/storefront/category-nav"
import { ProductCard } from "@/components/storefront/product-card"

const PAGE_SIZE = 6

export default function StorefrontHomePage() {
  const store = useStore()
  const theme = store.themeTokens
  const copy = store.copy
  const base = `/storefront/${store.tenant}`

  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  const activeProducts = useMemo(
    () => store.products.filter((p) => p.status === "ativo"),
    [store.products],
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return activeProducts
    const q = search.toLowerCase()
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [activeProducts, search])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleLoadMore() {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE)
      setLoadingMore(false)
    }, 400)
  }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              `linear-gradient(${hexAlpha(theme.border, 0.35)} 1px, transparent 1px)`,
              `linear-gradient(90deg, ${hexAlpha(theme.border, 0.35)} 1px, transparent 1px)`,
            ].join(", "),
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "640px",
            height: "480px",
            background: `radial-gradient(ellipse, ${hexAlpha(theme.primary, 0.07)} 0%, transparent 65%)`,
          }}
        />
        {/* Fade edges so the grid doesn't end abruptly */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              `linear-gradient(to right, ${theme.background} 0%, transparent 10%, transparent 90%, ${theme.background} 100%)`,
              `linear-gradient(to bottom, transparent 60%, ${theme.background} 100%)`,
            ].join(", "),
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-xl text-center">
            {/* Store badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{
                borderColor: hexAlpha(theme.primary, 0.2),
                color: theme.primary,
                backgroundColor: hexAlpha(theme.primary, 0.05),
              }}
            >
              <Sparkles className="h-3 w-3" />
              {store.branding.storeDisplayName}
            </div>

            {/* Headline */}
            <h1
              className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: theme.foreground, lineHeight: 1.12 }}
            >
              {copy.headline}
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto mt-5 max-w-md text-pretty text-sm leading-relaxed lg:text-base"
              style={{ color: theme.mutedForeground }}
            >
              {copy.subheadline}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#products"
                className="group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold transition-shadow duration-200"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  boxShadow: `0 0 0 0 ${hexAlpha(theme.primary, 0)}, 0 1px 12px ${hexAlpha(theme.primary, 0.25)}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${hexAlpha(theme.primary, 0.15)}, 0 4px 20px ${hexAlpha(theme.primary, 0.4)}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${hexAlpha(theme.primary, 0)}, 0 1px 12px ${hexAlpha(theme.primary, 0.25)}`
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${hexAlpha(theme.primary, 0.15)}, 0 4px 20px ${hexAlpha(theme.primary, 0.4)}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${hexAlpha(theme.primary, 0)}, 0 1px 12px ${hexAlpha(theme.primary, 0.25)}`
                }}
              >
                {copy.ctaPrimaryText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <Link
                href={`${base}/support`}
                className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-medium transition-colors duration-200"
                style={{
                  borderColor: theme.border,
                  color: theme.mutedForeground,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.18)
                  e.currentTarget.style.color = theme.foreground
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border
                  e.currentTarget.style.color = theme.mutedForeground
                }}
              >
                {copy.ctaSecondaryText}
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: ShieldCheck, label: "Pagamento seguro" },
                { icon: Zap, label: "Entrega digital" },
                { icon: Headphones, label: "Suporte dedicado" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium"
                  style={{
                    borderColor: theme.border,
                    color: theme.mutedForeground,
                  }}
                >
                  <item.icon className="h-3 w-3" style={{ color: hexAlpha(theme.primary, 0.55) }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div
        className="mx-auto max-w-6xl px-4 lg:px-6"
      >
        <div className="h-px" style={{ backgroundColor: theme.border }} />
      </div>

      {/* Products section */}
      <section id="products" className="pb-28 pt-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2
                className="text-2xl font-extrabold tracking-tight lg:text-3xl"
                style={{ color: theme.foreground }}
              >
                Produtos
              </h2>
              <p className="text-sm" style={{ color: theme.mutedForeground }}>
                {activeProducts.length} produtos disponíveis
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryNav
                categories={store.categories.filter((c) => c.productCount > 0)}
                theme={theme}
                tenantSlug={store.tenant}
              />
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: theme.mutedForeground }}
                />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setVisibleCount(PAGE_SIZE)
                  }}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 sm:w-64"
                  style={{
                    backgroundColor: theme.muted,
                    borderColor: theme.border,
                    color: theme.foreground,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: theme.muted }}
              >
                <Package className="h-7 w-7" style={{ color: theme.mutedForeground }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold" style={{ color: theme.foreground }}>
                  Nenhum produto encontrado
                </p>
                <p className="text-xs" style={{ color: theme.mutedForeground }}>
                  Tente buscar com outros termos ou explore as categorias.
                </p>
              </div>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-xl border px-5 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ borderColor: theme.border, color: theme.foreground }}
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cardStyle={store.productCard}
                    theme={theme}
                    tenantSlug={store.tenant}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 rounded-xl border px-8 py-3 text-sm font-semibold transition-all duration-200 hover:translate-y-[-1px] disabled:opacity-50"
                    style={{
                      borderColor: theme.border,
                      color: theme.foreground,
                      backgroundColor: theme.card,
                    }}
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loadingMore ? "Carregando..." : "Carregar mais produtos"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
