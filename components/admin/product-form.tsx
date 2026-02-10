"use client"

import { useRouter, useParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import type { Product, ProductStatus } from "@/lib/types"
import { toast } from "sonner"
import { useState } from "react"

const variantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da variante obrigatório"),
  price: z.coerce.number().min(1, "Preço obrigatório"),
  stock: z.coerce.number().min(0, "Estoque inválido"),
})

const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.coerce.number().min(1, "Preço deve ser maior que 0"),
  images: z.string(),
  badges: z.string(),
  benefits: z.string(),
  status: z.enum(["ativo", "rascunho", "arquivado"]),
  variants: z.array(variantSchema),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const { tenant } = useParams<{ tenant: string }>()
  const { categories, addProduct, updateProduct } = useStore()
  const [saving, setSaving] = useState(false)
  const isEditing = !!product

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          description: product.description,
          price: product.price,
          images: product.images.join(", "),
          badges: product.badges.join(", "),
          benefits: product.benefits.join("\n"),
          status: product.status,
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock,
          })),
        }
      : {
          name: "",
          slug: "",
          categoryId: "",
          description: "",
          price: 0,
          images: "",
          badges: "",
          benefits: "",
          status: "rascunho" as ProductStatus,
          variants: [],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  function onSubmit(values: ProductFormValues) {
    setSaving(true)

    const productData = {
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      description: values.description,
      price: values.price,
      images: values.images.split(",").map((s) => s.trim()).filter(Boolean),
      badges: values.badges.split(",").map((s) => s.trim()).filter(Boolean),
      benefits: values.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
      status: values.status,
      variants: values.variants,
    }

    if (isEditing && product) {
      updateProduct(product.id, productData)
      toast.success("Produto atualizado com sucesso.")
    } else {
      addProduct(productData)
      toast.success("Produto criado com sucesso.")
    }

    setTimeout(() => {
      setSaving(false)
      router.push(`/admin/${tenant}/products`)
    }, 300)
  }

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    form.setValue("name", name)
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      form.setValue("slug", slug)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/${tenant}/products`)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Editar produto" : "Novo produto"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Atualize as informações do produto"
              : "Preencha os dados para criar um novo produto"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main info */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações gerais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Sistema de Empregos v3"
                            {...field}
                            onChange={(e) => handleNameChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="sistema-empregos-v3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o produto..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (em centavos)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="4990" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Media & extras */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mídia e extras</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URLs de imagens (separadas por vírgula)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="badges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badges (separadas por vírgula)</FormLabel>
                        <FormControl>
                          <Input placeholder="Mais vendido, Novo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefícios (um por linha)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Benefício 1&#10;Benefício 2" rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Variants */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Variantes</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ id: `var-new-${fields.length}`, name: "", price: 0, stock: 0 })
                    }
                    className="gap-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar
                  </Button>
                </CardHeader>
                <CardContent>
                  {fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Nenhuma variante adicionada.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {fields.map((varField, idx) => (
                        <div key={varField.id} className="flex items-end gap-3">
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                {idx === 0 && <FormLabel>Nome</FormLabel>}
                                <FormControl>
                                  <Input placeholder="ESX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.price`}
                            render={({ field }) => (
                              <FormItem className="w-28">
                                {idx === 0 && <FormLabel>Preço</FormLabel>}
                                <FormControl>
                                  <Input type="number" placeholder="4990" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.stock`}
                            render={({ field }) => (
                              <FormItem className="w-24">
                                {idx === 0 && <FormLabel>Estoque</FormLabel>}
                                <FormControl>
                                  <Input type="number" placeholder="999" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(idx)}
                            className="h-10 w-10 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Publicação</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rascunho">Rascunho</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="arquivado">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <Button type="submit" disabled={saving} className="w-full gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEditing ? "Salvar alterações" : "Criar produto"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
