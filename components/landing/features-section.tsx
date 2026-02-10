import {
  CreditCard,
  BarChart3,
  Palette,
  Shield,
  Globe,
  Bell,
  Layers,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "Checkout otimizado",
    description: "Checkout rápido e seguro com múltiplas formas de pagamento.",
  },
  {
    icon: BarChart3,
    title: "Dashboard completo",
    description: "Métricas, vendas, clientes e relatórios em tempo real.",
  },
  {
    icon: Palette,
    title: "Personalização total",
    description: "Customize cores, layout e domínio da sua loja como quiser.",
  },
  {
    icon: Shield,
    title: "Segurança avançada",
    description: "Proteção contra fraudes, SSL e criptografia de ponta a ponta.",
  },
  {
    icon: Globe,
    title: "Subdomínio gratuito",
    description: "Tenha sualoja.nexshop.com.br ou conecte seu domínio próprio.",
  },
  {
    icon: Bell,
    title: "Notificações",
    description: "Alertas de vendas, estoque e atividades via e-mail e webhook.",
  },
  {
    icon: Layers,
    title: "Multi-loja",
    description: "Gerencie múltiplas lojas a partir de uma única conta.",
  },
  {
    icon: Zap,
    title: "API e Integrações",
    description: "Conecte com Discord, Telegram, WhatsApp e muito mais.",
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Recursos</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tudo que você precisa para vender online
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ferramentas profissionais para gerenciar, vender e escalar seu negócio digital.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
