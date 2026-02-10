import { FileText, Headphones, Gamepad2, Server, Package, GraduationCap } from "lucide-react"

const categories = [
  {
    icon: FileText,
    title: "Produtos digitais",
    description: "E-books, templates, presets, softwares e qualquer arquivo digital.",
  },
  {
    icon: Headphones,
    title: "Serviços",
    description: "Consultorias, mentorias, design, desenvolvimento e mais.",
  },
  {
    icon: Gamepad2,
    title: "Contas de jogos",
    description: "Venda contas, itens e ativos de jogos de forma segura.",
  },
  {
    icon: Server,
    title: "FiveM / GTA RP",
    description: "Servidores, scripts, veículos, mapas e recursos para FiveM.",
  },
  {
    icon: GraduationCap,
    title: "Cursos e aulas",
    description: "Venda acesso a cursos online e conteúdos educativos.",
  },
  {
    icon: Package,
    title: "Assinaturas",
    description: "Crie planos recorrentes e gere receita previsível.",
  },
]

export function SellSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Categorias</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            O que você pode vender
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uma plataforma versátil para diversos tipos de negócios digitais.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <cat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">{cat.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
