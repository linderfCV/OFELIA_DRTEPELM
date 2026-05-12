'use client';

import * as React from "react";
import { OfeliaForm } from "@/components/OfeliaForm";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { OfeliaDashboard } from "@/components/OfeliaDashboard";
import { OfeliaChatbot } from "@/components/OfeliaChatbot";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = ["/Fondo1.jfif", "/Fondo2.jpg", "/Fondo4.jpg"];

export default function Home() {
  const [step, setStep] = React.useState<'registration' | 'diagnostic' | 'dashboard'>('registration');
  const [userData, setUserData] = React.useState<any>(null);
  const [routeType, setRouteType] = React.useState<'idea' | 'active' | 'domestic' | null>(null);
  const [results, setResults] = React.useState<any>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [currentHeroIdx, setCurrentHeroIdx] = React.useState(0);

  // Lógica de carrusel automático para el Hero
  React.useEffect(() => {
    if (step === 'registration') {
      const interval = setInterval(() => {
        setCurrentHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [step]);

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

              {/* El formulario mantiene su alineación interna normal */}
              <OfeliaForm onComplete={handleRegistrationComplete} />
            </div>
          </div>

          {/* Lado Derecho: Carrusel Hero Premium */}
          <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-[#1A1A1A]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={HERO_IMAGES[currentHeroIdx]} 
                  alt="Contexto MTPE" 
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{ imageRendering: 'auto' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlays Institucionales */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
            <div className="absolute inset-0 bg-black/5" />
            
            <div className="absolute bottom-16 left-16 right-16 text-white space-y-6">
              <div className="w-20 h-1.5 bg-white rounded-full mb-8 shadow-xl" />
              <div className="space-y-2">
                <h2 className="text-5xl font-black italic tracking-tighter leading-none">Formalizar es Crecer.</h2>
                <p className="text-lg font-medium opacity-90 max-w-[380px] leading-relaxed text-blue-50">
                  Accede a beneficios exclusivos del Ministerio de Trabajo y protege el futuro de tu negocio o tu hogar.
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-lg">
                      <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-black uppercase tracking-widest">+5,000 CIUDADANOS ASESORADOS</p>
              </div>
            </div>
            
            {/* Indicadores del carrusel */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-2 z-20">
              {HERO_IMAGES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "w-1 h-8 rounded-full transition-all duration-500",
                    currentHeroIdx === idx ? "bg-white h-12" : "bg-white/30"
                  )}
                />
              ))}
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
