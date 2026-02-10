"use client"

import Link from "next/link"
import { Mail, HelpCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { hexAlpha } from "@/lib/storefront-theme"

/* ─────────────────────────────────────────────
   Footer link — reusable to avoid inline repetition
   ───────────────────────────────────────────── */
function FooterLink({
  href,
  children,
  theme,
  external,
}: {
  href: string
  children: React.ReactNode
  theme: { foreground: string }
  external?: boolean
}) {
  const restColor = hexAlpha(theme.foreground, 0.55)
  const Tag = external ? "a" : Link
  const extra = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {}

  return (
    <Tag
      href={href}
      className="text-[13px] leading-relaxed transition-colors duration-150"
      style={{ color: restColor }}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = theme.foreground
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = restColor
      }}
      {...extra}
    >
      {children}
    </Tag>
  )
}

/* ─────────────────────────────────────────────
   StorefrontFooter
   ───────────────────────────────────────────── */
export function StorefrontFooter() {
  const store = useStore()
  const theme = store.themeTokens
  const copy = store.copy
  const base = `/storefront/${store.tenant}`
  const year = new Date().getFullYear()
  const storeName = store.branding.storeDisplayName

  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: theme.border, backgroundColor: theme.card }}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* ── Top: Brand + nav columns ── */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:gap-12">
          {/* Brand block — spans full width on mobile, 1 col on sm+ */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              {store.branding.logoUrl ? (
                <img
                  src={store.branding.logoUrl}
                  alt={storeName}
                  className="h-7 w-7 rounded-lg object-contain"
                />
              ) : (
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                  }}
                >
                  {storeName.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className="text-sm font-bold tracking-tight"
                style={{ color: theme.foreground }}
              >
                {storeName}
              </span>
            </div>
            <p
              className="max-w-[220px] text-xs leading-relaxed"
              style={{ color: theme.mutedForeground }}
            >
              {copy.subheadline}
            </p>
          </div>

          {/* Column — Loja */}
          <nav className="flex flex-col gap-2.5">
            <span
              className="mb-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Loja
            </span>
            <FooterLink href={base} theme={theme}>
              Produtos
            </FooterLink>
            <FooterLink href={`${base}/categories/scripts-fivem`} theme={theme}>
              Categorias
            </FooterLink>
          </nav>

          {/* Column — Ajuda */}
          <nav className="flex flex-col gap-2.5">
            <span
              className="mb-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Ajuda
            </span>
            <FooterLink href={`${base}/support`} theme={theme}>
              <span className="inline-flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Suporte
              </span>
            </FooterLink>
            {copy.supportEmail && (
              <FooterLink
                href={`mailto:${copy.supportEmail}`}
                theme={theme}
                external
              >
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {copy.supportEmail}
                </span>
              </FooterLink>
            )}
          </nav>

          {/* Column — Conta */}
          <nav className="flex flex-col gap-2.5">
            <span
              className="mb-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.mutedForeground }}
            >
              Conta
            </span>
            <FooterLink href={`${base}/account`} theme={theme}>
              Minha Conta
            </FooterLink>
            <FooterLink href={`${base}/cart`} theme={theme}>
              Carrinho
            </FooterLink>
          </nav>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex items-center justify-between border-t py-6"
          style={{ borderColor: theme.border }}
        >
          <p
            className="text-[11px]"
            style={{ color: hexAlpha(theme.mutedForeground, 0.7) }}
          >
            &copy; {year} {storeName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
