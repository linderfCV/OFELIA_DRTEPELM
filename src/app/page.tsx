'use client';

import * as React from "react";
import { OfeliaForm } from "@/components/OfeliaForm";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { OfeliaDashboard } from "@/components/OfeliaDashboard";
import { OfeliaChatbot } from "@/components/OfeliaChatbot";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [step, setStep] = React.useState<'registration' | 'diagnostic' | 'dashboard'>('registration');
  const [userData, setUserData] = React.useState<any>(null);
  const [routeType, setRouteType] = React.useState<'idea' | 'active' | 'domestic' | null>(null);
  const [results, setResults] = React.useState<any>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const handleRegistrationComplete = (data: any) => {
    setUserData(data);
    setStep('diagnostic');
  };

  const handleDiagnosticComplete = (type: 'idea' | 'active' | 'domestic', diagnosticResults: any) => {
    setRouteType(type);
    setResults(diagnosticResults);
    setStep('dashboard');
  };

  const handleRedoDiagnostic = () => {
    setResults(null);
    setRouteType(null);
    setStep('diagnostic');
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-body selection:bg-primary/20 overflow-x-hidden">
      {/* Layout para Registro (Split Screen Moderna) */}
      {step === 'registration' ? (
        <div className="flex min-h-screen">
          {/* Lado Izquierdo: Bienvenida y Formulario */}
          <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 bg-white">
            <div className="w-full max-w-[460px] space-y-12 animate-slide-up">
              <header className="flex flex-col items-center text-center gap-8">
                {/* Logos Superiores Centrados */}
                <div className="flex items-center justify-center gap-4">
                  <img src="/image_f1ee39.jfif" alt="MTPE" className="h-12 w-auto object-contain" />
                  <div className="h-8 w-[1px] bg-gray-200" />
                  <img src="/Ofelia_logo.png" alt="OFELIA" className="h-8 w-auto" />
                </div>
                
                {/* Título Principal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">SISTEMA OFICIAL DRTPELM</p>
                  </div>
                  <h1 className="text-8xl font-black text-[#1A1A1A] tracking-tighter leading-[0.8] drop-shadow-sm">
                    OFELIA
                  </h1>
                </div>

                {/* Texto Institucional y Bienvenida */}
                <div className="space-y-8 w-full">
                  <p className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-[0.15em] leading-relaxed opacity-90 max-w-[420px] mx-auto">
                    MODELO DE ORIENTACIÓN EN FORMALIZACIÓN EMPRESARIAL, LABORAL ITINERANTE Y ASISTIDA
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <p className="text-2xl font-black text-[#1A1A1A] tracking-tight leading-none italic bg-primary/5 py-3 px-6 rounded-2xl inline-block border border-primary/10">
                      Comienza tu ruta de crecimiento.
                    </p>
                    <p className="text-sm font-medium text-gray-400 mt-2">
                      Accede a tu panel de formalización.
                    </p>
                  </div>
                </div>
              </header>

              <OfeliaForm onComplete={handleRegistrationComplete} />
            </div>
          </div>

          {/* Lado Derecho: Composición Visual Moderna (Tipo SaaS) */}
          <div className="hidden lg:flex lg:w-[45%] relative bg-[#F9FAFB] items-center justify-center overflow-hidden border-l border-gray-100">
            {/* Fondo con textura sutil */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#D91E18 1px, transparent 1px)', size: '24px 24px' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

            {/* Composición de imágenes con profundidad - Centrada verticalmente */}
            <div className="relative w-full max-w-lg h-[700px] flex flex-col items-center justify-center">
              
              <div className="relative w-full h-[450px] flex items-center justify-center">
                {/* Imagen Principal (Fondo 2) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute z-10 w-[85%] h-[380px] rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] border-[12px] border-white"
                >
                  <img src="/Fondo2.jpg" alt="Institucional" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay" />
                </motion.div>

                {/* Imagen Secundaria Circular (Fondo 1) - Posición equilibrada */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: -60, y: -40 }}
                  animate={{ opacity: 1, scale: 1, x: -60, y: -40 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute z-20 left-0 top-1/4 w-52 h-52 rounded-full overflow-hidden border-[10px] border-white shadow-2xl"
                >
                  <img src="/Fondo1.jfif" alt="Human" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
                </motion.div>

                {/* Elemento de Apoyo Rectangular (Fondo 4) - Posicionado intencionalmente para ser visible */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 220, y: -110 }}
                  animate={{ opacity: 1, scale: 1, x: 220, y: -110 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute z-0 w-48 h-64 rounded-[40px] overflow-hidden border-[8px] border-white shadow-xl opacity-90"
                >
                  <img src="/Fondo4.jpg" alt="Support" className="w-full h-full object-cover grayscale-[0.1]" style={{ imageRendering: 'auto' }} />
                </motion.div>

                {/* Decoración: Badge flotante de éxito - Reubicado para balance */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute z-30 bottom-10 right-4 bg-white p-5 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ruta Técnica</p>
                    <p className="text-xs font-black text-[#1A1A1A] uppercase">Ciudadano Formalizado</p>
                  </div>
                </motion.div>
              </div>

              {/* Branding y Texto Inferior - Llenando el espacio inferior */}
              <div className="w-full px-16 mt-12 space-y-10">
                <div className="space-y-4">
                  <div className="w-20 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <h2 className="text-6xl font-black italic tracking-tighter leading-none text-[#1A1A1A] drop-shadow-sm">
                    Formalizar es <span className="text-primary">Crecer.</span>
                  </h2>
                  <p className="text-xl font-bold text-gray-400 max-w-[420px] leading-relaxed">
                    Protege tu futuro y el de tu negocio con la asesoría estratégica de la DRTPELM.
                  </p>
                </div>
                
                {/* Sección Institucional Refinada */}
                <div className="pt-8 border-t border-gray-200/60 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                      Plataforma basada en normativa oficial
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {['SUNAT', 'MTPE', 'SUNARP', 'INDECOPI'].map((entity, idx) => (
                      <React.Fragment key={entity}>
                        <span className="text-xs font-black text-[#1A1A1A] tracking-[0.2em]">{entity}</span>
                        {idx < 3 && <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Layout para Diagnóstico y Dashboard */
        <div className="flex flex-col items-center w-full min-h-screen bg-[#F9FAFB]">
          <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
              <img src="/image_f1ee39.jfif" alt="MTPE" className="h-8 w-auto" />
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-primary font-black text-xl leading-none">OFELIA</span>
                <span className="text-[9px] font-black uppercase text-gray-400">Lima Metropolitana</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={() => window.open('https://extranet.trabajo.gob.pe/extranet/web/citas', '_blank')} className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                Portal Oficial
              </button>
              <button onClick={() => window.location.reload()} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 text-gray-400 hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </header>

          <main className="w-full max-w-[520px] px-6 py-12 animate-slide-up">
            {step === 'diagnostic' && (
              <DiagnosticFlow onComplete={handleDiagnosticComplete} userData={userData} />
            )}

            {step === 'dashboard' && routeType && (
              <OfeliaDashboard 
                routeType={routeType} 
                results={results} 
                onOpenChat={openChat}
                onRedoDiagnostic={handleRedoDiagnostic}
              />
            )}
          </main>
        </div>
      )}

      <OfeliaChatbot 
        context={routeType} 
        currentStep={step} 
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
}
