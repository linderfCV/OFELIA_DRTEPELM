import { OfeliaForm } from "@/components/OfeliaForm"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FDFDFD] p-4 md:pt-12">
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <header className="flex flex-col items-center text-center">
          <img 
            src="/image_f1ee39.jfif" 
            alt="Logo MTPE" 
            style={{ width: '280px', height: 'auto', display: 'block', margin: '0 auto 1rem auto' }} 
          />
          
          <div className="space-y-1">
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
          <p className="text-sm text-muted-foreground font-medium mt-4 max-w-[280px]">
            Comienza tu ruta de crecimiento. Accede a tu panel de formalización.
          </p>
        </header>

        <main className="w-full">
          <OfeliaForm />
        </main>

        <footer className="mt-8 mb-12 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Iniciativa de la <span className="text-foreground font-extrabold">DRTPELM</span> · Innova Región 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
