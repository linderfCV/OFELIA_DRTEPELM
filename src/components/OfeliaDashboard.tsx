"use client"

import * as React from "react"
import { 
  Search, 
  FileText, 
  CreditCard, 
  MapPin, 
  MessageSquare,
  ClipboardList,
  AlertCircle,
  RefreshCcw,
  ShieldCheck,
  ExternalLink,
  UserCheck,
  Download,
  Scale,
  Zap,
  Award,
  TrendingUp,
  Landmark,
  HeartPulse,
  Truck,
  GraduationCap,
  Trophy,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TaskOption {
  label: string;
  url: string;
}

interface Task {
  id: string;
  step: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string;
  requirements: string[];
  steps: string[];
  link?: string;
  options?: TaskOption[];
}

interface OfeliaDashboardProps {
  routeType: 'idea' | 'active' | 'domestic';
  results: Record<string, any>;
  onOpenChat?: () => void;
  onRedoDiagnostic?: () => void;
}

export function OfeliaDashboard({ routeType, results, onOpenChat, onRedoDiagnostic }: OfeliaDashboardProps) {
  
  const getSectoralTask = (sectorLabel: string): Task | null => {
    if (sectorLabel.includes("Educación")) {
      return {
        id: "sectoral-edu",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Autorización de Funcionamiento (MINEDU)",
        icon: <GraduationCap className="w-5 h-5" />,
        description: "¿RUBRO EDUCACIÓN?",
        details: "Para instituciones educativas privadas (Nidos, Colegios, Institutos), necesitas la autorización de funcionamiento otorgada por el Ministerio de Educación o la UGEL de tu jurisdicción.",
        requirements: ["Proyecto Educativo Institucional (PEI).", "Plano de infraestructura aprobado.", "DNI del promotor."],
        steps: ["Verifica requisitos en el portal del MINEDU.", "Presenta expediente en la UGEL correspondiente.", "Obtén la Resolución Directoral de Funcionamiento."],
        link: "https://www.gob.pe/minedu"
      };
    }
    if (sectorLabel.includes("Salud")) {
      return {
        id: "sectoral-salud",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Registro de IPRESS (SUSALUD)",
        icon: <HeartPulse className="w-5 h-5" />,
        description: "¿RUBRO SALUD?",
        details: "Todo establecimiento de salud (Boticas, Clínicas, Consultorios) debe registrarse ante la Superintendencia Nacional de Salud (SUSALUD) como IPRESS.",
        requirements: ["RUC activo.", "Título profesional del Director Médico.", "Categorización vigente de la DIRIS/DIRESA."],
        steps: ["Obtén la categorización en la DIRIS local.", "Inscribe el establecimiento en el Registro Nacional de IPRESS (RENIPRESS).", "Mantén el registro actualizado ante SUSALUD."],
        link: "https://www.gob.pe/susalud"
      };
    }
    if (sectorLabel.includes("Transporte")) {
      return {
        id: "sectoral-transporte",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Autorización de Operación (ATU/MTC)",
        icon: <Truck className="w-5 h-5" />,
        description: "¿RUBRO TRANSPORTE?",
        details: "Para servicios de transporte de pasajeros o carga, requieres permisos específicos de la Autoridad de Transporte Urbano (ATU) para Lima y Callao o del MTC.",
        requirements: ["Tarjeta de propiedad del vehículo.", "SOAT vigente.", "Certificado de Inspección Técnica Vehicular (CITV)."],
        steps: ["Solicita la habilitación vehicular ante la ATU.", "Obtén el Permiso de Operación para la ruta.", "Registra a tus conductores en el padrón oficial."],
        link: "https://www.gob.pe/atu"
      };
    }
    if (sectorLabel.includes("Gastronomía")) {
      return {
        id: "sectoral-gastro",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Registro Sanitario y Vigilancia (DIGESA)",
        icon: <Landmark className="w-5 h-5" />,
        description: "¿RUBRO ALIMENTOS?",
        details: "Si fabricas o comercializas alimentos procesados, necesitas el Registro Sanitario de DIGESA para garantizar la inocuidad alimentaria.",
        requirements: ["Resultados de análisis físico-químico.", "Ficha técnica del producto.", "Pago de tasa administrativa."],
        steps: ["Realiza los análisis de laboratorio obligatorios.", "Solicita el registro vía VUCE.", "Obtén el código de Registro Sanitario para tus productos."],
        link: "https://www.gob.pe/digesa"
      };
    }
    return null;
  };

  const getMypeBenefitsTask = (): Task => ({
    id: "mype-benefits",
    step: "VALOR AGREGADO",
    title: "Beneficios de tu Formalización MYPE",
    icon: <Award className="w-5 h-5" />,
    description: "¿POR QUÉ SER FORMAL ES TU MEJOR NEGOCIO?",
    details: "Estar en el REMYPE te permite acceder a un régimen laboral especial diseñado para que tu empresa crezca con costos reducidos y mayor competitividad.",
    requirements: [
      "Microempresa: Ventas anuales hasta 150 UIT.",
      "Ahorro en CTS y Gratificaciones en el régimen Micro.",
      "Vacaciones Reducidas: 15 días calendario por año.",
      "Acceso al SIS Emprendedor o EsSalud preferencial.",
      "10% de puntaje adicional en licitaciones estatales."
    ],
    steps: [
      "Inscríbete en el REMYPE tras obtener tu RUC.",
      "Accede a créditos con tasas preferenciales.",
      "Protege tu patrimonio mediante la Personería Jurídica."
    ],
    options: [
      { label: "Guía de beneficios de la formalización empresarial", url: "https://www.gob.pe/institucion/tuempresa/noticias/914295-conozca-los-6-beneficios-de-la-formalizacion-empresarial" },
      { label: "Portal Emprender (SUNAT)", url: "https://emprender.sunat.gob.pe/acciones-contribuyente/formalizacion/beneficios-ser-formal" }
    ]
  });

  const getIdeaTasks = (): Task[] => {
    const allTasks: Task[] = [
      {
        id: "sunarp",
        step: "PASO 1",
        title: "Reserva de Nombre Legal (SUNARP)",
        icon: <Search className="w-5 h-5" />,
        description: "PRIMERA GESTIÓN REGISTRAL",
        details: "La reserva de nombre protege tu denominación por 30 días mientras elevas la escritura pública.",
        requirements: ["DNI vigente.", "Tres opciones de nombres.", "Pago de tasa registral."],
        steps: ["Búsqueda de Índices.", "Solicitud de Reserva de Nombre.", "Entrega de constancia."],
        link: "https://www.gob.pe/271-buscar-y-reservar-el-nombre-de-una-empresa-en-la-sunarp"
      },
      {
        id: "indecopi",
        step: "PASO 2",
        title: "Protección de Marca (INDECOPI)",
        icon: <ShieldCheck className="w-5 h-5" />,
        description: "PROPIEDAD INTELECTUAL",
        details: "Protege tu nombre comercial y evita que otros utilicen tu identidad de marca.",
        requirements: ["Logo digital.", "Clasificación de Niza.", "Tasa de registro."],
        steps: ["Búsqueda Fonética gratuita.", "Presentación de solicitud virtual.", "Publicación en Gaceta Electrónica."],
        link: "https://pi.indecopi.gob.pe/buscatumarca/#/inicio"
      },
      {
        id: "acto",
        step: "PASO 3",
        title: "Elaborar Acto Constitutivo (Minuta)",
        icon: <FileText className="w-5 h-5" />,
        description: "FUNDACIÓN LEGAL",
        details: "Documento donde defines estatutos, socios y capital. Gestiónable en CDE de PRODUCE.",
        requirements: ["Reserva SUNARP.", "DNI de socios.", "Aportes de capital."],
        steps: ["Elaboración de Minuta.", "Firma ante Notario.", "Inscripción en Registros Públicos."],
        link: "https://www.gob.pe/269-elaborar-la-minuta-de-constitucion-de-la-empresa-o-acto-constitutivo"
      },
      {
        id: "sunat",
        step: "PASO 4",
        title: "RUC y Régimen Tributario (SUNAT)",
        icon: <CreditCard className="w-5 h-5" />,
        description: "IDENTIFICACIÓN TRIBUTARIA",
        details: "Indispensable para emitir facturas y boletas electrónicas.",
        requirements: ["Escritura inscrita.", "Recibo de local.", "DNI representante."],
        steps: ["Activación de RUC.", "Elección de Régimen (MYPE/Especial).", "Generación de Clave SOL."],
        link: "https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios"
      },
      {
        id: "municipal",
        step: "PASO 5",
        title: "Licencia de Funcionamiento",
        icon: <MapPin className="w-5 h-5" />,
        description: "AUTORIZACIÓN LOCAL",
        details: "Habilita el local para el desarrollo de actividades económicas.",
        requirements: ["RUC activo.", "Certificado de ITSE.", "Vigencia de poderes."],
        steps: ["Verificación de Zonificación.", "Solicitud en Municipio.", "Inspección de Seguridad."],
        link: "https://www.gob.pe/20844-obtener-licencia-de-funcionamiento"
      }
    ];

    const isFormal = results[3] === true && results[4] === true && results[5] === true && results[6] === true;
    if (isFormal) return [getMypeBenefitsTask()];

    const pendingTasks: Task[] = [];
    if (results[3] === false) pendingTasks.push(allTasks[0]);
    if (results[4] === false) {
      pendingTasks.push(allTasks[1]);
      pendingTasks.push(allTasks[2]);
    }
    if (results[5] === false) pendingTasks.push(allTasks[3]);
    if (results[6] === false) pendingTasks.push(allTasks[4]);
    
    if (results.sector) {
      const sectoralTask = getSectoralTask(results.sector);
      if (sectoralTask) pendingTasks.push(sectoralTask);
    }

    pendingTasks.push(getMypeBenefitsTask());
    return pendingTasks;
  };

  const getActiveTasks = (): Task[] => {
    const allTasks: Task[] = [
      {
        id: "ruc-update",
        step: "PASO 1",
        title: "Actualización de RUC (SUNAT)",
        icon: <CreditCard className="w-5 h-5" />,
        description: "CUMPLIMIENTO TRIBUTARIO",
        details: "Mantenimiento de tu información fiscal y domicilio al día.",
        requirements: ["Clave SOL.", "DNI actualizado."],
        steps: ["Validación de actividad (CIIU).", "Confirmación de domicilio.", "Verificación de estado."],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "remype",
        step: "PASO 2",
        title: "Registro en REMYPE (MTPE)",
        icon: <ClipboardList className="w-5 h-5" />,
        description: "FORMALIZACIÓN LABORAL",
        details: "Indispensable para acceder al régimen laboral especial de la micro y pequeña empresa.",
        requirements: ["RUC habilitado.", "Al menos 1 trabajador.", "Tope de ventas anuales."],
        steps: ["Acceso al portal REMYPE.", "Carga de datos de planilla.", "Descarga de constancia de acreditación."],
        link: "https://www.gob.pe/285-registro-de-la-micro-y-pequena-empresa-remype"
      },
      {
        id: "municipal-active",
        step: "PASO 3",
        title: "Regularización Municipal",
        icon: <MapPin className="w-5 h-5" />,
        description: "CONTROL LOCAL",
        details: "Asegura la vigencia de tu licencia ante cualquier cambio de giro o infraestructura.",
        requirements: ["RUC activo.", "Declaración Jurada ITSE."],
        steps: ["Actualización de datos en municipalidad.", "Inspección técnica de seguridad."]
      }
    ];

    const isFormal = results[3] === true && results[4] === true && results[5] === true;
    if (isFormal) return [getMypeBenefitsTask()];

    const pendingTasks: Task[] = [];
    if (results[3] === false) pendingTasks.push(allTasks[0]);
    if (results[4] === false) pendingTasks.push(allTasks[1]);
    if (results[5] === false) pendingTasks.push(allTasks[2]);
    
    if (results.sector) {
      const sectoralTask = getSectoralTask(results.sector);
      if (sectoralTask) pendingTasks.push(sectoralTask);
    }

    pendingTasks.push(getMypeBenefitsTask());
    return pendingTasks;
  };

  const getDomesticTasks = (): Task[] => {
    const allTasks: Task[] = [
      {
        id: "ruc-domestic",
        step: "PASO 1",
        title: "Inscripción en el RUC (SUNAT)",
        icon: <CreditCard className="w-5 h-5" />,
        description: "REGISTRO DE EMPLEADOR",
        details: "Permite declarar y pagar los aportes de seguridad social y pensiones.",
        requirements: ["DNI del empleador.", "Recibo de servicios local.", "Email activo."],
        steps: ["Inscripción virtual vía APP Personas.", "Obtención de Clave SOL.", "Activación de RUC."],
        link: "https://www.gob.pe/284-inscripcion-en-el-ruc"
      },
      {
        id: "t-registro",
        step: "PASO 2",
        title: "Alta en el T-Registro (SUNAT)",
        icon: <UserCheck className="w-5 h-5" />,
        description: "FORMALIDAD CIUDADANA",
        details: "Vincula legalmente al trabajador(a) con su empleador para el goce de derechos.",
        requirements: ["DNI del trabajador(a).", "Detalle de sueldo y jornada.", "Clave SOL."],
        steps: ["Ingreso a SUNAT Operaciones en Línea.", "Registro en la sección Trabajador del Hogar.", "Emisión de Constancia de Alta."],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "mtpe-contract",
        step: "PASO 3",
        title: "Contrato y Aplicativo (MTPE)",
        icon: <FileText className="w-5 h-5" />,
        description: "CONTRATO OFICIAL",
        details: "Es obligatorio registrar el contrato firmado en el portal del Ministerio de Trabajo.",
        requirements: ["Contrato impreso firmado.", "Acceso al aplicativo MTPE.", "Boleta de pago."],
        steps: ["Descarga del modelo oficial.", "Firma y escaneo del documento.", "Carga en el sistema de Trabajadores del Hogar."],
        link: "https://apps.trabajo.gob.pe/rcth/app/#/inicio",
        options: [
          { label: "Modelo Cama Adentro (Con residencia)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
          { label: "Modelo Cama Afuera (Sin residencia)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
          { label: "Modelo Tiempo Parcial", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" }
        ]
      },
      {
        id: "obligations-domestic",
        step: "INFO CLAVE",
        title: "Marco Legal y Obligaciones",
        icon: <Scale className="w-5 h-5" />,
        description: "LEY N° 31047",
        details: "Resumen de las obligaciones críticas para garantizar un empleo digno y evitar sanciones.",
        requirements: [
          "Jornada: Máximo 8h diarias / 48h semanales.",
          "Descanso: Mínimo 24h consecutivas.",
          "Gratificaciones: Sueldo íntegro en Julio y Diciembre.",
          "Seguridad Social: Aporte empleador 9% (EsSalud).",
          "Boleta: Entrega obligatoria mensual firmada."
        ],
        steps: [
          "Realiza los pagos mensuales vía SUNAT.",
          "Garantiza alimentación y alojamiento digno.",
          "Respeta los periodos vacacionales (30 días)."
        ],
        link: "https://www.gob.pe/institucion/mtpe/campa%C3%B1as/38712-conoce-tus-derechos-trabajador-ra-del-hogar"
      }
    ];

    const isFormal = results[2] === true && results[3] === true && results[4] === true;
    if (isFormal) return [allTasks[3]];

    const pendingTasks: Task[] = [];
    if (results[2] === false) pendingTasks.push(allTasks[0]);
    if (results[3] === false) pendingTasks.push(allTasks[1]);
    if (results[4] === false) pendingTasks.push(allTasks[2]);
    pendingTasks.push(allTasks[3]);

    return pendingTasks;
  };

  const tasks = routeType === 'idea' ? getIdeaTasks() : routeType === 'active' ? getActiveTasks() : getDomesticTasks();
  const isFormalUser = (routeType === 'domestic' && tasks.length === 1 && tasks[0].id === 'obligations-domestic') ||
                       ((routeType === 'idea' || routeType === 'active') && tasks.length === 1 && tasks[0].id === 'mype-benefits');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Banner de Estado - Estilo Ejecutivo */}
      <div className="relative w-full rounded-[40px] overflow-hidden p-8 shadow-2xl group min-h-[140px] flex items-center">
        <div className={cn(
          "absolute inset-0 transition-all duration-700",
          isFormalUser ? "bg-[#1e40af]" : "bg-[#1A1A1A]"
        )} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-60" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-12" />
        
        <div className="relative z-10 flex items-center gap-6 w-full">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-lg backdrop-blur-md",
            isFormalUser ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white"
          )}>
             {isFormalUser ? <Trophy className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
          </div>
          <div className="flex-1 space-y-1">
             <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", isFormalUser ? "bg-emerald-400 animate-pulse" : "bg-primary")} />
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">
                  {isFormalUser ? "ESTADO: FORMALIZADO" : "ANÁLISIS DE FORMALIDAD"}
                </p>
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
               Tu Ruta Técnica de Crecimiento Formal
             </h2>
          </div>
        </div>
      </div>

      {/* Título y Subtítulo Refinado */}
      <header className="space-y-3 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full border border-gray-200">
           <Zap className="w-3 h-3 text-amber-600" />
           <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Diagnóstico Personalizado</span>
        </div>
        <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tight leading-none">
          Ruta Técnica de Formalización
        </h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[460px]">
          Recomendaciones estratégicas construidas según tu situación actual y el marco normativo de la DRTPELM Lima Metropolitana.
        </p>
      </header>

      {/* Lista de Tareas en Acordeón */}
      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={tasks[0]?.id}>
          {tasks.map((task) => {
            const isInfoClave = task.step === "INFO CLAVE" || task.step === "VALOR AGREGADO";
            const isSectoral = task.step.includes("SECTORIAL");
            
            return (
              <AccordionItem 
                key={task.id} 
                value={task.id}
                className={cn(
                  "border rounded-[32px] bg-white shadow-sm overflow-hidden px-6 transition-all hover:shadow-xl hover:shadow-gray-200/40",
                  isInfoClave ? "border-blue-100 bg-blue-50/5" : isSectoral ? "border-emerald-100 bg-emerald-50/5" : "border-gray-100"
                )}
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-5 text-left">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                      isInfoClave ? "bg-blue-600 border-blue-500 text-white" : isSectoral ? "bg-emerald-600 border-emerald-500 text-white" : "bg-gray-50 border-gray-100 text-primary"
                    )}>
                      {task.icon}
                    </div>
                    <div className="space-y-0.5">
                      <p className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-gray-400"
                      )}>
                        {task.step}
                      </p>
                      <h3 className={cn(
                        "font-black text-base tracking-tight",
                        isInfoClave ? "text-blue-900" : isSectoral ? "text-emerald-900" : "text-[#1A1A1A]"
                      )}>
                        {task.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2">
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <p className="text-[13px] font-medium leading-relaxed text-gray-600 bg-gray-50/80 p-5 rounded-[24px] border border-gray-100 border-l-4 border-l-primary/30">
                        {task.details}
                      </p>
                      {task.link && (
                        <Button variant="link" className={cn(
                          "h-auto p-0 text-[10px] font-black uppercase gap-2 hover:opacity-80 transition-all",
                          isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-primary"
                        )} onClick={() => window.open(task.link, '_blank')}>
                          Gestionar en Portal Oficial <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </section>

                    {task.options && (
                      <section className="bg-blue-50/30 p-6 rounded-[32px] border border-blue-100/50 space-y-4">
                        <div className="flex items-center gap-2">
                           <Download className="w-4 h-4 text-blue-600" />
                           <h4 className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest">Formatos y Modelos</h4>
                        </div>
                        <div className="grid gap-3">
                          {task.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => window.open(opt.url, '_blank')}
                              className="w-full flex items-center justify-between gap-4 p-4 bg-white border border-blue-100 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all text-left group"
                            >
                              <span className="text-[12px] font-bold text-blue-700 leading-tight group-hover:text-blue-900">
                                {opt.label}
                              </span>
                              <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <section className="space-y-4">
                         <h4 className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                           <AlertCircle className="w-3.5 h-3.5 text-primary" />
                           Requisitos Base
                         </h4>
                         <div className="space-y-2.5">
                           {task.requirements.map((req, idx) => (
                             <div key={idx} className="flex items-start gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary/20 mt-1.5 shrink-0" />
                               <p className="text-[12px] font-medium text-gray-700 leading-snug">{req}</p>
                             </div>
                           ))}
                         </div>
                       </section>

                       <section className="space-y-4">
                         <h4 className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                           <TrendingUp className="w-3.5 h-3.5 text-primary" />
                           Pasos del Proceso
                         </h4>
                         <div className="space-y-4">
                           {task.steps.map((step, idx) => (
                             <div key={idx} className="flex gap-4 items-start relative">
                               <div className="w-6 h-6 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">{idx + 1}</div>
                               <p className="text-[12px] font-medium text-gray-600 leading-relaxed pt-0.5">{step}</p>
                               {idx < task.steps.length - 1 && (
                                 <div className="absolute left-[11px] top-7 w-[1px] h-[calc(100%-14px)] bg-gray-100" />
                               )}
                             </div>
                           ))}
                         </div>
                       </section>
                    </div>

                    <div onClick={onOpenChat} className="border-2 border-dashed rounded-[32px] p-6 flex items-center justify-between group cursor-pointer transition-all hover:bg-gray-50 hover:border-primary/40 bg-white shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/5 text-primary shadow-sm group-hover:scale-110 transition-transform">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-primary uppercase tracking-tight mb-0.5">
                            ¿Necesitas asesoría sobre este punto?
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Consultar a la asistente OFELIA ahora</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-all">
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary" />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Nueva Sección: Próxima Acción Premium */}
      <section className="pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary p-10 rounded-[48px] shadow-[0_32px_64px_rgba(217,30,24,0.15)] relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Siguiente hito clave</span>
               </div>
               <h4 className="text-3xl font-black tracking-tighter leading-none uppercase italic">Próxima Acción</h4>
               <p className="text-sm font-medium text-white/80 max-w-[320px] leading-relaxed">
                 Te recomendamos agendar una asesoría técnica presencial o virtual para validar tu expediente antes de presentarlo ante las entidades correspondientes.
               </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button 
                onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')}
                className="h-16 px-10 bg-white text-primary hover:bg-white/90 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 gap-3 group"
              >
                AGENDAR ASESORÍA OFICIAL
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[10px] text-center font-black uppercase tracking-widest text-white/60">Servicio Gratuito DRTPELM</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer del Dashboard */}
      <footer className="pt-12 flex flex-col items-center gap-6 border-t border-gray-100">
        <div className="flex gap-4">
           <Button 
            variant="outline" 
            size="sm" 
            onClick={onRedoDiagnostic}
            className="h-11 px-6 text-[10px] font-black text-muted-foreground hover:text-primary gap-2 uppercase tracking-widest rounded-2xl border-gray-200 bg-white shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reiniciar Diagnóstico
          </Button>
           <Button 
            variant="outline"
            className="h-11 px-6 border-gray-200 text-[10px] font-black uppercase tracking-widest gap-2 rounded-2xl hover:bg-gray-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            Descargar Ruta PDF
          </Button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-4 opacity-30">
              <div className="h-[1px] w-12 bg-gray-400" />
              <img src="/image_f1ee39.jfif" alt="MTPE" className="h-6 w-auto grayscale" />
              <div className="h-[1px] w-12 bg-gray-400" />
           </div>
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] mt-2">DRTPELM LIMA METROPOLITANA</p>
        </div>
      </footer>
    </div>
  );
}
