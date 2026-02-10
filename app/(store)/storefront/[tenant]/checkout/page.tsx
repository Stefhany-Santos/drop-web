"use client"

import React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/format"
import { hexAlpha } from "@/lib/storefront-theme"
import { StorefrontShell } from "@/components/storefront/storefront-shell"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import type { PaymentMethod } from "@/lib/types"
import { toast } from "sonner"

export default function CheckoutPage() {
  const store = useStore()
  const router = useRouter()
  const theme = store.themeTokens
  const base = `/storefront/${store.tenant}`

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [processing, setProcessing] = useState(false)
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)

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

  const schema = useMemo(() => {
    let s = z.object({
      name: z.string().min(2, "Nome obrigatorio"),
      email: z.string().email("Email invalido"),
      phone: z.string().optional(),
      cpf: z.string().optional(),
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
    setProcessing(true)
    const buyerInfo = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      discord: data.discord,
      cityId: data.cityId,
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

  if (store.cart.length === 0 && !pixCode) {
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

  const inputClass = "w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all focus:ring-2"
  const inputStyle = {
    backgroundColor: theme.muted,
    borderColor: theme.border,
    color: theme.foreground,
  }

  const paymentOptions: { value: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "pix", label: "PIX", icon: <QrCode className="h-5 w-5" />, desc: "Pagamento instantaneo" },
    { value: "card", label: "Cartao", icon: <CreditCard className="h-5 w-5" />, desc: "Credito ou debito" },
    { value: "stripe", label: "Stripe", icon: <Lock className="h-5 w-5" />, desc: "Checkout seguro" },
  ]

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

          {!store.customerSession.isLoggedIn && (
            <div
              className="mb-8 flex items-center gap-3 rounded-xl border p-4"
              style={{ borderColor: theme.border, backgroundColor: hexAlpha(theme.primary, 0.04) }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: hexAlpha(theme.primary, 0.1) }}
              >
                <ShieldCheck className="h-4 w-4" style={{ color: theme.primary }} />
              </div>
              <p className="flex-1 text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
                Ja tem conta?{" "}
                <Link href={`${base}/account`} className="font-bold underline" style={{ color: theme.primary }}>
                  Entre aqui
                </Link>{" "}
                para vincular ao seu historico, ou continue como convidado.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Step 1: Buyer info */}
                <div className="flex flex-col gap-5 rounded-xl border p-5" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
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
                      <input {...register("name")} className={inputClass} style={inputStyle} placeholder="Seu nome completo" />
                      {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Email *</label>
                      <input {...register("email")} type="email" className={inputClass} style={inputStyle} placeholder="seu@email.com" />
                      {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Telefone</label>
                      <input {...register("phone")} className={inputClass} style={inputStyle} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>CPF</label>
                      <input {...register("cpf")} className={inputClass} style={inputStyle} placeholder="000.000.000-00" />
                    </div>
                  </div>

                  {(needsCityId || needsDiscord) && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2" style={{ borderColor: theme.border }}>
                      {needsCityId && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>ID da Cidade (FiveM) *</label>
                          <input {...register("cityId")} className={inputClass} style={inputStyle} placeholder="Ex: 42" />
                          {errors.cityId && <span className="text-xs text-red-500">{errors.cityId.message}</span>}
                        </div>
                      )}
                      {needsDiscord && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Discord *</label>
                          <input {...register("discord")} className={inputClass} style={inputStyle} placeholder="usuario#1234" />
                          {errors.discord && <span className="text-xs text-red-500">{errors.discord.message}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 2: Payment */}
                <div className="flex flex-col gap-5 rounded-xl border p-5" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                      2
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Metodo de pagamento</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {paymentOptions.map((opt) => {
                      const active = paymentMethod === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setPaymentMethod(opt.value); setPixCode(null) }}
                          className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200"
                          style={{
                            borderColor: active ? theme.primary : theme.border,
                            backgroundColor: active ? hexAlpha(theme.primary, 0.06) : "transparent",
                            color: active ? theme.primary : theme.foreground,
                          }}
                        >
                          {opt.icon}
                          <span className="text-sm font-bold">{opt.label}</span>
                          <span className="text-[10px]" style={{ color: active ? theme.primary : theme.mutedForeground }}>
                            {opt.desc}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Card fields */}
                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3" style={{ borderColor: theme.border }}>
                      <div className="flex flex-col gap-1.5 sm:col-span-3">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Numero do cartao</label>
                        <input {...register("cardNumber")} className={inputClass} style={inputStyle} placeholder="0000 0000 0000 0000" />
                        {errors.cardNumber && <span className="text-xs text-red-500">{errors.cardNumber.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>Validade</label>
                        <input {...register("cardExpiry")} className={inputClass} style={inputStyle} placeholder="MM/AA" />
                        {errors.cardExpiry && <span className="text-xs text-red-500">{errors.cardExpiry.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ color: theme.mutedForeground }}>CVV</label>
                        <input {...register("cardCvv")} className={inputClass} style={inputStyle} placeholder="000" />
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

              {/* Order summary sidebar */}
              <div className="flex flex-col gap-5">
                <div
                  className="sticky top-24 flex flex-col gap-4 rounded-xl border p-5"
                  style={{ borderColor: theme.border, backgroundColor: theme.card }}
                >
                  <h2 className="text-sm font-bold" style={{ color: theme.foreground }}>Resumo do pedido</h2>
                  <div className="flex flex-col gap-2.5">
                    {store.cart.map((item) => {
                      const product = store.products.find((p) => p.id === item.productId)
                      if (!product) return null
                      const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : undefined
                      return (
                        <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex items-center justify-between text-xs">
                          <span className="flex-1 truncate pr-2" style={{ color: theme.foreground }}>
                            {product.name}{variant ? ` (${variant.name})` : ""} x{item.quantity}
                          </span>
                          <span className="shrink-0" style={{ color: theme.mutedForeground }}>
                            {formatCurrency((variant?.price ?? product.price) * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
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

                  {!pixCode && (
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.primaryForeground,
                        boxShadow: `0 4px 14px ${hexAlpha(theme.primary, 0.3)}`,
                      }}
                    >
                      {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                      {processing
                        ? "Processando..."
                        : paymentMethod === "pix"
                          ? "Gerar PIX"
                          : paymentMethod === "stripe"
                            ? "Pagar com Stripe"
                            : "Finalizar pagamento"}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-1.5">
                    <Lock className="h-3 w-3" style={{ color: theme.mutedForeground }} />
                    <span className="text-[10px]" style={{ color: theme.mutedForeground }}>
                      Pagamento seguro e criptografado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <StorefrontFooter />
    </StorefrontShell>
  )
}
