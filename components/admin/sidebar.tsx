"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Settings,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const NAV_ITEMS = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Categorias", href: "categories", icon: FolderTree },
  { label: "Produtos", href: "products", icon: Package },
  { label: "Pedidos", href: "orders", icon: ShoppingCart },
  { label: "Clientes", href: "customers", icon: Users },
  { label: "Configurações", href: "settings", icon: Settings },
  { label: "Assinatura", href: "subscription", icon: CreditCard },
]

export function AdminSidebar({ tenant }: { tenant: string }) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">N</span>
        </div>
        <span className="font-display text-lg font-bold text-foreground">NexShop</span>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const fullHref = `/admin/${tenant}/${item.href}`
            const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`)
            return (
              <Link
                key={item.href}
                href={fullHref}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}

export function MobileSidebarContent({ tenant }: { tenant: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const fullHref = `/admin/${tenant}/${item.href}`
        const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`)
        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
