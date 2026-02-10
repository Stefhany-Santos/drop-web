import type { TenantTheme, ProductCardStyle } from "./types"

/**
 * Build a CSSProperties-like object from TenantTheme tokens.
 * Use this on the shell wrapper so all children can reference CSS vars.
 */
export function buildThemeCSSVars(theme: TenantTheme): Record<string, string> {
  return {
    "--sf-primary": theme.primary,
    "--sf-primary-fg": theme.primaryForeground,
    "--sf-bg": theme.background,
    "--sf-fg": theme.foreground,
    "--sf-card": theme.card,
    "--sf-card-fg": theme.cardForeground,
    "--sf-muted": theme.muted,
    "--sf-muted-fg": theme.mutedForeground,
    "--sf-border": theme.border,
    "--sf-ring": theme.ring,
  }
}

/**
 * Generates an rgba-like opacity variant of a hex color.
 * E.g. hexAlpha("#22c55e", 0.1) -> "rgba(34,197,94,0.1)"
 */
export function hexAlpha(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "")
  const r = Number.parseInt(sanitized.substring(0, 2), 16)
  const g = Number.parseInt(sanitized.substring(2, 4), 16)
  const b = Number.parseInt(sanitized.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * Get box-shadow from ProductCardStyle shadow level.
 */
export function getCardShadow(shadow: ProductCardStyle["shadow"]): string {
  switch (shadow) {
    case "none":
      return "none"
    case "sm":
      return "0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)"
    case "md":
      return "0 4px 12px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.08)"
    case "lg":
      return "0 10px 30px rgba(0,0,0,.16), 0 4px 8px rgba(0,0,0,.1)"
    default:
      return "none"
  }
}
