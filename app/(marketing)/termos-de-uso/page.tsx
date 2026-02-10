import type { Metadata } from "next"
import { LegalPageLayout } from "@/components/marketing/legal-page-layout"

export const metadata: Metadata = {
  title: "Termos de Uso - NexShop",
  description:
    "Leia os termos de uso da plataforma NexShop. Saiba mais sobre as regras, responsabilidades e direitos ao utilizar nossos servicos.",
}

export default function TermosDeUsoPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      subtitle="Ao utilizar a plataforma NexShop, voce concorda com os termos descritos abaixo. Leia-os com atencao."
      breadcrumbLabel="Termos de uso"
      lastUpdated="09/02/2026"
    >
      <section>
        <h2>1. Aceitacao dos Termos</h2>
        <p>
          Ao acessar ou utilizar a plataforma NexShop, voce declara que leu, compreendeu e concorda em cumprir estes Termos de Uso. Caso nao concorde com qualquer parte destes termos, voce nao deve utilizar nossos servicos.
        </p>
        <p>
          Estes termos se aplicam a todos os usuarios da plataforma, incluindo vendedores, compradores e visitantes. A NexShop se reserva o direito de atualizar estes termos a qualquer momento, notificando os usuarios atraves da plataforma.
        </p>
      </section>

      <section>
        <h2>2. Conta do Usuario</h2>
        <p>
          Para utilizar os servicos da NexShop, voce deve criar uma conta fornecendo informacoes verdadeiras, completas e atualizadas. Voce e responsavel por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
        </p>
        <ul>
          <li>Voce deve ter pelo menos 18 anos para criar uma conta.</li>
          <li>Cada pessoa ou empresa pode manter apenas uma conta ativa.</li>
          <li>A NexShop pode suspender ou encerrar contas que violem estes termos.</li>
        </ul>
      </section>

      <section>
        <h2>3. Pagamentos</h2>
        <p>
          Os pagamentos processados pela NexShop sao realizados por meio de provedores de pagamento terceirizados. A NexShop cobra uma taxa sobre cada transacao conforme o plano contratado pelo vendedor.
        </p>
        <p>
          Os repasses aos vendedores seguem o calendario definido na plataforma. A NexShop nao se responsabiliza por atrasos causados por instituicoes financeiras ou provedores de pagamento.
        </p>
      </section>

      <section>
        <h2>4. Cancelamento e Reembolso</h2>
        <p>
          Compradores podem solicitar reembolso dentro do prazo de 7 dias apos a compra de produtos digitais, conforme previsto no Codigo de Defesa do Consumidor. Cada vendedor pode definir politicas de reembolso adicionais em sua loja.
        </p>
        <p>
          A NexShop se reserva o direito de mediar disputas entre compradores e vendedores, podendo aplicar reembolsos quando houver evidencias de fraude ou ma-fe.
        </p>
      </section>

      <section>
        <h2>5. Conteudo Proibido</h2>
        <p>
          E estritamente proibido publicar, vender ou distribuir na plataforma NexShop:
        </p>
        <ul>
          <li>Conteudo ilegal, fraudulento ou que viole direitos de terceiros.</li>
          <li>Softwares maliciosos, hacks, cheats ou ferramentas de exploracao.</li>
          <li>Conteudo que promova discriminacao, violencia ou discurso de odio.</li>
          <li>Materiais protegidos por direitos autorais sem devida autorizacao.</li>
          <li>Produtos ou servicos que violem leis locais ou internacionais.</li>
        </ul>
      </section>

      <section>
        <h2>6. Responsabilidades</h2>
        <p>
          A NexShop atua como intermediaria entre vendedores e compradores. Os vendedores sao integralmente responsaveis pelos produtos e servicos que oferecem, incluindo qualidade, entrega e suporte ao cliente.
        </p>
        <p>
          A NexShop nao garante que a plataforma estara disponivel de forma ininterrupta ou livre de erros, embora se esforce para manter a maior disponibilidade possivel.
        </p>
      </section>

      <section>
        <h2>7. Propriedade Intelectual</h2>
        <p>
          Todo o conteudo da plataforma NexShop, incluindo logotipos, design, textos e codigo-fonte, e de propriedade da NexShop ou de seus licenciadores. E proibida a reproducao, distribuicao ou uso comercial sem autorizacao previa.
        </p>
        <p>
          Os vendedores mantem a propriedade intelectual sobre os produtos que publicam, concedendo a NexShop uma licenca limitada para exibicao e distribuicao dentro da plataforma.
        </p>
      </section>

      <section>
        <h2>8. Privacidade</h2>
        <p>
          O uso dos seus dados pessoais e regido pela nossa{" "}
          <a href="/privacidade">Politica de Privacidade</a>, que faz parte integrante destes Termos de Uso. Recomendamos a leitura completa para entender como seus dados sao coletados, utilizados e protegidos.
        </p>
      </section>

      <section>
        <h2>9. Contato</h2>
        <p>
          Para duvidas, sugestoes ou reclamacoes relacionadas a estes Termos de Uso, entre em contato conosco atraves da nossa{" "}
          <a href="/contato">pagina de contato</a> ou pelo e-mail{" "}
          <a href="mailto:suporte@nexshop.com.br">suporte@nexshop.com.br</a>.
        </p>
      </section>

      <section>
        <h2>10. Alteracoes</h2>
        <p>
          A NexShop pode modificar estes Termos de Uso a qualquer momento. Alteracoes significativas serao comunicadas aos usuarios por e-mail ou atraves de notificacao na plataforma. O uso continuado da plataforma apos a publicacao das alteracoes constitui aceitacao dos novos termos.
        </p>
      </section>
    </LegalPageLayout>
  )
}
