"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, Phone, CreditCard, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { logOfeliaEvent } from "@/services/event-service"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { motion } from "framer-motion"

const formSchema = z.object({
  docType: z.enum(["DNI_CE", "RUC"]),
  docNumber: z.string()
    .regex(/^\d+$/, "Solo se permiten números"),
  fullName: z.string().min(3, "El nombre o razón social debe tener al menos 3 caracteres"),
  email: z.string().email("Ingrese un correo electrónico válido"),
  phone: z.string()
    .length(9, "El celular debe tener 9 dígitos")
    .regex(/^\d+$/, "El celular debe tener solo números"),
}).superRefine((data, ctx) => {
  if (data.docType === "DNI_CE") {
    if (data.docNumber.length !== 8 && data.docNumber.length !== 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe tener 8 (DNI) o 9 (CE) dígitos",
        path: ["docNumber"],
      });
    }
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
  const [docType, setDocType] = React.useState<"DNI_CE" | "RUC">("DNI_CE")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docType: "DNI_CE",
      docNumber: "",
      fullName: "",
      email: "",
      phone: "",
    },
    mode: "onChange"
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let specificType = values.docType === "RUC" ? "RUC" : (values.docNumber.length === 8 ? "DNI" : "CE");

    const eventPayload = {
      tipoEvento: "registro_usuario",
      tipoDocumento: specificType,
      numeroDocumento: values.docNumber,
      nombresApellidos: values.fullName,
      correoElectronico: values.email,
      telefonoCelular: values.phone,
      canal: "pantalla_principal"
    };

    sessionStorage.setItem('ofelia_user_session', JSON.stringify({
      ...values,
      docType: specificType
    }));

    await logOfeliaEvent(eventPayload);
    onComplete(values);
  }

  const handleDocTypeChange = (type: "DNI_CE" | "RUC") => {
    setDocType(type)
    form.setValue("docType", type)
    form.setValue("docNumber", "")
    form.clearErrors("docNumber")
  }

  return (
    <Card className="border-none shadow-premium rounded-[40px] overflow-hidden bg-white/95 backdrop-blur-xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-red-500 to-primary/40 opacity-80" />
      
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-primary/5 py-2 px-4 rounded-full border border-primary/10"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Plataforma Oficial DRTPELM</span>
          </motion.div>
          <div className="h-0.5 w-12 bg-gray-100 rounded-full" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2.5"
            >
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Identificación Ciudadana</Label>
              <div className="segmented-control p-1 bg-gray-100/60 rounded-2xl border border-gray-100">
                <div
                  className={cn(
                    "flex-1 px-4 py-3 text-[10px] font-black transition-all rounded-xl text-center cursor-pointer uppercase tracking-widest",
                    docType === "DNI_CE" ? "bg-white shadow-md text-[#1A1A1A] scale-[1.01]" : "text-gray-400 hover:text-gray-600"
                  )}
                  onClick={() => handleDocTypeChange("DNI_CE")}
                >
                  DNI / CE
                </div>
                <div
                  className={cn(
                    "flex-1 px-4 py-3 text-[10px] font-black transition-all rounded-xl text-center cursor-pointer uppercase tracking-widest",
                    docType === "RUC" ? "bg-white shadow-md text-[#1A1A1A] scale-[1.01]" : "text-gray-400 hover:text-gray-600"
                  )}
                  onClick={() => handleDocTypeChange("RUC")}
                >
                  RUC
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="docNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">
                      {docType === "RUC" ? "Número de RUC" : "Número de documento"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          placeholder={docType === "RUC" ? "11 dígitos" : "8 o 9 dígitos"}
                          maxLength={docType === "RUC" ? 11 : 9}
                          type="text"
                          inputMode="numeric"
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            field.onChange(val);
                          }}
                          className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 font-bold focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">
                      {docType === "RUC" ? "Razón Social" : "Nombres y Apellidos"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder={docType === "RUC" ? "Nombre de la empresa" : "Ej. María Pérez Quispe"} 
                          {...field} 
                          className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 font-bold focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Correo Electrónico</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="tucorreo@ejemplo.com" 
                            type="email" 
                            {...field} 
                            className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 font-bold focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Número de Celular</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="9XX XXX XXX" 
                            type="tel" 
                            maxLength={9}
                            {...field} 
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              field.onChange(val);
                            }}
                            className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 font-bold focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                disabled={!form.formState.isValid}
                className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 rounded-[24px] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:grayscale active:scale-95"
              >
                INGRESAR AL PANEL
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </motion.div>
            
            <div className="space-y-6">
              <p className="text-[9px] text-center text-gray-400 font-bold px-4 leading-relaxed uppercase tracking-wider">
                Al continuar aceptas las políticas de tratamiento de datos del MTPE y los términos de uso GovTech.
              </p>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100/60">
                <div className="flex items-center gap-3 grayscale opacity-30">
                  <img src="/image_f1ee39.jfif" alt="MTPE" className="h-5 w-auto" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-2.5 h-2.5 text-primary/30" />
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    Iniciativa de la DRTPELM <span className="mx-2 text-gray-200">·</span> Innova Región 2026
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
