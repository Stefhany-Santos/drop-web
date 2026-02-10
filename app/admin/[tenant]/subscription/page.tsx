"use client"

import { Check, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import { useStore } from "@/lib/store"
import { PLAN_DETAILS } from "@/lib/constants"
import { formatCurrency, formatDate } from "@/lib/format"
import type { SubscriptionPlan } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const PLAN_ORDER: SubscriptionPlan[] = ["starter", "pro", "business"]

export default function SubscriptionPage() {
  const { subscription, changePlan } = useStore()

  const currentPlanIndex = PLAN_ORDER.indexOf(subscription.plan)

  function handleChangePlan(plan: SubscriptionPlan) {
    if (plan === subscription.plan) return
    changePlan(plan)
    const isUpgrade = PLAN_ORDER.indexOf(plan) > currentPlanIndex
    toast.success(
      isUpgrade
        ? `Upgrade para ${PLAN_DETAILS[plan].name} realizado.`
        : `Downgrade para ${PLAN_DETAILS[plan].name} realizado.`,
    )
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    ativo: { label: "Ativo", color: "bg-primary/15 text-primary" },
    cancelado: { label: "Cancelado", color: "bg-destructive/15 text-destructive" },
    trial: { label: "Trial", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
    expirado: { label: "Expirado", color: "bg-muted text-muted-foreground" },
  }

  const currentStatus = statusMap[subscription.status] ?? statusMap.ativo

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano e veja o histórico
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plano atual</CardTitle>
          <CardDescription>
            Detalhes da sua assinatura vigente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {PLAN_DETAILS[subscription.plan].name[0]}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {PLAN_DETAILS[subscription.plan].name}
                  </span>
                  <StatusBadge label={currentStatus.label} colorClass={currentStatus.color} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {PLAN_DETAILS[subscription.plan].price === 0
                    ? "Gratuito"
                    : `${formatCurrency(PLAN_DETAILS[subscription.plan].price)}/mês`}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Início: {formatDate(subscription.startedAt)}</p>
              <p>Expira: {formatDate(subscription.expiresAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((planKey) => {
          const plan = PLAN_DETAILS[planKey]
          const isCurrent = planKey === subscription.plan
          const planIndex = PLAN_ORDER.indexOf(planKey)
          const isUpgrade = planIndex > currentPlanIndex
          const isDowngrade = planIndex < currentPlanIndex

          return (
            <Card
              key={planKey}
              className={cn(
                "relative",
                isCurrent && "border-primary ring-1 ring-primary",
              )}
            >
              {isCurrent && (
                <Badge className="absolute -top-2.5 left-4">Plano atual</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price === 0
                    ? "Gratuito para sempre"
                    : `${formatCurrency(plan.price)}/mês`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Separator />
                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full bg-transparent">
                    Plano atual
                  </Button>
                ) : (
                  <Button
                    variant={isUpgrade ? "default" : "outline"}
                    onClick={() => handleChangePlan(planKey)}
                    className="w-full gap-2"
                  >
                    {isUpgrade ? (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="h-4 w-4" />
                        Downgrade
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Plano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscription.history.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm">{formatDate(entry.date)}</TableCell>
                  <TableCell className="text-sm">{entry.action}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{PLAN_DETAILS[entry.plan].name}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
