"use client"

import Link from "next/link"
import { Mail, HelpCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { NEXSHOP_LEGAL } from "@/lib/constants"
import { hexAlpha } from "@/lib/storefront-theme"

export function StorefrontFooter() {
  const store = useStore()
  const theme = store.themeTokens
  const copy = store.copy
  const base = `/storefront/${store.tenant}`
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: theme.border, backgroundColor: theme.card }}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              {store.branding.logoUrl ? (
                <img
                  src={store.branding.logoUrl}
                  alt={store.branding.storeDisplayName}
                  className="h-7 w-7 rounded-lg object-contain"
                />
              ) : (
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  {store.branding.storeDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-bold" style={{ color: theme.foreground }}>
                {store.branding.storeDisplayName}
              </span>
            </div>
            <p
              className="max-w-[240px] text-xs leading-relaxed"
              style={{ color: theme.mutedForeground }}
            >
              {copy.subheadline}
            </p>
          </div>

          {/* Column 2 - Produtos */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Loja
            </span>
            <nav className="flex flex-col gap-2">
              <Link
                href={base}
                className="text-[13px] transition-colors"
                style={{ color: hexAlpha(theme.foreground, 0.7) }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
              >
                Produtos
              </Link>
              <Link
                href={`${base}/categories/scripts-fivem`}
                className="text-[13px] transition-colors"
                style={{ color: hexAlpha(theme.foreground, 0.7) }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
              >
                Categorias
              </Link>
            </nav>
          </div>

          {/* Column 3 - Suporte */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Suporte
            </span>
            <nav className="flex flex-col gap-2">
              <Link
                href={`${base}/support`}
                className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
                style={{ color: hexAlpha(theme.foreground, 0.7) }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Central de ajuda
              </Link>
              {copy.supportEmail && (
                <a
                  href={`mailto:${copy.supportEmail}`}
                  className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
                  style={{ color: hexAlpha(theme.foreground, 0.7) }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {copy.supportEmail}
                </a>
              )}
            </nav>
          </div>

          {/* Column 4 - Conta */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Conta
            </span>
            <nav className="flex flex-col gap-2">
              <Link
                href={`${base}/account`}
                className="text-[13px] transition-colors"
                style={{ color: hexAlpha(theme.foreground, 0.7) }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
              >
                Minha Conta
              </Link>
              <Link
                href={`${base}/cart`}
                className="text-[13px] transition-colors"
                style={{ color: hexAlpha(theme.foreground, 0.7) }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.foreground }}
                onMouseLeave={(e) => { e.currentTarget.style.color = hexAlpha(theme.foreground, 0.7) }}
              >
                Carrinho
              </Link>
            </nav>
          </div>
        </div>

        {/* Legal section */}
        <div
          className="flex flex-col gap-4 border-t py-8 lg:flex-row lg:items-center lg:justify-between"
          style={{ borderColor: theme.border }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium" style={{ color: theme.mutedForeground }}>
              {NEXSHOP_LEGAL.companyName}
              <span className="mx-1.5" style={{ color: hexAlpha(theme.mutedForeground, 0.4) }}>
                |
              </span>
              CNPJ: {NEXSHOP_LEGAL.cnpj}
              <span className="mx-1.5" style={{ color: hexAlpha(theme.mutedForeground, 0.4) }}>
                |
              </span>
              {NEXSHOP_LEGAL.address}
            </p>
            <p
              className="max-w-xl text-[10px] leading-relaxed"
              style={{ color: hexAlpha(theme.mutedForeground, 0.6) }}
            >
              {NEXSHOP_LEGAL.platformDescription}
            </p>
          </div>
          <p
            className="shrink-0 text-[11px]"
            style={{ color: hexAlpha(theme.mutedForeground, 0.6) }}
          >
            &copy; {year} {copy.footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}
