"use client"

import React, { createContext, useContext, useCallback, useMemo, useState } from "react"
import type {
  AuthProvider,
  CartItem,
  Category,
  CheckoutData,
  Customer,
  CustomerSession,
  MockUser,
  Order,
  OrderStatus,
  Product,
  ProductCardStyle,
  StoreSettings,
  Subscription,
  TenantBranding,
  TenantCopy,
  TenantDomains,
  TenantTheme,
} from "./types"
import {
  DEFAULT_PRODUCT_CARD_STYLE,
  DEFAULT_TENANT_BRANDING,
  DEFAULT_TENANT_COPY,
  DEFAULT_TENANT_DOMAINS,
  DEFAULT_TENANT_THEME,
  MOCK_CATEGORIES,
  MOCK_COUPONS,
  MOCK_CURRENT_USER,
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_STORE_SETTINGS,
  MOCK_SUBSCRIPTION,
} from "./mock-data"

interface StoreState {
  tenant: string
  categories: Category[]
  products: Product[]
  orders: Order[]
  customers: Customer[]
  settings: StoreSettings
  subscription: Subscription

  // White-label state
  branding: TenantBranding
  themeTokens: TenantTheme
  productCard: ProductCardStyle
  copy: TenantCopy
  domains: TenantDomains
  currentUser: MockUser

  // Customer session (storefront)
  customerSession: CustomerSession
  loginWithGoogle: (email: string, name: string) => void
  loginWithDiscord: (username: string, discordId: string) => void
  logoutCustomer: () => void

  // Cart
  cart: CartItem[]
  cartDiscount: number // percentage
  cartCouponCode: string | null
  addToCart: (productId: string, qty?: number, variantId?: string) => void
  removeFromCart: (productId: string, variantId?: string) => void
  updateCartQty: (productId: string, qty: number, variantId?: string) => void
  applyCoupon: (code: string) => { success: boolean; message: string }
  clearCart: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number

  // Storefront orders
  createOrder: (data: CheckoutData) => string
  getOrderById: (id: string) => Order | undefined
  getOrdersByUser: (userId: string) => Order[]
  getOrdersByEmail: (email: string) => Order[]

  // Category CRUD
  addCategory: (cat: Omit<Category, "id" | "productCount">) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Product CRUD
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  duplicateProduct: (id: string) => void

  // Order actions
  updateOrderStatus: (id: string, status: OrderStatus) => void
  bulkUpdateOrderStatus: (ids: string[], status: OrderStatus) => void

  // Settings
  updateSettings: (data: Partial<StoreSettings>) => void

  // Subscription
  changePlan: (plan: Subscription["plan"]) => void

  // White-label actions
  updateBranding: (data: Partial<TenantBranding>) => void
  updateThemeTokens: (data: Partial<TenantTheme>) => void
  updateProductCard: (data: Partial<ProductCardStyle>) => void
  updateCopy: (data: Partial<TenantCopy>) => void
  updateDomains: (data: Partial<TenantDomains>) => void
}

