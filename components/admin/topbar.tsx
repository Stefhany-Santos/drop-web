"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, Store, ChevronDown, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebarContent } from "./sidebar"
import { TENANTS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export function AdminTopbar({ tenant }: { tenant: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { domains } = useStore()

  const currentTenant = TENANTS.find((t) => t.slug === tenant) ?? TENANTS[0]

  const storeDisplayUrl = domains.customDomain || `${domains.subdomain}.nexshop.com.br`
  const storeHref = domains.customDomain
    ? `https://${domains.customDomain}`
    : `/storefront/${tenant}`

  function switchTenant(slug: string) {
    const segments = pathname.split("/")
    if (segments.length >= 3) {
      segments[2] = slug
    }
    router.push(segments.join("/"))
  }

  function handleCopyLink() {
    const url = domains.customDomain
      ? `https://${domains.customDomain}`
      : `https://${domains.subdomain}.nexshop.com.br`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!")
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentTenant.name}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Trocar loja</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {TENANTS.map((t) => (
                <DropdownMenuItem
                  key={t.slug}
                  onClick={() => switchTenant(t.slug)}
                  className={t.slug === tenant ? "bg-accent" : ""}
                >
                  <Store className="mr-2 h-4 w-4" />
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Store link */}
          <div className="hidden items-center gap-1 md:flex">
            <span className="max-w-[200px] truncate text-xs text-muted-foreground font-mono">
              {storeDisplayUrl}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopyLink}
              title="Copiar link"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              asChild
              title="Abrir loja"
            >
              <a href={storeHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Meu perfil</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">N</span>
              </div>
              NexShop
            </SheetTitle>
          </SheetHeader>
          <MobileSidebarContent tenant={tenant} />
        </SheetContent>
      </Sheet>
    </>
  )
}
