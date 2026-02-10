import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card px-8 py-16 text-center md:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(152_60%_42%/0.08),transparent)]" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pronto para criar sua loja digital?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Junte-se a milhares de empreendedores que já vendem online com a NexShop.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </div>
      </div>
    </section>
  )
}
