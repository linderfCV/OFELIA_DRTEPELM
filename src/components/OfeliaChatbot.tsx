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
  docType?: string;
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
    if (context === 'idea') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Veo que tienes una idea de negocio. ¿Cómo puedo orientarte hoy con temas de <strong>SUNARP</strong> o <strong>INDECOPI</strong>?</div>";
    if (context === 'active') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Ya tienes un negocio en marcha. ¿Hablamos sobre el <strong>REMYPE</strong> o regularización laboral?</div>";
    if (context === 'domestic') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Te ayudaré con la formalidad del hogar. ¿Dudas sobre el <strong>T-Registro</strong> o el contrato?</div>";
    return "<div>¡Hola! Soy <strong>OFELIA</strong>, tu asistente de la DRTPE Lima. ¿En qué tema técnico deseas enfocarte hoy?</div>";
  }, [context]);

  React.useEffect(() => {
    if (isOpen) {
      const savedSession = sessionStorage.getItem('ofelia_user_session');
      if (savedSession) {
        const data = JSON.parse(savedSession);
        setUserData({
          idNumber: data.docNumber,
          name: data.fullName,
          district: data.distrito || "Desconocido",
          reference: data.referencia,
          profile: data.tipoUsuario || (context === 'domestic' ? 'domestic' : 'entrepreneur'),
          docType: data.docType
        });
        setOnboardingStep('ready');
        
        if (messages.length === 0) {
          setMessages([{ role: 'model', content: getGreeting() }]);
        }
      } else if (onboardingStep === null && messages.length === 0) {
        setOnboardingStep('id');
        setMessages([
          { role: 'model', content: "<div>¡Hola! Soy <strong>OFELIA</strong>. Para ayudarte con tu formalización, primero necesito conocerte un poco. ¿Cuál es tu número de <strong>DNI</strong> o <strong>CE</strong>?</div>" }
        ]);
      }
    }
  }, [isOpen, onboardingStep, messages.length, getGreeting, context]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleOnboarding = async (val: string) => {
    const currentMessages = [...messages, { role: 'user', content: val } as Message];
    setMessages(currentMessages);

    if (onboardingStep === 'id') {
      if (!/^\d+$/.test(val) || (val.length < 8 || val.length > 11)) {
        setMessages([...currentMessages, { role: 'model', content: "<div>Por favor, ingresa un número de documento válido (DNI/CE/RUC).</div>" }]);
        return;
      }
      setUserData({ ...userData, idNumber: val, docType: val.length === 11 ? "RUC" : (val.length === 8 ? "DNI" : "CE") });
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
      setMessages([...currentMessages, { role: 'model', content: "<div>¿Alguna <strong>referencia</strong> de tu ubicación? (Escribe 'No' si no tienes)</div>" }]);
    }
    else if (onboardingStep === 'ref') {
      setUserData({ ...userData, reference: val.toLowerCase() === 'no' ? undefined : val });
      setOnboardingStep('profile');
      setMessages([...currentMessages, { 
        role: 'model', 
        content: "<div>¡Gracias! Por último, selecciona tu perfil:</div>",
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
      tipoDocumento: finalUserData.docType,
      numeroDocumento: finalUserData.idNumber,
      nombresApellidos: finalUserData.name,
      distrito: finalUserData.district,
      tipoUsuario: profile,
      usuarioRegistrado: true,
      canal: "chatbot"
    });

    setMessages([...currentMessages, { 
      role: 'model', 
      content: `<div>¡Bienvenido, <strong>${userData.name || 'Ciudadano'}</strong>! Ya puedes hacerme consultas técnicas. ¿En qué te ayudo?</div>` 
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
        canal: "chatbot",
        usuarioRegistrado: !!userData.idNumber
      });

      setMessages([...currentMessages, { role: 'model', content: response.text }]);
    } catch (error) {
      setMessages([...currentMessages, { 
        role: 'model', 
        content: "<div>Tuve un problema al consultar mis manuales. Reintenta.</div>" 
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
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-[92vw] sm:w-[400px] h-[580px] bg-white rounded-[40px] shadow-[0_24px_64px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col overflow-hidden"
          >
            <header className="bg-primary px-8 py-5 text-white flex justify-between items-center relative shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-red-600/40" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                  <img src="/Ofelia_logo.png" alt="O" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tighter uppercase italic leading-none">OFELIA</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[8px] font-black opacity-80 uppercase mt-1 tracking-widest leading-none">Asistente Oficial DRTPELM</p>
                </div>
              </div>
              
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all z-10 border border-white/10 active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <div ref={scrollRef} className="flex-1 p-6 bg-[#FDFDFD] overflow-y-auto space-y-6 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("flex flex-col gap-2 max-w-[88%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}
                >
                  <div className={cn(
                    "p-4 rounded-[24px] text-[13px] font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100"
                  )}>
                    {formatContent(msg.content)}
                  </div>
                  
                  {msg.isAction && onboardingStep === 'profile' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2 w-full mt-2"
                    >
                      <Button variant="outline" className="justify-start h-12 rounded-2xl border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary/40 active:scale-[0.98] transition-all" onClick={() => selectProfile('entrepreneur')}>
                        <Briefcase className="w-3.5 h-3.5 mr-3 text-primary" /> Soy emprendedor
                      </Button>
                      <Button variant="outline" className="justify-start h-12 rounded-2xl border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary/40 active:scale-[0.98] transition-all" onClick={() => selectProfile('domestic')}>
                        <Home className="w-3.5 h-3.5 mr-3 text-primary" /> Soy empleador hogar
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-3 text-[8px] font-black text-primary px-4 bg-primary/5 py-2.5 rounded-full border border-primary/10 w-fit animate-pulse">
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                  CONSULTANDO MANUALES...
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input 
                type="text"
                placeholder="Escribe tu consulta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading || onboardingStep === 'profile'}
                className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none disabled:opacity-50 transition-all"
              />
              <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim() || onboardingStep === 'profile'} className="h-12 w-12 rounded-2xl bg-primary shrink-0 transition-all active:scale-90 shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border-4 border-white relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </motion.div>
          ) : (
            <motion.div key="logo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <img src="/Ofelia_logo.png" alt="OFELIA" className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-xl" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-bounce" />}
      </button>
    </div>
  );
}
