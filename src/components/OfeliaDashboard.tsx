
"use client"

import * as React from "react"
import { CheckCircle2, Circle, ArrowRight, MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OfeliaDashboardProps {
  routeType: 'idea' | 'active';
  results: Record<number, boolean>;
}

export function OfeliaDashboard({ routeType, results }: OfeliaDashboardProps) {
  const tasks = routeType === 'idea' 
    ? [
        { title: "Reserva de Nombre en SUNARP", desc: "Asegura la identidad de tu marca antes de constituirte.", status: results[1] },
        { title: "Elaboración del Acto Constitutivo", desc: "Define socios y capital (S.A.C., E.I.R.L., etc.).", status: results[2] },
        { title: "Orientación Tributaria", desc: "Elige el régimen SUNAT adecuado para tu nivel de ingresos.", status: !results[3] },
        { title: "Licencia de Funcionamiento", desc: "Trámite ante tu municipalidad distrital.", status: results[4] }
      ]
    : [
        { title: "Regularización de RUC", desc: "Asegura que tu actividad económica esté actualizada.", status: results[1] },
        { title: "Registro en REMYPE", desc: "Accede a beneficios de la Ley MYPE (MTPE).", status: results[2] },
        { title: "Certificado ITSE", desc: "Verifica las condiciones de seguridad de tu local.", status: results[3] },
        { title: "Licencia Municipal", desc: "Regulariza tu licencia de funcionamiento vigente.", status: results[4] }
      ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="inline-flex px-3 py-1 bg-primary/10 rounded-full">
          <p className="text-[10px] font-black text-primary uppercase tracking-wider">Resultado del Diagnóstico</p>
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
          {routeType === 'idea' ? "Tu Hoja de Ruta para tu Formalización" : "Tu Plan de Regularización"}
        </h2>
        <p className="text-sm text-muted-foreground font-medium">Hemos diseñado estas tareas prioritarias basadas en tu situación actual.</p>
      </header>

      <div className="space-y-4">
        {tasks.map((task, i) => (
          <Card key={i} className={`border-none shadow-sm ${task.status ? 'bg-emerald-50/50' : 'bg-white shadow-md'}`}>
            <CardContent className="p-4 flex items-start gap-4">
              {task.status ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-gray-200 shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${task.status ? 'text-emerald-700 line-through' : 'text-[#1A1A1A]'}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{task.desc}</p>
              </div>
              {!task.status && <ArrowRight className="w-4 h-4 text-primary" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {!results[4] && (
        <Card className="border-2 border-dashed border-amber-200 bg-amber-50/30 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-amber-900 uppercase tracking-tight">Atención: Licencia Municipal</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Para obtener tu <strong>Licencia de Funcionamiento</strong>, debes verificar primero la compatibilidad de uso en tu distrito. Recuerda que la licencia definitiva suele requerir el certificado de ITSE (Defensa Civil).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-primary rounded-2xl p-6 text-white space-y-4 shadow-xl shadow-primary/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="font-black text-xl italic tracking-tight uppercase leading-none">Próxima Acción</h3>
            <p className="text-xs font-medium opacity-90 leading-tight">
              Recibirás un correo con la guía detallada de trámites municipales y laborales.
            </p>
          </div>
        </div>
        <Button className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
          AGENDAR ASESORÍA GRATUITA
        </Button>
      </div>
    </div>
  );
}
