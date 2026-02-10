import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  label: string
  colorClass: string
}

export function StatusBadge({ label, colorClass }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colorClass,
      )}
    >
      {label}
    </span>
  )
}
