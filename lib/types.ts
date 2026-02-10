// ── Admin Types ──

export type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado" | "reembolsado"

export type ProductStatus = "ativo" | "rascunho" | "arquivado"

export type SubscriptionPlan = "starter" | "pro" | "business"

export type SubscriptionStatus = "ativo" | "cancelado" | "trial" | "expirado"

export type StoreType = "digital" | "services" | "game-accounts" | "fivem" | "other"

export type PaymentMethod = "pix" | "card" | "stripe"

// ── White-label types ──

export interface TenantBranding {
  storeDisplayName: string
  logoUrl: string
  faviconUrl: string
}

export interface TenantTheme {
  primary: string
  primaryForeground: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  muted: string
  mutedForeground: string
  border: string
  ring: string
}

export interface ProductCardStyle {
  bgColor: string
  textColor: string
  titleColor: string
  priceColor: string
  borderColor: string
  shadow: "none" | "sm" | "md" | "lg"
  radius: number
  buttonBg: string
  buttonText: string
  badgeBg: string
  badgeText: string
}

export interface TenantCopy {
  headline: string
  subheadline: string
  ctaPrimaryText: string
  ctaSecondaryText: string
  footerText: string
  supportEmail: string
}

export interface TenantDomains {
  subdomain: string
  customDomain?: string
}

export interface Tenant {
  slug: string
  name: string
  logoUrl: string
  subdomain: string
  theme: string
  currency: string
  storeType: StoreType
  branding: TenantBranding
  themeTokens: TenantTheme
  productCard: ProductCardStyle
  copy: TenantCopy
  domains: TenantDomains
}

// ── Delivery ──

export interface ProductDelivery {
  type: "download" | "manual" | "discord" | "game"
  requiresDiscord?: boolean
  requiresCityId?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

export interface ProductVariant {
  id: string
  name: string
  price: number // centavos
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  description: string
  price: number // centavos
  images: string[]
  badges: string[]
  benefits: string[]
  variants: ProductVariant[]
  status: ProductStatus
  createdAt: string
  delivery?: ProductDelivery
  cardStyleOverride?: Partial<ProductCardStyle>
}

// ── Cart ──

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
}

// ── Checkout ──

export interface BuyerInfo {
  name: string
  email: string
  phone?: string
  cpf?: string
  discord?: string
  cityId?: string
}

export interface CheckoutData {
  buyer: BuyerInfo
  paymentMethod: PaymentMethod
  couponCode?: string
}

// ── Orders (storefront-aware) ──

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number // centavos
  variantName?: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerCpf?: string
  customerDiscord?: string
  customerCityId?: string
  userId?: string // linked if logged in
  items: OrderItem[]
  total: number // centavos
  discount: number // centavos
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
  paidAt: string | null
  deliveredAt: string | null
}

export interface Customer {
  id: string
  name: string
  email: string
  totalPurchases: number
  lastPurchaseAt: string | null
}

export interface Subscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startedAt: string
  expiresAt: string
  history: SubscriptionHistoryEntry[]
}

export interface SubscriptionHistoryEntry {
  date: string
  action: string
  plan: SubscriptionPlan
}

export interface StoreSettings {
  name: string
  logoUrl: string
  subdomain: string
  theme: string
  storeType: StoreType
}

export interface Coupon {
  id: string
  code: string
  discount: number // percentage
  usageCount: number
}

export interface KpiData {
  salesToday: number
  totalSales: number
  monthlySales: number
  weeklyVisits: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

// ── Mock Auth User ──

export interface MockUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  tenantSlug: string | null
}

// ── Customer Session (storefront) ──

export type AuthProvider = "google" | "discord"

export interface CustomerSession {
  isLoggedIn: boolean
  userId: string | null
  name: string | null
  email: string | null
  provider: AuthProvider | null
  discordId: string | null
  discordUsername: string | null
  avatarUrl: string | null
}

// ── Legal Info ──

export interface LegalInfo {
  companyName: string
  cnpj: string
  address?: string
}
