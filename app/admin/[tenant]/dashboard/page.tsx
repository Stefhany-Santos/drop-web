"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, CalendarDays, Eye, Package, Ticket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { KpiCard } from "@/components/admin/kpi-card"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { useStore } from "@/lib/store"
import { MOCK_KPI, MOCK_REVENUE_DATA, MOCK_COUPONS } from "@/lib/mock-data"
import { ORDER_STATUS_MAP } from "@/lib/constants"
import { formatCurrency, formatDate } from "@/lib/format"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export default function DashboardPage() {
  const { orders, products } = useStore()
  const [chartMode, setChartMode] = useState<"revenue" | "orders">("revenue")

  const recentOrders = orders.slice(0, 5)
  const popularProducts = products
    .filter((p) => p.status === "ativo")
    .slice(0, 4)

  const chartData = MOCK_REVENUE_DATA.map((d) => ({
    date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(
      new Date(d.date),
    ),
    value: chartMode === "revenue" ? d.revenue / 100 : d.orders,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da sua loja
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Vendas hoje"
          value={formatCurrency(MOCK_KPI.salesToday)}
          icon={DollarSign}
        />
        <KpiCard
          title="Total em vendas"
          value={formatCurrency(MOCK_KPI.totalSales)}
          icon={TrendingUp}
        />
        <KpiCard
          title="Vendas no mês"
          value={formatCurrency(MOCK_KPI.monthlySales)}
          icon={CalendarDays}
        />
        <KpiCard
          title="Visitas na loja (semana)"
          value={MOCK_KPI.weeklyVisits.toLocaleString("pt-BR")}
          icon={Eye}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Receita do período</CardTitle>
          <Tabs
            value={chartMode}
            onValueChange={(v) => setChartMode(v as "revenue" | "orders")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="revenue" className="text-xs px-3">
                Receita
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs px-3">
                Pedidos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs fill-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-xs fill-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    chartMode === "revenue"
                      ? `R$${(v as number).toLocaleString("pt-BR")}`
                      : String(v)
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) =>
                    chartMode === "revenue"
                      ? [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Receita"]
                      : [value, "Pedidos"]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pedidos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const statusInfo = ORDER_STATUS_MAP[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.items.map((i) => i.productName).join(", ")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={statusInfo.label} colorClass={statusInfo.color} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Popular Products & Coupons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Produtos populares</CardTitle>
          </CardHeader>
          <CardContent>
            {popularProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Nenhum produto"
                description="Adicione produtos à sua loja para vê-los aqui."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {popularProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    {product.badges.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {product.badges[0]}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cupons populares</CardTitle>
          </CardHeader>
          <CardContent>
            {MOCK_COUPONS.length === 0 ? (
              <EmptyState
                icon={Ticket}
                title="Nenhum cupom"
                description="Crie cupons para engajar seus clientes."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {MOCK_COUPONS.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {coupon.code}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {coupon.usageCount} usos
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {coupon.discount}% off
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
