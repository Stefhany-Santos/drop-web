import type { Metadata } from "next"
import { LegalPageLayout } from "@/components/marketing/legal-page-layout"

export const metadata: Metadata = {
  title: "Politica de Privacidade - NexShop",
  description:
    "Saiba como a NexShop coleta, utiliza e protege seus dados pessoais. Transparencia e seguranca para voce.",
}

export default function PrivacidadePage() {
  return (
    <LegalPageLayout
      title="Politica de Privacidade"
      subtitle="A NexShop valoriza a sua privacidade. Este documento descreve como coletamos, utilizamos e protegemos seus dados pessoais."
      breadcrumbLabel="Privacidade"
      lastUpdated="09/02/2026"
    >
      <section>
        <h2>1. Dados Coletados</h2>
        <p>
          A NexShop coleta os seguintes tipos de dados pessoais durante o uso da plataforma:
        </p>
        <ul>
          <li>
            <strong>Dados de cadastro:</strong> nome completo, e-mail, CPF/CNPJ e informacoes de contato.
          </li>
          <li>
            <strong>Dados de transacao:</strong> historico de compras, valores, metodos de pagamento utilizados.
          </li>
          <li>
            <strong>Dados de navegacao:</strong> endereco IP, tipo de navegador, paginas acessadas e tempo de permanencia.
          </li>
          <li>
            <strong>Dados do dispositivo:</strong> sistema operacional, tipo de dispositivo e resolucao de tela.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Finalidade do Tratamento</h2>
        <p>
          Os dados coletados sao utilizados para as seguintes finalidades:
        </p>
        <ul>
          <li>Prestacao e melhoria dos servicos da plataforma.</li>
          <li>Processamento de pagamentos e repasses aos vendedores.</li>
          <li>Comunicacao sobre atualizacoes, novidades e suporte ao cliente.</li>
          <li>Prevencao de fraudes e seguranca da plataforma.</li>
          <li>Cumprimento de obrigacoes legais e regulatorias.</li>
        </ul>
      </section>

      <section>
        <h2>3. Base Legal</h2>
        <p>
          O tratamento dos dados pessoais pela NexShop e realizado com fundamento nas seguintes bases legais previstas na Lei Geral de Protecao de Dados (LGPD):
        </p>
        <ul>
          <li>Execucao de contrato ou procedimentos preliminares.</li>
          <li>Consentimento do titular dos dados.</li>
          <li>Cumprimento de obrigacao legal ou regulatoria.</li>
          <li>Interesse legitimo do controlador.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies</h2>
        <p>
          A NexShop utiliza cookies e tecnologias semelhantes para melhorar a experiencia do usuario, analisar o trafego do site e personalizar conteudo. Os cookies podem ser:
        </p>
        <ul>
          <li>
            <strong>Essenciais:</strong> necessarios para o funcionamento basico da plataforma.
          </li>
          <li>
            <strong>Analiticos:</strong> utilizados para entender como os usuarios interagem com a plataforma.
          </li>
          <li>
            <strong>Marketing:</strong> utilizados para exibir conteudo relevante e campanhas direcionadas.
          </li>
        </ul>
        <p>
          Voce pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade de alguns recursos da plataforma.
        </p>
      </section>

      <section>
        <h2>5. Compartilhamento de Dados</h2>
        <p>
          A NexShop pode compartilhar seus dados pessoais com terceiros nas seguintes situacoes:
        </p>
        <ul>
          <li>Provedores de pagamento para processamento de transacoes.</li>
          <li>Servicos de hospedagem e infraestrutura em nuvem.</li>
          <li>Ferramentas de analytics para melhoria dos servicos.</li>
          <li>Autoridades competentes quando exigido por lei.</li>
        </ul>
        <p>
          A NexShop nao vende, aluga ou comercializa dados pessoais de seus usuarios a terceiros para fins de marketing.
        </p>
      </section>

      <section>
        <h2>6. Retencao de Dados</h2>
        <p>
          Os dados pessoais serao retidos pelo tempo necessario para cumprir as finalidades para as quais foram coletados, incluindo o cumprimento de obrigacoes legais, contabeis ou de relatorios. Apos esse periodo, os dados serao anonimizados ou eliminados de forma segura.
        </p>
      </section>

      <section>
        <h2>7. Seguranca</h2>
        <p>
          A NexShop implementa medidas tecnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso nao autorizado, perda, destruicao ou alteracao. Isso inclui criptografia de dados, controle de acesso restrito e auditorias regulares de seguranca.
        </p>
      </section>

      <section>
        <h2>8. Direitos do Titular</h2>
        <p>
          Em conformidade com a LGPD, voce possui os seguintes direitos sobre seus dados pessoais:
        </p>
        <ul>
          <li>Confirmacao da existencia de tratamento de dados.</li>
          <li>Acesso aos seus dados pessoais.</li>
          <li>Correcao de dados incompletos, inexatos ou desatualizados.</li>
          <li>Anonimizacao, bloqueio ou eliminacao de dados desnecessarios.</li>
          <li>Portabilidade dos dados a outro fornecedor de servico.</li>
          <li>Eliminacao dos dados tratados com base no consentimento.</li>
          <li>Revogacao do consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <a href="mailto:privacidade@nexshop.com.br">privacidade@nexshop.com.br</a>.
        </p>
      </section>

      <section>
        <h2>9. Encarregado de Protecao de Dados (DPO)</h2>
        <p>
          A NexShop designou um Encarregado de Protecao de Dados para atender solicitacoes dos titulares e da Autoridade Nacional de Protecao de Dados (ANPD). Para entrar em contato:
        </p>
        <ul>
          <li>
            <strong>E-mail:</strong>{" "}
            <a href="mailto:dpo@nexshop.com.br">dpo@nexshop.com.br</a>
          </li>
          <li>
            <strong>Formulario:</strong>{" "}
            <a href="/contato">Pagina de contato</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>10. Alteracoes</h2>
        <p>
          Esta Politica de Privacidade pode ser atualizada periodicamente para refletir mudancas em nossas praticas de dados ou em requisitos legais. Alteracoes significativas serao comunicadas por e-mail ou aviso na plataforma. Recomendamos a revisao periodica deste documento.
        </p>
      </section>
    </LegalPageLayout>
  )
}
