
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, Phone, CreditCard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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

interface OfeliaFormProps {
  onComplete: (data: z.infer<typeof formSchema>) => void;
}

export function OfeliaForm({ onComplete }: OfeliaFormProps) {
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
    onComplete(values);
  }

  const handleDocTypeChange = (type: "DNI" | "RUC") => {
    setDocType(type)
    form.setValue("docType", type)
    form.setValue("docNumber", "")
  }

  const docNumberPlaceholder = docType === "DNI" ? "8 dígitos" : "11 dígitos"
  const docNumberMaxLength = docType === "DNI" ? 8 : 11

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tipo de Documento</Label>
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
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Número de {docType}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder={docNumberPlaceholder}
                        maxLength={docNumberMaxLength}
                        type="text"
                        inputMode="numeric"
                        className="h-12 pl-11 rounded-xl bg-[#FAFAFA] border-border/60 placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {docType === "DNI" ? "Nombres y Apellidos" : "Razón Social"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder={docType === "DNI" ? "Ej. María Pérez Quispe" : "Nombre de la empresa"} 
                        {...field} 
                        className="h-12 pl-11 rounded-xl bg-[#FAFAFA] border-border/60 placeholder:text-muted-foreground/50" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Correo Electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="tucorreo@ejemplo.com" 
                        type="email" 
                        {...field} 
                        className="h-12 pl-11 rounded-xl bg-[#FAFAFA] border-border/60 placeholder:text-muted-foreground/50" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Número de Teléfono Celular</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="9XX XXX XXX" 
                        type="tel" 
                        {...field} 
                        className="h-12 pl-11 rounded-xl bg-[#FAFAFA] border-border/60 placeholder:text-muted-foreground/50" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full h-14 text-sm font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                Crear mi Perfil / Ingresar
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground font-medium px-4 leading-normal">
              Al continuar aceptas las políticas de tratamiento de datos del MTPE.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
