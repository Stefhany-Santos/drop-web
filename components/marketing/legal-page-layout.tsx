"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FileText, Shield, Users, Mail } from "lucide-react"

const sidebarLinks = [
  { label: "Termos de uso", href: "/termos-de-uso", icon: FileText },
  { label: "Privacidade", href: "/privacidade", icon: Shield },
  { label: "Sobre", href: "/sobre", icon: Users },
  { label: "Contato", href: "/contato", icon: Mail },
]

interface LegalPageLayoutProps {
  title: string
  subtitle?: string
  breadcrumbLabel: string
  lastUpdated?: string
  children: React.ReactNode
}

export function LegalPageLayout({
  title,
  subtitle,
  breadcrumbLabel,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Institucional
            </p>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">
                {subtitle}
              </p>
            )}
            {lastUpdated && (
              <p className="mt-3 text-sm text-muted-foreground">
                {"Ultima atualizacao: "}{lastUpdated}
              </p>
            )}
          </header>

          <div className="max-w-4xl space-y-8 text-base leading-relaxed text-foreground/90 [&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-1 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80">
            {children}
          </div>

          {/* CTA to contact */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Duvidas?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Se voce tiver alguma duvida sobre esta pagina ou qualquer outro assunto, entre em contato conosco. Nossa equipe esta pronta para ajudar.
            </p>
            <Link
              href="/contato"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              Fale conosco
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
