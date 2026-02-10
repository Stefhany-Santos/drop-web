import type { OrderStatus, ProductStatus, SubscriptionPlan } from "./types"

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  pago: { label: "Pago", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  enviado: { label: "Enviado", color: "bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  entregue: { label: "Entregue", color: "bg-primary/15 text-primary" },
  cancelado: { label: "Cancelado", color: "bg-destructive/15 text-destructive" },
  reembolsado: { label: "Reembolsado", color: "bg-muted text-muted-foreground" },
}

export const PRODUCT_STATUS_MAP: Record<ProductStatus, { label: string; color: string }> = {
  ativo: { label: "Ativo", color: "bg-primary/15 text-primary" },
  rascunho: { label: "Rascunho", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  arquivado: { label: "Arquivado", color: "bg-muted text-muted-foreground" },
}

export const PLAN_DETAILS: Record<SubscriptionPlan, { name: string; price: number; features: string[] }> = {
  starter: {
    name: "Starter",
    price: 0,
    features: [
      "Até 10 produtos",
      "1 loja",
      "Checkout básico",
      "Suporte por email",
    ],
  },
  pro: {
    name: "Pro",
    price: 9900,
    features: [
      "Até 100 produtos",
      "3 lojas",
      "Checkout customizado",
      "Domínio personalizado",
      "Cupons e descontos",
      "Suporte prioritário",
    ],
  },
  business: {
    name: "Business",
    price: 24900,
    features: [
      "Produtos ilimitados",
      "Lojas ilimitadas",
      "API completa",
      "White label",
      "Suporte dedicado",
      "Webhooks e integrações",
    ],
  },
}

export const TENANTS = [
  { slug: "minha-loja", name: "Minha Loja", logoUrl: "" },
  { slug: "game-store", name: "Game Store", logoUrl: "" },
] as const

// ── NexShop Legal Info ──
export const NEXSHOP_LEGAL = {
  companyName: "NexShop Tecnologia Ltda",
  cnpj: "00.000.000/0001-00",
  address: "Sao Paulo, SP - Brasil",
  platformDescription:
    "NexShop e uma plataforma de e-commerce para produtos digitais. Todos os produtos sao de responsabilidade de seus respectivos vendedores.",
} as const
