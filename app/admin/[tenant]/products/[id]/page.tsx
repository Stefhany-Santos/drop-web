"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"
import { useStore } from "@/lib/store"

export default function EditProductPage() {
  const { tenant, id } = useParams<{ tenant: string; id: string }>()
  const router = useRouter()
  const { products } = useStore()

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Button variant="outline" onClick={() => router.push(`/admin/${tenant}/products`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  return <ProductForm product={product} />
}
