"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, Filter, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { ORDER_STATUS_MAP } from "@/lib/constants"
import { formatCurrency, formatDate } from "@/lib/format"
import type { OrderStatus } from "@/lib/types"
import { toast } from "sonner"

export default function OrdersPage() {
  const { tenant } = useParams<{ tenant: string }>()
  const { orders, bulkUpdateOrderStatus } = useStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        search === "" ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === "all" || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id))

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((o) => o.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleBulkDeliver() {
    const ids = Array.from(selected)
    bulkUpdateOrderStatus(ids, "entregue")
    setSelected(new Set())
    toast.success(`${ids.length} pedido(s) marcados como entregue.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os pedidos da sua loja
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou produto..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {ORDER_STATUS_MAP[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <Button onClick={handleBulkDeliver} size="sm" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Marcar {selected.size} como entregue
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto(s)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const statusInfo = ORDER_STATUS_MAP[order.status]
                return (
                  <TableRow key={order.id} data-state={selected.has(order.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(order.id)}
                        onCheckedChange={() => toggleOne(order.id)}
                        aria-label={`Selecionar ${order.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/${tenant}/orders/${order.id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{order.customerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {order.items.map((i) => i.productName).join(", ")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={statusInfo.label} colorClass={statusInfo.color} />
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
