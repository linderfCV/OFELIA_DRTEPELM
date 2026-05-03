
"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check, MapPin, Store, Search, ArrowRight, Home, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DiagnosticFlowProps {
  onComplete: (type: 'idea' | 'active' | 'domestic', answers: any) => void;
}

const SECTORS = [
  { id: "gastronomia", label: "Gastronomía (Restaurantes, Cafés, Comida al paso)", icon: "🍳" },
  { id: "comercio", label: "Comercio (Tiendas de ropa, Minimarkets, Abarrotes)", icon: "🛒" },
  { id: "textil", label: "Manufactura y Textil (Gamarra, Confecciones)", icon: "🧵" },
  { id: "servicios", label: "Servicios Profesionales y Técnicos", icon: "💼" },
  { id: "belleza", label: "Belleza y Cuidado Personal (Peluquerías, Spas)", icon: "💅" },
  { id: "transporte", label: "Transporte, Logística y Delivery", icon: "🛵" },
  { id: "tecnologia", label: "Tecnología, Apps y E-commerce", icon: "💻" },
  { id: "salud", label: "Salud y Bienestar (Boticas, Consultorios)", icon: "🏥" },
  { id: "construccion", label: "Construcción y Ferretería", icon: "🏗️" },
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
  const [step, setStep] = React.useState(-1);
  const [profile, setProfile] = React.useState<'entrepreneur' | 'domestic' | null>(null);
  const [routeType, setRouteType] = React.useState<'idea' | 'active' | 'domestic' | null>(null);
  const [sector, setSector] = React.useState<string | null>(null);
  const [district, setDistrict] = React.useState<string | null>(null);
  const [zone, setZone] = React.useState("");
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
    ],
    domestic: [
      "RUC Activo: ¿Tiene RUC para declarar la planilla de su trabajador(a)?",
      "Alta en SUNAT: ¿Inscribió a su trabajador(a) en el Registro de Trabajadores del Hogar (T-Registro)?",
      "Contrato Formal: ¿El contrato está firmado y subido al aplicativo del Ministerio de Trabajo?"
    ]
  };

  const isDomestic = profile === 'domestic';
  
  const getProgressInfo = () => {
    if (step === -1) return { total: 1, current: 1, percent: 0 };
    
    if (isDomestic) {
      const total = 2 + routeQuestions.domestic.length;
      return { total, current: step + 1, percent: ((step + 1) / total) * 100 };
    } else {
      const total = 3 + (routeType ? routeQuestions[routeType as 'idea' | 'active'].length : 0);
      return { total, current: step + 1, percent: ((step + 1) / total) * 100 };
    }
  };

  const { total: totalSteps, percent: currentProgress } = getProgressInfo();

  const handleNext = (data: Partial<typeof answers>) => {
    const nextAnswers = { ...answers, ...data };
    setAnswers(nextAnswers);
    
    const questionsCount = routeType ? routeQuestions[routeType as keyof typeof routeQuestions].length : 0;
    const finalStep = isDomestic ? 1 + questionsCount : 2 + questionsCount;

    if (step < finalStep) {
      setStep(step + 1);
    } else {
      onComplete(routeType!, nextAnswers);
    }
  };

  if (step === -1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">BIENVENIDO A OFELIA</p>
          <h2 className="text-3xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight">
            ¿Cómo te identificas hoy?
          </h2>
          <p className="text-sm text-muted-foreground font-medium">Selecciona tu perfil para darte la asesoría correcta.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setProfile('entrepreneur'); setStep(0); }}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A1A]">Soy Emprendedor</h3>
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Negocios y Proyectos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={() => { setProfile('domestic'); setRouteType('domestic'); setSector('Trabajadores(as) del Hogar'); setStep(1); }}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A1A]">Soy Empleador de Trabajadores(as) del Hogar</h3>
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Régimen Especial</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 0 && profile === 'entrepreneur') {
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

  if (step === 1 && profile === 'entrepreneur') {
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

        <ScrollArea className="h-[400px] pr-2">
          <div className="grid gap-2 pb-4">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSector(s.label); handleNext({ sector: s.label }); }}
                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl text-left hover:border-primary/30 transition-all hover:bg-gray-50 group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                  {s.icon}
                </div>
                <span className="text-sm font-bold text-gray-700 flex-1">{s.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  const isDistrictStep = (isDomestic && step === 1) || (!isDomestic && step === 2);
  if (isDistrictStep) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">UBICACIÓN</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
          <h2 className="text-2xl font-black text-[#1A1A1A] pt-4 leading-[1.2] tracking-tight">
            ¿En qué distrito se ubica el {isDomestic ? 'hogar' : 'negocio'}?
          </h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Busca tu distrito..." 
              className="pl-10 h-12 rounded-xl border-gray-200"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px] border border-gray-100 rounded-2xl bg-white p-2">
            <div className="grid gap-1">
              {DISTRICTS.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).map((d) => (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-between",
                    district === d 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {d}
                  <MapPin className={cn("w-3.5 h-3.5", district === d ? "opacity-100" : "opacity-30")} />
                </button>
              ))}
            </div>
          </ScrollArea>

          {district && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">
                  Zona o lugar de referencia (Opcional)
                </label>
                <Input 
                  placeholder="Ej: Mercado Central, Galería El Rey, Óvalo..." 
                  className="h-12 rounded-xl bg-gray-50 border-none focus:ring-1 focus:ring-primary/30"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                onClick={() => handleNext({ district, zone })}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const routeStepIdx = isDomestic ? step - 2 : step - 3;
  const currentQuestion = routeType ? routeQuestions[routeType as keyof typeof routeQuestions][routeStepIdx] : "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PASO {step + 1} DE {totalSteps}</p>
          <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
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
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Información Confidencial (DRTPELM)</p>
      </div>
    </div>
  );
}
