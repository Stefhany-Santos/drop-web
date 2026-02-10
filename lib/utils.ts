import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { MockUser } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determine where to redirect a user after login/register.
 * Uses mock user data -- replace with real auth check later.
 */
export function getPostAuthRedirect(user: MockUser | null): string {
  if (!user) return "/login"
  if (!user.emailVerified) return "/verify-email"
  if (!user.tenantSlug) return "/onboarding/plan"
  return `/admin/${user.tenantSlug}/dashboard`
}
