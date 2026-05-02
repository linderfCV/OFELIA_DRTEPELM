
"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check, MapPin, Store, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface DiagnosticFlowProps {
  onComplete: (type: 'idea' | 'active', answers: any) => void;
}

const SECTORS = [
  { id: "gastronomia", label: "Gastronomía y Restaurantes", icon: "🍳" },
  { id: "comercio", label: "Comercio y Tiendas (Ropa, Abarrotes)", icon: "🛒" },
  { id: "servicios", label: "Servicios Profesionales y Salud", icon: "💼" },
  { id: "manufactura", label: "Manufactura y Confección", icon: "🧵" },
  { id: "tecnologia", label: "Tecnología y Ecommerce", icon: "💻" },
  { id: "construccion", label: "Construcción y Ferretería", icon: "🏗️" },
  { id: "transporte", label: "Transporte y Delivery", icon: "🛵" },
  { id: "otros", label: "Otros Sectores", icon: "✨" },
];

const DISTRICTS = [
  "Cercado de Lima", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", 
  "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", 
  "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", 
  "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", 
  "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", 
  "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", 
  "Villa María del Triunfo"
].sort();

export function DiagnosticFlow({ onComplete }: DiagnosticFlowProps) {
  const [step, setStep] = React.useState(0);
  const [routeType, setRouteType] = React.useState<'idea' | 'active' | null>(null);
  const [sector, setSector] = React.useState<string | null>(null);
  const [district, setDistrict] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [districtSearch, setDistrictSearch] = React.useState("");

  const routeQuestions = {
    idea: [
      "¿Ya tienes definido el nombre o marca de tu proyecto?",
      "¿Conoces qué trámites necesitas para constituirte como empresa (Persona Jurídica)?",
      "¿Necesitas asesoría para elegir tu régimen tributario inicial?",
      "¿Tienes licencia de funcionamiento?"
    ],
    active: [
      "¿Tu negocio cuenta con RUC activo y domicilio fiscal actualizado?",
      "¿Cuentas con trabajadores en planilla o registrados en REMYPE?",
      "¿Tienes licencia de funcionamiento?"
    ]
  };

  // Global steps: 0 (Stage), 1 (Sector), 2 (District)
  // Route steps: 3 to N
  const totalGlobalSteps = 3;
  const totalRouteSteps = routeType ? routeQuestions[routeType].length : 0;
  const totalSteps = totalGlobalSteps + totalRouteSteps;
  
  const currentProgress = ((step + 1) / totalSteps) * 100;

  const handleNext = (data: Partial<typeof answers>) => {
    const nextAnswers = { ...answers, ...data };
    setAnswers(nextAnswers);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(routeType!, nextAnswers);
    }
  };

  const filteredDistricts = DISTRICTS.filter(d => 
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  // STEP 0: Stage Choice
  if (step === 0) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO 1 DE {totalSteps}</p>
          <h2 className="text-3xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight">
            ¿En qué etapa se encuentra tu emprendimiento?
          </h2>
          <p className="text-sm text-muted-foreground font-medium">Personalizaremos tu ruta de formalización municipal y laboral.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setRouteType('idea'); setStep(1); }}
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
            onClick={() => { setRouteType('active'); setStep(1); }}
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

  // STEP 1: Sector / Rubro
  if (step === 1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO 2 DE {totalSteps}</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
          <h2 className="text-2xl font-black text-[#1A1A1A] pt-4 leading-[1.2] tracking-tight">
            ¿Cuál es el rubro o sector de tu negocio?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSector(s.label); handleNext({ sector: s.label }); }}
              className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl text-left hover:border-primary/30 transition-all hover:bg-gray-50 group"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-sm font-bold text-gray-700 flex-1">{s.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2: District
  if (step === 2) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO 3 DE {totalSteps}</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
          <h2 className="text-2xl font-black text-[#1A1A1A] pt-4 leading-[1.2] tracking-tight">
            ¿En qué distrito se ubica (o se ubicará) tu negocio?
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Busca tu distrito..." 
            className="pl-10 h-12 rounded-xl"
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[300px] border border-gray-100 rounded-2xl bg-white p-2">
          <div className="grid gap-1">
            {filteredDistricts.map((d) => (
              <button
                key={d}
                onClick={() => { setDistrict(d); handleNext({ district: d }); }}
                className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors flex items-center justify-between"
              >
                {d}
                <MapPin className="w-3.5 h-3.5 opacity-30" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // STEP 3+: Route Specific Questions
  const routeStepIdx = step - totalGlobalSteps;
  const currentQuestion = routeType ? routeQuestions[routeType][routeStepIdx] : "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO {step + 1} DE {totalSteps}</p>
          <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}% COMPLETADO</p>
        </div>
        <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
        
        <h2 className="text-2xl font-black text-[#1A1A1A] pt-4 leading-[1.2] tracking-tight">
          {currentQuestion}
        </h2>
      </div>

      <div className="grid gap-3 pt-4">
        <Button
          variant="outline"
          className="h-16 text-lg font-bold border-2 rounded-2xl hover:border-primary hover:text-primary transition-all flex justify-between px-6"
          onClick={() => handleNext({ [step]: true })}
        >
          Sí, lo tengo claro
          <Check className="w-5 h-5 opacity-40" />
        </Button>
        <Button
          variant="outline"
          className="h-16 text-lg font-bold border-2 rounded-2xl hover:border-primary hover:text-primary transition-all flex justify-start px-6"
          onClick={() => handleNext({ [step]: false })}
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
