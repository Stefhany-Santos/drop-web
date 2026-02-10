"use client"

import Link from "next/link"
import { Mail, HelpCircle, Shield } from "lucide-react"
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
        <div className="flex flex-col gap-10 py-12 lg:flex-row lg:justify-between">
          {/* Brand column */}
          <div className="flex flex-col gap-3 lg:max-w-xs">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
              >
                {store.branding.storeDisplayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold" style={{ color: theme.foreground }}>
                {store.branding.storeDisplayName}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
              {copy.subheadline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.mutedForeground }}
              >
                Loja
              </span>
              <div className="flex flex-col gap-2.5">
                <Link href={base} className="text-[13px] transition-opacity hover:opacity-70" style={{ color: theme.foreground }}>
                  Produtos
                </Link>
                <Link href={`${base}/categories/scripts-fivem`} className="text-[13px] transition-opacity hover:opacity-70" style={{ color: theme.foreground }}>
                  Categorias
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.mutedForeground }}
              >
                Ajuda
              </span>
              <div className="flex flex-col gap-2.5">
                <Link
                  href={`${base}/support`}
                  className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
                  style={{ color: theme.foreground }}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Suporte
                </Link>
                {copy.supportEmail && (
                  <a
                    href={`mailto:${copy.supportEmail}`}
                    className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
                    style={{ color: theme.foreground }}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {copy.supportEmail}
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.mutedForeground }}
              >
                Conta
              </span>
              <div className="flex flex-col gap-2.5">
                <Link href={`${base}/account`} className="text-[13px] transition-opacity hover:opacity-70" style={{ color: theme.foreground }}>
                  Minha Conta
                </Link>
                <Link href={`${base}/cart`} className="text-[13px] transition-opacity hover:opacity-70" style={{ color: theme.foreground }}>
                  Carrinho
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal section */}
        <div
          className="flex flex-col gap-5 border-t py-8 lg:flex-row lg:items-start lg:justify-between"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: hexAlpha(theme.mutedForeground, 0.1) }}
            >
              <Shield className="h-4 w-4" style={{ color: theme.mutedForeground }} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-semibold" style={{ color: theme.mutedForeground }}>
                {NEXSHOP_LEGAL.companyName} - CNPJ: {NEXSHOP_LEGAL.cnpj}
              </p>
              <p className="text-[11px]" style={{ color: theme.mutedForeground }}>
                {NEXSHOP_LEGAL.address}
              </p>
              <p className="mt-0.5 max-w-lg text-[10px] leading-relaxed" style={{ color: theme.mutedForeground }}>
                {NEXSHOP_LEGAL.platformDescription}
              </p>
            </div>
          </div>
          <p className="shrink-0 text-[11px]" style={{ color: theme.mutedForeground }}>
            {year} {copy.footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}
