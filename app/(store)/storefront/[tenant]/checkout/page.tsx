"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Package,
  LogOut,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useStore } from "@/lib/store"
import { formatCurrency, formatCPF, stripCPF, isValidCPF } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import type { PaymentMethod } from "@/lib/types"
import { toast } from "sonner"
import {
  getDiscordAuthUrl,
  generateOAuthState,
  exchangeCodeForDiscordProfile,
} from "@/lib/discord-auth"

// ── Payment method definitions ──
interface PaymentOption {
  value: PaymentMethod
  label: string
  icon: React.ReactNode
  desc: string
  microcopy: string
}

// ── Discord SVG icon (inline, no new dep) ──
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
    </svg>
  )
}

// ── Mercado Pago SVG icon ──
function MercadoPagoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">MP</text>
    </svg>
  )
}

export default function CheckoutPage() {
  const store = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [processing, setProcessing] = useState(false)
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  // ── Mounted gate for hydration safety ──
  useEffect(() => { setMounted(true) }, [])

  // ── Handle Discord OAuth callback ──
  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    if (!code || !state) return

    const savedState = typeof window !== "undefined" ? sessionStorage.getItem("discord_oauth_state") : null
    if (state !== savedState) {
      toast.error("Estado OAuth invalido. Tente novamente.")
      return
    }

    setOauthLoading(true)
    exchangeCodeForDiscordProfile(code).then((profile) => {
      store.loginWithDiscordOAuth({
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        email: profile.email,
        avatarUrl: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=80`
          : null,
      })
      toast.success(`Conectado como ${profile.displayName}`)
      // Clean URL params
      router.replace(`${base}/checkout`)
    }).catch(() => {
      toast.error("Falha ao conectar com Discord.")
    }).finally(() => {
      setOauthLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Discord login handler ──
  const handleDiscordLogin = useCallback(() => {
    const state = generateOAuthState()
    if (typeof window !== "undefined") {
      sessionStorage.setItem("discord_oauth_state", state)
    }
    const redirectUri = typeof window !== "undefined"
      ? `${window.location.origin}${base}/checkout`
      : `${base}/checkout`
    const url = getDiscordAuthUrl(redirectUri, state)
    window.location.href = url
  }, [base])

  // ── Dynamic form fields based on cart ──
  const needsCityId = useMemo(() => {
    const storeIsFivem = store.settings.storeType === "fivem"
    const productRequires = store.cart.some((item) => {
      const p = store.products.find((pr) => pr.id === item.productId)
      return p?.delivery?.requiresCityId
    })
    return storeIsFivem || productRequires
  }, [store.cart, store.products, store.settings.storeType])

  const needsDiscord = useMemo(() => {
    return store.cart.some((item) => {
      const p = store.products.find((pr) => pr.id === item.productId)
      return p?.delivery?.requiresDiscord
    })
  }, [store.cart, store.products])

  // ── Zod schema with CPF validation ──
  const schema = useMemo(() => {
    let s = z.object({
      name: z.string().min(2, "Nome obrigatorio"),
      email: z.string().email("Email invalido"),
      phone: z.string().optional(),
      cpf: z.string().min(14, "CPF obrigatorio").refine(
        (val) => isValidCPF(val),
        { message: "CPF invalido" }
      ),
      discord: needsDiscord ? z.string().min(2, "Discord obrigatorio") : z.string().optional(),
      cityId: needsCityId ? z.string().min(1, "ID da cidade obrigatorio") : z.string().optional(),
      cardNumber: z.string().optional(),
      cardExpiry: z.string().optional(),
      cardCvv: z.string().optional(),
    })
    if (paymentMethod === "card") {
      s = s
        .refine((d) => d.cardNumber && d.cardNumber.replace(/\s/g, "").length >= 13, {
          message: "Numero do cartao invalido",
          path: ["cardNumber"],
        })
        .refine((d) => d.cardExpiry && /^\d{2}\/\d{2}$/.test(d.cardExpiry), {
          message: "Validade invalida (MM/AA)",
          path: ["cardExpiry"],
        })
        .refine((d) => d.cardCvv && d.cardCvv.length >= 3, {
          message: "CVV invalido",
          path: ["cardCvv"],
        }) as unknown as typeof s
    }
    return s
  }, [needsDiscord, needsCityId, paymentMethod])

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: store.customerSession.name ?? "",
      email: store.customerSession.email ?? "",
      phone: "",
      cpf: "",
      discord: store.customerSession.discordUsername ?? "",
      cityId: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  })

  const subtotal = store.getCartSubtotal()
  const total = store.getCartTotal()
  const discount = subtotal - total

  async function onSubmit(data: FormValues) {
    if (!store.customerSession.isLoggedIn) {
      toast.error("Voce precisa estar logado para finalizar a compra.")
      return
    }
    setProcessing(true)
    const buyerInfo = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: stripCPF(data.cpf),
      discord: data.discord,
      cityId: data.cityId,
    }

    // For external payment methods, simulate redirect
    if (paymentMethod === "mercadopago" || paymentMethod === "paypal" || paymentMethod === "picpay") {
      await new Promise((r) => setTimeout(r, 2000))
      const orderId = store.createOrder({ buyer: buyerInfo, paymentMethod, couponCode: store.cartCouponCode ?? undefined })
      store.updateOrderStatus(orderId, "pago")
      store.clearCart()
      router.push(`${base}/success/${orderId}`)
      return
    }

    if (paymentMethod === "pix") {
      const fakePixCode = `00020126360014BR.GOV.BCB.PIX0114+5511999${Math.floor(100000 + Math.random() * 900000)}520400005303986540${(total / 100).toFixed(2)}5802BR`
      setPixCode(fakePixCode)
      setProcessing(false)
      await new Promise((r) => setTimeout(r, 4000))
      const orderId = store.createOrder({ buyer: buyerInfo, paymentMethod: "pix", couponCode: store.cartCouponCode ?? undefined })
      store.updateOrderStatus(orderId, "pago")
      store.clearCart()
      router.push(`${base}/success/${orderId}`)
      return
    }
    if (paymentMethod === "stripe") {
      await new Promise((r) => setTimeout(r, 2000))
      const orderId = store.createOrder({ buyer: buyerInfo, paymentMethod: "stripe", couponCode: store.cartCouponCode ?? undefined })
      store.clearCart()
      router.push(`${base}/success/${orderId}`)
      return
    }
    await new Promise((r) => setTimeout(r, 2000))
    const orderId = store.createOrder({ buyer: buyerInfo, paymentMethod: "card", couponCode: store.cartCouponCode ?? undefined })
    store.clearCart()
    setProcessing(false)
    router.push(`${base}/success/${orderId}`)
  }

  function copyPix() {
    if (!pixCode) return
    navigator.clipboard.writeText(pixCode)
    setPixCopied(true)
    toast.success("Codigo PIX copiado!")
    setTimeout(() => setPixCopied(false), 2000)
  }

  // ── Payment options with icons and microcopy ──
  const paymentOptions: PaymentOption[] = [
    { value: "pix", label: "PIX", icon: <QrCode className="h-5 w-5" />, desc: "Transferencia instantanea", microcopy: "Aprovacao imediata" },
    { value: "mercadopago", label: "Mercado Pago", icon: <MercadoPagoIcon className="h-5 w-5" />, desc: "Cartao, boleto ou saldo", microcopy: "Multiplas opcoes" },
    { value: "paypal", label: "PayPal", icon: <CreditCard className="h-5 w-5" />, desc: "Pague com sua conta", microcopy: "Protecao ao comprador" },
    { value: "picpay", label: "PicPay", icon: <Zap className="h-5 w-5" />, desc: "Carteira digital", microcopy: "Cashback disponivel" },
    { value: "card", label: "Cartao", icon: <CreditCard className="h-5 w-5" />, desc: "Credito ou debito", microcopy: "Parcelamento disponivel" },
    { value: "stripe", label: "Stripe", icon: <Lock className="h-5 w-5" />, desc: "Checkout internacional", microcopy: "Seguro e global" },
  ]

  const isLoggedIn = mounted && store.customerSession.isLoggedIn

  // ── Shared input styles ──
  const inputClass = "w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all duration-200 focus:ring-2"
  const inputStyle: React.CSSProperties = {
    backgroundColor: theme.muted,
    borderColor: theme.border,
    color: theme.foreground,
  }
  const inputFocusRing = { "--tw-ring-color": hexAlpha(theme.primary, 0.4) } as React.CSSProperties

  // ── Empty cart ──
  if (mounted && store.cart.length === 0 && !pixCode) {
    return (
      <StorefrontShell theme={theme}>
        <StorefrontHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <Package className="h-10 w-10" style={{ color: theme.mutedForeground }} />
          <p className="text-sm" style={{ color: theme.mutedForeground }}>Seu carrinho esta vazio.</p>
          <Link
            href={base}
            className="rounded-xl px-5 py-2.5 text-sm font-bold"
            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
          >
            Voltar a loja
          </Link>
        </div>
        <StorefrontFooter />
      </StorefrontShell>
    )
  }

  // ── Order Summary component (reused in sidebar and mobile) ──
  function OrderSummary({ collapsible }: { collapsible?: boolean }) {
    const content = (
      <div className="flex flex-col gap-3">
        {store.cart.map((item) => {
          const product = store.products.find((p) => p.id === item.productId)
          if (!product) return null
          const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : undefined
          return (
            <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                style={{ backgroundColor: theme.muted }}
              >
                {product.images[0] ? (
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-4 w-4" style={{ color: theme.mutedForeground }} />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold" style={{ color: theme.foreground }}>
                    {product.name}{variant ? ` (${variant.name})` : ""}
                  </p>
                  <p className="text-[10px]" style={{ color: theme.mutedForeground }}>
                    Qtd: {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold" style={{ color: theme.foreground }}>
                  {formatCurrency((variant?.price ?? product.price) * item.quantity)}
                </span>
              </div>
            </div>
          )
        })}

        <div className="flex flex-col gap-2 border-t pt-3" style={{ borderColor: theme.border }}>
          <div className="flex justify-between text-xs">
            <span style={{ color: theme.mutedForeground }}>Subtotal</span>
            <span style={{ color: theme.foreground }}>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs">
              <span style={{ color: theme.primary }}>Desconto</span>
              <span style={{ color: theme.primary }}>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-3 text-base font-extrabold" style={{ borderColor: theme.border }}>
            <span style={{ color: theme.foreground }}>Total</span>
            <span style={{ color: theme.primary }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    )

    if (collapsible) {
      return (
        <div
          className="rounded-xl border"
          style={{ borderColor: theme.border, backgroundColor: theme.card }}
        >
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between p-4"
          >
            <span className="text-sm font-bold" style={{ color: theme.foreground }}>
              Resumo do pedido ({store.cart.reduce((s, i) => s + i.quantity, 0)} itens)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: theme.primary }}>
                {formatCurrency(total)}
              </span>
              {summaryOpen ? (
                <ChevronUp className="h-4 w-4" style={{ color: theme.mutedForeground }} />
              ) : (
                <ChevronDown className="h-4 w-4" style={{ color: theme.mutedForeground }} />
              )}
            </div>
          </button>
          {summaryOpen && <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: theme.border }}>{content}</div>}
        </div>
      )
    }

    return content
  }

  return (
    <StorefrontShell theme={theme}>
      <StorefrontHeader />

      <section className="py-8 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <Link
            href={`${base}/cart`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: theme.primary }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao carrinho
          </Link>

          <h1 className="mb-2 text-2xl font-extrabold tracking-tight lg:text-3xl" style={{ color: theme.foreground }}>
            Checkout
          </h1>
          <p className="mb-8 text-sm" style={{ color: theme.mutedForeground }}>
            Preencha seus dados para finalizar a compra.
          </p>

          {/* Mobile order summary (collapsible) */}
          <div className="mb-6 lg:hidden">
            <OrderSummary collapsible />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left column — form steps */}
              <div className="flex flex-col gap-6 lg:col-span-2">

                {/* ── Step 0: Discord Auth Gate ── */}
                <div
                  className="flex flex-col gap-4 rounded-xl border p-5"
                  style={{ borderColor: theme.border, backgroundColor: theme.card }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: "#5865F2", color: "#ffffff" }}
                    >
                      <DiscordIcon className="h-3.5 w-3.5" />
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Autenticacao</h2>
                  </div>

                  {oauthLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6">
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: theme.primary }} />
                      <span className="text-sm" style={{ color: theme.mutedForeground }}>Conectando com Discord...</span>
                    </div>
                  ) : isLoggedIn ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {store.customerSession.avatarUrl ? (
                          <img
                            src={store.customerSession.avatarUrl}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                            style={{ backgroundColor: "#5865F2", color: "#ffffff" }}
                          >
                            {(store.customerSession.name ?? "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold" style={{ color: theme.foreground }}>
                            {store.customerSession.name}
                          </p>
                          <p className="text-xs" style={{ color: theme.mutedForeground }}>
                            {store.customerSession.email ?? store.customerSession.discordUsername}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => store.logoutCustomer()}
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-200"
                        style={{ borderColor: theme.border, color: theme.mutedForeground }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.2)
                          e.currentTarget.style.color = theme.foreground
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = theme.border
                          e.currentTarget.style.color = theme.mutedForeground
                        }}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Trocar conta
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <p className="text-center text-sm" style={{ color: theme.mutedForeground }}>
                        Para finalizar sua compra, conecte-se com sua conta Discord.
                      </p>
                      <button
                        type="button"
                        onClick={handleDiscordLogin}
                        className="flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#5865F2",
                          color: "#ffffff",
                          boxShadow: `0 2px 12px rgba(88,101,242,0.3)`,
                        }}
                      >
                        <DiscordIcon className="h-5 w-5" />
                        Entrar com Discord
                      </button>
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-3 w-3" style={{ color: theme.mutedForeground }} />
                        <span className="text-[10px]" style={{ color: theme.mutedForeground }}>
                          Nao publicamos nada em sua conta
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Step 1: Buyer Info ── */}
                <div
                  className="flex flex-col gap-5 rounded-xl border p-5 transition-opacity duration-300"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                    opacity: isLoggedIn ? 1 : 0.5,
                    pointerEvents: isLoggedIn ? "auto" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                      1
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Dados do comprador</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Nome *</label>
                      <input {...register("name")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="Seu nome completo" />
                      {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Email *</label>
                      <input {...register("email")} type="email" className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="seu@email.com" />
                      {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Telefone</label>
                      <input {...register("phone")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>CPF *</label>
                      <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className={inputClass}
                            style={{ ...inputStyle, ...inputFocusRing }}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            onChange={(e) => field.onChange(formatCPF(e.target.value))}
                          />
                        )}
                      />
                      {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
                    </div>
                  </div>

                  {(needsCityId || needsDiscord) && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2" style={{ borderColor: theme.border }}>
                      {needsCityId && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>ID da Cidade (FiveM) *</label>
                          <input {...register("cityId")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="Ex: 42" />
                          {errors.cityId && <span className="text-xs text-red-500">{errors.cityId.message}</span>}
                        </div>
                      )}
                      {needsDiscord && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Discord *</label>
                          <input {...register("discord")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="usuario#1234" />
                          {errors.discord && <span className="text-xs text-red-500">{errors.discord.message}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Step 2: Payment Method ── */}
                <div
                  className="flex flex-col gap-5 rounded-xl border p-5 transition-opacity duration-300"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                    opacity: isLoggedIn ? 1 : 0.5,
                    pointerEvents: isLoggedIn ? "auto" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                      2
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Forma de pagamento</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {paymentOptions.map((opt) => {
                      const active = paymentMethod === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setPaymentMethod(opt.value); setPixCode(null) }}
                          className="group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200"
                          style={{
                            borderColor: active ? theme.primary : theme.border,
                            backgroundColor: active ? hexAlpha(theme.primary, 0.06) : "transparent",
                            color: active ? theme.primary : theme.foreground,
                            boxShadow: active ? `0 0 0 1px ${theme.primary}` : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.borderColor = hexAlpha(theme.foreground, 0.18)
                              e.currentTarget.style.backgroundColor = hexAlpha(theme.foreground, 0.03)
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.borderColor = theme.border
                              e.currentTarget.style.backgroundColor = "transparent"
                            }
                          }}
                        >
                          {/* Selected indicator */}
                          {active && (
                            <div
                              className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                              style={{ backgroundColor: theme.primary }}
                            >
                              <Check className="h-2.5 w-2.5" style={{ color: theme.primaryForeground }} />
                            </div>
                          )}
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: active ? hexAlpha(theme.primary, 0.12) : theme.muted,
                              color: active ? theme.primary : theme.mutedForeground,
                            }}
                          >
                            {opt.icon}
                          </div>
                          <span className="text-xs font-bold">{opt.label}</span>
                          <span
                            className="text-[10px] leading-tight"
                            style={{ color: active ? hexAlpha(theme.primary, 0.8) : theme.mutedForeground }}
                          >
                            {opt.desc}
                          </span>
                          {active && (
                            <span
                              className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                              style={{
                                backgroundColor: hexAlpha(theme.primary, 0.1),
                                color: theme.primary,
                              }}
                            >
                              <Zap className="h-2.5 w-2.5" />
                              {opt.microcopy}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Card fields */}
                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3" style={{ borderColor: theme.border }}>
                      <div className="flex flex-col gap-1.5 sm:col-span-3">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Numero do cartao</label>
                        <input {...register("cardNumber")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="0000 0000 0000 0000" />
                        {errors.cardNumber && <span className="text-xs text-red-500">{errors.cardNumber.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Validade</label>
                        <input {...register("cardExpiry")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="MM/AA" />
                        {errors.cardExpiry && <span className="text-xs text-red-500">{errors.cardExpiry.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>CVV</label>
                        <input {...register("cardCvv")} className={inputClass} style={{ ...inputStyle, ...inputFocusRing }} placeholder="000" />
                        {errors.cardCvv && <span className="text-xs text-red-500">{errors.cardCvv.message}</span>}
                      </div>
                    </div>
                  )}

                  {/* PIX display */}
                  {pixCode && (
                    <div className="flex flex-col items-center gap-4 border-t pt-5" style={{ borderColor: theme.border }}>
                      <div
                        className="flex h-44 w-44 items-center justify-center rounded-xl border"
                        style={{ borderColor: theme.border, backgroundColor: theme.muted }}
                      >
                        <QrCode className="h-24 w-24" style={{ color: theme.mutedForeground }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: theme.foreground }}>Escaneie o QR code ou copie o codigo</p>
                      <div className="flex w-full items-center gap-2">
                        <input readOnly value={pixCode} className="flex-1 truncate rounded-lg border px-3 py-2.5 text-xs outline-none" style={inputStyle} />
                        <button
                          type="button"
                          onClick={copyPix}
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold"
                          style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                        >
                          {pixCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {pixCopied ? "Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div
                        className="flex items-center gap-2 rounded-lg px-4 py-2"
                        style={{ backgroundColor: hexAlpha(theme.primary, 0.08) }}
                      >
                        <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: theme.primary }} />
                        <p className="text-xs font-semibold" style={{ color: theme.primary }}>
                          Aguardando confirmacao do pagamento...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right column: Sticky order summary (desktop) ── */}
              <div className="hidden flex-col gap-5 lg:flex">
                <div
                  className="sticky top-24 flex flex-col gap-4 rounded-xl border p-5"
                  style={{ borderColor: theme.border, backgroundColor: theme.card }}
                >
                  <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Resumo do pedido</h2>
                  <OrderSummary />

                  {!pixCode && (
                    <button
                      type="submit"
                      disabled={processing || !isLoggedIn}
                      className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.primaryForeground,
                        boxShadow: `0 2px 14px ${hexAlpha(theme.primary, 0.3)}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!processing && isLoggedIn) {
                          e.currentTarget.style.boxShadow = `0 4px 20px ${hexAlpha(theme.primary, 0.45)}`
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 2px 14px ${hexAlpha(theme.primary, 0.3)}`
                      }}
                    >
                      {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                      {!isLoggedIn
                        ? "Faca login para continuar"
                        : processing
                          ? "Processando..."
                          : paymentMethod === "pix"
                            ? "Gerar PIX"
                            : paymentMethod === "stripe"
                              ? "Pagar com Stripe"
                              : paymentMethod === "mercadopago"
                                ? "Pagar com Mercado Pago"
                                : paymentMethod === "paypal"
                                  ? "Pagar com PayPal"
                                  : paymentMethod === "picpay"
                                    ? "Pagar com PicPay"
                                    : "Finalizar pagamento"}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" style={{ color: theme.mutedForeground }} />
                    <span className="text-[10px]" style={{ color: theme.mutedForeground }}>
                      Pagamento seguro e criptografado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile submit button (fixed at bottom) */}
            <div className="mt-6 lg:hidden">
              {!pixCode && (
                <button
                  type="submit"
                  disabled={processing || !isLoggedIn}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                    boxShadow: `0 2px 14px ${hexAlpha(theme.primary, 0.3)}`,
                  }}
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {!isLoggedIn
                    ? "Faca login para continuar"
                    : processing
                      ? "Processando..."
                      : paymentMethod === "pix"
                        ? "Gerar PIX"
                        : "Finalizar pagamento"}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
