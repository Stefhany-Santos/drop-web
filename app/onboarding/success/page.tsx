"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { PartyPopper, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingStepper } from "@/components/onboarding-stepper"

function createConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ["#22c55e", "#16a34a", "#4ade80", "#10b981", "#34d399", "#f59e0b", "#3b82f6"]
  const particles: {
    x: number
    y: number
    w: number
    h: number
    color: string
    vx: number
    vy: number
    rotation: number
    rotationSpeed: number
    opacity: number
  }[] = []

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    })
  }

  let animationId: number
  let frame = 0

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    frame++

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed
      if (frame > 100) {
        p.opacity = Math.max(0, p.opacity - 0.005)
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }

    if (particles.some((p) => p.opacity > 0)) {
      animationId = requestAnimationFrame(animate)
    }
  }

  animate()
  return () => cancelAnimationFrame(animationId)
}

export default function OnboardingSuccessPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = createConfetti(canvasRef.current)
      return cleanup
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
        aria-hidden="true"
      />
      <OnboardingStepper currentStep={2} />
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
            Sua loja foi criada!
          </h1>
          <p className="mt-3 max-w-sm text-muted-foreground">
            Parabéns! Sua loja está pronta. Acesse o painel para começar a adicionar seus produtos e
            personalizar sua experiência.
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/admin/minha-loja/dashboard">
                Ir para o painel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/storefront/minha-loja" target="_blank">
                Visitar loja
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
