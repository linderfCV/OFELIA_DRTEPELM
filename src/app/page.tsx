'use client';

import * as React from "react";
import { OfeliaForm } from "@/components/OfeliaForm";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { OfeliaDashboard } from "@/components/OfeliaDashboard";
import { OfeliaChatbot } from "@/components/OfeliaChatbot";
import { cn } from "@/lib/utils";

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
    <div className={cn(
      "min-h-screen flex flex-col items-center transition-all duration-700",
      step === 'registration' 
        ? "bg-[url('/fondo3.png')] bg-cover bg-center bg-no-repeat bg-fixed" 
        : "bg-[#FDFDFD]"
    )}>
      {/* Header Institucional Superior */}
      {step !== 'registration' && (
        <header className="w-full bg-white border-b border-gray-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <img src="/image_f1ee39.jfif" alt="Logo MTPE" className="h-8 w-auto" />
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <div className="flex flex-col">
              <span className="text-primary font-black text-lg leading-none">OFELIA</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter text-muted-foreground">DRTPELM LIMA METROPOLITANA</span>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </header>
      )}

      <div className="w-full max-w-[440px] px-4 pt-6 pb-20">
        {step === 'registration' && (
          <div className="flex flex-col gap-6">
            <header className="flex flex-col items-center text-center">
              <img 
                src="/image_f1ee39.jfif" 
                alt="Logo MTPE" 
                style={{ width: '280px', height: 'auto', display: 'block', margin: '0 auto 1rem auto' }} 
              />
              <div className="space-y-1 bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#1A1A1A]">
                  Dirección Regional de Trabajo y Promoción del Empleo de Lima Metropolitana
                </h2>
                <h1 className="text-5xl font-black text-primary tracking-tighter pt-2">
                  OFELIA
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] max-w-[300px] mx-auto leading-tight">
                  Oficina de Formalización Empresarial, Laboral Itinerante y Asistida
                </p>
              </div>
              <p className="text-sm text-foreground/80 font-bold mt-4 max-w-[280px] drop-shadow-sm">
                Comienza tu ruta de crecimiento. Accede a tu panel de formalización.
              </p>
            </header>
            <OfeliaForm onComplete={handleRegistrationComplete} />
          </div>
        )}

        {step === 'diagnostic' && (
          <DiagnosticFlow onComplete={handleDiagnosticComplete} />
        )}

        {step === 'dashboard' && routeType && (
          <OfeliaDashboard 
            routeType={routeType} 
            results={results} 
            onOpenChat={openChat}
            onRedoDiagnostic={handleRedoDiagnostic}
          />
        )}
      </div>

      {/* Footer solo en registro */}
      {step === 'registration' && (
        <footer className="mt-auto py-8 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
            Iniciativa de la <span className="text-foreground font-extrabold">DRTPELM</span> · Innova Región 2026
          </p>
        </footer>
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
