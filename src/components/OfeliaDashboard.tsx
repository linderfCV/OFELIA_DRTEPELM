
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
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  results: Record<number, boolean>;
  onOpenChat?: () => void;
  onRedoDiagnostic?: () => void;
}

export function OfeliaDashboard({ routeType, results, onOpenChat, onRedoDiagnostic }: OfeliaDashboardProps) {
  
  const getMypeBenefitsTask = (): Task => ({
    id: "mype-benefits",
    step: "INFO CLAVE",
    title: "Beneficios de tu Formalización MYPE",
    icon: <Award className="w-5 h-5 text-primary" />,
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
    link: "https://www.gob.pe/285-registro-de-la-micro-y-pequena-empresa-remype"
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
        link: "https://www.gob.pe/706-reservar-el-nombre-de-una-empresa"
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
        link: "https://www.gob.pe/291-obtener-ruc-de-persona-juridica"
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
        link: "https://www.gob.pe/443-obtener-licencia-de-funcionamiento"
      }
    ];

    const isFormal = results[3] === true && results[4] === true && results[5] === true && results[6] === true;
    if (isFormal) return [getMypeBenefitsTask()];

    const pendingTasks: Task[] = [];
    if (results[3] === false) pendingTasks.push(allTasks[0]); // Nombre/Marca -> SUNARP
    if (results[4] === false) {
      pendingTasks.push(allTasks[1]); // Trámites -> Indecopi
      pendingTasks.push(allTasks[2]); // Constitución -> Acto
    }
    if (results[5] === false) pendingTasks.push(allTasks[3]); // Régimen -> SUNAT
    if (results[6] === false) pendingTasks.push(allTasks[4]); // Licencia -> Municipal
    
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
        link: "https://www.gob.pe/es/i/11545"
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
        link: "https://www.gob.pe/es/i/6570925",
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
        icon: <Scale className="w-5 h-5 text-primary" />,
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
          {tasks.map((task) => (
            <AccordionItem 
              key={task.id} 
              value={task.id}
              className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    {task.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{task.step}</p>
                    <h3 className="font-bold text-sm text-[#1A1A1A] leading-tight">{task.title}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div className="space-y-6 text-[#1A1A1A]">
                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{task.description}</h4>
                    <p className="text-xs font-medium leading-relaxed text-gray-700">{task.details}</p>
                    {task.link && (
                      <Button variant="link" className="h-auto p-0 text-primary text-[10px] font-bold uppercase gap-1 mt-2" onClick={() => window.open(task.link, '_blank')}>
                        Ir a la plataforma oficial <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </section>

                  {task.options && (
                    <section className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">MODELOS DE CONTRATO</h4>
                      <div className="space-y-2">
                        {task.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.open(opt.url, '_blank')}
                            className="w-full flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-red-50/30 transition-all group text-left"
                          >
                            <span className="text-[11px] font-bold text-gray-700 leading-tight group-hover:text-primary">{opt.label}</span>
                            <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary shrink-0" />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                      {task.id === 'mype-benefits' ? 'VENTAJAS COMPETITIVAS' : 'REQUISITOS / OBLIGACIONES'}
                    </h4>
                    <ul className="space-y-1.5">
                      {task.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs font-medium flex items-start gap-2">
                          <span className="text-primary mt-1">•</span> {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                      {task.id === 'mype-benefits' ? 'RECOMENDACIONES' : 'PASOS A SEGUIR'}
                    </h4>
                    <div className="space-y-3">
                      {task.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{idx + 1}</div>
                          <p className="text-xs font-medium leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div onClick={onOpenChat} className="bg-red-50/50 border border-dashed border-primary/20 rounded-xl p-4 mt-4 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-primary leading-tight">¿Duda específica sobre este punto?</p>
                        <p className="text-[10px] font-black text-primary underline">Pregunta aquí</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
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
          <Button className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
            AGENDAR ASESORÍA GRATUITA
          </Button>
        </div>
      )}

      {isFormalUser && (
        <div className="bg-emerald-500 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-emerald-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-black text-xl italic tracking-tight uppercase leading-none">Ruta de Crecimiento</h3>
              <p className="text-xs font-medium opacity-90 leading-tight">Accede a capacitaciones exclusivas para MYPEs formales.</p>
            </div>
          </div>
          <Button className="w-full bg-white text-emerald-600 hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
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
