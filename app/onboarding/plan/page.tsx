"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Grátis",
    period: "",
    features: ["Até 10 produtos", "Subdomínio gratuito", "Checkout básico", "Dashboard de vendas"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    highlight: true,
    features: [
      "Produtos ilimitados",
      "Domínio personalizado",
      "Checkout otimizado",
      "Analytics avançado",
      "Integrações",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 149",
    period: "/mês",
    features: [
      "Tudo do Pro",
      "Multi-loja",
      "API completa",
      "White-label",
      "Gerente dedicado",
    ],
  },
]

export default function OnboardingPlanPage() {
  const router = useRouter()
  const [selected, setSelected] = useState("pro")

  return (
    <>
      <OnboardingStepper currentStep={0} />
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Escolha seu plano
          </h1>
          <p className="mt-2 text-muted-foreground">
            Você pode alterar seu plano a qualquer momento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 text-left transition-all hover:shadow-md",
                selected === plan.id
                  ? "border-primary bg-card shadow-lg shadow-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                  Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div
                className={cn(
                  "mt-6 flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  selected === plan.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {selected === plan.id ? "Selecionado" : "Selecionar"}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => router.push("/onboarding/store")}
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
