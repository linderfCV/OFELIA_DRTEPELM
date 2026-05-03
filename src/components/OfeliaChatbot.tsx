
"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OfeliaChatbotProps {
  context: 'idea' | 'active' | 'domestic' | null;
  currentStep: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OfeliaChatbot({ context, currentStep, isOpen: externalIsOpen, onOpenChange }: OfeliaChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  const getGreeting = () => {
    if (context === 'idea') {
      return "¡Hola! Soy OFELIA. ¡Qué chévere que quieras iniciar tu ruta con esa idea de negocio! ¿Te ayudo con SUNARP o INDECOPI?";
    }
    if (context === 'active') {
      return "¡Hola! Soy OFELIA. ¡Qué bueno que estés formalizando tu negocio! Estoy aquí para ayudarte con el REMYPE o dudas municipales.";
    }
    if (context === 'domestic') {
      return "¡Hola! Soy OFELIA. Te ayudaré a formalizar la relación laboral en tu hogar. ¿Tienes dudas sobre el T-Registro o el contrato del MTPE?";
    }
    return "¡Hola! Soy OFELIA, tu asistente de formalización. ¡Qué chévere que estés aquí! Regístrate para empezar tu ruta al éxito.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[320px] h-[450px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-visible animate-in fade-in slide-in-from-bottom-8">
          <header className="bg-primary px-4 py-2 text-white flex justify-between items-center relative rounded-t-3xl shrink-0 min-h-[64px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="z-10">
                <h3 className="font-black text-[15px] tracking-tight leading-none uppercase">ASISTENTE OFELIA</h3>
                <p className="text-[10px] font-bold opacity-90 uppercase mt-0.5">En línea ahora</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 h-full">
              <div className="relative w-20 h-20 -mt-8 mr-1 select-none">
                <img 
                  src="/Ofelia_logo.png" 
                  alt="Asistente OFELIA" 
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>
          
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4 rounded-b-3xl">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs font-medium text-[#1A1A1A] leading-relaxed">
              {getGreeting()}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 rounded-b-3xl">
            <input 
              type="text" 
              placeholder="Escribe tu duda aquí..." 
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
            <Button size="icon" className="h-8 w-8 rounded-xl bg-primary">
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white rounded-full shadow-2xl shadow-primary/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative border-2 border-primary/10 overflow-hidden p-0"
      >
        {isOpen ? (
          <X className="w-8 h-8 text-primary" />
        ) : (
          <div className="w-full h-full relative">
            <img 
              src="/Ofelia_logo.png" 
              alt="Asistente OFELIA" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith('.png')) {
                  target.src = target.src.replace('.png', '.jpg');
                }
              }}
            />
          </div>
        )}
        {!isOpen && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white z-10" />
        )}
      </button>
    </div>
  );
}
