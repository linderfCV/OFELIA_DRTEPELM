"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles, User, Home, Briefcase, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ofeliaChat } from "@/ai/flows/ofelia-chat-flow"
import { cn } from "@/lib/utils"
import { logOfeliaEvent } from "@/services/event-service"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: 'user' | 'model';
  content: string;
  isAction?: boolean;
}

interface UserChatData {
  idNumber: string;
  name: string;
  district: string;
  reference?: string;
  profile?: 'entrepreneur' | 'domestic';
}

interface OfeliaChatbotProps {
  context: 'idea' | 'active' | 'domestic' | null;
  currentStep: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type OnboardingStep = 'id' | 'name' | 'district' | 'ref' | 'profile' | 'ready';

export function OfeliaChatbot({ context, currentStep, isOpen: externalIsOpen, onOpenChange }: OfeliaChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState<OnboardingStep | null>(null);
  const [userData, setUserData] = React.useState<Partial<UserChatData>>({});
  
  const sessionId = React.useMemo(() => Math.random().toString(36).substring(2, 15), []);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  const getGreeting = React.useCallback(() => {
    if (context === 'idea') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Veo que tienes una idea de negocio. ¿Cómo puedo orientarte hoy con temas de <strong>SUNARP</strong>, <strong>INDECOPI</strong> o tu constitución legal?</div>";
    if (context === 'active') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Ya tienes un negocio en marcha. ¿Hablamos sobre cómo registrarte en el <strong>REMYPE</strong> o regularizar tu situación laboral?</div>";
    if (context === 'domestic') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Te ayudaré con la formalidad del hogar. ¿Tienes dudas sobre el <strong>T-Registro</strong> de SUNAT o el contrato del MTPE?</div>";
    return "<div>¡Hola! Soy <strong>OFELIA</strong>, tu asistente de la DRTPE Lima. ¿En qué tema técnico deseas enfocarte hoy?</div>";
  }, [context]);

  React.useEffect(() => {
    if (currentStep !== 'registration' && onboardingStep !== 'ready' && onboardingStep !== null) {
      setMessages([]);
      setUserData({});
      setOnboardingStep('ready');
    }
  }, [currentStep, onboardingStep]);

  React.useEffect(() => {
    if (isOpen) {
      if (currentStep === 'registration' && onboardingStep === null && messages.length === 0) {
        setOnboardingStep('id');
        setMessages([
          { role: 'model', content: "<div>¡Hola! Soy <strong>OFELIA</strong>. Para ayudarte con tu formalización, primero necesito conocerte un poco. ¿Cuál es tu número de <strong>DNI</strong> o <strong>CE</strong>?</div>" }
        ]);
      } else if (currentStep !== 'registration' && messages.length === 0) {
        setOnboardingStep('ready');
        setMessages([
          { role: 'model', content: getGreeting() }
        ]);
      }
    }
  }, [isOpen, currentStep, onboardingStep, messages.length, getGreeting]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleOnboarding = async (val: string) => {
    const currentMessages = [...messages, { role: 'user', content: val } as Message];
    setMessages(currentMessages);

    if (onboardingStep === 'id') {
      if (!/^\d+$/.test(val) || (val.length !== 8 && val.length !== 9)) {
        setMessages([...currentMessages, { role: 'model', content: "<div>Por favor, ingresa un número de <strong>DNI</strong> (8 dígitos) o <strong>CE</strong> (9 dígitos) válido.</div>" }]);
        return;
      }
      setUserData({ ...userData, idNumber: val });
      setOnboardingStep('name');
      setMessages([...currentMessages, { role: 'model', content: "<div>Perfecto. Ahora, ¿cuál es tu <strong>nombre completo</strong> o razón social?</div>" }]);
    } 
    else if (onboardingStep === 'name') {
      setUserData({ ...userData, name: val });
      setOnboardingStep('district');
      setMessages([...currentMessages, { role: 'model', content: "<div>¿En qué <strong>distrito</strong> de Lima te encuentras?</div>" }]);
    }
    else if (onboardingStep === 'district') {
      setUserData({ ...userData, district: val });
      setOnboardingStep('ref');
      setMessages([...currentMessages, { role: 'model', content: "<div>¿Alguna <strong>referencia</strong> de tu ubicación? (Si no tienes escribe 'No')</div>" }]);
    }
    else if (onboardingStep === 'ref') {
      setUserData({ ...userData, reference: val.toLowerCase() === 'no' ? undefined : val });
      setOnboardingStep('profile');
      setMessages([...currentMessages, { 
        role: 'model', 
        content: "<div>¡Gracias! Por último, selecciona tu perfil para darte respuestas exactas:</div>",
        isAction: true
      }]);
    }
  };

  const selectProfile = async (profile: 'entrepreneur' | 'domestic') => {
    const profileText = profile === 'entrepreneur' ? 'Soy emprendedor' : 'Soy empleador del hogar';
    const currentMessages = [...messages, { role: 'user', content: profileText } as Message];
    setMessages(currentMessages);
    
    const finalUserData = { ...userData, profile };
    setUserData(finalUserData);
    setOnboardingStep('ready');

    await logOfeliaEvent({
      tipoEvento: "registro_chatbot",
      sessionId,
      tipoDocumento: finalUserData.idNumber?.length === 8 ? "DNI" : "CE",
      numeroDocumento: finalUserData.idNumber,
      nombresApellidos: finalUserData.name,
      distrito: finalUserData.district,
      lugarReferencia: finalUserData.reference || "N/A",
      tipoUsuario: profile,
      usuarioRegistrado: true,
      canal: "chatbot"
    });

    setMessages([...currentMessages, { 
      role: 'model', 
      content: `<div>¡Registro completo! Bienvenido, <strong>${userData.name || 'Ciudadano'}</strong>. Ya puedes hacerme consultas técnicas. ¿En qué te ayudo hoy?</div>` 
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const val = input.trim();
    setInput("");

    if (onboardingStep !== 'ready' && onboardingStep !== null) {
      handleOnboarding(val);
      return;
    }

    const currentMessages = [...messages, { role: 'user', content: val } as Message];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const response = await ofeliaChat({
        message: val,
        context: context || (userData.profile === 'domestic' ? 'domestic' : 'general'),
        history: messages.map(m => ({ 
          role: m.role === 'model' ? 'model' : 'user', 
          content: m.content 
        }))
      });

      await logOfeliaEvent({
        tipoEvento: "consulta_chatbot",
        sessionId,
        numeroDocumento: userData.idNumber || "Anónimo",
        nombresApellidos: userData.name || "Usuario Chat",
        distrito: userData.district || "Desconocido",
        tipoUsuario: context || userData.profile || "general",
        textoConsulta: val,
        respuestaGenerada: response.text,
        fuenteUsada: response.sources?.[0] || "AI",
        canal: "chatbot"
      });

      setMessages([...currentMessages, { role: 'model', content: response.text }]);
    } catch (error) {
      setMessages([...currentMessages, { 
        role: 'model', 
        content: "<div>Tuve un problema al consultar mis manuales. Intenta de nuevo en unos momentos.</div>" 
      } as Message]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (text: string) => {
    if (text.includes('<div') || text.includes('<p') || text.includes('<ul')) {
      return <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return text;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-5">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[400px] h-[640px] bg-white rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
          >
            <header className="bg-primary px-8 py-6 text-white flex justify-between items-center relative rounded-t-[48px] shrink-0 overflow-hidden">
              <img src="/Fondo5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110" style={{ imageRendering: 'auto' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-red-600/40" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-xl">
                  <img src="/Ofelia_logo.png" alt="O" className="w-10 h-10 object-contain drop-shadow-md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl tracking-tighter uppercase italic leading-none">OFELIA</h3>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[9px] font-black opacity-80 uppercase mt-1.5 tracking-[0.2em]">Asistente Técnico IA</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2.5 hover:bg-white/20 rounded-2xl transition-all active:scale-90 z-10 border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <div ref={scrollRef} className="flex-1 p-8 bg-[#FDFDFD] overflow-y-auto space-y-8 shadow-inner">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex flex-col gap-2 max-w-[90%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-5 rounded-[32px] text-[13px] font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                      : "bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100 border-b-4 border-b-gray-200/40"
                  )}>
                    {formatContent(msg.content)}
                  </div>
                  
                  {msg.isAction && onboardingStep === 'profile' && (
                    <div className="flex flex-col gap-3 w-full mt-4 animate-in fade-in zoom-in-95">
                      <Button 
                        variant="outline" 
                        className="justify-start gap-4 h-16 rounded-2xl border-gray-100 hover:bg-blue-50 text-[#1A1A1A] hover:text-blue-700 font-black text-[12px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                        onClick={() => selectProfile('entrepreneur')}
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        Soy emprendedor
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start gap-4 h-16 rounded-2xl border-gray-100 hover:bg-emerald-50 text-[#1A1A1A] hover:text-emerald-700 font-black text-[12px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                        onClick={() => selectProfile('domestic')}
                      >
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                          <Home className="w-5 h-5" />
                        </div>
                        Soy empleador del hogar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-4 text-[10px] font-black text-primary px-4 bg-primary/5 py-3 rounded-full border border-primary/10 w-fit">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                  CONSULTANDO MANUALES TÉCNICOS...
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-gray-50 flex gap-3">
              <input 
                type="text"
                placeholder={
                  onboardingStep === 'profile' ? "Selecciona una opción" :
                  "Escribe tu duda legal aquí..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading || onboardingStep === 'profile'}
                className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/10 outline-none disabled:opacity-50 transition-all shadow-inner"
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={isLoading || !input.trim() || onboardingStep === 'profile'}
                className="h-16 w-16 rounded-[28px] bg-primary shrink-0 transition-all active:scale-90 shadow-2xl shadow-primary/30"
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative border-4 border-white p-0 overflow-visible"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-10 h-10 text-primary" />
            </motion.div>
          ) : (
            <motion.div key="logo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative w-full h-full flex items-center justify-center">
              <img 
                src="/Ofelia_logo.png" 
                alt="OFELIA" 
                className="w-16 h-16 object-contain drop-shadow-2xl transition-transform group-hover:scale-110" 
                style={{ imageRendering: 'auto' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-bounce z-10" />
        )}
      </button>
    </div>
  );
}
