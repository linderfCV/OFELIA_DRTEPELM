"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check, MapPin, Store, Search, ArrowRight, Home, UserCheck, Sparkles } from "lucide-react"
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
      // Registro y lógica de guardado omitida por brevedad (se mantiene igual)
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
        if (!val) detected.push(theme);
      });

      // Cálculo de Hoja de Ruta
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

  const HeaderImage = ({ src }: { src: string }) => (
    <div className="relative w-full h-40 rounded-[32px] overflow-hidden mb-8 shadow-xl">
      <img src={src} alt="Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-4 left-6">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Asesoría Preventiva</span>
        </div>
      </div>
    </div>
  );

  if (step === -1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <HeaderImage src="/Fondo3.png" />
        <div className="space-y-3 px-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">IDENTIFICACIÓN</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] leading-[0.95] tracking-tighter">
            ¿Cómo te identificas hoy?
          </h2>
          <p className="text-sm text-gray-500 font-medium">Selecciona tu perfil para personalizar tu ruta legal.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setProfile('entrepreneur'); setStep(0); }}
            className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-[32px] text-left hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-[#1A1A1A]">Soy Emprendedor</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">Negocios y Proyectos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={() => { setProfile('domestic'); setRouteType('domestic'); setSector('Trabajadores del Hogar'); setStep(1); }}
            className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-[32px] text-left hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
              <Home className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-[#1A1A1A]">Soy Empleador del Hogar</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">Régimen Especial</p>
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
        <HeaderImage src="/Fondo4.jpg" />
        <div className="space-y-3 px-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PASO 1 DE {totalSteps}</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] leading-[0.95] tracking-tighter">
            ¿En qué etapa estás?
          </h2>
          <p className="text-sm text-gray-500 font-medium italic">Tu formalización depende del estado de tu proyecto.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setRouteType('idea'); setStep(1); }}
            className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-[32px] text-left hover:border-primary/20 hover:shadow-2xl transition-all group"
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <Lightbulb className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-[#1A1A1A]">Idea de Negocio</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">Incubación y Constitución</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={() => { setRouteType('active'); setStep(1); }}
            className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-[32px] text-left hover:border-primary/20 hover:shadow-2xl transition-all group"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-[#1A1A1A]">Negocio en Marcha</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">Regularización y REMYPE</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  // --- RESTO DE PASOS (SECTOR, DISTRITO, PREGUNTAS) ---
  // Se mantienen con mejoras sutiles en espaciado y tipografía para coincidir con el nuevo estilo visual.

  if (step === 1 && profile === 'entrepreneur') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4 px-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PASO 2 DE {totalSteps}</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
          <h2 className="text-3xl font-black text-[#1A1A1A] pt-4 leading-none tracking-tighter">
            ¿Cuál es el rubro de tu negocio?
          </h2>
        </div>

        <ScrollArea className="h-[440px] pr-4">
          <div className="grid gap-2.5 pb-4">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSector(s.label); handleNext({ sector: s.label }); }}
                className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/30 transition-all hover:bg-gray-50 group"
              >
                <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all">
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
        <div className="space-y-4 px-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UBICACIÓN</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
          <h2 className="text-3xl font-black text-[#1A1A1A] pt-4 leading-none tracking-tighter">
            ¿En qué distrito se ubica?
          </h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Busca tu distrito..." 
              className="pl-11 h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[280px] border border-gray-100 rounded-[32px] bg-white p-3 shadow-inner">
            <div className="grid gap-1">
              {DISTRICTS.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).map((d) => (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={cn(
                    "w-full text-left px-5 py-4 text-sm font-bold rounded-xl transition-all flex items-center justify-between",
                    district === d 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  {d}
                  <MapPin className={cn("w-4 h-4", district === d ? "opacity-100" : "opacity-20")} />
                </button>
              ))}
            </div>
          </ScrollArea>

          {district && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">
                  Zona o referencia (Opcional)
                </label>
                <Input 
                  placeholder="Ej: Mercado Central, Óvalo..." 
                  className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-medium"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-14 rounded-2xl font-black bg-primary hover:bg-primary/90 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                onClick={() => handleNext({ district, zone })}
              >
                Continuar Diagnóstico
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
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-5 px-2">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PASO {step + 1} DE {totalSteps}</p>
          <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
        </div>
        <Progress value={currentProgress} className="h-1.5 bg-gray-100" />
        
        <h2 className="text-3xl font-black text-[#1A1A1A] pt-4 leading-[1.1] tracking-tighter italic">
          "{currentQuestion}"
        </h2>
      </div>

      <div className="grid gap-4 pt-4">
        <button
          className="h-20 text-lg font-black bg-white border-2 border-gray-100 rounded-3xl hover:border-primary hover:text-primary transition-all flex items-center justify-between px-8 group shadow-sm hover:shadow-xl active:scale-95"
          onClick={() => handleNext({ [step]: true })}
        >
          Sí, lo tengo claro
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Check className="w-5 h-5 text-gray-300 group-hover:text-primary" />
          </div>
        </button>
        <button
          className="h-20 text-lg font-black bg-white border-2 border-gray-100 rounded-3xl hover:border-primary hover:text-primary transition-all flex items-center justify-start px-8 group shadow-sm hover:shadow-xl active:scale-95"
          onClick={() => handleNext({ [step]: false })}
        >
          No, necesito orientación
        </button>
      </div>

      <div className="pt-10 flex flex-col items-center gap-4">
        <div className="h-[1px] w-20 bg-gray-200" />
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">DRTPELM LIMA METROPOLITANA</p>
      </div>
    </div>
  );
}
