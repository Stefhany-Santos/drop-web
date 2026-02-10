/**
 * CPF mask + validation utilities.
 * No external dependencies — pure regex + digit-verifier algorithm.
 */

/**
 * Apply CPF mask: 000.000.000-00
 * Accepts any string, strips non-digits, formats progressively.
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

/**
 * Strip mask and return only digits.
 */
export function stripCPF(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Validate CPF with real check-digit algorithm.
 * Returns true for valid CPFs, false otherwise.
 */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return false

  // Reject known-invalid sequences (all same digit)
  if (/^(\d)\1{10}$/.test(digits)) return false

  // First check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[9])) return false

  // Second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[10])) return false

  return true
}
