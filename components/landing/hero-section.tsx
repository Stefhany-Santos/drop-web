import Link from "next/link"
import { ArrowRight, ShieldCheck, Globe, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { icon: ShieldCheck, label: "Pagamentos seguros" },
  { icon: Globe, label: "Subdomínio próprio" },
  { icon: BarChart3, label: "Analytics em tempo real" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(152_60%_42%/0.12),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Plataforma em constante evolução
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-balance">
              Sua loja digital.{" "}
              <span className="text-primary">Sem limites.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Crie, gerencie e escale sua loja de produtos digitais, serviços e servidores de jogos.
            Tudo em uma plataforma profissional e pronta para crescer.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 text-base" asChild>
              <Link href="/register">
                Criar minha loja
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
              <a href="#planos">Ver planos</a>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
            {highlights.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
