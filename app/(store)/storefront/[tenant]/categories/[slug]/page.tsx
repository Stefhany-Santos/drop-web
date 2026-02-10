"use client"

import { useMemo, useState, useEffect, useRef, useCallback, use } from "react"
import {
  ArrowLeft,
  ArrowUpDown,
  Package,
  ChevronRight,
  Clock,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ArrowDownAZ,
  Check,
  Search,
  X,
} from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { CategoryNav } from "@/components/storefront/category-nav"
import { ProductCard } from "@/components/storefront/product-card"

type SortOption = "recent" | "price-asc" | "price-desc" | "name"

const SORT_OPTIONS: {
  value: SortOption
  label: string
  icon: typeof Clock
}[] = [
  { value: "recent", label: "Mais recentes", icon: Clock },
  { value: "price-asc", label: "Menor preco", icon: ArrowDownNarrowWide },
  { value: "price-desc", label: "Maior preco", icon: ArrowUpNarrowWide },
  { value: "name", label: "Nome A-Z", icon: ArrowDownAZ },
]

// ── Custom hook: debounced value ──
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

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
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  // Search state
  const [searchRaw, setSearchRaw] = useState("")
  const searchQuery = useDebouncedValue(searchRaw, 300)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // "/" keyboard shortcut to focus search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName ?? "",
        )
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Close sort dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    if (sortOpen) document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [sortOpen])

  // Close sort on Escape
  const handleSortKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortOpen(false)
      }
    },
    [],
  )

  const products = useMemo(() => {
    let filtered = store.products.filter(
      (p) => p.status === "ativo" && p.categoryId === category?.id,
    )

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }

    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price)
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
  }, [store.products, category, sort, searchQuery])

  const activeSort = SORT_OPTIONS.find((o) => o.value === sort)!

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      {/* Page header with blueprint grid */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid */}
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
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "500px",
            height: "300px",
            background: `radial-gradient(ellipse, ${hexAlpha(theme.primary, 0.06)} 0%, transparent 65%)`,
          }}
        />
        {/* Edge fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              `linear-gradient(to right, ${theme.background} 0%, transparent 10%, transparent 90%, ${theme.background} 100%)`,
              `linear-gradient(to bottom, transparent 40%, ${theme.background} 100%)`,
            ].join(", "),
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 lg:px-6 lg:pt-14">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-1.5 text-xs"
            aria-label="Breadcrumb"
          >
            <Link
              href={base}
              className="transition-colors duration-150"
              style={{ color: theme.mutedForeground }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.mutedForeground
              }}
            >
              Loja
            </Link>
            <ChevronRight
              className="h-3 w-3"
              style={{ color: hexAlpha(theme.mutedForeground, 0.5) }}
            />
            <span
              style={{ color: theme.foreground }}
              className="font-semibold"
            >
              {category?.name ?? "Categoria"}
            </span>
          </nav>

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
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="h-px" style={{ backgroundColor: theme.border }} />
      </div>

      {/* Products section */}
      <section className="pb-28 pt-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          {/* Toolbar: Categories + Search + Sort */}
          <div className="mb-10 flex flex-col gap-6">
            <CategoryNav
              categories={store.categories.filter((c) => c.productCount > 0)}
              activeSlug={slug}
              theme={theme}
              tenantSlug={store.tenant}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search input */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: theme.mutedForeground }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar nesta categoria..."
                  value={searchRaw}
                  onChange={(e) => setSearchRaw(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      searchInputRef.current?.blur()
                    }
                  }}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm outline-none transition-shadow duration-200"
                  style={{
                    backgroundColor: theme.muted,
                    borderColor: theme.border,
                    color: theme.foreground,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${hexAlpha(theme.primary, 0.25)}`
                    e.currentTarget.style.borderColor = hexAlpha(theme.primary, 0.4)
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = theme.border
                  }}
                />
                {searchRaw && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchRaw("")
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 transition-colors duration-150"
                    style={{ color: theme.mutedForeground }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.foreground
                      e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.08)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.mutedForeground
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                    aria-label="Limpar busca"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div
                ref={sortRef}
                className="relative"
                onKeyDown={handleSortKeyDown}
              >
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-shadow duration-200"
                  style={{
                    backgroundColor: theme.muted,
                    borderColor: sortOpen
                      ? hexAlpha(theme.primary, 0.4)
                      : theme.border,
                    color: theme.foreground,
                    boxShadow: sortOpen
                      ? `0 0 0 2px ${hexAlpha(theme.primary, 0.25)}`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!sortOpen) {
                      e.currentTarget.style.borderColor = hexAlpha(
                        theme.foreground,
                        0.18,
                      )
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!sortOpen) {
                      e.currentTarget.style.borderColor = theme.border
                    }
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  <ArrowUpDown
                    className="h-3.5 w-3.5"
                    style={{ color: theme.mutedForeground }}
                  />
                  <span>
                    Ordenar:{" "}
                    <span style={{ color: theme.primary }}>
                      {activeSort.label}
                    </span>
                  </span>
                </button>

                {/* Dropdown menu */}
                {sortOpen && (
                  <div
                    className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border py-1"
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      boxShadow: `0 8px 30px ${hexAlpha(theme.background, 0.8)}`,
                    }}
                    role="listbox"
                    aria-label="Opcoes de ordenacao"
                  >
                    {SORT_OPTIONS.map((opt) => {
                      const isActive = sort === opt.value
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => {
                            setSort(opt.value)
                            setSortOpen(false)
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-xs font-medium transition-colors duration-100"
                          style={{
                            color: isActive
                              ? theme.primary
                              : theme.foreground,
                            backgroundColor: isActive
                              ? hexAlpha(theme.primary, 0.08)
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor =
                                hexAlpha(theme.foreground, 0.05)
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isActive
                              ? hexAlpha(theme.primary, 0.08)
                              : "transparent"
                          }}
                        >
                          <Icon
                            className="h-3.5 w-3.5 shrink-0"
                            style={{
                              color: isActive
                                ? theme.primary
                                : theme.mutedForeground,
                            }}
                          />
                          <span className="flex-1">{opt.label}</span>
                          {isActive && (
                            <Check
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: theme.primary }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: theme.muted }}
              >
                <Package
                  className="h-7 w-7"
                  style={{ color: theme.mutedForeground }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.foreground }}
                >
                  {searchQuery.trim()
                    ? "Nenhum produto encontrado"
                    : "Nenhum produto nesta categoria"}
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme.mutedForeground }}
                >
                  {searchQuery.trim()
                    ? "Tente buscar com outros termos."
                    : "Explore outras categorias para encontrar o que procura."}
                </p>
              </div>
              {searchQuery.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchRaw("")}
                  className="rounded-xl border px-5 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{
                    borderColor: theme.border,
                    color: theme.foreground,
                  }}
                >
                  Limpar busca
                </button>
              ) : (
                <Link
                  href={base}
                  className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                  }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Ver todos os produtos
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
