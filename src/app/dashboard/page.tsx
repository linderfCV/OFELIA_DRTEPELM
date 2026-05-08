
'use client';

import * as React from "react";
import dynamic from 'next/dynamic';
import { 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  UserCircle, 
  Map as MapIcon, 
  TrendingUp, 
  Activity, 
  Calendar,
  Search,
  Download,
  AlertCircle,
  LayoutDashboard,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Home,
  Sparkles,
  RefreshCw,
  MapPin,
  BarChart3,
  Layers,
  Lightbulb,
  Clock,
  ExternalLink,
  Target,
  ListFilter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Carga dinámica del mapa para evitar errores de Hydration/SSR con Leaflet
const RealLimaMap = dynamic(() => import('@/components/RealLimaMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-gray-50 rounded-[40px] flex items-center justify-center border border-gray-100 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-primary/30 animate-spin" />
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Cargando Mapa de Lima...</span>
      </div>
    </div>
  )
});

// --- CONSTANTES DE ESTILO MTPE ---
const COLORS = ['#D91E18', '#1a73e8', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];
const DONUT_COLORS = ['#D91E18', '#1a73e8', '#f59e0b'];

// --- COMPONENTES INTERNOS ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
    active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-gray-100"
  )}>
    <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-primary")} />
    <span className={cn("text-sm font-bold", active ? "text-white" : "text-gray-600")}>{label}</span>
  </button>
);

