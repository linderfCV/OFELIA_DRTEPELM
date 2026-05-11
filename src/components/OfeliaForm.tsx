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
import { logOfeliaEvent } from "@/services/event-service"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  docType: z.enum(["DNI", "CE", "RUC"]),
  docNumber: z.string()
    .regex(/^\d+$/, "Solo se permiten números"),
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingrese un correo electrónico válido"),
  phone: z.string()
    .length(9, "El celular debe tener 9 dígitos")
    .regex(/^\d+$/, "El celular debe tener solo números"),
}).superRefine((data, ctx) => {
  if (data.docType === "DNI" && data.docNumber.length !== 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El DNI debe tener 8 dígitos",
      path: ["docNumber"],
    });
  }
  if (data.docType === "CE" && data.docNumber.length !== 9) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El CE debe tener 9 dígitos",
      path: ["docNumber"],
    });
  }
  if (data.docType === "RUC" && data.docNumber.length !== 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El RUC debe tener 11 dígitos",
      path: ["docNumber"],
    });
  }
});

interface OfeliaFormProps {
  onComplete: (data: z.infer<typeof formSchema>) => void;
}

export function OfeliaForm({ onComplete }: OfeliaFormProps) {
  const [docType, setDocType] = React.useState<"DNI" | "CE" | "RUC">("DNI")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docType: "DNI",
      docNumber: "",
      fullName: "",
      email: "",
      phone: "",
    },
    mode: "onChange"
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await logOfeliaEvent({
      tipoEvento: "registro_usuario",
      tipoDocumento: values.docType,
      numeroDocumento: values.docNumber,
      nombresApellidos: values.fullName,
      correoElectronico: values.email,
      telefonoCelular: values.phone,
      canal: "pantalla_principal"
    });
    
    onComplete(values);
  }

  const handleDocTypeChange = (type: "DNI" | "CE" | "RUC") => {
    setDocType(type)
    form.setValue("docType", type)
    form.setValue("docNumber", "")
    form.clearErrors("docNumber")
  }

  const getDocConfig = () => {
    switch(docType) {
      case "DNI": return { placeholder: "8 dígitos", max: 8 };
      case "CE": return { placeholder: "9 dígitos", max: 9 };
      case "RUC": return { placeholder: "11 dígitos", max: 11 };
      default: return { placeholder: "", max: 15 };
    }
  }

  const docConfig = getDocConfig();

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
                  data-active={docType === "CE"}
                  onClick={() => handleDocTypeChange("CE")}
                >
                  CE
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
                        placeholder={docConfig.placeholder}
                        maxLength={docConfig.max}
                        type="text"
                        inputMode="numeric"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          field.onChange(val);
                        }}
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
                    {docType === "RUC" ? "Razón Social" : "Nombres y Apellidos"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder={docType === "RUC" ? "Nombre de la empresa" : "Ej. María Pérez Quispe"} 
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
                        maxLength={9}
                        {...field} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          field.onChange(val);
                        }}
                        className="h-12 pl-11 rounded-xl bg-[#FAFAFA] border-border/60 placeholder:text-muted-foreground/50" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={!form.formState.isValid}
                className="w-full h-14 text-sm font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
              >
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
