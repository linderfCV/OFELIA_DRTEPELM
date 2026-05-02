
"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DiagnosticFlowProps {
  onComplete: (type: 'idea' | 'active', answers: any) => void;
}

export function DiagnosticFlow({ onComplete }: DiagnosticFlowProps) {
  const [step, setStep] = React.useState(0);
  const [routeType, setRouteType] = React.useState<'idea' | 'active' | null>(null);
  const [answers, setAnswers] = React.useState<Record<number, boolean>>({});

  const questions = {
    idea: [
      "¿En qué etapa se encuentra tu emprendimiento?", // Step 0
      "¿Ya tienes definido el nombre o marca de tu proyecto?", // Step 1
      "¿Conoces qué trámites necesitas para constituirte como empresa (Persona Jurídica)?", // Step 2
      "¿Necesitas asesoría para elegir tu régimen tributario inicial?", // Step 3
      "¿Tienes licencia de funcionamiento?" // Step 4
    ],
    active: [
      "¿En qué etapa se encuentra tu emprendimiento?", // Step 0
      "¿Tu negocio cuenta con RUC activo y domicilio fiscal actualizado?", // Step 1
      "¿Cuentas con trabajadores en planilla o registrados en REMYPE?", // Step 2
      "¿Tienes licencia de funcionamiento?" // Step 3 (ITSE eliminado)
    ]
  };

  const totalSteps = routeType ? questions[routeType].length : 1;
  const currentProgress = ((step + 1) / totalSteps) * 100;

  const handleInitialChoice = (type: 'idea' | 'active') => {
    setRouteType(type);
    setStep(1);
  };

  const handleAnswer = (answer: boolean) => {
    const nextAnswers = { ...answers, [step]: answer };
    setAnswers(nextAnswers);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(routeType!, nextAnswers);
    }
  };

  if (step === 0) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO 1 DE {totalSteps}</p>
          <h2 className="text-3xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight">
            {questions.idea[0]}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">Personalizaremos tu ruta de formalización municipal y laboral.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => handleInitialChoice('idea')}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A1A]">Tengo una idea de negocio</h3>
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Ruta del Emprendedor</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={() => handleInitialChoice('active')}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A1A]">Ya tengo un negocio en marcha</h3>
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Ruta de la Regularización</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO {step + 1} DE {totalSteps}</p>
          <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}% COMPLETADO</p>
        </div>
        <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
        
        <h2 className="text-2xl font-black text-[#1A1A1A] pt-4 leading-[1.2] tracking-tight">
          {routeType === 'idea' ? questions.idea[step] : questions.active[step]}
        </h2>
      </div>

      <div className="grid gap-3 pt-4">
        <Button
          variant="outline"
          className="h-16 text-lg font-bold border-2 rounded-2xl hover:border-primary hover:text-primary transition-all flex justify-between px-6"
          onClick={() => handleAnswer(true)}
        >
          Sí, lo tengo claro
          <Check className="w-5 h-5 opacity-40" />
        </Button>
        <Button
          variant="outline"
          className="h-16 text-lg font-bold border-2 rounded-2xl hover:border-primary hover:text-primary transition-all flex justify-start px-6"
          onClick={() => handleAnswer(false)}
        >
          No, necesito orientación
        </Button>
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Tu información es confidencial (DRTPELM)</p>
      </div>
    </div>
  );
}
