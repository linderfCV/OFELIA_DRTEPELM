"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check, MapPin, Store, Search, ArrowRight, Home, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { logOfeliaEvent } from "@/services/event-service"

interface DiagnosticFlowProps {
  onComplete: (type: 'idea' | 'active' | 'domestic', answers: any) => void;
  userData?: any;
}

const SECTORS = [
  { id: "gastronomia", label: "Gastronomía (Restaurantes, Cafés, Comida al paso)", icon: "🍳" },
  { id: "educacion", label: "Educación (Nidos, Colegios, Academias, Capacitación)", icon: "📚" },
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

const SECTOR_MAPPING: Record<string, string> = {
  "Gastronomía (Restaurantes, Cafés, Comida al paso)": "gastronomia",
  "Educación (Nidos, Colegios, Academias, Capacitación)": "educacion",
  "Comercio (Tiendas de ropa, Minimarkets, Abarrotes)": "comercio",
  "Manufactura y Textil (Gamarra, Confecciones)": "manufactura_textil",
  "Servicios Profesionales y Técnicos": "servicios_profesionales",
  "Belleza y Cuidado Personal (Peluquerías, Spas)": "belleza_cuidado_personal",
  "Transporte, Logística y Delivery)": "transporte_logistica_delivery",
  "Tecnología, Apps y E-commerce": "tecnologia_apps_ecommerce",
  "Salud y Bienestar (Boticas, Consultorios)": "salud_bienestar",
  "Construcción y Ferretería": "construccion_ferreteria",
  "Otros Sectores": "otros"
};

const DISTRICTS = [
  "Cercado de Lima", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", 
  "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", 
  "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", 
  "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", 
  "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", 
  "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", 
  "Villa María del Triunfo"
].sort();

export function DiagnosticFlow({ onComplete, userData }: DiagnosticFlowProps) {
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

  const handleNext = async (data: Partial<typeof answers>) => {
    const nextAnswers = { ...answers, ...data };
    setAnswers(nextAnswers);
    
    const questionsCount = routeType ? routeQuestions[routeType as keyof typeof routeQuestions].length : 0;
    const finalStep = isDomestic ? 1 + questionsCount : 2 + questionsCount;

    if (step < finalStep) {
      setStep(step + 1);
    } else {
      // Mapeo detallado para Firestore
      const detail: any[] = [];
      const detected: string[] = [];
      const roadmap: string[] = [];
      
      const currentQuestions = routeQuestions[routeType as keyof typeof routeQuestions];
      const startIdx = isDomestic ? 2 : 3;
      
      currentQuestions.forEach((q, index) => {
        const answerStep = startIdx + index;
        const val = nextAnswers[answerStep];
        
        let theme = "";
        let stage = "";
        
        if (routeType === 'idea') {
           const ideaMaps = [
             {t: "sunarp_indecopi", s: "Reserva de Nombre Legal / Protección de Marca"},
             {t: "constitucion_empresa", s: "Elaborar Acto Constitutivo"},
             {t: "ruc_regimen_tributario", s: "RUC y Régimen Tributario"},
             {t: "licencia_funcionamiento", s: "Licencia de Funcionamiento"}
           ];
           theme = ideaMaps[index]?.t || "otros";
           stage = ideaMaps[index]?.s || "General";
        } else if (routeType === 'active') {
           const activeMaps = [
             {t: "ruc_regimen_tributario", s: "Actualización de RUC"},
             {t: "remype", s: "Registro en REMYPE"},
             {t: "licencia_funcionamiento", s: "Regularización Municipal"}
           ];
           theme = activeMaps[index]?.t || "otros";
           stage = activeMaps[index]?.s || "General";
        } else if (routeType === 'domestic') {
           const domesticMaps = [
             {t: "ruc_trabajador_hogar", s: "Inscripción en el RUC (SUNAT)"},
             {t: "t_registro_trabajador_hogar", s: "Alta en el T-Registro (SUNAT)"},
             {t: "contrato_trabajador_hogar", s: "Contrato y Aplicativo (MTPE)"}
           ];
           theme = domesticMaps[index]?.t || "otros";
           stage = domesticMaps[index]?.s || "General";
        }

        detail.push({
          pregunta: q,
          respuestaSeleccionada: val ? "Sí, lo tengo claro" : "No, necesito orientación",
          necesitaOrientacion: !val,
          temaRelacionado: theme,
          etapaRuta: stage
        });
        
        if (!val) {
          detected.push(theme);
        }
      });

      // Cálculo de Hoja de Ruta mostrada (espejo del Dashboard)
      if (routeType === 'idea') {
        if (nextAnswers[3] === false) roadmap.push("Reserva de Nombre Legal (SUNARP)");
        if (nextAnswers[4] === false) { roadmap.push("Protección de Marca (INDECOPI)"); roadmap.push("Elaborar Acto Constitutivo (Minuta)"); }
        if (nextAnswers[5] === false) roadmap.push("RUC y Régimen Tributario (SUNAT)");
        if (nextAnswers[6] === false) roadmap.push("Licencia de Funcionamiento");
        roadmap.push("Beneficios de tu Formalización MYPE");
      } else if (routeType === 'active') {
        if (nextAnswers[3] === false) roadmap.push("Actualización de RUC (SUNAT)");
        if (nextAnswers[4] === false) roadmap.push("Registro en REMYPE (MTPE)");
        if (nextAnswers[5] === false) roadmap.push("Regularización Municipal");
        roadmap.push("Beneficios de tu Formalización MYPE");
      } else if (routeType === 'domestic') {
        if (nextAnswers[2] === false) roadmap.push("Inscripción en el RUC (SUNAT)");
        if (nextAnswers[3] === false) roadmap.push("Alta en el T-Registro (SUNAT)");
        if (nextAnswers[4] === false) roadmap.push("Contrato y Aplicativo (MTPE)");
        roadmap.push("Obligaciones del Empleador y Derechos");
      }

      const rubroSlug = sector ? (SECTOR_MAPPING[sector] || "otros") : "hogar";
      
      let summary = "";
      if (isDomestic) {
        summary = `El ciudadano es empleador de trabajador(a) del hogar, ubicado en ${district}. ${detected.length > 0 ? `Requiere orientación en: ${detected.join(', ')}.` : 'Cuenta con formalidad base.'}`;
      } else {
        summary = `El ciudadano es emprendedor en etapa de ${routeType === 'idea' ? 'idea de negocio' : 'negocio en marcha'}, rubro ${sector}, ubicado en ${district}. ${detected.length > 0 ? `Requiere orientación en: ${detected.join(', ')}.` : 'Cuenta con formalidad base.'}`;
      }

      // Registro de diagnóstico enriquecido en Firestore
      await logOfeliaEvent({
        tipoEvento: "diagnostico_usuario",
        numeroDocumento: userData?.docNumber || "N/A",
        nombresApellidos: userData?.fullName || "N/A",
        tipoUsuario: isDomestic ? 'empleador_hogar' : 'emprendedor',
        etapaEmprendimiento: routeType === 'idea' ? 'idea_negocio' : routeType === 'active' ? 'negocio_en_marcha' : 'n_a',
        rubroNegocio: rubroSlug,
        rubroNegocioLabel: sector || "Trabajadores del Hogar",
        distrito: district,
        referencia: zone,
        respuestasDiagnosticoDetalle: detail,
        temasDetectados: detected,
        hojaRutaMostrada: roadmap,
        resultadoDiagnosticoResumen: summary,
        canal: "diagnostico_inicial"
      });

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
            onClick={() => { setProfile('domestic'); setRouteType('domestic'); setSector('Trabajadores del Hogar'); setStep(1); }}
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
