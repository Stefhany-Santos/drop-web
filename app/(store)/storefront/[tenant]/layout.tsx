import React from "react"
import { StoreProvider } from "@/lib/store"

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params

  return <StoreProvider tenant={tenant}>{children}</StoreProvider>
}
