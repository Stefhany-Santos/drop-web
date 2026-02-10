/**
 * Format a number in centavos to BRL currency string.
 */
export function formatCurrency(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100)
}

/**
 * Format a date string to pt-BR locale.
 * Uses UTC to avoid server/client hydration mismatches.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateStr))
}

/**
 * Format a date string to pt-BR locale with time.
 * Uses UTC to avoid server/client hydration mismatches.
 */
export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(dateStr))
}

/**
 * Format a number as compact (e.g. 1.2K, 3.4M).
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}

// ── CPF Utilities ──

/**
 * Apply CPF mask: 000.000.000-00
 * Accepts any string, strips non-digits, and formats progressively.
 */
export function formatCPF(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

/**
 * Strip CPF mask, returning only digits.
 */
export function stripCPF(cpf: string): string {
  return cpf.replace(/\D/g, "")
}

/**
 * Validate a CPF using the standard Brazilian check-digit algorithm.
 * Returns true only for syntactically and mathematically valid CPFs.
 */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return false

  // Reject known invalid patterns (all same digit)
  if (/^(\d)\1{10}$/.test(digits)) return false

  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[9])) return false

  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[10])) return false

  return true
}
