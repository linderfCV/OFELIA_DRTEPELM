"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  docType: z.enum(["DNI", "RUC"]),
  docNumber: z.string().min(8, "Mínimo 8 dígitos"),
  fullName: z.string().min(3, "Campo requerido"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(9, "9 dígitos requeridos"),
})

export function RegistrationForm() {
  const [docType, setDocType] = React.useState<"DNI" | "RUC">("DNI")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docType: "DNI",
      docNumber: "",
      fullName: "",
      email: "",
      phone: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const handleDocTypeChange = (type: "DNI" | "RUC") => {
    setDocType(type)
    form.setValue("docType", type)
    form.setValue("docNumber", "")
  }

  const docNumberPlaceholder = docType === "DNI" ? "8 dígitos" : "11 dígitos"
  const docNumberMaxLength = docType === "DNI" ? 8 : 11

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Tipo de Documento</Label>
            <div className="segmented-control">
              <div
                className="segmented-control-item"
                data-active={docType === "DNI"}
                onClick={() => handleDocTypeChange("DNI")}
              >
                DNI
              </div>
              <div
                className="segmented-control-item"
                data-active={docType === "RUC"}
                onClick={() => handleDocTypeChange("RUC")}
              >
                RUC
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="docNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Documento</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={docNumberPlaceholder}
                    maxLength={docNumberMaxLength}
                    type="text"
                    inputMode="numeric"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {docType === "DNI" ? "Nombres y Apellidos" : "Razón Social"}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese aquí..." {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="usuario@ejemplo.com" type="email" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Teléfono Celular</FormLabel>
                <FormControl>
                  <Input placeholder="999 999 999" type="tel" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-lg">
          Crear mi Perfil / Ingresar
        </Button>
      </form>
    </Form>
  )
}
