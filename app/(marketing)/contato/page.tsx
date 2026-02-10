import type { Metadata } from "next"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ContactForm } from "@/components/marketing/contact-form"
import { Mail, MessageSquare, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contato - NexShop",
  description:
    "Entre em contato com a equipe NexShop. Estamos prontos para ajudar com duvidas, sugestoes ou suporte tecnico.",
}

const contactInfo = [
  {
    icon: Mail,
    title: "E-mail",
    value: "suporte@nexshop.com.br",
    description: "Para duvidas gerais e suporte.",
  },
  {
    icon: MessageSquare,
    title: "Chat",
    value: "Disponivel no painel",
    description: "Atendimento em tempo real para clientes.",
  },
  {
    icon: Clock,
    title: "Horario",
    value: "Seg a Sex, 9h as 18h",
    description: "Horario de Brasilia (GMT-3).",
  },
]

export default function ContatoPage() {
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
            <BreadcrumbPage>Contato</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          Fale Conosco
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">
          Tem alguma duvida, sugestao ou precisa de ajuda? Preencha o formulario abaixo e nossa equipe entrara em contato o mais rapido possivel.
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Form */}
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-semibold text-foreground">
              Envie sua mensagem
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Info sidebar */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="flex flex-col gap-4">
            {contactInfo.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-foreground/80">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
