
"use client"

import * as React from "react"
import { CheckCircle2, Circle, ArrowRight, Download, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OfeliaDashboardProps {
  routeType: 'idea' | 'active';
  results: Record<number, boolean>;
}

export function OfeliaDashboard({ routeType, results }: OfeliaDashboardProps) {
  const tasks = routeType === 'idea' 
    ? [
        { title: "Elaboración del Acto Constitutivo", desc: "El primer paso para ser una empresa legal.", status: results[1] },
        { title: "Reserva de Nombre en SUNARP", desc: "Asegura la identidad de tu marca.", status: results[1] },
        { title: "Inscripción en RUC", desc: "Obtén tu número de identidad tributaria.", status: results[3] }
      ]
    : [
        { title: "Registro en REMYPE", desc: "Accede a beneficios laborales especiales.", status: results[2] },
        { title: "Licencia de Funcionamiento", desc: "Trámite ante tu municipalidad.", status: results[3] },
        { title: "Regularización de RUC", desc: "Asegura que tu actividad sea la correcta.", status: results[1] }
      ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="inline-flex px-3 py-1 bg-primary/10 rounded-full">
          <p className="text-[10px] font-black text-primary uppercase tracking-wider">Resultado del Diagnóstico</p>
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
          {routeType === 'idea' ? "Tu Hoja de Ruta para Nacer Formal" : "Tu Plan de Regularización"}
        </h2>
        <p className="text-sm text-muted-foreground">Hemos diseñado estas tareas prioritarias basadas en tus respuestas.</p>
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

      <div className="bg-primary rounded-2xl p-6 text-white space-y-4 shadow-xl shadow-primary/20">
        <div className="space-y-1">
          <h3 className="font-black text-xl italic tracking-tight uppercase">Siguiente Paso</h3>
          <p className="text-xs font-medium opacity-90 leading-tight">Agendar cita presencial en el Centro de Empleo para validación de documentos.</p>
        </div>
        <Button className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl">
          AGENDAR ASESORÍA GRATUITA
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold gap-2">
          <Download className="w-4 h-4" /> PDF
        </Button>
        <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold gap-2">
          <Share2 className="w-4 h-4" /> Compartir
        </Button>
      </div>
    </div>
  );
}
