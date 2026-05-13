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
  Sparkles,
  BookOpen
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
  requirementsLabel?: string;
  stepsLabel?: string;
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
        details: "Para abrir una institución educativa privada (Nidos, Colegios o Institutos), es obligatorio obtener la autorización de funcionamiento. Este trámite valida que el local, el personal y el proyecto pedagógico cumplen con los estándares de calidad del Estado peruano.",
        requirements: [
          "Proyecto Educativo Institucional (PEI) y Plan Curricular.",
          "Plano de arquitectura y distribución visado por un arquitecto.",
          "Certificado de ITSE (Inspección de Seguridad) vigente.",
          "DNI del promotor y declaración jurada de antecedentes penales.",
          "Vigencia de poderes (si es persona jurídica)."
        ],
        steps: [
          "Presenta tu solicitud ante la UGEL correspondiente a tu distrito.",
          "Atiende la inspección ocular técnica de los especialistas de educación.",
          "Recibe la Resolución Directora que autoriza el servicio educativo.",
          "Registra tu institución en el padrón oficial del Ministerio."
        ],
        link: "https://www.gob.pe/minedu"
      };
    }
    if (sectorLabel.includes("Salud")) {
      return {
        id: "sectoral-salud",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Categorización y Registro (SUSALUD)",
        icon: <HeartPulse className="w-5 h-5" />,
        description: "¿RUBRO SALUD?",
        details: "Todo establecimiento que brinde servicios de salud (clínicas, boticas, consultorios) debe registrarse ante la Superintendencia Nacional de Salud (SUSALUD) como IPRESS. Esto garantiza que el servicio es formal y seguro para el ciudadano.",
        requirements: [
          "RUC activo con giro de negocio en salud.",
          "Título profesional y colegiatura del Director Médico responsable.",
          "Categorización vigente otorgada por la DIRIS o DIRESA local.",
          "Manuales de organización y funciones técnicos.",
          "Contrato de gestión de residuos sólidos hospitalarios."
        ],
        steps: [
          "Solicita la categorización de tu local en la DIRIS Lima (según zona).",
          "Inscribe tu establecimiento en el Registro Nacional de IPRESS (RENIPRESS).",
          "Actualiza anualmente tu información de personal y equipamiento ante SUSALUD.",
          "Obtén la clave para el sistema de vigilancia epidemiológica si aplica."
        ],
        link: "https://www.gob.pe/susalud"
      };
    }
    if (sectorLabel.includes("Transporte")) {
      return {
        id: "sectoral-transporte",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Autorización de Operación (ATU / MTC)",
        icon: <Truck className="w-5 h-5" />,
        description: "¿RUBRO TRANSPORTE?",
        details: "Si tu proyecto involucra el transporte de carga o pasajeros, requieres la habilitación de la ATU para Lima y Callao. Sin este permiso, el vehículo es informal y está sujeto a multas graves e internamiento en el depósito.",
        requirements: [
          "Tarjeta de Propiedad Vehicular y SOAT vigente (especialidad transporte).",
          "Certificado de Inspección Técnica Vehicular (CITV) para transporte público.",
          "RUC de la empresa con domicilio fiscal en Lima.",
          "Licencia de conducir profesional de los conductores.",
          "Póliza de seguro contra accidentes a terceros."
        ],
        steps: [
          "Gestiona la habilitación de la flota ante la ATU de forma virtual.",
          "Obtén la Tarjeta de Circulación y el código de ruta autorizado.",
          "Registra a los conductores en el sistema de gestión de la ATU.",
          "Verifica la instalación de GPS si el servicio lo requiere por normativa."
        ],
        link: "https://www.gob.pe/atu"
      };
    }
    if (sectorLabel.includes("Gastronomía")) {
      return {
        id: "sectoral-gastro",
        step: "AUTORIZACIÓN SECTORIAL",
        title: "Vigilancia Sanitaria y DIGESA",
        icon: <Landmark className="w-5 h-5" />,
        description: "¿RUBRO ALIMENTOS?",
        details: "Si procesas alimentos o comercializas productos envasados, necesitas asegurar la inocuidad. Para restaurantes, el control es municipal, pero para fabricación y distribución de alimentos procesados se requiere Registro Sanitario de DIGESA.",
        requirements: [
          "Análisis físico-químico y microbiológico del producto final.",
          "Ficha técnica detallada del envase y empaque.",
          "Manual de Buenas Prácticas de Manufactura (BPM).",
          "Plan HACCP (Análisis de Peligros y Puntos Críticos de Control).",
          "Pago de derecho de trámite (Tasa DIGESA)."
        ],
        steps: [
          "Realiza los análisis de laboratorio en entidades autorizadas.",
          "Solicita el Registro Sanitario a través de la plataforma VUCE.",
          "Tramita la Validación Técnica Oficial del Plan HACCP para tu planta.",
          "Asegura el carnet de sanidad vigente para todo tu personal operativo."
        ],
        link: "https://www.digesa.minsa.gob.pe/"
      };
    }
    return null;
  };

  const getMypeBenefitsTask = (): Task => ({
    id: "mype-benefits",
    step: "VALOR AGREGADO",
    title: "Beneficios del Régimen Especial MYPE",
    icon: <Award className="w-5 h-5" />,
    description: "¿POR QUÉ SER FORMAL ES TU MEJOR NEGOCIO?",
    details: "La formalización te permite acceder a beneficios que reducen tus costos operativos y protegen tu crecimiento. Estar en el REMYPE no solo es un cumplimiento, es una ventaja competitiva frente a empresas informales.",
    requirementsLabel: "Ventajas Competitivas",
    requirements: [
      "Microempresa: Ventas brutas anuales hasta 150 UIT (aprox. S/ 772,500).",
      "Pequeña Empresa: Ventas hasta 1700 UIT (aprox. S/ 8,755,000).",
      "Régimen Laboral Especial: Ahorro en costos de CTS, Gratificaciones y Vacaciones.",
      "Seguro Social: Acceso al SIS Emprendedor o aportes reducidos a EsSalud.",
      "Puntaje Adicional: 10% extra en licitaciones y compras estatales."
    ],
    stepsLabel: "Recomendación",
    steps: [
      "Inscríbete en el REMYPE a través del portal del Ministerio de Trabajo.",
      "Asegura a tus trabajadores en el régimen especial para evitar sobrecostos.",
      "Solicita financiamiento preferencial con el respaldo de tu acreditación MYPE.",
      "Participa en las ferias y capacitaciones gratuitas de la DRTPELM."
    ],
    options: [
      { label: "Conoce los 6 beneficios de la formalización empresarial", url: "https://www.gob.pe/institucion/tuempresa/noticias/914295-conozca-los-6-beneficios-de-la-formalizacion-empresarial" },
      { label: "Beneficios de ser formal", url: "https://emprender.sunat.gob.pe/acciones-contribuyente/formalizacion/beneficios-ser-formal" }
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
        details: "Antes de constituir tu empresa, debes asegurar que el nombre que elegiste está disponible. La reserva impide que otras personas inscriban un nombre igual o similar al tuyo durante 30 días calendario, dándote tiempo para terminar la escritura pública.",
        requirements: [
          "Tres opciones de nombres (en orden de preferencia).",
          "DNI o CE vigente del solicitante o representantes.",
          "Pago de la tasa registral (aprox. S/ 24.00 soles).",
          "Identificar el tipo de empresa (S.A.C., E.I.R.L., S.R.L., etc.)."
        ],
        steps: [
          "Realiza una 'Búsqueda de Índices' en el sistema virtual de SUNARP para verificar disponibilidad.",
          "Solicita el formulario de Reserva de Nombre mediante la plataforma SPRL.",
          "Realiza el pago virtual o en oficina de la tasa administrativa.",
          "Recibe tu constancia de reserva en un plazo de 24 a 48 horas."
        ],
        link: "https://www.gob.pe/271-buscar-y-reservar-el-nombre-de-una-empresa-en-la-sunarp"
      },
      {
        id: "indecopi",
        step: "PASO 2",
        title: "Protección de Marca (INDECOPI)",
        icon: <ShieldCheck className="w-5 h-5" />,
        description: "PROPIEDAD INTELECTUAL",
        details: "La reserva en SUNARP solo protege el nombre legal de tu empresa. Para proteger tu nombre comercial, logo e identidad frente al mercado y la competencia, debes registrar tu MARCA ante INDECOPI. Esto te otorga exclusividad por 10 años en todo el territorio nacional.",
        requirements: [
          "Logo de la marca en formato digital de alta calidad.",
          "Clasificación de Niza (identificar qué productos o servicios protege).",
          "Búsqueda fonética y figurativa (para evitar conflictos legales).",
          "Pago de tasa de registro (aprox. S/ 534.99 por una clase)."
        ],
        steps: [
          "Realiza una 'Búsqueda Fonética' gratuita en el portal de INDECOPI.",
          "Define la clase de productos/servicios según la Clasificación Internacional de Niza.",
          "Presenta la solicitud virtual de Registro de Marca.",
          "Monitorea la publicación automática en la Gaceta Electrónica durante el plazo de oposición."
        ],
        link: "https://pi.indecopi.gob.pe/buscatumarca/#/inicio"
      },
      {
        id: "acto",
        step: "PASO 3",
        title: "Elaboración del Acto Constitutivo (Minuta)",
        icon: <FileText className="w-5 h-5" />,
        description: "FUNDACIÓN LEGAL",
        details: "Es el documento donde los socios manifiestan su voluntad de crear la empresa. Aquí se definen los estatutos, el capital social (dinero o bienes), el cargo de los directores y las reglas de funcionamiento. Puedes hacerlo gratis en los Centros de Desarrollo Empresarial (CDE) de PRODUCE.",
        requirements: [
          "Reserva de nombre emitida por SUNARP.",
          "DNI/CE vigentes de todos los socios y sus cónyuges (si aplica).",
          "Detalle del objeto social (qué actividades realizará el negocio).",
          "Aporte de capital (depósito bancario o inventario detallado de bienes)."
        ],
        steps: [
          "Acude a un Centro de Desarrollo Empresarial (CDE) o una notaría.",
          "Redacta el Acto Constitutivo (Minuta) con asesoría legal.",
          "Eleva la Minuta a Escritura Pública ante un Notario.",
          "El Notario enviará los partes electrónicos a SUNARP para la inscripción final."
        ],
        link: "https://www.gob.pe/269-elaborar-la-minuta-de-constitucion-de-la-empresa-o-acto-constitutivo"
      },
      {
        id: "sunat",
        step: "PASO 4",
        title: "RUC y Régimen Tributario (SUNAT)",
        icon: <CreditCard className="w-5 h-5" />,
        description: "IDENTIFICACIÓN TRIBUTARIA",
        details: "El Registro Único de Contribuyentes (RUC) es tu identidad frente a la administración tributaria. Al obtenerlo, debes elegir un régimen tributario. Para emprendedores, el Régimen MYPE Tributario es ideal pues tiene tasas progresivas según tus ganancias.",
        requirements: [
          "Escritura Pública de Constitución inscrita en Registros Públicos.",
          "Recibo de servicios (agua/luz) del domicilio fiscal (no mayor a 2 meses).",
          "DNI del representante legal.",
          "Clave SOL (se genera al momento del trámite)."
        ],
        steps: [
          "Realiza la inscripción virtual vía 'APP Personas' o en la web de SUNAT.",
          "Elige el Régimen MYPE Tributario para gozar de beneficios de formalización.",
          "Genera tu Clave SOL y activa tu Buzón Electrónico.",
          "Habilita la emisión de comprobantes electrónicos (boletas y facturas)."
        ],
        link: "https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios"
      },
      {
        id: "municipal",
        step: "PASO 5",
        title: "Licencia de Funcionamiento Municipal",
        icon: <MapPin className="w-5 h-5" />,
        description: "AUTORIZACIÓN LOCAL",
        details: "Es la autorización que otorga tu Municipalidad para que tu negocio opere legalmente en un local físico. Evalúa la zonificación (si el lugar permite tu tipo de negocio) y las condiciones de seguridad (Defensa Civil).",
        requirements: [
          "RUC activo y Habido.",
          "Vigencia de poderes actualizada del representante legal.",
          "Certificado de ITSE (Inspección Técnica de Seguridad en Edificaciones).",
          "Declaración Jurada de cumplimiento de condiciones de seguridad."
        ],
        steps: [
          "Verifica el Índice de Usos y Zonificación en el portal de tu Municipalidad.",
          "Presenta la solicitud de Licencia de Funcionamiento de forma presencial o virtual.",
          "Atiende la inspección técnica de seguridad de Defensa Civil.",
          "Recibe tu licencia y colócala en un lugar visible del establecimiento."
        ],
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
        title: "Actualización de RUC y Datos (SUNAT)",
        icon: <CreditCard className="w-5 h-5" />,
        description: "CUMPLIMIENTO TRIBUTARIO",
        details: "Es vital que tu RUC refleje la realidad actual de tu negocio. Si cambiaste de dirección, de actividad económica (CIIU) o de representante, debes actualizarlo inmediatamente para evitar multas de SUNAT o problemas con el sistema de facturación.",
        requirements: [
          "Clave SOL vigente.",
          "Nuevo código CIIU (si cambiaste de giro de negocio).",
          "Documento sustentatorio de domicilio (recibo o contrato de alquiler).",
          "DNI del nuevo representante si aplica."
        ],
        steps: [
          "Ingresa a SUNAT Operaciones en Línea con tu RUC y Clave SOL.",
          "Busca la opción 'Mi RUC y Otros Registros'.",
          "Modifica los campos necesarios (Dirección, Teléfono, Correo, Actividad).",
          "Verifica la actualización en tu Ficha RUC virtual."
        ],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "remype",
        step: "PASO 2",
        title: "Registro y Acreditación en REMYPE (MTPE)",
        icon: <ClipboardList className="w-5 h-5" />,
        description: "FORMALIZACIÓN LABORAL",
        details: "Este es el paso más importante para reducir tus costos laborales legalmente. Al estar acreditado en el REMYPE como Micro o Pequeña empresa, puedes contratar personal bajo un régimen que requiere menos pagos de beneficios sociales (como CTS o gratificaciones reducidas).",
        requirements: [
          "RUC activo y en condición de 'Habido'.",
          "Tener al menos un (1) trabajador registrado en planilla.",
          "Ventas anuales que no superen las 150 UIT (Micro) o 1700 UIT (Pequeña).",
          "No pertenecer a grupos económicos o vinculación societaria excluyente."
        ],
        steps: [
          "Accede al portal REMYPE con tu RUC, usuario y Clave SOL.",
          "Completa el formulario de solicitud registrando a tu personal.",
          "Acepta la Declaración Jurada de cumplimiento de requisitos.",
          "Descarga tu Constancia de Acreditación MYPE e imprímela."
        ],
        link: "https://www.gob.pe/285-registro-de-la-micro-y-pequena-empresa-remype"
      },
      {
        id: "municipal-active",
        step: "PASO 3",
        title: "Regularización y Control Municipal",
        icon: <MapPin className="w-5 h-5" />,
        description: "CONTROL LOCAL",
        details: "Asegura que tu negocio no tenga impedimentos de operación local. Muchas empresas activas olvidan renovar su certificado de seguridad ITSE o no informan sobre ampliaciones de local, lo que genera clausuras temporales.",
        requirements: [
          "Copia de la Licencia de Funcionamiento vigente.",
          "Certificado de ITSE (Inspección Técnica de Seguridad) no vencido.",
          "Plan de Seguridad para establecimientos (si el aforo lo requiere).",
          "Carnet de sanidad actualizado (obligatorio para rubros de atención directa)."
        ],
        steps: [
          "Verifica la fecha de vencimiento de tu certificado de Defensa Civil.",
          "Solicita la renovación de ITSE ante la Municipalidad si está próxima a vencer.",
          "Informa a la municipalidad si has realizado cambios en el metraje o giro.",
          "Asegura que los avisos publicitarios tengan la autorización respectiva."
        ]
      }
    ];

    const isFormal = results[3] === true && results[4] === true && results[5] === true;
    if (isFormal) return [getMypeBenefitsTask()];

    const pendingTasks: Task[] = [];
    if (results[3] === false) pendingTasks.push(allTasks[0]);
    if (results[4] === false) {
      pendingTasks.push(allTasks[1]);
      if (results[5] === false) pendingTasks.push(allTasks[2]);
    } else if (results[5] === false) {
      pendingTasks.push(allTasks[2]);
    }
    
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
        title: "Inscripción en el RUC como Empleador",
        icon: <CreditCard className="w-5 h-5" />,
        description: "REGISTRO DE EMPLEADOR",
        details: "Todo empleador de un trabajador(a) del hogar debe tener un RUC (generalmente bajo el régimen de 'Empleador de Hogar'). Esto es indispensable para poder poder declarar la planilla mensual y pagar los aportes de EsSalud (9%) y Pensiones (ONP/AFP).",
        requirements: [
          "DNI o CE vigente del empleador.",
          "Dirección exacta de la residencia donde se prestará el servicio.",
          "Número de celular y correo electrónico para notificaciones de SUNAT.",
          "Recibo de luz o agua del domicilio del empleador."
        ],
        steps: [
          "Descarga la APP 'Personas SUNAT' o ingresa a la web oficial.",
          "Inscríbete en el RUC seleccionando la opción de 'Trabajadores del Hogar'.",
          "Obtén tu Clave SOL (usuario y contraseña virtual).",
          "Verifica que tu estado sea 'Activo' y 'Habido'."
        ],
        link: "https://www.gob.pe/284-inscripcion-en-el-ruc"
      },
      {
        id: "t-registro",
        step: "PASO 2",
        title: "Alta en el T-Registro (SUNAT)",
        icon: <UserCheck className="w-5 h-5" />,
        description: "FORMALIDAD CIUDADANA",
        details: "El T-Registro es el sistema donde se vincula legalmente al trabajador(a) con su empleador. Sin este registro, el trabajador(a) no existe para el sistema de seguridad social, lo que genera una falta grave y el impedimento de atención médica en EsSalud.",
        requirements: [
          "DNI del trabajador(a) del hogar.",
          "Fecha de nacimiento y nacionalidad del trabajador(a).",
          "Monto de la remuneración mensual (no menor al mínimo vital).",
          "Detalle de la jornada (Cama Adentro / Cama Afuera / Tiempo Parcial).",
          "Régimen pensionario elegido por el trabajador(a) (ONP o AFP)."
        ],
        steps: [
          "Ingresa a SUNAT Operaciones en Línea con tu Clave SOL.",
          "Ubica la sección 'Mi RUC y Otros Registros' > 'Trabajador del Hogar'.",
          "Completa el 'Alta del Trabajador' con todos los datos solicitados.",
          "Emite e imprime la Constancia de Alta para entregársela al trabajador(a)."
        ],
        link: "https://www.sunat.gob.pe/sol.html"
      },
      {
        id: "mtpe-contract",
        step: "PASO 3",
        title: "Registro de Contrato en el Aplicativo (MTPE)",
        icon: <FileText className="w-5 h-5" />,
        description: "CONTRATO OFICIAL",
        details: "Según la Ley N° 31047, el contrato de trabajo del hogar debe ser POR ESCRITO y registrado obligatoriamente ante el Ministerio de Trabajo. Este documento protege a ambas partes definiendo claramente las tareas, el horario y los beneficios.",
        requirements: [
          "Contrato impreso firmado por ambas partes (3 ejemplares).",
          "Copia de los DNI de empleador y trabajador.",
          "Registro previo en el T-Registro de SUNAT.",
          "Acceso al aplicativo virtual del MTPE con DNI o Clave SOL."
        ],
        steps: [
          "Descarga el modelo oficial de contrato del portal institucional del MTPE.",
          "Firma el contrato junto a tu trabajador(a) e imprime las copias necesarias.",
          "Ingresa al 'Registro de Contratos de Trabajadores del Hogar' en la web del MTPE.",
          "Carga el archivo escaneado del contrato y obtén tu constancia de registro."
        ],
        link: "https://apps.trabajo.gob.pe/rcth/app/#/inicio",
        options: [
          { label: "Modelo de Contrato Cama Adentro", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" },
          { label: "Modelo de Contrato Cama Afuera", url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/6570925-contrato-para-los-trabajadores-as-del-hogar" }
        ]
      },
      {
        id: "obligations-domestic",
        step: "INFO CLAVE",
        title: "Obligaciones del Empleador (Ley N° 31047)",
        icon: <Scale className="w-5 h-5" />,
        description: "CUMPLIMIENTO LEGAL",
        details: "Como empleador(a), tienes responsabilidades críticas. El incumplimiento de estas obligaciones puede derivar en multas severas de SUNAFIL y demandas laborales por beneficios no pagados.",
        requirements: [
          "Jornada Laboral: Máximo 8 horas diarias y 48 horas semanales.",
          "Descanso Semanal: Mínimo 24 horas consecutivas (generalmente domingos).",
          "Gratificaciones: Pago de un (1) sueldo íntegro en Julio y Diciembre.",
          "Vacaciones: 30 días de descanso remunerado por cada año de servicio.",
          "CTS: Un (1) sueldo por año, depositado semestralmente (Mayo/Noviembre).",
          "Seguridad Social: Pago mensual del 9% del sueldo a EsSalud."
        ],
        steps: [
          "Entrega mensualmente una Boleta de Pago firmada a tu trabajador(a).",
          "Garantiza condiciones dignas de alimentación y alojamiento (si es cama adentro).",
          "Realiza los pagos de aportes puntualmente vía SUNAT antes del vencimiento.",
          "Contrata un Seguro de Vida Ley si el vínculo supera los 4 años (recomendado desde el inicio)."
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 relative">
      <div className="absolute inset-x-0 -top-20 -bottom-20 digital-mesh opacity-50 pointer-events-none" />

      <div className="relative w-full rounded-[40px] overflow-hidden p-8 shadow-premium group min-h-[140px] flex items-center">
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

      <header className="space-y-3 px-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
           <Zap className="w-3 h-3 text-amber-600 glow-primary" />
           <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Diagnóstico Personalizado</span>
        </div>
        <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tight leading-none">
          Ruta Técnica de Formalización
        </h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[460px]">
          Recomendaciones construidas según tu diagnóstico y normativa oficial vigente.
        </p>
      </header>

      <div className="space-y-4 relative z-10">
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={tasks[0]?.id}>
          {tasks.map((task) => {
            const isInfoClave = task.step === "INFO CLAVE" || task.step === "VALOR AGREGADO";
            const isSectoral = task.step.includes("SECTORIAL");
            
            return (
              <AccordionItem 
                key={task.id} 
                value={task.id}
                className={cn(
                  "border rounded-[32px] bg-white/80 backdrop-blur-sm shadow-premium overflow-hidden px-6 transition-all hover:shadow-2xl hover:shadow-gray-200/50",
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
                           <h4 className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest">Formatos y Modelos Oficiales</h4>
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
                           {task.requirementsLabel || "Requisitos Técnicos"}
                         </h4>
                         <div className="space-y-3">
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
                           {task.stepsLabel || "Guía de Ejecución"}
                         </h4>
                         <div className="space-y-5">
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
                            ¿Necesitas asesoría técnica sobre este punto?
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Consulta a OFELIA IA para resolver dudas legales específicas</p>
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

      <section className="pt-8 relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary p-10 rounded-[48px] shadow-[0_32px_64px_rgba(217,30,24,0.2)] relative overflow-hidden text-white w-full flex flex-col items-center text-center space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl opacity-30" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
             <Sparkles className="w-4 h-4 text-amber-300" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Orientación Estratégica</span>
          </div>

          <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            Próxima Acción Sugerida
          </h4>

          <p className="text-sm font-medium text-white/90 max-w-lg leading-relaxed">
            Te recomendamos agendar una asesoría técnica presencial o virtual. Un especialista de la DRTPELM validará tu expediente antes de presentarlo.
          </p>

          <Button 
            onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')}
            className="h-16 w-full max-w-sm bg-white text-primary hover:bg-white/95 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl gap-3 group transition-all active:scale-95"
          >
            AGENDAR ASESORÍA OFICIAL
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Button>

          <div className="flex items-center justify-center gap-2.5 text-white/60">
            <CheckCircle2 className="w-4 h-4" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em]">Servicio Gratuito DRTPELM</p>
          </div>
        </motion.div>
      </section>

      <footer className="pt-12 flex flex-col items-center gap-6 border-t border-gray-100 relative z-10">
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
            Descargar Hoja de Ruta PDF
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
