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
  Filter,
  Search,
  Download,
  AlertCircle,
  LayoutDashboard,
  FileText,
  HelpCircle,
  Settings,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Home,
  Sparkles,
  RefreshCw,
  MoreVertical,
  MapPin
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
  const [searchTerm, setSearchSearchTerm] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const q = query(collection(db, "ofelia_eventos"), orderBy("fechaHora", "desc"), limit(300));
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
    const total = events.length;
    const diagnostics = events.filter(e => e.tipoEvento === 'diagnostico_usuario').length;
    const queries = events.filter(e => e.tipoEvento === 'consulta_chatbot').length;
    const registrations = events.filter(e => e.tipoEvento === 'registro_usuario' || e.tipoEvento === 'registro_chatbot').length;
    const uniqueUsers = new Set(events.map(e => e.numeroDocumento)).size;
    
    const entrepreneurs = events.filter(e => e.tipoUsuario?.includes('emprendedor') || e.tipoUsuario === 'entrepreneur').length;
    const domestics = events.filter(e => e.tipoUsuario?.includes('hogar') || e.tipoUsuario === 'domestic').length;

    // Distritos
    const districts: Record<string, number> = {};
    events.forEach(e => { if (e.distrito) districts[e.distrito] = (districts[e.distrito] || 0) + 1; });
    const topDistrict = Object.entries(districts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    
    // Temas mas detectados
    const themes: Record<string, number> = {};
    events.forEach(e => {
      e.temasDetectados?.forEach((t: string) => { themes[t] = (themes[t] || 0) + 1; });
    });
    const topTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/_/g, ' ').toUpperCase() || "N/A";

    // Chart: Eventos por día (últimos 7 días)
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

    // Chart: Rubros
    const rubros: Record<string, number> = {};
    events.forEach(e => { if (e.rubroNegocioLabel) rubros[e.rubroNegocioLabel] = (rubros[e.rubroNegocioLabel] || 0) + 1; });
    const rubroData = Object.entries(rubros).map(([name, value]) => ({ name, value }));

    return {
      total,
      diagnostics,
      queries,
      registrations,
      uniqueUsers,
      topDistrict,
      topTheme,
      entrepreneurPct: total > 0 ? Math.round((entrepreneurs / total) * 100) : 0,
      domesticPct: total > 0 ? Math.round((domestics / total) * 100) : 0,
      dailyData,
      rubroData
    };
  }, [events, mounted]);

  const filteredEvents = events.filter(e => 
    e.nombresApellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numeroDocumento?.includes(searchTerm) ||
    e.distrito?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Evitar hydration error bloqueando renderizado de fechas hasta el mount
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
            <p className="text-[10px] font-bold text-gray-500 mt-1 leading-tight">Asigna un asesor de la DRTPELM para casos críticos.</p>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl h-9 text-[10px] font-black uppercase tracking-widest">
              AGENDAR ASESORÍA
            </Button>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
        {/* Header Superior */}
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
            <Button size="icon" variant="outline" className="h-11 w-11 rounded-2xl bg-white shadow-sm border-gray-100">
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </header>

        {/* KPIs Principales */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard title="Ciudadanos Atendidos" value={stats.registrations} subvalue="Total de perfiles únicos" icon={UserCircle} trend={+12} />
          <KPICard title="Diagnósticos MYPE" value={stats.diagnostics} subvalue="Tests de formalidad realizados" icon={ClipboardCheck} trend={+5} />
          <KPICard title="Consultas Chatbot" value={stats.queries} subvalue="Interacciones con la IA" icon={MessageSquare} trend={-2} />
          <KPICard title="Distrito Líder" value={stats.topDistrict} subvalue="Mayor concentración de demanda" icon={MapIcon} />
        </section>

        {/* Sección Media: Mapa e Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-primary" />
                Mapa de Demanda en Lima Metropolitana
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                <Activity className="w-3 h-3" />
                Mapa Interactivo Real
              </div>
            </div>
            <RealLimaMap events={events} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black uppercase tracking-tight">Insights Clave</h3>
            </div>
            
            <div className="space-y-4">
              <motion.div whileHover={{ x: 5 }} className="bg-white p-5 rounded-[28px] border-l-4 border-l-primary border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Hallazgo Crítico</p>
                <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                  El distrito de <span className="text-primary">{stats.topDistrict}</span> concentra el mayor flujo de atenciones de esta semana.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="bg-white p-5 rounded-[28px] border-l-4 border-l-amber-500 border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Tendencia de Rubro</p>
                <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                  El sector <span className="text-amber-600">Comercio y Gastronomía</span> lidera las consultas sobre Licencias Municipales.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="bg-white p-5 rounded-[28px] border-l-4 border-l-blue-600 border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Uso de IA</p>
                <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                  <span className="text-blue-600 font-black">"{stats.topTheme}"</span> es la categoría técnica con más actividad en el chatbot.
                </p>
              </motion.div>
              
              <div className="bg-[#1A1A1A] text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Distribución de Usuarios</h4>
                <div className="mt-6 flex items-end justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-white">Emprendedores</span>
                        <span className="text-xl font-black text-white">{stats.entrepreneurPct}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${stats.entrepreneurPct}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-white">Empleadores Hogar</span>
                        <span className="text-xl font-black text-white">{stats.domesticPct}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.domesticPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos Analíticos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tendencia Semanal */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Tráfico Semanal de Ciudadanos
              </h3>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D91E18" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#D91E18" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#D91E18' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#D91E18" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sectores / Rubros */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Categorización por Rubro
              </h3>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-gray-400" /></Button>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.rubroData.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 800, fill: '#64748B'}}
                  />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'xl' }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                    {stats.rubroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Tabla de Eventos Recientes */}
        <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight">Últimos Eventos Registrados</h3>
              <p className="text-xs font-bold text-gray-400">Detalle granular de las interacciones en tiempo real.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por DNI o Nombre..." 
                  className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-gray-100 gap-2 font-bold text-xs uppercase">
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5 pl-8">Fecha / Hora</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5">Ciudadano</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5">Tipo Usuario</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5">Evento / Canal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5">Distrito</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-5 pr-8">Resumen Diagnóstico</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredEvents.map((event, idx) => (
                    <motion.tr 
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="pl-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1A1A1A]">{format(event.fechaHora, "dd/MM/yyyy")}</span>
                          <span className="text-[10px] font-bold text-gray-400">{format(event.fechaHora, "HH:mm")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1A1A1A] truncate max-w-[140px] capitalize">{event.nombresApellidos || "Anónimo"}</span>
                          <span className="text-[10px] font-bold text-gray-400">{event.numeroDocumento || "Sin DOC"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase",
                          event.tipoUsuario?.includes('hogar') ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"
                        )}>
                          {event.tipoUsuario?.includes('hogar') ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                          {event.tipoUsuario?.replace(/_/g, ' ') || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tighter">
                            {event.tipoEvento?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 italic">vía {event.canal || "Desconocido"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-300" />
                          {event.distrito || "Lima"}
                        </span>
                      </TableCell>
                      <TableCell className="pr-8 max-w-[200px]">
                        <p className="text-[10px] font-medium text-gray-500 line-clamp-2 leading-relaxed">
                          {event.resultadoDiagnosticoResumen || event.textoConsulta || "Sin detalle"}
                        </p>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            
            {filteredEvents.length === 0 && !loading && (
              <div className="py-20 flex flex-col items-center justify-center text-gray-300">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No se encontraron eventos coincidentes</p>
              </div>
            )}
          </div>
        </section>

        <footer className="text-center pb-8">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistema Oficial</span>
            <div className="h-4 w-[1px] bg-gray-200" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">DRTPELM 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
