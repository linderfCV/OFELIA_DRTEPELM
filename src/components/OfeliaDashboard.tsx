
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
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

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
        step: "AUTORIZACION SECTORIAL",
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
        step: "AUTORIZACION SECTORIAL",
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
        step: "AUTORIZACION SECTORIAL",
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
        step: "AUTORIZACION SECTORIAL",
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
    step: "INFO CLAVE",
    title: "Beneficios de tu Formalización MYPE",
    icon: <Award className="w-5 h-5 text-blue-600" />,
    description: "¿POR QUÉ SER FORMAL ES TU MEJOR NEGOCIO?",
    details: "Estar en el REMYPE te permite acceder a un régimen laboral especial diseñado para que tu empresa crezca con costos reducidos y mayor competitividad.",
    requirements: [
      "Microempresa: Ventas anuales hasta 150 UIT (S/ 772,500).",
      "Ahorro en CTS: En la Microempresa no estás obligado al pago de CTS.",
      "Ahorro en Gratificaciones: En la Microempresa no estás obligado al pago de gratificaciones.",
      "Vacaciones Reducidas: Solo 15 días calendario de descanso por año.",
      "Seguridad Social: Acceso al SIS Emprendedor (Micro) o EsSalud con tasas preferenciales.",
      "Contratación Pública: 10% de puntaje adicional en licitaciones con el Estado."
    ],
    steps: [
      "Mantén tu registro REMYPE siempre vigente en el portal del MTPE.",
      "Accede a créditos con mejores tasas en el sistema financiero formal.",
      "Participa en ferias y programas de capacitación de la DRTPELM.",
      "Protege tu patrimonio separando tus cuentas personales de las de la empresa."
    ],
    options: [
      { label: "Conoce los 6 beneficios de la formalización empresarial", url: "https://www.gob.pe/institucion/tuempresa/noticias/914295-conozca-los-6-beneficios-de-la-formalizacion-empresarial" },
      { label: "Beneficios de ser formal (Portal Emprender SUNAT)", url: "https://emprender.sunat.gob.pe/acciones-contribuyente/formalizacion/beneficios-ser-formal" }
    ]
  });

  const getIdeaTasks = (): Task[] => {
    const allTasks: Task[] = [
      {
        id: "sunarp",
        step: "PASO 1",
        title: "Reserva de Nombre Legal (SUNARP)",
        icon: <Search className="w-5 h-5 text-primary" />,
        description: "¿POR QUÉ ES EL PRIMER PASO?",
        details: "La reserva de nombre protege la denominación de tu empresa por 30 días en SUNARP mientras formalizas la escritura pública.",
        requirements: ["DNI vigente.", "Mínimo 3 opciones de nombres.", "Pago de tasa registral (Costo: S/ 24.00)."],
        steps: ["Realiza una 'Búsqueda de Índices' (S/ 5.00).", "Solicita la Reserva de Nombre indicando el tipo de sociedad.", "Obtén tu constancia de reserva."],
        link: "https://www.gob.pe/271-buscar-y-reservar-el-nombre-de-una-empresa-en-la-sunarp"
      },
      {
        id: "indecopi",
        step: "PASO 2",
        title: "Protección de Marca (INDECOPI)",
        icon: <ShieldCheck className="w-5 h-5 text-primary" />,
        description: "¿SABÍAS QUE PUEDES HACERLO ONLINE?",
        details: "INDECOPI protege el nombre comercial de tu marca. Puedes verificar si tu marca está libre de forma gratuita y online.",
        requirements: ["Logo digital.", "Clasificación de Niza.", "Pago de tasa (S/ 534.99)."],
        steps: ["Ingresa a 'Busca tu Marca' de INDECOPI.", "Realiza la 'Búsqueda Fonética' gratuita.", "Presenta tu solicitud virtual."],
        link: "https://pi.indecopi.gob.pe/buscatumarca/#/inicio"
      },
      {
        id: "acto",
        step: "PASO 3",
        title: "Elaborar Acto Constitutivo (Minuta)",
        icon: <FileText className="w-5 h-5 text-primary" />,
        description: "¿DE QUÉ SE TRATA?",
        details: "Documento legal donde se definen estatutos y socios. Se puede gestionar en CDE (PRODUCE) para reducir costos.",
        requirements: ["Reserva SUNARP.", "Copia de DNI de socios.", "Detalle de aportes."],
        steps: ["Acude a una Notaría o CDE de PRODUCE.", "Firma la minuta.", "Inscripción en SUNARP."],
        link: "https://www.gob.pe/269-elaborar-la-minuta-de-constitucion-de-la-empresa-o-acto-constitutivo"
      },
      {
        id: "sunat",
        step: "PASO 4",
        title: "RUC y Régimen Tributario (SUNAT)",
        icon: <CreditCard className="w-5 h-5 text-primary" />,
        description: "¿POR QUÉ EL RUC?",
        details: "Registro para emitir comprobantes legales ante SUNAT.",
        requirements: ["Escritura inscrita.", "Recibo de luz local fiscal.", "DNI representante."],
        steps: ["Activación de RUC virtual o presencial.", "Elección de Régimen (MYPE o Especial).", "Activa Clave SOL."],
        link: "https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios"
      },
      {
        id: "municipal",
        step: "PASO 5",
        title: "Licencia de Funcionamiento",
        icon: <MapPin className="w-5 h-5 text-primary" />,
        description: "¿AUTORIZACIÓN MUNICIPAL?",
        details: "Autorización para el desarrollo de actividades económicas.",
        requirements: ["RUC activo.", "Declaración Jurada de Seguridad.", "Pago de tasa municipal."],
        steps: ["Verifica compatibilidad de uso.", "Presenta solicitud.", "Inspección técnica (ITSE)."],
        link: "https://www.gob.pe/20844-obtener-licencia-de-funcionamiento-para-negocios-de-riesgo-bajo-o-medio?child=25781"
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
        icon: <CreditCard className="w-5 h-5 text-primary" />,
        description: "¿POR QUÉ ACTUALIZAR?",
        details: "Asegura que tu actividad económica y domicilio fiscal estén al día.",
        requirements: ["Clave SOL.", "DNI representante."],
        steps: ["Ingresa a SUNAT SOL.", "Actualiza actividad (CIIU).", "Verifica estado de Habido."],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "remype",
        step: "PASO 2",
        title: "Registro en REMYPE (MTPE)",
        icon: <ClipboardList className="w-5 h-5 text-primary" />,
        description: "¿BENEFICIOS LABORALES?",
        details: "Acceso a régimen laboral especial con costos reducidos.",
        requirements: ["RUC con Clave SOL.", "Mínimo 1 trabajador.", "Ventas < 1,700 UIT."],
        steps: ["Accede al portal MTPE.", "Registro en sistema REMYPE.", "Obtén acreditación."],
        link: "https://www.gob.pe/285-registro-de-la-micro-y-pequena-empresa-remype"
      },
      {
        id: "municipal-active",
        step: "PASO 3",
        title: "Regularización Municipal",
        icon: <MapPin className="w-5 h-5 text-primary" />,
        description: "¿GESTIÓN MUNICIPAL?",
        details: "Actualiza tu licencia si cambiaste de giro o local.",
        requirements: ["RUC actualizado.", "Pago de tasa.", "DNI titular."],
        steps: ["Solicita actualización en municipio.", "Declaración de seguridad.", "Nueva inspección ITSE."]
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
        icon: <CreditCard className="w-5 h-5 text-primary" />,
        description: "¿ES OBLIGATORIO?",
        details: "Como empleador del hogar, necesitas un RUC para declarar la planilla y pagar los aportes de seguridad social (EsSalud/ONP).",
        requirements: ["DNI del empleador.", "Dirección del domicilio.", "Correo electrónico."],
        steps: ["Inscríbete en SUNAT virtual o presencial.", "Obtén tu Clave SOL.", "Activa tu RUC como Empleador de Trabajador(a) del Hogar."],
        link: "https://www.gob.pe/284-inscripcion-en-el-ruc"
      },
      {
        id: "t-registro",
        step: "PASO 2",
        title: "Alta en el T-Registro (SUNAT)",
        icon: <UserCheck className="w-5 h-5 text-primary" />,
        description: "¿QUÉ ES EL ALTA?",
        details: "Es el registro formal del trabajador(a) ante la SUNAT para garantizar sus derechos sociales.",
        requirements: ["DNI del trabajador(a).", "Datos de jornada y sueldo.", "Clave SOL del empleador."],
        steps: ["Ingresa a SUNAT Operaciones en Línea.", "Registra a tu trabajador(a) en el T-Registro.", "Genera la constancia de alta."],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "mtpe-contract",
        step: "PASO 3",
        title: "Contrato y Aplicativo (MTPE)",
        icon: <FileText className="w-5 h-5 text-primary" />,
        description: "¿FORMALIDAD LABORAL?",
        details: "El contrato debe ser por escrito y registrado en el portal del Ministerio de Trabajo.",
        requirements: ["Contrato firmado.", "Registro en el aplicativo del MTPE.", "Boleta de pago mensual."],
        steps: [
          "Selecciona y descarga el modelo de contrato que necesites.",
          "Sube el contrato firmado al aplicativo virtual.",
          "Entrega copias y boletas mensuales."
        ],
        link: "https://apps.trabajo.gob.pe/rcth/app/#/inicio",
        options: [
          { label: "Modelo referencial con residencia (Cama adentro)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
          { label: "Modelo referencial sin residencia (Cama afuera)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
          { label: "Modelo referencial tiempo parcial (Sin residencia)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" }
        ]
      },
      {
        id: "obligations-domestic",
        step: "INFO CLAVE",
        title: "Obligaciones del Empleador y Derechos",
        icon: <Scale className="w-5 h-5 text-blue-600" />,
        description: "¿QUÉ DEBO CUMPLIR SEGÚN LA LEY N° 31047?",
        details: "Todo empleador del hogar tiene obligaciones legales para garantizar un trabajo digno. El incumplimiento genera sanciones graves.",
        requirements: [
          "Jornada Laboral: Máximo 8 horas diarias o 48 horas semanales.",
          "Descanso Semanal: Mínimo 24 horas consecutivas de descanso.",
          "Gratificaciones: Un sueldo completo en Julio y Diciembre.",
          "Vacaciones: 30 días calendario por cada año de servicios.",
          "CTS: Pago proporcional según la remuneración mensual.",
          "Seguro Social (EsSalud): El empleador aporta el 9%.",
          "Pensiones: A cargo del trabajador (ONP o AFP)."
        ],
        steps: [
          "Respeta los horarios de descanso y jornada máxima legal.",
          "Realiza el pago de EsSalud mensualmente a través de SUNAT.",
          "Entrega obligatoriamente la boleta de pago firmada cada mes.",
          "Proporciona alimentación y alojamiento (si es cama adentro) dignos."
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] font-black text-primary uppercase tracking-wider">
              {isFormalUser ? "ESTADO: FORMALIZADO" : "TUS TAREAS PRIORITARIAS"}
            </p>
          </div>
          {onRedoDiagnostic && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRedoDiagnostic}
              className="h-7 text-[9px] font-bold text-muted-foreground hover:text-primary gap-1.5 uppercase"
            >
              <RefreshCcw className="w-3 h-3" />
              Realizar el diagnóstico nuevamente
            </Button>
          )}
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
          {isFormalUser 
            ? "¡Felicidades! Eres un actor clave en la economía formal" 
            : "Tu Hoja de Ruta para tu Formalización"}
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          {isFormalUser 
            ? "Ahora conoce los beneficios exclusivos que el Estado peruano tiene para tu crecimiento."
            : "Información basada en portales oficiales como SUNAT, MTPE, SUNARP, INDECOPI y PRODUCE."}
        </p>
      </header>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-3" defaultValue={tasks[0]?.id}>
          {tasks.map((task) => {
            const isInfoClave = task.step === "INFO CLAVE";
            const isSectoral = task.step === "AUTORIZACION SECTORIAL";
            
            return (
              <AccordionItem 
                key={task.id} 
                value={task.id}
                className={cn(
                  "border rounded-2xl bg-white shadow-sm overflow-hidden px-4 transition-colors",
                  isInfoClave ? "border-blue-400 bg-blue-50/20" : isSectoral ? "border-emerald-200 bg-emerald-50/10" : "border-gray-100"
                )}
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isInfoClave ? "bg-blue-600 shadow-lg shadow-blue-200" : isSectoral ? "bg-emerald-600 shadow-lg shadow-emerald-200" : "bg-red-50"
                    )}>
                      {React.cloneElement(task.icon as React.ReactElement, { 
                        className: cn("w-5 h-5", (isInfoClave || isSectoral) ? "text-white" : "text-primary") 
                      })}
                    </div>
                    <div className="space-y-0.5">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-muted-foreground"
                      )}>
                        {task.step}
                      </p>
                      <h3 className={cn(
                        "font-bold text-sm leading-tight",
                        isInfoClave ? "text-blue-900" : isSectoral ? "text-emerald-900" : "text-[#1A1A1A]"
                      )}>
                        {task.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2">
                  <div className="space-y-6 text-[#1A1A1A]">
                    <section>
                      <h4 className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-2",
                        isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {task.description}
                      </h4>
                      <p className="text-xs font-medium leading-relaxed text-gray-700">{task.details}</p>
                      {task.link && (
                        <Button variant="link" className={cn(
                          "h-auto p-0 text-[10px] font-bold uppercase gap-1 mt-2",
                          isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-primary"
                        )} onClick={() => window.open(task.link, '_blank')}>
                          Ir a la plataforma oficial <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </section>

                    {task.options && (
                      <section className="bg-blue-50/30 p-3 rounded-xl border border-blue-100/50">
                        <h4 className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest mb-2">ENLACES DE INTERÉS</h4>
                        <div className="space-y-2">
                          {task.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => window.open(opt.url, '_blank')}
                              className="w-full flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400/50 hover:bg-blue-50/50 transition-all group text-left shadow-sm"
                            >
                              <span className="text-[11px] font-black italic text-blue-600 leading-tight group-hover:underline">
                                {opt.label}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                    <section>
                      <h4 className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-2",
                        isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {task.id === 'mype-benefits' ? 'VENTAJAS COMPETITIVAS' : 'REQUISITOS / OBLIGACIONES'}
                      </h4>
                      <ul className="space-y-1.5">
                        {task.requirements.map((req, idx) => (
                          <li key={idx} className="text-xs font-medium flex items-start gap-2">
                            <span className={cn("mt-1", isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-primary")}>•</span> {req}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h4 className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-2",
                        isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {task.id === 'mype-benefits' ? 'RECOMENDACIONES' : 'PASOS A SEGUIR'}
                      </h4>
                      <div className="space-y-3">
                        {task.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className={cn(
                              "w-5 h-5 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5",
                              isInfoClave ? "bg-blue-600" : isSectoral ? "bg-emerald-600" : "bg-primary"
                            )}>{idx + 1}</div>
                            <p className="text-xs font-medium leading-snug">{step}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div onClick={onOpenChat} className={cn(
                      "border border-dashed rounded-xl p-4 mt-4 flex items-center justify-between group cursor-pointer transition-colors",
                      isInfoClave ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : isSectoral ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100" : "bg-red-50/50 border-primary/20 hover:bg-red-50"
                    )}>
                      <div className="flex items-center gap-3">
                        <MessageSquare className={cn("w-4 h-4", isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-primary")} />
                        <div className="text-left">
                          <p className={cn("text-[10px] font-bold leading-tight", isInfoClave ? "text-blue-600" : isSectoral ? "text-emerald-600" : "text-primary")}>¿Duda específica sobre este punto?</p>
                          <p className={cn("text-[10px] font-black underline", isInfoClave ? "text-blue-700" : isSectoral ? "text-emerald-700" : "text-primary")}>Pregunta aquí</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {!isFormalUser && (
        <div className="bg-primary rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-black text-xl italic tracking-tight uppercase leading-none">Próxima Acción</h3>
              <p className="text-xs font-medium opacity-90 leading-tight">Un asesor de la DRTPELM revisará tu perfil para contactarte.</p>
            </div>
          </div>
          <Button 
            onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')}
            className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest"
          >
            AGENDAR ASESORÍA GRATUITA
          </Button>
        </div>
      )}

      {isFormalUser && (
        <div className="bg-blue-600 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-blue-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-black text-xl italic tracking-tight uppercase leading-none">Ruta de Crecimiento</h3>
              <p className="text-xs font-medium opacity-90 leading-tight">Accede a capacitaciones exclusivas para emprendimientos formales.</p>
            </div>
          </div>
          <Button 
            onClick={() => window.open('https://portal.trabajo.gob.pe/formalizateahora/capacitacion', '_blank')}
            className="w-full bg-white text-blue-700 hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest"
          >
            EXPLORAR CAPACITACIONES
          </Button>
        </div>
      )}

      <div className="text-center pt-2">
        <Button variant="link" onClick={onRedoDiagnostic} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary">
          realizar el diagnostico nuevamente
        </Button>
      </div>
    </div>
  );
}
