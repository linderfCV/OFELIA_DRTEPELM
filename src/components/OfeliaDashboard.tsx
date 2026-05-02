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
  AlertCircle
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
}

export function OfeliaDashboard({ routeType, results, onOpenChat }: OfeliaDashboardProps) {
  const getIdeaTasks = () => [
    {
      id: "sunarp",
      step: "PASO 1",
      title: "Búsqueda de nombre en SUNARP",
      icon: <Search className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Antes de constituir tu empresa, debes verificar que el nombre o razón social esté disponible en los Registros Públicos. Este paso evita que rechacen tu inscripción más adelante.",
      requirements: [
        "DNI vigente del titular o representante",
        "Pago de tasa registral (S/ 5.00 aprox.)",
        "Propuesta de 1 a 3 nombres alternativos"
      ],
      steps: [
        "Ingresa al portal SUNARP en línea o acércate a una oficina registral.",
        "Realiza la búsqueda y reserva del nombre por 30 días hábiles.",
        "Guarda la constancia de reserva para el acto constitutivo."
      ]
    },
    {
      id: "acto",
      step: "PASO 2",
      title: "Elaborar Acto Constitutivo (Notaría)",
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Es el documento donde los socios manifiestan su voluntad de constituir la empresa. Define el tipo de sociedad (SAC, EIRL, etc.) y los estatutos.",
      requirements: [
        "Reserva de nombre en SUNARP",
        "DNI original de los socios y cónyuges",
        "Archivo (PDF/Word) con el objeto social y capital",
        "Aporte de capital (dinero o bienes)"
      ],
      steps: [
        "Acude a una notaría o al Centro de Desarrollo Empresarial (Produce).",
        "Firma la minuta y el notario elevará el documento a Escritura Pública.",
        "El notario enviará el parte a SUNARP para su inscripción."
      ]
    },
    {
      id: "sunat",
      step: "PASO 3",
      title: "Inscripción en el RUC (SUNAT)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "El RUC identifica a tu empresa ante el estado para fines tributarios. Debes elegir un régimen que se ajuste a tu nivel de proyección.",
      requirements: [
        "Escritura pública inscrita en Registros Públicos",
        "Recibo de servicios (luz/agua) del domicilio fiscal",
        "DNI del representante legal"
      ],
      steps: [
        "Realiza el trámite vía web (App Personas) o presencial.",
        "Elige tu régimen tributario (MYPE Tributario o Régimen Especial).",
        "Genera tu Clave SOL para emitir comprobantes electrónicos."
      ]
    },
    {
      id: "municipal",
      step: "PASO 4",
      title: "Licencia de Funcionamiento",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Es la autorización municipal para que tu local pueda operar legalmente. Certifica que el lugar es seguro y apto para la actividad.",
      requirements: [
        "RUC activo y habido",
        "Certificado ITSE (Inspección Técnica de Seguridad)",
        "Declaración Jurada de vigencia de poder"
      ],
      steps: [
        "Consulta la compatibilidad de uso en tu municipio distrital.",
        "Presenta la solicitud y paga la tasa municipal (TUPA).",
        "Recibe la inspección técnica de seguridad de Defensa Civil."
      ]
    }
  ];

  const getActiveTasks = () => [
    {
      id: "ruc-update",
      step: "PASO 1",
      title: "Regularización de RUC (Actividad)",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Asegura que tu Código CIIU (actividad económica) y domicilio fiscal coincidan con tu operación real actual.",
      requirements: [
        "Clave SOL activa",
        "DNI del representante legal",
        "Documento que sustente el nuevo domicilio fiscal"
      ],
      steps: [
        "Ingresa a SUNAT Operaciones en Línea.",
        "Actualiza tus datos de contacto y actividad principal.",
        "Verifica que tu estado sea 'Activo' y tu condición 'Habido'."
      ]
    },
    {
      id: "remype",
      step: "PASO 2",
      title: "Registro en REMYPE (MTPE)",
      icon: <ClipboardList className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Permite que tu empresa acceda a beneficios laborales especiales de la Ley MYPE, reduciendo costos no salariales.",
      requirements: [
        "RUC vigente y Clave SOL",
        "Tener al menos 1 trabajador registrado en T-Registro",
        "No superar las 1,700 UIT de ventas anuales"
      ],
      steps: [
        "Ingresa al portal del MTPE con tu RUC y Clave SOL.",
        "Completa la declaración jurada de datos de la empresa.",
        "Imprime tu constancia de acreditación REMYPE."
      ]
    },
    {
      id: "itse",
      step: "PASO 3",
      title: "Certificado ITSE (Defensa Civil)",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
      description: "¿DE QUÉ SE TRATA?",
      details: "Inspección que garantiza que el local cumple con las normas de seguridad estructural, eléctrica y de evacuación.",
      requirements: [
        "Plano de arquitectura y distribución",
        "Certificado de pozo a tierra vigente",
        "Plan de seguridad y cronograma de mantenimiento"
      ],
      steps: [
        "Solicita la inspección ante la Gerencia de Gestión del Riesgo.",
        "Levanta las observaciones señaladas por el inspector.",
        "Recibe el certificado vigente por 2 años."
      ]
    }
  ];

  const tasks = routeType === 'idea' ? getIdeaTasks() : getActiveTasks();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
          <ClipboardList className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] font-black text-primary uppercase tracking-wider">TUS TAREAS PRIORITARIAS</p>
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
          Tu Hoja de Ruta para tu Formalización
        </h2>
        <p className="text-sm text-muted-foreground font-medium">Sigue estos pasos para operar legalmente y acceder a beneficios del Estado.</p>
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
                      <p className="text-[10px] font-bold text-primary text-center">
                        ¿Tienes una duda específica sobre este paso? <br/>
                        <span className="font-black underline">Pregunta aquí</span>
                      </p>
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
              Recibirás un correo de la DRTPELM con la guía detallada de trámites municipales y laborales.
            </p>
          </div>
        </div>
        <Button className="w-full bg-white text-primary hover:bg-gray-50 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
          AGENDAR ASESORÍA GRATUITA
        </Button>
      </div>
    </div>
  );
}
