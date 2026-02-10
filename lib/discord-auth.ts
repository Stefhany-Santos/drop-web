/**
 * Discord OAuth2 mock helpers.
 *
 * TODO: Replace mock functions with real API calls when backend is ready.
 * The real flow:
 *   1. Redirect to Discord authorize URL
 *   2. User approves -> Discord redirects back with ?code=...&state=...
 *   3. Backend exchanges `code` for access_token (POST /oauth2/token)
 *   4. Backend fetches user info (GET /users/@me) with the access_token
 *   5. Backend returns { id, username, avatar, email } to the frontend
 *
 * This module simulates step 3-5 client-side for development.
 */

export interface DiscordProfile {
  id: string
  username: string
  displayName: string
  avatar: string | null
  email: string | null
}

// ── Configuration ──
// TODO: Move these to env vars when backend is ready
const DISCORD_CLIENT_ID = "YOUR_DISCORD_CLIENT_ID"

/**
 * Build the Discord OAuth2 authorization URL.
 * `redirectUri` should be the full URL to the checkout page.
 */
export function getDiscordAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
    state,
  })
  return `https://discord.com/oauth2/authorize?${params.toString()}`
}

/**
 * Generate a random state string for CSRF protection.
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(16)
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(array)
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * MOCK: Exchange an authorization code for a Discord profile.
 *
 * TODO: Replace with real backend call:
 *   const res = await fetch("/api/auth/discord/callback", {
 *     method: "POST",
 *     body: JSON.stringify({ code, redirectUri }),
 *   })
 *   return res.json() as DiscordProfile
 */
export async function exchangeCodeForDiscordProfile(
  _code: string,
): Promise<DiscordProfile> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800))

  // Return mock profile
  return {
    id: "123456789012345678",
    username: "player_fivem",
    displayName: "Player FiveM",
    avatar: null,
    email: "player@discord.example.com",
  }
}

// ── Session persistence keys ──
const DISCORD_SESSION_KEY = "sf_discord_session"

export interface DiscordSession {
  id: string
  username: string
  displayName: string
  email: string | null
  avatarUrl: string | null
}

/**
 * Save Discord session to sessionStorage.
 */
export function saveDiscordSession(session: DiscordSession): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(DISCORD_SESSION_KEY, JSON.stringify(session))
  } catch {
    // silent fail
  }
}

/**
 * Load Discord session from sessionStorage.
 */
export function loadDiscordSession(): DiscordSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(DISCORD_SESSION_KEY)
    return raw ? (JSON.parse(raw) as DiscordSession) : null
  } catch {
    return null
  }
}

/**
 * Clear Discord session from sessionStorage.
 */
export function clearDiscordSession(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(DISCORD_SESSION_KEY)
  } catch {
    // silent fail
  }
}
