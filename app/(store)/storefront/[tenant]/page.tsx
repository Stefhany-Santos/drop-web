"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowRight, Sparkles, Package, Loader2 } from "lucide-react"
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
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.foreground} 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: "600px",
            height: "300px",
            background: `radial-gradient(ellipse, ${hexAlpha(theme.primary, 0.08)} 0%, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider"
              style={{
                borderColor: hexAlpha(theme.primary, 0.3),
                color: theme.primary,
                backgroundColor: hexAlpha(theme.primary, 0.06),
              }}
            >
              <Sparkles className="h-3 w-3" />
              {store.branding.storeDisplayName}
            </div>
            <h1
              className="text-balance text-3xl font-extrabold tracking-tight lg:text-5xl"
              style={{ color: theme.foreground }}
            >
              {copy.headline}
            </h1>
            <p
              className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed lg:text-lg"
              style={{ color: theme.mutedForeground }}
            >
              {copy.subheadline}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.35)}`,
                }}
              >
                {copy.ctaPrimaryText}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={`${base}/support`}
                className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: theme.border,
                  color: theme.foreground,
                }}
              >
                {copy.ctaSecondaryText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section id="products" className="pb-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-10 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h2
                className="text-xl font-extrabold tracking-tight lg:text-2xl"
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
