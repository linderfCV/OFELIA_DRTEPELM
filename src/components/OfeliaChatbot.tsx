"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ofeliaChat } from "@/ai/flows/ofelia-chat-flow"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface OfeliaChatbotProps {
  context: 'idea' | 'active' | 'domestic' | null;
  currentStep: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OfeliaChatbot({ context, currentStep, isOpen: externalIsOpen, onOpenChange }: OfeliaChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getGreeting = () => {
    if (context === 'idea') return "¡Hola! Soy OFELIA. Veo que tienes una idea de negocio. ¿Cómo puedo orientarte hoy con SUNARP o INDECOPI?";
    if (context === 'active') return "¡Hola! Soy OFELIA. Ya tienes un negocio en marcha, ¡excelente! ¿Hablamos del REMYPE o regularización?";
    if (context === 'domestic') return "¡Hola! Soy OFELIA. Te ayudaré con la formalidad en el hogar. ¿Alguna duda sobre el T-Registro?";
    return "¡Hola! Soy OFELIA, tu asistente técnica de la DRTPE Lima. Regístrate para iniciar tu ruta de formalización.";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages = [...messages, { role: 'user', content: userMessage } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await ofeliaChat({
        message: userMessage,
        context: context || 'general',
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      setMessages([...newMessages, { role: 'model', content: response.text } as Message]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { role: 'model', content: "Lo siento, tuve un problema al conectar con mis sistemas. Por favor, intenta de nuevo en unos momentos." } as Message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[340px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-visible animate-in fade-in slide-in-from-bottom-8">
          <header className="bg-primary px-4 py-2 text-white flex justify-between items-center relative rounded-t-3xl shrink-0 min-h-[64px] overflow-visible">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="z-10">
                <h3 className="font-black text-[13px] tracking-tight leading-none uppercase">ASISTENTE OFELIA</h3>
                <p className="text-[9px] font-bold opacity-90 uppercase mt-0.5">DRTPE LIMA METROPOLITANA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 h-full">
              <div className="relative w-16 h-20 -mt-10 mr-1 select-none pointer-events-none">
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
          
          <div ref={scrollRef} className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4 rounded-b-3xl scroll-smooth">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-[11px] font-medium text-[#1A1A1A] leading-relaxed border border-gray-100">
              {getGreeting()}
            </div>
            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col gap-1 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                OFELIA está consultando fuentes .gob.pe...
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 rounded-b-3xl">
            <input 
              type="text" 
              placeholder="Escribe tu duda técnica aquí..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-[11px] focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 rounded-xl bg-primary shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
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
