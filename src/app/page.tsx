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
    <div className="min-h-screen flex flex-col items-center transition-all duration-700 w-full relative bg-[#FDFDFD]">
      {/* Header Institucional Superior */}
      {step !== 'registration' ? (
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
      ) : (
        <div className="w-full flex justify-center pt-8 pb-2 z-20">
          <img 
            src="/image_f1ee39.jfif" 
            alt="Logo MTPE" 
            className="h-16 w-auto object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-[440px] px-4 pt-2 pb-20 relative z-10">
        {step === 'registration' && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <header className="flex flex-col items-center text-center">
              <div className="w-full bg-white px-6 py-8 rounded-[40px] border border-gray-100 shadow-xl mb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#1A1A1A] leading-tight mb-4">
                  DIRECCIÓN REGIONAL DE TRABAJO Y PROMOCIÓN DEL EMPLEO DE LIMA METROPOLITANA
                </h2>
                <h1 className="text-6xl font-black text-primary tracking-tighter mb-4 leading-none">
                  OFELIA
                </h1>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A] max-w-[320px] mx-auto leading-tight opacity-90">
                  Oficina de Formalización Empresarial, Laboral Itinerante y Asistida
                </p>
              </div>
              
              <div className="space-y-1 py-2">
                <p className="text-[15px] text-[#1A1A1A] font-bold">
                  Comienza tu ruta de crecimiento.
                </p>
                <p className="text-[15px] text-[#1A1A1A] font-bold">
                  Accede a tu panel de formalización.
                </p>
              </div>
            </header>
            
            <div className="mt-4">
              <OfeliaForm onComplete={handleRegistrationComplete} />
            </div>
          </div>
        )}

        {step === 'diagnostic' && (
          <div className="pt-6">
            <DiagnosticFlow onComplete={handleDiagnosticComplete} />
          </div>
        )}

        {step === 'dashboard' && routeType && (
          <div className="pt-6">
            <OfeliaDashboard 
              routeType={routeType} 
              results={results} 
              onOpenChat={openChat}
              onRedoDiagnostic={handleRedoDiagnostic}
            />
          </div>
        )}
      </div>

      {/* Footer solo en registro */}
      {step === 'registration' && (
        <footer className="mt-auto py-8 text-center relative z-10 w-full">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-gray-100 px-6 py-2.5 rounded-full border border-gray-200 inline-block">
            Iniciativa de la <span className="text-primary font-black underline underline-offset-2">DRTPELM</span> · Innova Región 2026
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
