import { UserPlus, Store, Rocket } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie sua conta",
    description: "Registre-se gratuitamente em menos de 1 minuto. Sem cartão de crédito.",
  },
  {
    icon: Store,
    step: "02",
    title: "Configure sua loja",
    description: "Escolha o tipo da loja, personalize e adicione seus produtos ou serviços.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Comece a vender",
    description: "Publique sua loja e comece a receber pagamentos de forma segura e automatizada.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Como funciona</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Comece em 3 passos simples
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Do registro até a primeira venda em poucos minutos.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="group relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">
                {step.step}
              </span>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
