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
      {/* Layout para Registro (Split Screen) */}
      {step === 'registration' ? (
        <div className="flex min-h-screen">
          {/* Lado Izquierdo: Formulario */}
          <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 bg-white">
            <div className="w-full max-w-[440px] space-y-8 animate-slide-up">
              <header className="flex flex-col items-start gap-4">
                <img src="/image_f1ee39.jfif" alt="MTPE" className="h-14 w-auto object-contain" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">SISTEMA OFICIAL DRTPELM</p>
                  </div>
                  <h1 className="text-7xl font-black text-[#1A1A1A] tracking-tighter leading-[0.85]">
                    OFELIA
                  </h1>
                </div>
                <p className="text-[13px] font-bold text-gray-500 max-w-[340px] leading-relaxed">
                  Oficina de Formalización Empresarial, Laboral Itinerante y Asistida. Tu ruta al crecimiento formal en Lima.
                </p>
              </header>

              <OfeliaForm onComplete={handleRegistrationComplete} />

              <footer className="pt-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <img src="/Ofelia_logo.png" alt="OFELIA" className="w-4 h-4 grayscale opacity-50" />
                  Iniciativa de la DRTPELM · Innova Región 2026
                </p>
              </footer>
            </div>
          </div>

          {/* Lado Derecho: Imagen Institucional */}
          <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
            <img 
              src="/Fondo4.jpg" 
              alt="Contexto MTPE" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlays decorativos */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            
            <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
              <div className="w-16 h-1 bg-white rounded-full" />
              <h2 className="text-4xl font-black italic tracking-tight leading-none">Formalizar es Crecer.</h2>
              <p className="text-sm font-medium opacity-90 max-w-[360px] leading-relaxed">
                Accede a beneficios exclusivos del Ministerio de Trabajo y protege el futuro de tu negocio o tu hogar.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Layout para Diagnóstico y Dashboard (Centrado) */
        <div className="flex flex-col items-center w-full min-h-screen bg-[#F9FAFB]">
          <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
              <img src="/image_f1ee39.jfif" alt="MTPE" className="h-8 w-auto" />
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-primary font-black text-xl leading-none">OFELIA</span>
                <span className="text-[9px] font-black uppercase text-gray-400">Lima Metropolitana</span>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </header>

          <main className="w-full max-w-[480px] px-6 py-10 animate-slide-up">
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
