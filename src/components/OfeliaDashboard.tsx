
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
  ShieldCheck
} from "lucide-react"
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
      details: "La reserva de nombre protege la denominación de tu empresa por 30 días en SUNARP mientras formalizas la escritura pública. Es el paso previo indispensable para constituirte como persona jurídica.",
      requirements: [
        "DNI o Pasaporte vigente.",
        "Mínimo 3 opciones de nombres para tu empresa.",
        "Pago de tasa registral (Costo: S/ 24.00)."
      ],
      steps: [
        "Realiza una 'Búsqueda de Índices' en el portal SPRL de SUNARP (Costo: S/ 5.00).",
        "Solicita la Reserva de Nombre indicando el tipo de sociedad (SAC, EIRL, etc.).",
        "Obtén tu constancia de reserva para presentarla ante el notario."
      ]
    },
    {
      id: "indecopi",
      step: "PASO 2",
      title: "Protección de Marca (INDECOPI)",
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      description: "¿SABÍAS QUE PUEDES HACERLO ONLINE?",
      details: "INDECOPI protege el nombre comercial de tu producto o servicio. Puedes verificar si tu marca está libre de forma gratuita y 100% online desde su portal oficial.",
      requirements: [
        "Acceso a internet para usar la herramienta 'Busca tu Marca'.",
        "Logo de la marca en formato digital (JPG/PNG).",
        "Clasificación de Niza (categoría de tu producto/servicio)."
      ],
      steps: [
        "Ingresa a la página oficial 'Busca tu Marca' de INDECOPI vía internet.",
        "Realiza la 'Búsqueda Fonética' gratuita para ver si el nombre ya está registrado.",
        "Presenta tu solicitud de registro de forma virtual a través de la Gaceta Electrónica."
      ]
    },
    {
      id: "acto",
      step: "PASO 3",
      title: "Elaborar Acto Constitutivo (Minuta)",
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Es el documento legal donde se definen los estatutos de la empresa, los socios y el capital social. Debe ser elevado a Escritura Pública por un notario.",
      requirements: [
        "Constancia de Reserva de nombre en SUNARP.",
        "Copia de DNI de los socios.",
        "Detalle de aportes de capital (bienes o efectivo)."
      ],
      steps: [
        "Acude a una Notaría o a un Centro de Desarrollo Empresarial (CDE).",
        "Firma la minuta elaborada por el abogado o centro de asesoría.",
        "El notario enviará el parte electrónico a SUNARP para la inscripción."
      ]
    },
    {
      id: "sunat",
      step: "PASO 4",
      title: "RUC y Régimen Tributario (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "El RUC es el registro informático donde constan los datos de identificación de tu empresa ante la SUNAT. Permite emitir comprobantes de pago legales.",
      requirements: [
        "Escritura pública inscrita en SUNARP.",
        "Recibo de luz o agua del local fiscal.",
        "DNI del representante legal."
      ],
      steps: [
        "Realiza la activación del RUC de forma virtual o presencial.",
        "Elige el régimen tributario que más te convenga (MYPE Tributario o Especial).",
        "Activa tu Clave SOL para gestionar tus facturas electrónicas."
      ]
    },
    {
      id: "municipal",
      step: "PASO 5",
      title: "Licencia de Funcionamiento",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿AUTORIZACIÓN MUNICIPAL?",
      details: "Es la autorización que otorga la municipalidad para el desarrollo de actividades económicas en un establecimiento determinado.",
      requirements: [
        "RUC activo y habido.",
        "Declaración Jurada de Condiciones de Seguridad.",
        "Pago de tasa municipal según el distrito."
      ],
      steps: [
        "Verifica la compatibilidad de uso de tu local en el municipio.",
        "Presenta la solicitud de licencia de funcionamiento.",
        "Recibe la inspección técnica de seguridad (ITSE) posterior."
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
      details: "Asegura que tu actividad económica y domicilio fiscal estén al día para evitar multas innecesarias de SUNAT.",
      requirements: [
        "Clave SOL activa.",
        "DNI del representante legal."
      ],
      steps: [
        "Ingresa a SUNAT Operaciones en Línea.",
        "Actualiza tu actividad principal (CIIU) si ha cambiado.",
        "Verifica tu estado de Habido."
      ]
    },
    {
      id: "remype",
      step: "PASO 2",
      title: "Registro en REMYPE (MTPE)",
      icon: <ClipboardList className="w-5 h-5 text-primary" />,
      description: "¿BENEFICIOS LABORALES?",
      details: "El REMYPE permite a las Micro y Pequeñas empresas acceder a un régimen laboral especial con costos reducidos en beneficios sociales.",
      requirements: [
        "RUC con Clave SOL.",
        "Tener al menos 1 trabajador en planilla.",
        "Ventas anuales menores a 1,700 UIT."
      ],
      steps: [
        "Accede al portal del MTPE con tu Clave SOL.",
        "Completa el registro de tu empresa en el sistema REMYPE.",
        "Obtén tu acreditación para aplicar los beneficios laborales."
      ]
    },
    {
      id: "municipal-active",
      step: "PASO 3",
      title: "Regularización de Licencia Municipal",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿GESTIÓN MUNICIPAL?",
      details: "Si has ampliado tu local o cambiado de giro, debes actualizar tu licencia municipal para operar legalmente.",
      requirements: [
        "Copia del RUC actualizado.",
        "Pago de tasa de actualización municipal.",
        "DNI del titular."
      ],
      steps: [
        "Solicita la actualización por cambio de datos en tu municipalidad.",
        "Presenta la declaración de condiciones de seguridad actualizada.",
        "Programa la nueva inspección ITSE si es requerida."
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
