import React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { StoreProvider } from "@/lib/store"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function AdminTenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params

  return (
    <StoreProvider tenant={tenant}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar tenant={tenant} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar tenant={tenant} />
          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-6">{children}</main>
          </ScrollArea>
        </div>
      </div>
    </StoreProvider>
  )
}
