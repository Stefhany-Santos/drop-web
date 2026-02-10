"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabIdentity } from "@/components/admin/settings/tab-identity"
import { TabTheme } from "@/components/admin/settings/tab-theme"
import { TabProductCard } from "@/components/admin/settings/tab-product-card"
import { TabCopy } from "@/components/admin/settings/tab-copy"
import { TabDomain } from "@/components/admin/settings/tab-domain"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie identidade, cores, card de produto, textos e dominio da sua loja.
        </p>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="identity">Identidade</TabsTrigger>
          <TabsTrigger value="theme">Cores do site</TabsTrigger>
          <TabsTrigger value="card">Card do produto</TabsTrigger>
          <TabsTrigger value="copy">Textos</TabsTrigger>
          <TabsTrigger value="domain">Dominio & Preview</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="identity" className="mt-0">
            <TabIdentity />
          </TabsContent>
          <TabsContent value="theme" className="mt-0">
            <TabTheme />
          </TabsContent>
          <TabsContent value="card" className="mt-0">
            <TabProductCard />
          </TabsContent>
          <TabsContent value="copy" className="mt-0">
            <TabCopy />
          </TabsContent>
          <TabsContent value="domain" className="mt-0">
            <TabDomain />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
