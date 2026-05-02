"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OfeliaChatbotProps {
  context: 'idea' | 'active' | null;
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
      return "¡Hola! Soy OFELIA, tu asistente de formalización. ¡Qué chévere que quieras iniciar tu ruta de formalización con esa idea de negocio! ¿Te ayudo con los trámites en SUNARP o a proteger tu marca en INDECOPI?";
    }
    if (context === 'active') {
      return "¡Hola! Soy OFELIA. ¡Qué bueno que estés dando el paso para formalizar tu negocio! Estoy aquí para ayudarte con el REMYPE o tus dudas municipales. ¡Vamos con todo!";
    }
    return "¡Hola! Soy OFELIA, tu asistente de formalización. ¡Qué chévere que estés por aquí! Regístrate rapidito para darte una asesoría personalizada y empezar tu ruta al éxito.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[320px] h-[450px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <header className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tighter">ASISTENTE OFELIA</h3>
                <p className="text-[8px] font-bold opacity-80 uppercase">En línea ahora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </header>
          
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs font-medium text-[#1A1A1A] leading-relaxed">
              {getGreeting()}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
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
        className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
}
