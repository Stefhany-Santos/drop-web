"use client"

import { useMemo, useState, use } from "react"
import { ArrowLeft, ArrowUpDown, Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { CategoryNav } from "@/components/storefront/category-nav"
import { ProductCard } from "@/components/storefront/product-card"

type SortOption = "recent" | "price-asc" | "price-desc" | "name"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>
}) {
  const { slug } = use(params)
  const store = useStore()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const category = store.categories.find((c) => c.slug === slug)
  const [sort, setSort] = useState<SortOption>("recent")

  const products = useMemo(() => {
    const filtered = store.products.filter(
      (p) => p.status === "ativo" && p.categoryId === category?.id,
    )
    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price)
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
  }, [store.products, category, sort])

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Mais recentes" },
    { value: "price-asc", label: "Menor preco" },
    { value: "price-desc", label: "Maior preco" },
    { value: "name", label: "Nome A-Z" },
  ]

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm">
            <Link href={base} className="transition-opacity hover:opacity-80" style={{ color: theme.primary }}>
              Loja
            </Link>
            <ChevronRight className="h-3.5 w-3.5" style={{ color: theme.mutedForeground }} />
            <span style={{ color: theme.foreground }} className="font-semibold">
              {category?.name ?? "Categoria"}
            </span>
          </nav>

          <div className="mb-10 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h1
                className="text-2xl font-extrabold tracking-tight lg:text-3xl"
                style={{ color: theme.foreground }}
              >
                {category?.name ?? "Categoria"}
              </h1>
              <p className="text-sm" style={{ color: theme.mutedForeground }}>
                {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
                encontrado{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryNav
                categories={store.categories.filter((c) => c.productCount > 0)}
                activeSlug={slug}
                theme={theme}
                tenantSlug={store.tenant}
              />
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 shrink-0" style={{ color: theme.mutedForeground }} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-lg border py-2 pl-2 pr-8 text-xs font-semibold outline-none"
                  style={{
                    backgroundColor: theme.muted,
                    borderColor: theme.border,
                    color: theme.foreground,
                  }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: theme.muted }}
              >
                <Package className="h-7 w-7" style={{ color: theme.mutedForeground }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold" style={{ color: theme.foreground }}>
                  Nenhum produto nesta categoria
                </p>
                <p className="text-xs" style={{ color: theme.mutedForeground }}>
                  Explore outras categorias para encontrar o que procura.
                </p>
              </div>
              <Link
                href={base}
                className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cardStyle={store.productCard}
                  theme={theme}
                  tenantSlug={store.tenant}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
