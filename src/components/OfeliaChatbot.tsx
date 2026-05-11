"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles, Loader2, User, Home, Briefcase, ShieldCheck } from "lucide-react"
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
          { role: 'model', content: "<div>¡Hola! Soy <strong>OFELIA</strong>. Para ayudarte con tu formalización, primero necesito conocerte un poco. ¿Cuál es tu número de <strong>DNI</strong> (8 dígitos) o <strong>CE</strong> (9 dígitos)?</div>" }
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
      if (!/^\d+$/.test(val)) {
        setMessages([...currentMessages, { role: 'model', content: "<div>El documento debe contener <strong>solo números</strong>. Por favor, intenta de nuevo.</div>" }]);
        return;
      }
      if (val.length !== 8 && val.length !== 9) {
        setMessages([...currentMessages, { role: 'model', content: "<div>El <strong>DNI</strong> debe tener 8 dígitos y el <strong>CE</strong> debe tener 9 dígitos. Por favor, verifica e intenta de nuevo.</div>" }]);
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
      setMessages([...currentMessages, { role: 'model', content: "<div>¿Tienes alguna <strong>referencia</strong> de ubicación? (Opcional, si no tienes escribe 'No')</div>" }]);
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
    const profileText = profile === 'entrepreneur' ? 'Soy emprendedor' : 'Soy empleador de trabajadoras del hogar';
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
      content: `<div>¡Registro completo! Bienvenido, <strong>${userData.name || 'Ciudadano'}</strong>. Ahora puedes realizar cualquier consulta técnica sobre formalización laboral o empresarial. ¿En qué te ayudo?</div>` 
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
        tipoDocumento: userData.idNumber ? (userData.idNumber.length === 8 ? "DNI" : "CE") : "N/A",
        numeroDocumento: userData.idNumber || "Anónimo",
        nombresApellidos: userData.name || "Usuario Chat",
        distrito: userData.district || "Desconocido",
        tipoUsuario: context || userData.profile || "general",
        textoConsulta: val,
        respuestaGenerada: response.text,
        fuenteUsada: response.sources?.[0] || "AI/Web",
        usuarioRegistrado: onboardingStep === 'ready',
        canal: "chatbot"
      });

      setMessages([...currentMessages, { role: 'model', content: response.text }]);
    } catch (error) {
      setMessages([...currentMessages, { 
        role: 'model', 
        content: "<div>Lo siento, tuve un problema al conectar con mis sistemas oficiales. Por favor, intenta de nuevo.</div>" 
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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-[40px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <header className="bg-primary px-6 py-5 text-white flex justify-between items-center relative rounded-t-[40px] shrink-0 overflow-hidden">
            {/* Imagen de fondo sutil para el header */}
            <img src="/Fondo5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <img src="/Ofelia_logo.png" alt="O" className="w-8 h-8 object-contain" />
              </div>
              <div className="pr-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-[16px] tracking-tight leading-none uppercase">OFELIA</h3>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[8px] font-black opacity-80 uppercase mt-1 tracking-[0.1em]">Asistente IA · DRTPELM</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/20 rounded-2xl transition-all active:scale-90 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
          
          <div ref={scrollRef} className="flex-1 p-6 bg-[#F9FAFB] overflow-y-auto space-y-6 scroll-smooth shadow-inner">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col gap-1.5 max-w-[92%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "p-4 rounded-[24px] text-[13px] font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100 border-b-2 border-b-gray-200/50"
                )}>
                  {formatContent(msg.content)}
                </div>
                
                {msg.isAction && onboardingStep === 'profile' && (
                  <div className="flex flex-col gap-2 w-full mt-3 animate-in fade-in zoom-in-95">
                    <Button 
                      variant="outline" 
                      className="justify-start gap-3 h-14 rounded-2xl border-blue-100 hover:bg-blue-50 text-blue-700 font-black text-[11px] uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
                      onClick={() => selectProfile('entrepreneur')}
                    >
                      <Briefcase className="w-4 h-4" />
                      Soy emprendedor
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start gap-3 h-14 rounded-2xl border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-black text-[11px] uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
                      onClick={() => selectProfile('domestic')}
                    >
                      <Home className="w-4 h-4" />
                      Soy empleador del hogar
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-[10px] font-black text-primary px-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
                OFELIA consultando manuales técnicos...
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              inputMode={onboardingStep === 'id' ? "numeric" : "text"}
              placeholder={
                onboardingStep === 'id' ? "Ingresa solo números..." : 
                onboardingStep === 'profile' ? "Selecciona una opción" :
                "Escribe tu consulta aquí..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || onboardingStep === 'profile'}
              className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || onboardingStep === 'profile'}
              className="h-14 w-14 rounded-2xl bg-primary shrink-0 transition-all active:scale-90 shadow-xl shadow-primary/30"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative border-4 border-white p-0 overflow-visible"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-10 h-10 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img 
                src="/Ofelia_logo.png" 
                alt="OFELIA" 
                className="w-14 h-14 object-contain drop-shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute top-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-bounce z-10 flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
}