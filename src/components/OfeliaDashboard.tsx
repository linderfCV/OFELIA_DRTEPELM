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
  Download
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
  const getIdeaTasks = (): Task[] => [
    {
      id: "sunarp",
      step: "PASO 1",
      title: "Reserva de Nombre Legal (SUNARP)",
      icon: <Search className="w-5 h-5 text-primary" />,
      description: "¿POR QUÉ ES EL PRIMER PASO?",
      details: "La reserva de nombre protege la denominación de tu empresa por 30 días en SUNARP mientras formalizas la escritura pública.",
      requirements: ["DNI vigente.", "Mínimo 3 opciones de nombres.", "Pago de tasa registral (Costo: S/ 24.00)."],
      steps: ["Realiza una 'Búsqueda de Índices' (S/ 5.00).", "Solicita la Reserva de Nombre indicando el tipo de sociedad.", "Obtén tu constancia de reserva."]
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
      steps: ["Acude a una Notaría o CDE de PRODUCE.", "Firma la minuta.", "Inscripción en SUNARP."]
    },
    {
      id: "sunat",
      step: "PASO 4",
      title: "RUC y Régimen Tributario (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿POR QUÉ EL RUC?",
      details: "Registro para emitir comprobantes legales ante SUNAT.",
      requirements: ["Escritura inscrita.", "Recibo de luz local fiscal.", "DNI representante."],
      steps: ["Activación de RUC virtual o presencial.", "Elección de Régimen (MYPE o Especial).", "Activa Clave SOL."]
    },
    {
      id: "municipal",
      step: "PASO 5",
      title: "Licencia de Funcionamiento",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿AUTORIZACIÓN MUNICIPAL?",
      details: "Autorización para el desarrollo de actividades económicas.",
      requirements: ["RUC activo.", "Declaración Jurada de Seguridad.", "Pago de tasa municipal."],
      steps: ["Verifica compatibilidad de uso.", "Presenta solicitud.", "Inspección técnica (ITSE)."]
    }
  ];

  const getActiveTasks = (): Task[] => [
    {
      id: "ruc-update",
      step: "PASO 1",
      title: "Actualización de RUC (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿POR QUÉ ACTUALIZAR?",
      details: "Asegura que tu actividad económica y domicilio fiscal estén al día.",
      requirements: ["Clave SOL.", "DNI representante."],
      steps: ["Ingresa a SUNAT SOL.", "Actualiza actividad (CIIU).", "Verifica estado de Habido."]
    },
    {
      id: "remype",
      step: "PASO 2",
      title: "Registro en REMYPE (MTPE)",
      icon: <ClipboardList className="w-5 h-5 text-primary" />,
      description: "¿BENEFICIOS LABORALES?",
      details: "Acceso a régimen laboral especial con costos reducidos.",
      requirements: ["RUC con Clave SOL.", "Mínimo 1 trabajador.", "Ventas < 1,700 UIT."],
      steps: ["Accede al portal MTPE.", "Registro en sistema REMYPE.", "Obtén acreditación."]
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

  const getDomesticTasks = (): Task[] => [
    {
      id: "ruc-domestic",
      step: "PASO 1",
      title: "Inscripción en el RUC (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿ES OBLIGATORIO?",
      details: "Como empleador del hogar, necesitas un RUC para declarar la planilla y pagar los aportes de seguridad social (EsSalud/ONP).",
      requirements: ["DNI del empleador.", "Dirección del domicilio.", "Correo electrónico."],
      steps: ["Inscríbete en SUNAT virtual o presencial.", "Obtén tu Clave SOL.", "Activa tu RUC como Empleador de Trabajador del Hogar."]
    },
    {
      id: "t-registro",
      step: "PASO 2",
      title: "Alta en el T-Registro (SUNAT)",
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      description: "¿QUÉ ES EL ALTA?",
      details: "Es el registro formal del trabajador ante la SUNAT para garantizar sus derechos sociales.",
      requirements: ["DNI del trabajador.", "Datos de jornada y sueldo.", "Clave SOL del empleador."],
      steps: ["Ingresa a SUNAT Operaciones en Línea.", "Registra a tu trabajadora en el T-Registro.", "Genera la constancia de alta."]
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
      options: [
        { label: "Modelo referencial con residencia (Cama adentro)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
        { label: "Modelo referencial sin residencia (Cama afuera)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
        { label: "Modelo referencial tiempo parcial (Sin residencia)", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" }
      ]
    }
  ];

  const tasks = routeType === 'idea' ? getIdeaTasks() : routeType === 'active' ? getActiveTasks() : getDomesticTasks();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] font-black text-primary uppercase tracking-wider">TUS TAREAS PRIORITARIAS</p>
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
          Tu Hoja de Ruta para tu Formalización
        </h2>
        <p className="text-sm text-muted-foreground font-medium">Información basada en portales oficiales como SUNAT, MTPE, SUNARP, INDECOPI y PRODUCE.</p>
      </header>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {tasks.map((task, i) => (
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
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">REQUISITOS</h4>
                    <ul className="space-y-1.5">
                      {task.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs font-medium flex items-start gap-2">
                          <span className="text-primary mt-1">•</span> {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">PASOS A SEGUIR</h4>
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
                        <p className="text-[10px] font-bold text-primary leading-tight">¿Duda específica sobre este paso?</p>
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

      <div className="text-center pt-2">
        <Button variant="link" onClick={onRedoDiagnostic} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary">
          realizar el diagnostico nuevamente
        </Button>
      </div>
    </div>
  );
}
