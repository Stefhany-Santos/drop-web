import Link from "next/link"
import { Zap } from "lucide-react"

const footerLinks = {
  Produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Planos", href: "#planos" },
    { label: "Integrações", href: "#" },
  ],
  Empresa: [
    { label: "Sobre", href: "/sobre" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "/contato" },
  ],
  Legal: [
    { label: "Termos de uso", href: "/termos-de-uso" },
    { label: "Privacidade", href: "/privacidade" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                NexShop
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A plataforma completa para vender produtos digitais, serviços e servidores de jogos.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              {links.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            {"© 2026 NexShop. Todos os direitos reservados."}
          </p>
        </div>
      </div>
    </footer>
  )
}
