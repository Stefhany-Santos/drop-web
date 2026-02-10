import type { Metadata } from "next"
import { LegalPageLayout } from "@/components/marketing/legal-page-layout"
import { Rocket, ShieldCheck, Globe, Headphones, BarChart3, Palette } from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre - NexShop",
  description:
    "Conheca a NexShop, a plataforma completa para vender produtos digitais, servicos e servidores de jogos. Nossa missao, diferenciais e visao de futuro.",
}

const diferenciais = [
  {
    icon: Rocket,
    title: "Lancamento rapido",
    description: "Crie sua loja em minutos, sem necessidade de conhecimentos tecnicos.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamentos seguros",
    description: "Transacoes protegidas com criptografia e provedores confiaveis.",
  },
  {
    icon: Globe,
    title: "Subdominio personalizado",
    description: "Cada loja recebe seu proprio endereco na web, pronto para compartilhar.",
  },
  {
    icon: Headphones,
    title: "Suporte dedicado",
    description: "Equipe pronta para ajudar voce a crescer e resolver qualquer duvida.",
  },
  {
    icon: BarChart3,
    title: "Painel analitico",
    description: "Acompanhe vendas, receita e desempenho em tempo real.",
  },
  {
    icon: Palette,
    title: "Personalizacao total",
    description: "Customize cores, layout e identidade visual da sua loja.",
  },
]

export default function SobrePage() {
  return (
    <LegalPageLayout
      title="Sobre a NexShop"
      subtitle="Acreditamos que qualquer pessoa deve poder vender online de forma simples, segura e profissional."
      breadcrumbLabel="Sobre"
    >
      <section>
        <h2>Nossa Missao</h2>
        <p>
          A NexShop nasceu com a missao de democratizar o comercio digital no Brasil. Queremos que criadores, desenvolvedores, empreendedores e comunidades de jogos tenham acesso a ferramentas profissionais para vender seus produtos e servicos online, sem barreiras tecnicas ou financeiras.
        </p>
      </section>

      <section>
        <h2>O que Fazemos</h2>
        <p>
          Somos uma plataforma multi-tenant de e-commerce focada em produtos digitais, servicos sob demanda e servidores de jogos. Oferecemos uma solucao completa que inclui:
        </p>
        <ul>
          <li>Criacao de lojas com subdominio personalizado em poucos minutos.</li>
          <li>Processamento seguro de pagamentos com multiplos metodos.</li>
          <li>Entrega automatica de produtos digitais apos a compra.</li>
          <li>Painel de gestao com metricas de vendas em tempo real.</li>
          <li>Integracao com servidores FiveM e GTA RP para venda de pacotes e VIPs.</li>
        </ul>
      </section>

      <section>
        <h2>Para Quem e</h2>
        <p>
          A NexShop foi construida para atender diferentes perfis de vendedores digitais:
        </p>
        <ul>
          <li>
            <strong>Criadores de conteudo:</strong> venda e-books, cursos, templates, presets e outros infoprodutos.
          </li>
          <li>
            <strong>Desenvolvedores:</strong> comercialize scripts, plugins, temas e assets digitais.
          </li>
          <li>
            <strong>Comunidades de jogos:</strong> venda pacotes VIP, itens, whitelist e servicos para servidores FiveM e GTA RP.
          </li>
          <li>
            <strong>Freelancers e agencias:</strong> ofereca servicos de design, desenvolvimento, marketing e consultoria.
          </li>
        </ul>
      </section>

      <section>
        <h2>Principais Diferenciais</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {diferenciais.map((item) => {
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
                  <h3 className="!mt-0 !mb-1 text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="!mb-0 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2>Roadmap</h2>
        <p>
          Estamos em constante evolucao. Aqui esta um resumo do que planejamos para os proximos meses:
        </p>
        <ol>
          <li>
            <strong>Marketplace publico:</strong> um catalogo onde compradores podem descobrir e navegar entre lojas e produtos.
          </li>
          <li>
            <strong>Sistema de avaliacoes:</strong> avaliacoes e reviews publicos para aumentar a confianca entre compradores e vendedores.
          </li>
          <li>
            <strong>API publica:</strong> endpoints para integracao de lojas com sistemas externos e automacoes.
          </li>
          <li>
            <strong>Aplicativo mobile:</strong> gestao da loja e acompanhamento de vendas diretamente pelo celular.
          </li>
          <li>
            <strong>Programas de afiliados:</strong> ferramentas para que vendedores criem programas de indicacao e comissao.
          </li>
        </ol>
      </section>
    </LegalPageLayout>
  )
}
