
"use client"

import * as React from "react"
import { Lightbulb, Briefcase, ChevronRight, Check, MapPin, Search, ArrowRight, Home, UserCheck, Sparkles, User, FileText, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { logOfeliaEvent } from "@/services/event-service"
import { motion, AnimatePresence } from "framer-motion"

interface DiagnosticFlowProps {
  onComplete: (type: 'idea' | 'active' | 'domestic', answers: any) => void;
  userData?: any;
}

const SECTORS = [
  { id: "gastronomia", label: "Gastronomía (Restaurantes, Cafés, Comida)", icon: "🍳" },
  { id: "educacion", label: "Educación (Nidos, Colegios, Academias)", icon: "📚" },
  { id: "comercio", label: "Comercio (Tiendas, Minimarkets)", icon: "🛒" },
  { id: "textil", label: "Manufactura y Textil (Gamarra)", icon: "🧵" },
  { id: "servicios", label: "Servicios Profesionales y Técnicos", icon: "💼" },
  { id: "belleza", label: "Belleza y Cuidado Personal (Spas)", icon: "💅" },
  { id: "transporte", label: "Transporte, Logística y Delivery", icon: "🛵" },
  { id: "tecnologia", label: "Tecnología, Apps y E-commerce", icon: "💻" },
  { id: "salud", label: "Salud y Bienestar (Boticas)", icon: "🏥" },
  { id: "construccion", label: "Construcción y Ferretería", icon: "🏗️" },
  { id: "otros", label: "Otros Sectores", icon: "✨" },
];

const SECTOR_MAPPING: Record<string, string> = {
  "Gastronomía (Restaurantes, Cafés, Comida)": "gastronomia",
  "Educación (Nidos, Colegios, Academias)": "educacion",
  "Comercio (Tiendas, Minimarkets)": "comercio",
  "Manufactura y Textil (Gamarra)": "manufactura_textil",
  "Servicios Profesionales y Técnicos": "servicios_profesionales",
  "Belleza y Cuidado Personal (Spas)": "belleza_cuidado_personal",
  "Transporte, Logística y Delivery": "transporte_logistica_delivery",
  "Tecnología, Apps y E-commerce": "tecnologia_apps_ecommerce",
  "Salud y Bienestar (Boticas)": "salud_bienestar",
  "Construcción y Ferretería)": "construccion_ferreteria",
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
      const summary = isDomestic 
        ? `Empleador(a) del hogar en ${district}. ${detected.length > 0 ? `Brechas: ${detected.join(', ')}.` : 'Formalidad base completa.'}`
        : `Emprendedor (${routeType}) rubro ${sector} en ${district}. ${detected.length > 0 ? `Brechas: ${detected.join(', ')}.` : 'Formalidad base completa.'}`;

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

  const HeaderImage = ({ src, icon: Icon, title, subtitle }: { src: string, icon?: any, title: string, subtitle?: string }) => (
    <div className="relative w-full h-44 rounded-[40px] overflow-hidden mb-10 shadow-2xl group">
      <motion.img 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        src={src} 
        alt="Banner Step" 
        className="w-full h-full object-cover transition-transform duration-1000 select-none" 
        style={{ imageRendering: 'auto' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent opacity-80" />
      <div className="absolute bottom-6 left-8 flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-white tracking-tight leading-none uppercase italic">{title}</h3>
          {subtitle && <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (step === -1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <HeaderImage src="/Fondo3.png" icon={User} title="Identificación de Perfil" subtitle="PASO INICIAL" />
        
        <div className="space-y-3 px-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">BIENVENIDO(A)</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter">
            ¿Cómo podemos orientarte hoy?
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-[360px]">Selecciona la opción que mejor describa tu situación actual para iniciar tu ruta técnica.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setProfile('entrepreneur'); setStep(0); }}
            className="flex items-center gap-5 p-7 bg-white border border-gray-100 rounded-[40px] text-left hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-full bg-amber-500/5 -skew-x-12 translate-x-8 group-hover:translate-x-0 transition-transform duration-500" />
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-black text-xl text-[#1A1A1A] tracking-tight">Soy Emprendedor</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Negocios y Proyectos</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => { setProfile('domestic'); setRouteType('domestic'); setSector('Trabajadores del Hogar'); setStep(1); }}
            className="flex items-center gap-5 p-7 bg-white border border-gray-100 rounded-[40px] text-left hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-full bg-blue-500/5 -skew-x-12 translate-x-8 group-hover:translate-x-0 transition-transform duration-500" />
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Home className="w-8 h-8" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-black text-xl text-[#1A1A1A] tracking-tight">Empleador del Hogar</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Régimen Especial Laboral</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 0 && profile === 'entrepreneur') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <HeaderImage src="/Fondo4.jpg" icon={Sparkles} title="Etapa de Negocio" subtitle="CONSTRUYENDO TU RUTA" />
        
        <div className="space-y-3 px-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PASO 1 DE {totalSteps}</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter">
            ¿En qué etapa se encuentra tu proyecto?
          </h2>
          <p className="text-sm text-gray-500 font-medium">Esto nos ayuda a priorizar los trámites iniciales o de regularización.</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => { setRouteType('idea'); setStep(1); }}
            className="flex items-center gap-5 p-7 bg-white border border-gray-100 rounded-[40px] text-left hover:border-primary/30 hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-[#1A1A1A] tracking-tight italic">Tengo una Idea</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Incubación y Constitución</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-all" />
          </button>

          <button
            onClick={() => { setRouteType('active'); setStep(1); }}
            className="flex items-center gap-5 p-7 bg-white border border-gray-100 rounded-[40px] text-left hover:border-primary/30 hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-[#1A1A1A] tracking-tight italic">Negocio en Marcha</h3>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Formalización y REMYPE</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-all" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 1 && profile === 'entrepreneur') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="space-y-4 px-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PASO 2 DE {totalSteps}</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-2 bg-gray-100" />
          <h2 className="text-4xl font-black text-[#1A1A1A] pt-4 leading-[0.9] tracking-tighter">
            ¿A qué rubro pertenece tu negocio?
          </h2>
        </div>

        <ScrollArea className="h-[460px] pr-4 border border-gray-100 rounded-[40px] bg-white p-4 shadow-inner">
          <div className="grid gap-2.5">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSector(s.label); handleNext({ sector: s.label }); }}
                className="flex items-center gap-4 p-5 bg-white border border-gray-50 rounded-2xl text-left hover:border-primary/30 transition-all hover:bg-gray-50 group shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">
                  {s.icon}
                </div>
                <span className="text-sm font-bold text-gray-700 flex-1">{s.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-primary" />
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
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="space-y-4 px-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LOCALIZACIÓN</p>
            <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
          </div>
          <Progress value={currentProgress} className="h-2 bg-gray-100" />
          <h2 className="text-4xl font-black text-[#1A1A1A] pt-4 leading-[0.9] tracking-tighter">
            ¿En qué distrito se ubica el negocio o servicio?
          </h2>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Buscar distrito..." 
              className="pl-12 h-16 rounded-3xl border-gray-100 bg-white shadow-xl shadow-gray-200/40 font-bold text-lg focus:ring-4 focus:ring-primary/5 transition-all"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] border border-gray-100 rounded-[40px] bg-white p-3 shadow-inner">
            <div className="grid gap-1.5">
              {DISTRICTS.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).map((d) => (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={cn(
                    "w-full text-left px-6 py-5 text-sm font-bold rounded-2xl transition-all flex items-center justify-between",
                    district === d 
                      ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]" 
                      : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  {d}
                  {district === d && <MapPin className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </ScrollArea>

          {district && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-3">
                  Punto de referencia
                </label>
                <Input 
                  placeholder="Ej: Frente al Mercado Central, Óvalo Santa Anita..." 
                  className="h-16 rounded-3xl bg-gray-100/50 border-none focus:ring-4 focus:ring-primary/5 font-medium px-6"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-16 rounded-3xl font-black bg-primary hover:bg-primary/90 flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs transition-all active:scale-95"
                onClick={() => handleNext({ district, zone })}
              >
                CONTINUAR
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  const routeStepIdx = isDomestic ? step - 2 : step - 3;
  const currentQuestion = routeType ? routeQuestions[routeType as keyof typeof routeQuestions][routeStepIdx] : "";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="space-y-6 px-2">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AUDITORÍA TÉCNICA {step + 1} DE {totalSteps}</p>
          <p className="text-[10px] font-black text-primary uppercase">{Math.round(currentProgress)}%</p>
        </div>
        <Progress value={currentProgress} className="h-2 bg-gray-100" />
        
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-sm p-10 rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <h2 className="text-3xl font-black text-[#1A1A1A] leading-[1.05] tracking-tighter italic">
            "{currentQuestion}"
          </h2>
        </motion.div>
      </div>

      <div className="grid gap-4 pt-6">
        <button
          className="h-24 text-xl font-black bg-white border-2 border-gray-100 rounded-[40px] hover:border-primary hover:text-primary transition-all flex items-center justify-between px-10 group shadow-xl hover:shadow-2xl active:scale-[0.98]"
          onClick={() => handleNext({ [step]: true })}
        >
          Sí, lo tengo claro
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-inner">
            <Check className="w-6 h-6 text-gray-300 group-hover:text-primary" />
          </div>
        </button>
        <button
          className="h-24 text-xl font-black bg-white border-2 border-gray-100 rounded-[40px] hover:border-primary hover:text-primary transition-all flex items-center justify-start px-10 group shadow-xl hover:shadow-2xl active:scale-[0.98]"
          onClick={() => handleNext({ [step]: false })}
        >
          No, necesito orientación
        </button>
      </div>

      <div className="pt-12 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary/30">
            <FileText className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary/30">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary/30">
             <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">DRTPELM LIMA METROPOLITANA</p>
      </div>
    </div>
  );
}
