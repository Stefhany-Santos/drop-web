"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Grid3X3,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"

export function StorefrontHeader() {
  const store = useStore()
  const theme = store.themeTokens
  const branding = store.branding
  const cartCount = store.cart.reduce((s, i) => s + i.quantity, 0)
  const base = `/storefront/${store.tenant}`
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const navLinks = [
    { href: base, label: "Produtos", icon: Package },
    { href: `${base}/categories/scripts-fivem`, label: "Categorias", icon: Grid3X3 },
    { href: `${base}/support`, label: "Suporte", icon: HelpCircle },
  ]

  return (
    <>
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: hexAlpha(theme.card, 0.85),
          borderBottom: `1px solid ${theme.border}`,
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href={base} className="flex items-center gap-2.5">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl || "/placeholder.svg"}
                alt={branding.storeDisplayName}
                className="h-8 w-8 rounded-lg object-contain"
              />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                }}
              >
                {branding.storeDisplayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className="text-base font-bold tracking-tight"
              style={{ color: theme.foreground }}
            >
              {branding.storeDisplayName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors"
                style={{ color: theme.mutedForeground }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.foreground
                  e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.mutedForeground
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Account desktop */}
            {store.customerSession.isLoggedIn ? (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: theme.foreground }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                  }}
                  onMouseLeave={(e) => {
                    if (!accountOpen) e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  {store.customerSession.avatarUrl ? (
                    <img
                      src={store.customerSession.avatarUrl || "/placeholder.svg"}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                      {(store.customerSession.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[80px] truncate">
                    {store.customerSession.name}
                  </span>
                  <ChevronDown className="h-3 w-3" style={{ color: theme.mutedForeground }} />
                </button>
                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountOpen(false)}
                      onKeyDown={() => {}}
                      role="button"
                      tabIndex={-1}
                    />
                    <div
                      className="absolute right-0 top-full z-50 mt-1 flex w-48 flex-col overflow-hidden rounded-xl border"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: theme.card,
                        boxShadow: "0 8px 30px rgba(0,0,0,.2)",
                      }}
                    >
                      <div className="px-3 pb-2 pt-3">
                        <p className="truncate text-xs font-semibold" style={{ color: theme.foreground }}>
                          {store.customerSession.name}
                        </p>
                        <p className="truncate text-[10px]" style={{ color: theme.mutedForeground }}>
                          {store.customerSession.email ?? store.customerSession.discordUsername}
                        </p>
                      </div>
                      <div className="h-px" style={{ backgroundColor: theme.border }} />
                      <Link
                        href={`${base}/account`}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors"
                        style={{ color: theme.foreground }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <User className="h-3.5 w-3.5" style={{ color: theme.mutedForeground }} />
                        Minha Conta
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          store.logoutCustomer()
                          setAccountOpen(false)
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors"
                        style={{ color: theme.mutedForeground }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href={`${base}/account`}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors md:flex"
                style={{ color: theme.foreground }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.05)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <User className="h-4 w-4" />
                Entrar
              </Link>
            )}

            {/* Cart button */}
            <Link
              href={`${base}/cart`}
              className="relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: theme.primary,
                color: theme.primaryForeground,
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: theme.foreground,
                    color: theme.background,
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 md:hidden"
              style={{ color: theme.foreground }}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-72 flex-col"
            style={{ backgroundColor: theme.card }}
          >
            <div
              className="flex h-16 items-center justify-between border-b px-4"
              style={{ borderColor: theme.border }}
            >
              <span className="text-sm font-bold" style={{ color: theme.foreground }}>
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2"
                style={{ color: theme.mutedForeground }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-0.5 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
                  style={{ color: theme.foreground }}
                >
                  <link.icon className="h-4 w-4" style={{ color: theme.mutedForeground }} />
                  {link.label}
                </Link>
              ))}

              <div className="my-2 h-px" style={{ backgroundColor: theme.border }} />

              {store.customerSession.isLoggedIn ? (
                <>
                  <Link
                    href={`${base}/account`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
                    style={{ color: theme.foreground }}
                  >
                    {store.customerSession.avatarUrl ? (
                      <img src={store.customerSession.avatarUrl || "/placeholder.svg"} alt="" className="h-5 w-5 rounded-full" />
                    ) : (
                      <User className="h-4 w-4" style={{ color: theme.mutedForeground }} />
                    )}
                    Minha Conta
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      store.logoutCustomer()
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
                    style={{ color: theme.mutedForeground }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href={`${base}/account`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
                  style={{ color: theme.foreground }}
                >
                  <User className="h-4 w-4" style={{ color: theme.mutedForeground }} />
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
