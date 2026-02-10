import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    period: "",
    description: "Para quem está começando a vender online.",
    features: [
      "Até 10 produtos",
      "Subdomínio gratuito",
      "Checkout básico",
      "Dashboard de vendas",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para lojas em crescimento que precisam de mais.",
    features: [
      "Produtos ilimitados",
      "Domínio personalizado",
      "Checkout otimizado",
      "Analytics avançado",
      "Integrações (Discord, Telegram)",
      "Suporte prioritário",
    ],
    cta: "Começar agora",
    highlight: true,
  },
  {
    name: "Business",
    price: "R$ 149",
    period: "/mês",
    description: "Para operações de grande escala e multi-loja.",
    features: [
      "Tudo do Pro",
      "Multi-loja",
      "API completa",
      "Webhooks avançados",
      "White-label",
      "Gerente de conta dedicado",
    ],
    cta: "Falar com vendas",
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="planos" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Planos</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Escolha o plano ideal para você
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece gratuitamente e escale conforme seu negócio cresce.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                plan.highlight
                  ? "border-primary bg-card shadow-xl shadow-primary/5"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Recomendado
                </span>
              )}
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.highlight ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