const StoreContext = createContext<StoreState | null>(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

let idCounter = 100

function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

function nowISO() {
  return new Date().toISOString()
}

export function StoreProvider({
  tenant,
  children,
}: {
  tenant: string
  children: React.ReactNode
}) {
  const [categories, setCategories] = useState<Category[]>(() => [...MOCK_CATEGORIES])
  const [products, setProducts] = useState<Product[]>(() => [...MOCK_PRODUCTS])
  const [orders, setOrders] = useState<Order[]>(() => [...MOCK_ORDERS])
  const [customers] = useState<Customer[]>(() => [...MOCK_CUSTOMERS])
  const [settings, setSettings] = useState<StoreSettings>(() => ({ ...MOCK_STORE_SETTINGS }))
  const [subscription, setSubscription] = useState<Subscription>(() => ({ ...MOCK_SUBSCRIPTION }))

  // White-label state
  const [branding, setBranding] = useState<TenantBranding>(() => ({ ...DEFAULT_TENANT_BRANDING }))
  const [themeTokens, setThemeTokens] = useState<TenantTheme>(() => ({ ...DEFAULT_TENANT_THEME }))
  const [productCard, setProductCard] = useState<ProductCardStyle>(() => ({ ...DEFAULT_PRODUCT_CARD_STYLE }))
  const [copy, setCopy] = useState<TenantCopy>(() => ({ ...DEFAULT_TENANT_COPY }))
  const [domains, setDomains] = useState<TenantDomains>(() => ({ ...DEFAULT_TENANT_DOMAINS, subdomain: tenant }))
  const [currentUser] = useState<MockUser>(() => ({ ...MOCK_CURRENT_USER }))

  // Customer session
  const [customerSession, setCustomerSession] = useState<CustomerSession>({
    isLoggedIn: false,
    userId: null,
    name: null,
    email: null,
    provider: null,
    discordId: null,
    discordUsername: null,
    avatarUrl: null,
  })

  const loginWithGoogle = useCallback((email: string, name: string) => {
    const existing = MOCK_CUSTOMERS.find((c) => c.email === email)
    setCustomerSession({
      isLoggedIn: true,
      userId: existing?.id ?? `google-${Date.now()}`,
      name,
      email,
      provider: "google",
      discordId: null,
      discordUsername: null,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff&size=80`,
    })
  }, [])

  const loginWithDiscord = useCallback((username: string, discordId: string) => {
    setCustomerSession({
      isLoggedIn: true,
      userId: `discord-${discordId}`,
      name: username,
      email: null,
      provider: "discord",
      discordId,
      discordUsername: username,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=5865F2&color=fff&size=80`,
    })
  }, [])

  const logoutCustomer = useCallback(() => {
    setCustomerSession({
      isLoggedIn: false,
      userId: null,
      name: null,
      email: null,
      provider: null,
      discordId: null,
      discordUsername: null,
      avatarUrl: null,
    })
  }, [])

  // Cart
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartDiscount, setCartDiscount] = useState(0)
  const [cartCouponCode, setCartCouponCode] = useState<string | null>(null)

  const addToCart = useCallback((productId: string, qty = 1, variantId?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variantId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        )
      }
      return [...prev, { productId, variantId, quantity: qty }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)))
  }, [])

  const updateCartQty = useCallback((productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)))
      return
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, quantity: qty }
          : i,
      ),
    )
  }, [])

  const applyCoupon = useCallback(
    (code: string): { success: boolean; message: string } => {
      const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase())
      if (!coupon) return { success: false, message: "Cupom invalido." }
      setCartDiscount(coupon.discount)
      setCartCouponCode(coupon.code)
      return { success: true, message: `Cupom ${coupon.code} aplicado! ${coupon.discount}% de desconto.` }
    },
    [],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setCartDiscount(0)
    setCartCouponCode(null)
  }, [])

  const getCartSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return sum
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId)
        return sum + (variant?.price ?? product.price) * item.quantity
      }
      return sum + product.price * item.quantity
    }, 0)
  }, [cart, products])

  const getCartTotal = useCallback(() => {
    const subtotal = getCartSubtotal()
    return Math.round(subtotal * (1 - cartDiscount / 100))
  }, [getCartSubtotal, cartDiscount])

  // Storefront order creation
  const createOrder = useCallback(
    (data: CheckoutData): string => {
      const orderId = `ORD-${String(idCounter + 1).padStart(3, "0")}`
      idCounter += 1
      const subtotal = getCartSubtotal()
      const discountAmount = Math.round(subtotal * (cartDiscount / 100))
      const total = subtotal - discountAmount

      const newOrder: Order = {
        id: orderId,
        customerName: data.buyer.name,
        customerEmail: data.buyer.email,
        customerPhone: data.buyer.phone,
        customerCpf: data.buyer.cpf,
        customerDiscord: data.buyer.discord,
        customerCityId: data.buyer.cityId,
        userId: customerSession.isLoggedIn ? customerSession.userId ?? undefined : undefined,
        items: cart.map((item) => {
          const product = products.find((p) => p.id === item.productId)!
          const variant = item.variantId
            ? product.variants.find((v) => v.id === item.variantId)
            : undefined
          return {
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: variant?.price ?? product.price,
            variantName: variant?.name,
          }
        }),
        total,
        discount: discountAmount,
        paymentMethod: data.paymentMethod,
        status: data.paymentMethod === "pix" ? "pendente" : "pago",
        createdAt: nowISO(),
        paidAt: data.paymentMethod === "pix" ? null : nowISO(),
        deliveredAt: null,
      }

      setOrders((prev) => [newOrder, ...prev])
      return orderId
    },
    [cart, products, customerSession, getCartSubtotal, cartDiscount],
  )

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  )

  const getOrdersByUser = useCallback(
    (userId: string) => orders.filter((o) => o.userId === userId),
    [orders],
  )

  const getOrdersByEmail = useCallback(
    (email: string) => orders.filter((o) => o.customerEmail === email),
    [orders],
  )

  // ── Category CRUD ──
  const addCategory = useCallback((cat: Omit<Category, "id" | "productCount">) => {
    setCategories((prev) => [...prev, { ...cat, id: nextId("cat"), productCount: 0 }])
  }, [])

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // ── Product CRUD ──
  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt">) => {
    setProducts((prev) => [
      { ...product, id: nextId("prod"), createdAt: nowISO() },
      ...prev,
    ])
  }, [])

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const duplicateProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const original = prev.find((p) => p.id === id)
      if (!original) return prev
      return [
        {
          ...original,
          id: nextId("prod"),
          name: `${original.name} (copia)`,
          slug: `${original.slug}-copia`,
          status: "rascunho" as const,
          createdAt: nowISO(),
        },
        ...prev,
      ]
    })
  }, [])

  // ── Order actions ──
  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        return {
          ...o,
          status,
          paidAt: status === "pago" && !o.paidAt ? nowISO() : o.paidAt,
          deliveredAt: status === "entregue" && !o.deliveredAt ? nowISO() : o.deliveredAt,
        }
      }),
    )
  }, [])

  const bulkUpdateOrderStatus = useCallback((ids: string[], status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (!ids.includes(o.id)) return o
        return {
          ...o,
          status,
          paidAt: status === "pago" && !o.paidAt ? nowISO() : o.paidAt,
          deliveredAt: status === "entregue" && !o.deliveredAt ? nowISO() : o.deliveredAt,
        }
      }),
    )
  }, [])

  // ── Settings ──
  const updateSettings = useCallback((data: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }, [])

  // ── Subscription ──
  const changePlan = useCallback((plan: Subscription["plan"]) => {
    setSubscription((prev) => ({
      ...prev,
      plan,
      history: [
        ...prev.history,
        { date: nowISO(), action: plan === "starter" ? "Downgrade" : "Upgrade", plan },
      ],
    }))
  }, [])

  // ── White-label actions ──
  const updateBranding = useCallback((data: Partial<TenantBranding>) => {
    setBranding((prev) => ({ ...prev, ...data }))
  }, [])

  const updateThemeTokens = useCallback((data: Partial<TenantTheme>) => {
    setThemeTokens((prev) => ({ ...prev, ...data }))
  }, [])

  const updateProductCard = useCallback((data: Partial<ProductCardStyle>) => {
    setProductCard((prev) => ({ ...prev, ...data }))
  }, [])

  const updateCopy = useCallback((data: Partial<TenantCopy>) => {
    setCopy((prev) => ({ ...prev, ...data }))
  }, [])

  const updateDomains = useCallback((data: Partial<TenantDomains>) => {
    setDomains((prev) => ({ ...prev, ...data }))
  }, [])

  const value = useMemo<StoreState>(
    () => ({
      tenant,
      categories,
      products,
      orders,
      customers,
      settings,
      subscription,
      branding,
      themeTokens,
      productCard,
      copy,
      domains,
      currentUser,
      customerSession,
      loginWithGoogle,
      loginWithDiscord,
      logoutCustomer,
      cart,
      cartDiscount,
      cartCouponCode,
      addToCart,
      removeFromCart,
      updateCartQty,
      applyCoupon,
      clearCart,
      getCartTotal,
      getCartSubtotal,
      createOrder,
      getOrderById,
      getOrdersByUser,
      getOrdersByEmail,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      updateOrderStatus,
      bulkUpdateOrderStatus,
      updateSettings,
      changePlan,
      updateBranding,
      updateThemeTokens,
      updateProductCard,
      updateCopy,
      updateDomains,
    }),
    [
      tenant, categories, products, orders, customers, settings, subscription,
      branding, themeTokens, productCard, copy, domains, currentUser,
      customerSession, loginWithGoogle, loginWithDiscord, logoutCustomer,
      cart, cartDiscount, cartCouponCode,
      addToCart, removeFromCart, updateCartQty, applyCoupon, clearCart,
      getCartTotal, getCartSubtotal,
      createOrder, getOrderById, getOrdersByUser, getOrdersByEmail,
      addCategory, updateCategory, deleteCategory,
      addProduct, updateProduct, deleteProduct, duplicateProduct,
      updateOrderStatus, bulkUpdateOrderStatus,
      updateSettings, changePlan,
      updateBranding, updateThemeTokens, updateProductCard, updateCopy, updateDomains,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