const KPICard = ({ title, value, subvalue, icon: Icon, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{title}</p>
      <h3 className="text-3xl font-black text-[#1A1A1A] mt-1 tabular-nums">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 mt-1">{subvalue}</p>
    </div>
  </motion.div>
);

export default function OfeliaDashboard() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const q = query(collection(db, "ofelia_eventos"), orderBy("fechaHora", "desc"), limit(1000));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaHora: doc.data().fechaHora?.toDate() || new Date()
      }));
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- PROCESAMIENTO DE DATOS ---
  const stats = React.useMemo(() => {
    const diagEvents = events.filter(e => e.tipoEvento === 'diagnostico_usuario');
    const chatbotEvents = events.filter(e => e.tipoEvento === 'consulta_chatbot');
    const uniqueUsers = new Set(events.map(e => e.numeroDocumento)).size;
    
    const userTypeCounts = {
      'Emprendedores': diagEvents.filter(e => e.tipoUsuario === 'emprendedor').length,
      'Empleadores Hogar': diagEvents.filter(e => e.tipoUsuario === 'empleador_hogar').length
    };
    const userTypeData = Object.entries(userTypeCounts).map(([name, value]) => ({ name, value }));

    const entrepreneurDiags = diagEvents.filter(e => e.tipoUsuario === 'emprendedor');
    const stageData = [
      { name: 'Idea de Negocio', value: entrepreneurDiags.filter(e => e.etapaEmprendimiento === 'idea_negocio').length },
      { name: 'Negocio en Marcha', value: entrepreneurDiags.filter(e => e.etapaEmprendimiento === 'negocio_en_marcha').length },
      { name: 'Otro', value: entrepreneurDiags.filter(e => !['idea_negocio', 'negocio_en_marcha'].includes(e.etapaEmprendimiento)).length }
    ];

    const rubroCounts: Record<string, number> = {};
    entrepreneurDiags.forEach(e => {
      const label = e.rubroNegocioLabel || "Otros";
      rubroCounts[label] = (rubroCounts[label] || 0) + 1;
    });
    const rubroData = Object.entries(rubroCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const themeCounts: Record<string, number> = {};
    events.forEach(e => {
      if (e.temasDetectados?.length) {
        e.temasDetectados.forEach((t: string) => {
          const readable = t.replace(/_/g, ' ').toUpperCase();
          themeCounts[readable] = (themeCounts[readable] || 0) + 1;
        });
      }
    });
    const themeRanking = Object.entries(themeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const districts: Record<string, number> = {};
    events.forEach(e => { if (e.distrito) districts[e.distrito] = (districts[e.distrito] || 0) + 1; });
    const topDistrict = Object.entries(districts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const dailyData: any[] = [];
    if (mounted) {
      for(let i=6; i>=0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayLabel = format(date, 'EEE', { locale: es }).toUpperCase();
        const count = events.filter(e => e.fechaHora.toDateString() === date.toDateString()).length;
        dailyData.push({ name: dayLabel, valor: count });
      }
    }

    return {
      total: events.length,
      diagnostics: diagEvents.length,
      queries: chatbotEvents.length,
      uniqueUsers,
      topDistrict,
      userTypeData,
      stageData,
      rubroData,
      themeRanking,
      dailyData
    };
  }, [events, mounted]);

  // --- AGRUPACIÓN DE FILAS PARA LA TABLA (REFINADA - RESULTADO DIAGNÓSTICO EJECUTIVO) ---
  const tableRows = React.useMemo(() => {
    const diagnosticEvents = events.filter(e => e.tipoEvento === 'diagnostico_usuario');
    const chatbotEvents = events.filter(e => e.tipoEvento === 'consulta_chatbot');
    
    // Mapeo refinado para etiquetas ejecutivas
    const mapping: Record<string, string> = {
      "autoriz_sectoriales": "Autorizaciones sectoriales",
      "constitucion_empresa": "Constitución de empresa",
      "contratacion_extranjeros": "Trabajadores extranjeros",
      "licencia_funcionamiento": "Licencia de funcionamiento",
      "ruc_regimen_tributario": "Régimen tributario",
      "remype": "REMYPE",
      "sunarp_indecopi": "SUNARP e INDECOPI",
      "ruc_trabajador_hogar": "RUC empleador hogar",
      "t_registro_trabajador_hogar": "T-Registro",
      "contrato_trabajador_hogar": "Contrato de trabajador del hogar",
      "ley_mype": "Ley MYPE",
      "obligaciones_empleador": "Obligaciones del empleador",
      "sgsstt_mypes": "Seguridad y Salud (SST)"
    };

    const formatThemeLabel = (theme: string) => {
      const key = theme.replace(/\.md$/, '').toLowerCase().trim();
      return mapping[key] || theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const generateSummary = (themesSet: Set<string>, fallback: string) => {
      const themes = Array.from(themesSet) as string[];
      // Filtrar categorías genéricas que no aportan valor ejecutivo
      const filteredThemes = themes.filter(t => !['Manuales Drtpe', 'Manuales Internos', 'Orientacion General', 'Base De Conocimiento General'].includes(t));
      
      if (filteredThemes.length === 0) return fallback;
      if (filteredThemes.length === 1) return filteredThemes[0];
      if (filteredThemes.length === 2) return filteredThemes.join(' y ');
      const last = filteredThemes.pop();
      return filteredThemes.join(', ') + ' y ' + last;
    };

    const detectThemeFromQuery = (query: string) => {
      const text = query.toLowerCase();
      if (text.includes("extranjero")) return "Trabajadores extranjeros";
      if (text.includes("marca") || text.includes("indecopi")) return "Registro de marca";
      if (text.includes("licencia") || text.includes("funcionamiento")) return "Licencia de funcionamiento";
      if (text.includes("remype") || text.includes("acredita")) return "Acreditación REMYPE";
      if (text.includes("hogar") || text.includes("domestico")) return "Trabajadoras del hogar";
      if (text.includes("contrato")) return "Contrato laboral";
      if (text.includes("sunarp") || text.includes("constitu")) return "Constitución de empresa";
      if (text.includes("ruc") || text.includes("sunat")) return "RUC / Tributación";
      return null;
    };

    // Agrupación por sesión de chatbot
    const chatbotGroups: Record<string, any> = {};
    chatbotEvents.forEach(e => {
      const key = e.numeroDocumento && e.numeroDocumento !== 'N/A' && e.numeroDocumento !== 'Anónimo' 
        ? e.numeroDocumento 
        : (e.sessionId || `anon-${e.id}`);
      
      if (!chatbotGroups[key]) {
        chatbotGroups[key] = {
          id: `group-${key}`,
          tipoEvento: 'chatbot_session',
          fechaHora: e.fechaHora,
          nombresApellidos: e.nombresApellidos,
          numeroDocumento: e.numeroDocumento,
          tipoUsuario: e.tipoUsuario,
          distrito: e.distrito,
          canal: 'Chatbot',
          uniqueThemes: new Set(),
          consultasResumen: []
        };
      }
      
      if (e.temasDetectados?.length) {
        e.temasDetectados.forEach((t: string) => chatbotGroups[key].uniqueThemes.add(formatThemeLabel(t)));
      }
      const detectedFromText = detectThemeFromQuery(e.textoConsulta || "");
      if (detectedFromText) chatbotGroups[key].uniqueThemes.add(detectedFromText);

      chatbotGroups[key].consultasResumen.push(e.textoConsulta);
      if (e.fechaHora > chatbotGroups[key].fechaHora) chatbotGroups[key].fechaHora = e.fechaHora;
    });

    const chatbotRows = Object.values(chatbotGroups).map(g => ({
      ...g,
      temasDetectados: Array.from(g.uniqueThemes),
      resultadoDiagnosticoResumen: generateSummary(g.uniqueThemes, "Consulta técnica general")
    }));

    const processedDiagnostics = diagnosticEvents.map(e => {
      // Priorizamos los temas donde el usuario dijo "No, necesito orientación"
      const diagThemes = new Set((e.temasDetectados || []).map((t: string) => formatThemeLabel(t)));
      return {
        ...e,
        canal: 'Diagnóstico',
        temasDetectados: Array.from(diagThemes),
        resultadoDiagnosticoResumen: generateSummary(diagThemes, "Sin brechas críticas detectadas")
      };
    });

    return [...processedDiagnostics, ...chatbotRows].sort((a, b) => b.fechaHora - a.fechaHora);
  }, [events]);

  const filteredRows = tableRows.filter(e => 
    e.nombresApellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numeroDocumento?.includes(searchTerm) ||
    e.distrito?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-body text-[#1A1A1A]">
      {/* --- SIDEBAR IZQUIERDO --- */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-3 mb-12">
          <img src="/image_f1ee39.jfif" alt="MTPE" className="h-10 w-auto" />
          <div className="h-6 w-[1px] bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-primary font-black text-xl leading-none">OFELIA</span>
            <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground">DRTPELM LIMA METROPOLITANA</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4 mb-4">Menú Principal</p>
          <SidebarItem icon={LayoutDashboard} label="Resumen Ejecutivo" active />
          <SidebarItem icon={ClipboardCheck} label="Diagnósticos" />
          <SidebarItem icon={MessageSquare} label="Consultas Chatbot" />
          <SidebarItem icon={MapIcon} label="Demanda por Distrito" />
          <SidebarItem icon={TrendingUp} label="Temas y Necesidades" />
          <SidebarItem icon={UserCircle} label="Gestión Ciudadana" />
          
          <div className="pt-8">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4 mb-4">Otros</p>
            <SidebarItem icon={FileText} label="Reportes PDF" />
            <SidebarItem icon={Settings} label="Configuración" />
          </div>
        </nav>

        <div className="mt-auto">
          <div className="bg-primary/5 rounded-[24px] p-5 border border-primary/10 relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <h4 className="font-black text-xs text-primary uppercase italic tracking-tight">Oficina Digital</h4>
            <p className="text-[10px] font-bold text-gray-500 mt-1 leading-tight">Asigna un asesor de la DRTPELM para casios críticos.</p>
            <Button 
              onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')}
              className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl h-9 text-[10px] font-black uppercase tracking-widest"
            >
              AGENDAR ASESORÍA
            </Button>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Monitoreo en Tiempo Real</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#1A1A1A]">Dashboard Ejecutivo</h1>
            <p className="text-sm text-muted-foreground font-medium italic">Inteligencia de Atención y Formalización Laboral - OFELIA</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2.5 shadow-sm flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase leading-none">Hoy es</span>
                <span className="text-xs font-bold text-[#1A1A1A] capitalize">{format(new Date(), "eeee d 'de' MMMM", { locale: es })}</span>
              </div>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <Button size="icon" variant="outline" className="h-11 w-11 rounded-2xl bg-white shadow-sm border-gray-100" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </header>

        {/* KPIs Principales */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard title="Ciudadanos Atendidos" value={stats.uniqueUsers} subvalue="Total perfiles registrados" icon={UserCircle} trend={+12} />
          <KPICard title="Diagnósticos MYPE" value={stats.diagnostics} subvalue="Tests de formalidad completados" icon={ClipboardCheck} trend={+5} />
          <KPICard title="Consultas Chatbot" value={stats.queries} subvalue="Interacciones con la IA" icon={MessageSquare} trend={-2} />
          <KPICard title="Distrito Líder" value={stats.topDistrict} subvalue="Mayor demanda geográfica" icon={MapIcon} />
        </section>

        {/* Mapa e Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-primary" />
                Mapa de Demanda en Lima Metropolitana
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                <Activity className="w-3 h-3" />
                Datos Georeferenciados
              </div>
            </div>
            <RealLimaMap events={events} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black uppercase tracking-tight">Insights Críticos</h3>
            </div>
            
            <div className="space-y-4">
              <motion.div whileHover={{ x: 5 }} className="bg-white p-5 rounded-[28px] border-l-4 border-l-primary border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Zona Prioritaria</p>
                <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                  <span className="text-primary">{stats.topDistrict}</span> concentra el mayor flujo de atenciones preventivas.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="bg-white p-5 rounded-[28px] border-l-4 border-l-amber-500 border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Necesidad Técnica</p>
                <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                  El tema <span className="text-amber-600 font-black">"{stats.themeRanking[0]?.name || "General"}"</span> es la brecha legal más frecuente.
                </p>
              </motion.div>

              <div className="bg-[#1A1A1A] text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden h-[240px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Volumen Semanal</h4>
                <div className="h-40 mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.dailyData}>
                      <Area type="monotone" dataKey="valor" stroke="#D91E18" strokeWidth={3} fill="#D91E18" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloques Analíticos */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]">Tipo de Usuario</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.userTypeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.userTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]">Etapa Emprendedora</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.stageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.stageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]">Principales Rubros</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.rubroData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 900, fill: '#64748B'}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {stats.rubroData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]">Brechas de Formalidad</h3>
            </div>
            <ScrollArea className="h-[200px] pr-2">
              <div className="space-y-3">
                {stats.themeRanking.map((theme, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-300 w-4">{idx + 1}</span>
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter group-hover:text-primary transition-colors">{theme.name}</p>
                    </div>
                    <span className="bg-gray-100 text-[#1A1A1A] text-[9px] font-black px-2 py-0.5 rounded-full">{theme.value}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </section>

        {/* Tabla Ejecutiva */}
        <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-primary" />
                Monitoreo de Impacto por Ciudadano
              </h3>
              <p className="text-xs font-bold text-gray-400 italic">Análisis consolidado de brechas y necesidades técnicas.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="DNI, Nombre o Distrito..." 
                  className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-gray-100 gap-2 font-black text-[10px] uppercase tracking-widest">
                <Download className="w-4 h-4" />
                EXCEL
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6 pl-8">Último Evento</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6">Ciudadano</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6">Canal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6">Distrito</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6">Resultado del Diagnóstico</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-6 pr-8 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="pl-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1A1A1A]">{format(row.fechaHora, "dd/MM/yyyy")}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{format(row.fechaHora, "HH:mm")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1A1A1A] capitalize">{row.nombresApellidos || "Anónimo"}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-gray-400">{row.numeroDocumento || "Sin DOC"}</span>
                            <div className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                              row.tipoUsuario?.includes('hogar') ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"
                            )}>
                              {row.tipoUsuario?.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border",
                          row.canal === 'Chatbot' ? "text-amber-600 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                        )}>
                          {row.canal}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-300" />
                          {row.distrito || "Lima"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-[11px] font-black text-[#1A1A1A] leading-snug max-w-[300px]">
                          {row.resultadoDiagnosticoResumen}
                        </p>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase gap-1.5 hover:text-primary transition-all"
                          onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                        >
                          {expandedRow === row.id ? "Cerrar" : "Ver Detalle"}
                          {expandedRow === row.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <AnimatePresence>
                      {expandedRow === row.id && (
                        <TableRow className="bg-gray-50/50 border-none">
                          <TableCell colSpan={6} className="p-0">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-12 py-8 space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                      <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">Resumen Técnico de Necesidades</h4>
                                  </div>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase italic">ID: {row.id}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Brechas Identificadas</p>
                                    <div className="space-y-3">
                                      {row.canal === 'Diagnóstico' && (row.respuestasDiagnosticoDetalle || []).filter((d: any) => d.necesitaOrientacion).map((d: any, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                                          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[11px] font-bold text-[#1A1A1A] leading-snug">{d.pregunta}</p>
                                            <p className="text-[9px] font-black text-primary uppercase mt-1">Acción: {d.etapaRuta}</p>
                                          </div>
                                        </div>
                                      ))}
                                      {row.canal === 'Chatbot' && row.consultasResumen?.map((q: string, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-start gap-3">
                                          <Search className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                          <p className="text-[11px] font-medium text-gray-600 leading-snug italic">"{q}"</p>
                                        </div>
                                      ))}
                                      {(!row.temasDetectados || row.temasDetectados.length === 0) && (
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase">Sin brechas críticas detectadas.</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Próxima Acción Sugerida</p>
                                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                                      <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                        {row.resultadoDiagnosticoResumen ? `El ciudadano requiere orientación prioritaria en ${row.resultadoDiagnosticoResumen.toLowerCase()}.` : "Ciudadano requiere orientación integral en formalización MYPE."}
                                      </p>
                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')}
                                          className="bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest h-9 rounded-xl flex-1"
                                        >
                                          Asignar Asesor
                                        </Button>
                                        <Button variant="outline" className="border-gray-100 text-[10px] font-black uppercase tracking-widest h-9 rounded-xl flex-1">Perfil Completo</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <footer className="text-center pb-8">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistema Oficial de Monitoreo</span>
            <div className="h-4 w-[1px] bg-gray-200" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">DRTPELM 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
