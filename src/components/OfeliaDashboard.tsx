
"use client"

import * as React from "react"
import { 
  Search, 
  FileText, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  MessageSquare,
  ChevronDown,
  ClipboardList,
  AlertCircle,
  RefreshCcw,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface OfeliaDashboardProps {
  routeType: 'idea' | 'active';
  results: Record<number, boolean>;
  onOpenChat?: () => void;
  onRedoDiagnostic?: () => void;
}

export function OfeliaDashboard({ routeType, results, onOpenChat, onRedoDiagnostic }: OfeliaDashboardProps) {
  const getIdeaTasks = () => [
    {
      id: "sunarp",
      step: "PASO 1",
      title: "Reserva de Nombre Legal (SUNARP)",
      icon: <Search className="w-5 h-5 text-primary" />,
      description: "¿POR QUÉ ES EL PRIMER PASO?",
      details: "La reserva de nombre es el paso previo a la constitución de tu empresa (Persona Jurídica). Protege el nombre elegido por 30 días para que nadie más lo use mientras terminas los trámites.",
      requirements: [
        "DNI o Pasaporte vigente.",
        "Mínimo 3 opciones de nombres para tu empresa.",
        "Formulario de solicitud de reserva (puedes hacerlo vía SPRL)."
      ],
      steps: [
        "Realiza una 'Búsqueda de Índices' en SUNARP para verificar que el nombre no exista (Costo: S/ 5.00).",
        "Solicita la Reserva de Nombre indicando el tipo de sociedad (SAC, EIRL, SRL, etc.).",
        "Paga la tasa registral (Costo: S/ 24.00) y obtén tu constancia de reserva."
      ]
    },
    {
      id: "indecopi",
      step: "PASO 2",
      title: "Protección de Marca (INDECOPI)",
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      description: "¿PARA QUÉ SIRVE?",
      details: "A diferencia de SUNARP (que registra el nombre de la empresa), INDECOPI protege el nombre de tu producto o servicio (la marca) para evitar que otros se beneficien de tu prestigio.",
      requirements: [
        "Definir en qué clase vas a registrar tu marca (Clasificación de Niza).",
        "Tener el logo de tu marca en formato digital (si es marca mixta).",
        "Pago de tasa administrativa (Costo aproximado: S/ 534.99)."
      ],
      steps: [
        "Realiza una 'Búsqueda Fonética' gratuita en el portal de INDECOPI para ver si el nombre ya está registrado.",
        "Solicita una asesoría virtual gratuita en la 'Plataforma de Marcas' de INDECOPI.",
        "Presenta tu solicitud de registro de marca vía web en la Gaceta Electrónica."
      ]
    },
    {
      id: "acto",
      step: "PASO 3",
      title: "Elaborar Acto Constitutivo (Minuta)",
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Es el documento donde manifiestas tu voluntad de constituir la empresa. Aquí se definen los estatutos, aportes de capital y gerentes.",
      requirements: [
        "Reserva de nombre en SUNARP.",
        "Copia de DNI de los socios y cónyuges.",
        "Archivo con el objeto social y detalle de bienes/capital."
      ],
      steps: [
        "Acude a una Notaría o a un Centro de Desarrollo Empresarial (CDE) del Produce.",
        "Firma la minuta; el notario la elevará a Escritura Pública.",
        "El notario enviará el parte electrónico a SUNARP para la inscripción final."
      ]
    },
    {
      id: "sunat",
      step: "PASO 4",
      title: "RUC y Régimen Tributario (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "El RUC es el número que identifica a tu empresa ante la SUNAT. Es gratuito e indispensable para emitir facturas y boletas.",
      requirements: [
        "Escritura pública inscrita en SUNARP.",
        "Recibo de servicios (luz/agua) del domicilio fiscal.",
        "DNI del representante legal."
      ],
      steps: [
        "Realiza el trámite virtual vía 'App Personas' o presencial en SUNAT.",
        "Elige tu régimen (MYPE Tributario, Especial o General) según tu proyección de ventas.",
        "Activa tu Clave SOL y autoriza la impresión o emisión electrónica de comprobantes."
      ]
    },
    {
      id: "municipal",
      step: "PASO 5",
      title: "Licencia de Funcionamiento",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿AUTORIZACIÓN MUNICIPAL?",
      details: "Es la autorización que otorga la municipalidad para que tu negocio pueda operar en un local específico, garantizando que es seguro para el público.",
      requirements: [
        "RUC activo y habido.",
        "Declaración Jurada de Observancia de Condiciones de Seguridad.",
        "Pago de tasa municipal (varía según el distrito)."
      ],
      steps: [
        "Consulta la zonificación y compatibilidad de uso en el municipio del local.",
        "Presenta la solicitud de licencia junto con los planos de ubicación si es necesario.",
        "Recibe la inspección técnica de seguridad (ITSE) posterior a la entrega de la licencia."
      ]
    }
  ];

  const getActiveTasks = () => [
    {
      id: "ruc-update",
      step: "PASO 1",
      title: "Actualización de RUC y Datos",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿POR QUÉ ACTUALIZAR?",
      details: "Asegura que tu actividad económica (CIIU) y domicilio fiscal coincidan con tu operación real para evitar multas de SUNAT.",
      requirements: [
        "Clave SOL activa.",
        "DNI del representante legal."
      ],
      steps: [
        "Ingresa a SUNAT Operaciones en Línea.",
        "Verifica que tu actividad principal y secundaria sean las correctas.",
        "Confirma que tu estado sea 'ACTIVO' y condición 'HABIDO'."
      ]
    },
    {
      id: "remype",
      step: "PASO 2",
      title: "Registro en REMYPE (MTPE)",
      icon: <ClipboardList className="w-5 h-5 text-primary" />,
      description: "¿BENEFICIOS LABORALES?",
      details: "El REMYPE permite a las micro y pequeñas empresas acceder a un régimen laboral especial con menores costos en beneficios sociales.",
      requirements: [
        "RUC con Clave SOL.",
        "Tener al menos 1 trabajador registrado en T-Registro.",
        "Ventas anuales que no superen las 1,700 UIT."
      ],
      steps: [
        "Ingresa al portal del MTPE con tu clave SOL.",
        "Completa la declaración jurada de registro de la micro o pequeña empresa.",
        "Descarga tu constancia de acreditación en el REMYPE para gozar de los beneficios."
      ]
    },
    {
      id: "municipal-active",
      step: "PASO 3",
      title: "Regularización de Licencia Municipal",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿GESTIÓN MUNICIPAL?",
      details: "Si has cambiado de giro o ampliado tu local, debes actualizar tu licencia municipal para evitar clausuras.",
      requirements: [
        "Copia de RUC actualizado.",
        "DNI vigente.",
        "Pago de la tasa de actualización municipal."
      ],
      steps: [
        "Acude a la ventanilla de Desarrollo Económico de tu municipalidad.",
        "Solicita la actualización de tu licencia por cambio de datos o ampliación.",
        "Programa la nueva inspección de seguridad (ITSE) si el riesgo ha cambiado."
      ]
    }
  ];

  const tasks = routeType === 'idea' ? getIdeaTasks() : getActiveTasks();

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
        <p className="text-sm text-muted-foreground font-medium">Sigue estos pasos con información basada en el portal oficial GOV.PE.</p>
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
                    <p className="text-xs font-medium leading-relaxed text-gray-700">
                      {task.details}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">REQUISITOS</h4>
                    <ul className="space-y-1.5">
                      {task.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs font-medium flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">PASOS A SEGUIR</h4>
                    <div className="space-y-3">
                      {task.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs font-medium leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div 
                    onClick={onOpenChat}
                    className="bg-red-50/50 border border-dashed border-primary/20 rounded-xl p-4 mt-4 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-primary leading-tight">
                          ¿Tienes una duda específica sobre este paso?
                        </p>
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
            <p className="text-xs font-medium opacity-90 leading-tight">
              Un asesor de la DRTPELM revisará tu perfil y podría contactarte para una asesoría personalizada.
            </p>
          </div>
        </div>
        <Button className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
          AGENDAR ASESORÍA GRATUITA
        </Button>
      </div>

      <div className="text-center pt-2">
        <Button 
          variant="link" 
          onClick={onRedoDiagnostic}
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
        >
          realizar el diagnostico nuevamente
        </Button>
      </div>
    </div>
  );
}
