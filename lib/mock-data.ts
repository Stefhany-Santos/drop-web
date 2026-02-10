import type {
  Category,
  Coupon,
  Customer,
  KpiData,
  MockUser,
  Order,
  Product,
  ProductCardStyle,
  RevenueDataPoint,
  StoreSettings,
  Subscription,
  TenantBranding,
  TenantCopy,
  TenantDomains,
  TenantTheme,
} from "./types"

// ── Categories ──
export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Scripts FiveM", slug: "scripts-fivem", productCount: 4 },
  { id: "cat-2", name: "Veículos", slug: "veiculos", productCount: 2 },
  { id: "cat-3", name: "Mapas", slug: "mapas", productCount: 1 },
  { id: "cat-4", name: "Serviços", slug: "servicos", productCount: 1 },
  { id: "cat-5", name: "Templates", slug: "templates", productCount: 0 },
]

// ── Products ──
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Sistema de Empregos v3",
    slug: "sistema-empregos-v3",
    categoryId: "cat-1",
    description: "Sistema completo de empregos para FiveM com 15+ profissões, UI customizável e integração com economia.",
    price: 4990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Empregos+v3"],
    badges: ["Mais vendido", "Atualizado"],
    benefits: ["15+ profissões", "UI customizável", "Integração ESX/QBCore", "Suporte 30 dias"],
    variants: [
      { id: "var-1a", name: "ESX", price: 4990, stock: 999 },
      { id: "var-1b", name: "QBCore", price: 5490, stock: 999 },
    ],
    status: "ativo",
    createdAt: "2025-08-15T10:00:00Z",
    delivery: { type: "download", requiresCityId: true },
  },
  {
    id: "prod-2",
    name: "HUD Personalizada Pro",
    slug: "hud-personalizada-pro",
    categoryId: "cat-1",
    description: "HUD moderna e responsiva com minimapa, status de vida, fome, sede e armadura.",
    price: 2990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=HUD+Pro"],
    badges: ["Novo"],
    benefits: ["Design moderno", "Customizável via config", "Leve e otimizada"],
    variants: [],
    status: "ativo",
    createdAt: "2025-09-20T14:30:00Z",
    delivery: { type: "download" },
  },
  {
    id: "prod-3",
    name: "Pack de Veículos Brasileiros",
    slug: "pack-veiculos-br",
    categoryId: "cat-2",
    description: "Pack com 20 veículos brasileiros modelados em alta qualidade para FiveM.",
    price: 7990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Veiculos+BR"],
    badges: [],
    benefits: ["20 veículos", "Alta qualidade", "Handling realista"],
    variants: [],
    status: "ativo",
    createdAt: "2025-07-10T09:00:00Z",
  },
  {
    id: "prod-4",
    name: "Mapa Favela Completa",
    slug: "mapa-favela-completa",
    categoryId: "cat-3",
    description: "Mapa detalhado de favela com interiores, iluminação e otimização de performance.",
    price: 14990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Favela+Map"],
    badges: ["Premium"],
    benefits: ["Interiores acessíveis", "Iluminação noturna", "LOD otimizado"],
    variants: [],
    status: "rascunho",
    createdAt: "2025-10-01T16:00:00Z",
  },
  {
    id: "prod-5",
    name: "Sistema de Garagem Avançado",
    slug: "sistema-garagem-avancado",
    categoryId: "cat-1",
    description: "Garagem com múltiplos slots, preview 3D dos veículos e integração com mecânica.",
    price: 3990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Garagem"],
    badges: [],
    benefits: ["Preview 3D", "Múltiplos slots", "Sistema de mecânica"],
    variants: [],
    status: "ativo",
    createdAt: "2025-06-22T11:00:00Z",
  },
  {
    id: "prod-6",
    name: "Configuração de Servidor",
    slug: "configuracao-servidor",
    categoryId: "cat-4",
    description: "Serviço de instalação e configuração completa do seu servidor FiveM.",
    price: 19990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Config+Server"],
    badges: ["Serviço"],
    benefits: ["Instalação completa", "Otimização", "Suporte 7 dias"],
    variants: [],
    status: "ativo",
    createdAt: "2025-05-18T08:00:00Z",
    delivery: { type: "discord", requiresDiscord: true },
  },
  {
    id: "prod-7",
    name: "Pack de Armas Customizadas",
    slug: "pack-armas-customizadas",
    categoryId: "cat-2",
    description: "10 armas customizadas com texturas HD e animações exclusivas.",
    price: 5990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Armas+Pack"],
    badges: [],
    benefits: ["10 armas", "Texturas HD", "Animações custom"],
    variants: [],
    status: "arquivado",
    createdAt: "2025-03-05T13:00:00Z",
  },
  {
    id: "prod-8",
    name: "Sistema de Facções",
    slug: "sistema-faccoes",
    categoryId: "cat-1",
    description: "Sistema completo de facções com hierarquia, territórios e guerras.",
    price: 8990,
    images: ["https://placehold.co/600x400/1a1a2e/22c55e?text=Faccoes"],
    badges: ["Novo"],
    benefits: ["Hierarquia dinâmica", "Territórios", "Sistema de guerras", "Painel web"],
    variants: [],
    status: "ativo",
    createdAt: "2025-11-01T10:00:00Z",
  },
]

