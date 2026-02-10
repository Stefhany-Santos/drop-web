"use client"

import React from "react"
import type { TenantTheme } from "@/lib/types"
import { buildThemeCSSVars } from "@/lib/storefront-theme"

interface Props {
  theme: TenantTheme
  children: React.ReactNode
}

export function StorefrontShell({ theme, children }: Props) {
  const vars = buildThemeCSSVars(theme)

  return (
    <div
      className="flex min-h-screen flex-col"
      suppressHydrationWarning
      style={{
        ...vars,
        backgroundColor: theme.background,
        color: theme.foreground,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
