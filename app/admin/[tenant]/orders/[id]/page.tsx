"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  Truck,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/admin/status-badge"
import { useStore } from "@/lib/store"
import { ORDER_STATUS_MAP } from "@/lib/constants"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { OrderStatus } from "@/lib/types"
import { toast } from "sonner"

const TIMELINE_ICONS: Record<string, typeof Circle> = {
  criado: Clock,
  pago: CheckCircle,
  enviado: Truck,
  entregue: Package,
  cancelado: XCircle,
}

export default function OrderDetailPage() {
  const { tenant, id } = useParams<{ tenant: string; id: string }>()
  const router = useRouter()
  const { orders, updateOrderStatus } = useStore()

  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button variant="outline" onClick={() => router.push(`/admin/${tenant}/orders`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  // Build timeline entries
  const timeline: { label: string; date: string | null; icon: typeof Circle }[] = [
    { label: "Pedido criado", date: order.createdAt, icon: TIMELINE_ICONS.criado },
    { label: "Pagamento confirmado", date: order.paidAt, icon: TIMELINE_ICONS.pago },
    {
      label: order.status === "cancelado" ? "Cancelado" : "Entregue",
      date:
        order.status === "cancelado"
          ? order.createdAt
          : order.deliveredAt,
      icon: order.status === "cancelado" ? TIMELINE_ICONS.cancelado : TIMELINE_ICONS.entregue,
    },
  ]

  function handleCopyId() {
    navigator.clipboard.writeText(order!.id)
    toast.success("ID copiado para a área de transferência.")
  }

  function handleReprocess() {
    updateOrderStatus(order!.id, "pendente")
    toast.success("Pedido marcado como pendente para reprocessamento.")
  }

  const statusInfo = ORDER_STATUS_MAP[order.status]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/${tenant}/orders`)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Pedido {order.id}
              <StatusBadge label={statusInfo.label} colorClass={statusInfo.color} />
            </h1>
            <p className="text-sm text-muted-foreground">
              Criado em {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyId} className="gap-2 bg-transparent">
            <Copy className="h-3.5 w-3.5" />
            Copiar ID
          </Button>
          <Button variant="outline" size="sm" onClick={handleReprocess} className="gap-2 bg-transparent">
            <RefreshCw className="h-3.5 w-3.5" />
            Reprocessar
          </Button>
          <Select
            value={order.status}
            onValueChange={(v) => {
              updateOrderStatus(order.id, v as OrderStatus)
              toast.success(`Status alterado para ${ORDER_STATUS_MAP[v as OrderStatus].label}.`)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {ORDER_STATUS_MAP[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: items + client info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Itens do pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Preço unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Total do pedido</span>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">Nome</span>
                  <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="text-sm font-medium text-foreground">{order.customerEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {timeline.map((entry, idx) => {
                const Icon = entry.icon
                const isCompleted = entry.date !== null
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="mt-1 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex flex-col pb-6">
                      <span
                        className={`text-sm font-medium ${
                          isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {entry.label}
                      </span>
                      {entry.date && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(entry.date)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