// ── Orders ──
export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerName: "Lucas Silva",
    customerEmail: "lucas@email.com",
    items: [{ productId: "prod-1", productName: "Sistema de Empregos v3", quantity: 1, unitPrice: 4990 }],
    total: 4990,
    discount: 0,
    paymentMethod: "pix",
    status: "entregue",
    createdAt: "2025-11-20T14:30:00Z",
    paidAt: "2025-11-20T14:31:00Z",
    deliveredAt: "2025-11-20T14:32:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Ana Oliveira",
    customerEmail: "ana@email.com",
    items: [{ productId: "prod-2", productName: "HUD Personalizada Pro", quantity: 1, unitPrice: 2990 }],
    total: 2990,
    discount: 0,
    paymentMethod: "card",
    status: "pago",
    createdAt: "2025-11-21T09:15:00Z",
    paidAt: "2025-11-21T09:16:00Z",
    deliveredAt: null,
  },
  {
    id: "ORD-003",
    customerName: "Pedro Santos",
    customerEmail: "pedro@email.com",
    items: [
      { productId: "prod-3", productName: "Pack de Veículos Brasileiros", quantity: 1, unitPrice: 7990 },
      { productId: "prod-5", productName: "Sistema de Garagem Avançado", quantity: 1, unitPrice: 3990 },
    ],
    total: 11980,
    discount: 0,
    paymentMethod: "stripe",
    status: "pendente",
    createdAt: "2025-11-22T16:45:00Z",
    paidAt: null,
    deliveredAt: null,
  },
  {
    id: "ORD-004",
    customerName: "Maria Costa",
    customerEmail: "maria@email.com",
    items: [{ productId: "prod-6", productName: "Configuração de Servidor", quantity: 1, unitPrice: 19990 }],
    total: 19990,
    discount: 0,
    paymentMethod: "pix",
    status: "enviado",
    createdAt: "2025-11-19T11:00:00Z",
    paidAt: "2025-11-19T11:01:00Z",
    deliveredAt: null,
  },
  {
    id: "ORD-005",
    customerName: "João Ferreira",
    customerEmail: "joao@email.com",
    items: [{ productId: "prod-8", productName: "Sistema de Facções", quantity: 1, unitPrice: 8990 }],
    total: 8990,
    discount: 0,
    paymentMethod: "card",
    status: "cancelado",
    createdAt: "2025-11-18T08:20:00Z",
    paidAt: null,
    deliveredAt: null,
  },
  {
    id: "ORD-006",
    customerName: "Carla Mendes",
    customerEmail: "carla@email.com",
    userId: "cust-6",
    items: [{ productId: "prod-1", productName: "Sistema de Empregos v3", quantity: 1, unitPrice: 5490 }],
    total: 5490,
    discount: 0,
    paymentMethod: "card",
    status: "entregue",
    createdAt: "2025-11-17T13:10:00Z",
    paidAt: "2025-11-17T13:11:00Z",
    deliveredAt: "2025-11-17T13:12:00Z",
  },
  {
    id: "ORD-007",
    customerName: "Rafael Lima",
    customerEmail: "rafael@email.com",
    items: [{ productId: "prod-4", productName: "Mapa Favela Completa", quantity: 1, unitPrice: 14990 }],
    total: 14990,
    discount: 0,
    paymentMethod: "pix",
    status: "pago",
    createdAt: "2025-11-23T10:00:00Z",
    paidAt: "2025-11-23T10:01:00Z",
    deliveredAt: null,
  },
  {
    id: "ORD-008",
    customerName: "Fernanda Alves",
    customerEmail: "fernanda@email.com",
    items: [
      { productId: "prod-2", productName: "HUD Personalizada Pro", quantity: 1, unitPrice: 2990 },
      { productId: "prod-8", productName: "Sistema de Facções", quantity: 1, unitPrice: 8990 },
    ],
    total: 11980,
    discount: 0,
    paymentMethod: "stripe",
    status: "entregue",
    createdAt: "2025-11-15T17:30:00Z",
    paidAt: "2025-11-15T17:31:00Z",
    deliveredAt: "2025-11-15T17:35:00Z",
  },
]

