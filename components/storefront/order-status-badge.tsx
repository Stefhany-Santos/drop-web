import { ORDER_STATUS_MAP } from "@/lib/constants"
import type { OrderStatus } from "@/lib/types"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS_MAP[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>
      {s.label}
    </span>
  )
}
