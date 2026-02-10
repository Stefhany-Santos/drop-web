"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { getPostAuthRedirect } from "@/lib/utils"
import { MOCK_CURRENT_USER } from "@/lib/mock-data"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleVerify() {
    if (code.length !== 6) return
    setLoading(true)
    // Mock: simulate verification, then redirect based on user state
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    // After verifying, the user is verified - simulate by using mock user with tenant
    const verifiedUser = { ...MOCK_CURRENT_USER, emailVerified: true }
    const redirect = getPostAuthRedirect(verifiedUser)
    router.push(redirect)
  }

  async function handleResend() {
    setResending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setResending(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Verifique seu e-mail</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enviamos um código de 6 dígitos para o seu e-mail.
            Digite-o abaixo para confirmar sua conta.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            size="lg"
            className="w-full"
            disabled={code.length !== 6 || loading}
            onClick={handleVerify}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {resending ? "Reenviando..." : "Reenviar código"}
          </button>
        </div>
      </div>
    </div>
  )
}
