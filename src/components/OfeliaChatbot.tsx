
"use client"

import * as React from "react"
import { MessageCircle, X, Send, Sparkles, Loader2, User, Home, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ofeliaChat } from "@/ai/flows/ofelia-chat-flow"
import { cn } from "@/lib/utils"

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
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  // Iniciar onboarding si se abre en la pantalla de registro
  React.useEffect(() => {
    if (isOpen && currentStep === 'registration' && onboardingStep === null && messages.length === 0) {
      setOnboardingStep('id');
      setMessages([
        { role: 'model', content: "<div>¡Hola! Soy <strong>OFELIA</strong>. Para ayudarte con tu formalización, primero necesito conocerte un poco. ¿Cuál es tu número de <strong>DNI o CE</strong>? (Solo números)</div>" }
      ]);
    } else if (isOpen && currentStep !== 'registration' && messages.length === 0) {
      setOnboardingStep('ready');
      setMessages([
        { role: 'model', content: getGreeting() }
      ]);
    }
  }, [isOpen, currentStep]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getGreeting = () => {
    if (context === 'idea') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Veo que tienes una idea de negocio. ¿Cómo puedo orientarte hoy con temas de <strong>SUNARP</strong>, <strong>INDECOPI</strong> o tu constitución legal?</div>";
    if (context === 'active') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Ya tienes un negocio en marcha. ¿Hablamos sobre cómo registrarte en el <strong>REMYPE</strong> o regularizar tu situación laboral?</div>";
    if (context === 'domestic') return "<div>¡Hola! Soy <strong>OFELIA</strong>. Te ayudaré con la formalidad del hogar. ¿Tienes dudas sobre el <strong>T-Registro</strong> de SUNAT o el contrato del MTPE?</div>";
    return "<div>¡Hola! Soy <strong>OFELIA</strong>, tu asistente de la DRTPE Lima. ¿En qué tema técnico deseas enfocarte hoy?</div>";
  };

  const handleOnboarding = async (val: string) => {
    const currentMessages = [...messages, { role: 'user', content: val } as Message];
    setMessages(currentMessages);

    if (onboardingStep === 'id') {
      if (!/^\d+$/.test(val)) {
        setMessages([...currentMessages, { role: 'model', content: "<div>El número de documento debe contener <strong>solo números</strong>. Por favor, intenta de nuevo.</div>" }]);
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

  const selectProfile = (profile: 'entrepreneur' | 'domestic') => {
    const profileText = profile === 'entrepreneur' ? 'Soy emprendedor' : 'Soy empleador de trabajadoras del hogar';
    const currentMessages = [...messages, { role: 'user', content: profileText } as Message];
    setMessages(currentMessages);
    
    setUserData({ ...userData, profile });
    setOnboardingStep('ready');
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

      setMessages([...currentMessages, { role: 'model', content: response.text } as Message]);
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
        <div className="w-[360px] h-[540px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-visible animate-in fade-in slide-in-from-bottom-8">
          <header className="bg-primary px-5 py-3 text-white flex justify-between items-center relative rounded-t-[32px] shrink-0 min-h-[72px] overflow-visible">
            <div className="flex items-center gap-2 relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="z-10 pr-2">
                <h3 className="font-black text-[14px] tracking-tight leading-none uppercase">OFELIA</h3>
                <p className="text-[9px] font-black opacity-90 uppercase mt-1 tracking-tighter">DRTPE LIMA METROPOLITANA</p>
              </div>
              
              <div className="relative w-24 h-24 select-none pointer-events-none drop-shadow-xl z-20 -mt-10 -ml-2">
                <img 
                  src="/Ofelia_logo.png" 
                  alt="Asistente OFELIA" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
          
          <div ref={scrollRef} className="flex-1 p-5 bg-[#F9FAFB] overflow-y-auto space-y-5 rounded-b-[32px] scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col gap-1 max-w-[90%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl text-[12.5px] font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100"
                )}>
                  {formatContent(msg.content)}
                </div>
                
                {msg.isAction && onboardingStep === 'profile' && (
                  <div className="flex flex-col gap-2 w-full mt-2 animate-in fade-in zoom-in-95">
                    <Button 
                      variant="outline" 
                      className="justify-start gap-3 h-12 rounded-xl border-blue-100 hover:bg-blue-50 text-blue-700 font-bold text-xs"
                      onClick={() => selectProfile('entrepreneur')}
                    >
                      <Briefcase className="w-4 h-4" />
                      Soy emprendedor
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start gap-3 h-12 rounded-xl border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold text-xs"
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
              <div className="flex items-center gap-2 text-[10px] font-black text-primary animate-pulse px-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                OFELIA está consultando fuentes oficiales...
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 rounded-b-[32px]">
            <input 
              type={onboardingStep === 'id' ? "text" : "text"}
              inputMode={onboardingStep === 'id' ? "numeric" : "text"}
              placeholder={
                onboardingStep === 'id' ? "Ingresa solo números..." : 
                onboardingStep === 'profile' ? "Selecciona una opción arriba" :
                "Escribe aquí..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || onboardingStep === 'profile'}
              className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 text-[12.5px] font-medium focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || onboardingStep === 'profile'}
              className="h-11 w-11 rounded-2xl bg-primary shrink-0 transition-transform active:scale-90 shadow-md shadow-primary/20"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-18 h-18 bg-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative border-4 border-white overflow-visible p-0"
        style={{ width: '72px', height: '72px' }}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-primary" />
        ) : (
          <div className="w-full h-full relative">
            <img 
              src="/Ofelia_logo.png" 
              alt="Asistente OFELIA" 
              className="w-full h-full object-contain scale-125 -translate-y-1"
            />
          </div>
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white z-10" />
        )}
      </button>
    </div>
  );
}