// ── Customers ──
export const MOCK_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Lucas Silva", email: "lucas@email.com", totalPurchases: 3, lastPurchaseAt: "2025-11-20T14:30:00Z" },
  { id: "cust-2", name: "Ana Oliveira", email: "ana@email.com", totalPurchases: 1, lastPurchaseAt: "2025-11-21T09:15:00Z" },
  { id: "cust-3", name: "Pedro Santos", email: "pedro@email.com", totalPurchases: 5, lastPurchaseAt: "2025-11-22T16:45:00Z" },
  { id: "cust-4", name: "Maria Costa", email: "maria@email.com", totalPurchases: 2, lastPurchaseAt: "2025-11-19T11:00:00Z" },
  { id: "cust-5", name: "João Ferreira", email: "joao@email.com", totalPurchases: 1, lastPurchaseAt: "2025-11-18T08:20:00Z" },
  { id: "cust-6", name: "Carla Mendes", email: "carla@email.com", totalPurchases: 7, lastPurchaseAt: "2025-11-17T13:10:00Z" },
  { id: "cust-7", name: "Rafael Lima", email: "rafael@email.com", totalPurchases: 2, lastPurchaseAt: "2025-11-23T10:00:00Z" },
  { id: "cust-8", name: "Fernanda Alves", email: "fernanda@email.com", totalPurchases: 4, lastPurchaseAt: "2025-11-15T17:30:00Z" },
]

// ── KPI Data ──
export const MOCK_KPI: KpiData = {
  salesToday: 1498000,
  totalSales: 8240000,
  monthlySales: 3420000,
  weeklyVisits: 2847,
}

// ── Revenue Chart Data (last 7 days, deterministic) ──
export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { date: "2025-11-17", revenue: 549000, orders: 2 },
  { date: "2025-11-18", revenue: 899000, orders: 1 },
  { date: "2025-11-19", revenue: 1999000, orders: 3 },
  { date: "2025-11-20", revenue: 499000, orders: 1 },
  { date: "2025-11-21", revenue: 299000, orders: 1 },
  { date: "2025-11-22", revenue: 1198000, orders: 2 },
  { date: "2025-11-23", revenue: 1499000, orders: 1 },
]

// ── Subscription ──
export const MOCK_SUBSCRIPTION: Subscription = {
  plan: "pro",
  status: "ativo",
  startedAt: "2025-09-01T00:00:00Z",
  expiresAt: "2026-09-01T00:00:00Z",
  history: [
    { date: "2025-06-01T00:00:00Z", action: "Assinou", plan: "starter" },
    { date: "2025-09-01T00:00:00Z", action: "Upgrade", plan: "pro" },
  ],
}

// ── Coupons (popular) ──
export const MOCK_COUPONS: Coupon[] = [
  { id: "cup-1", code: "FIVEM10", discount: 10, usageCount: 23 },
  { id: "cup-2", code: "BLACKFRIDAY", discount: 25, usageCount: 47 },
  { id: "cup-3", code: "BEMVINDO", discount: 15, usageCount: 12 },
]

// ── Store Settings ──
export const MOCK_STORE_SETTINGS: StoreSettings = {
  name: "Minha Loja",
  logoUrl: "",
  subdomain: "minha-loja",
  theme: "dark",
  storeType: "fivem",
}

// ── White-label Defaults ──
export const DEFAULT_TENANT_BRANDING: TenantBranding = {
  storeDisplayName: "Minha Loja",
  logoUrl: "",
  faviconUrl: "",
}

export const DEFAULT_TENANT_THEME: TenantTheme = {
  primary: "#22c55e",
  primaryForeground: "#ffffff",
  background: "#0f1218",
  foreground: "#f2f2f2",
  card: "#171c26",
  cardForeground: "#f2f2f2",
  muted: "#1e2433",
  mutedForeground: "#8b8fa3",
  border: "#262d3d",
  ring: "#22c55e",
}

export const DEFAULT_PRODUCT_CARD_STYLE: ProductCardStyle = {
  bgColor: "#171c26",
  textColor: "#8b8fa3",
  titleColor: "#f2f2f2",
  priceColor: "#22c55e",
  borderColor: "#262d3d",
  shadow: "md",
  radius: 12,
  buttonBg: "#22c55e",
  buttonText: "#ffffff",
  badgeBg: "#22c55e",
  badgeText: "#ffffff",
}

export const DEFAULT_TENANT_COPY: TenantCopy = {
  headline: "Os melhores produtos digitais para seu servidor",
  subheadline: "Scripts, veiculos, mapas e muito mais para FiveM e GTA RP.",
  ctaPrimaryText: "Explorar produtos",
  ctaSecondaryText: "Saiba mais",
  footerText: "Todos os direitos reservados.",
  supportEmail: "suporte@nexshop.com.br",
}

export const DEFAULT_TENANT_DOMAINS: TenantDomains = {
  subdomain: "minha-loja",
}

// ── Mock Auth User ──
export const MOCK_CURRENT_USER: MockUser = {
  id: "user-1",
  name: "Admin Demo",
  email: "admin@nexshop.com.br",
  emailVerified: true,
  tenantSlug: "minha-loja",
}
