import Image from "next/image"
import { RegistrationForm } from "@/components/registration-form"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Home() {
  const logo = PlaceHolderImages.find(img => img.id === "mtpe-logo")

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FDFDFD] p-4 md:pt-12">
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-56 h-20">
            <Image
              src={logo?.imageUrl || "https://picsum.photos/seed/mtpe/300/100"}
              alt="MTPE Perú"
              fill
              className="object-contain"
              priority
              data-ai-hint="government logo"
            />
          </div>
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
          <p className="text-sm text-muted-foreground font-medium mt-2 max-w-[280px]">
            Comienza tu ruta de crecimiento. Accede a tu panel de formalización.
          </p>
        </header>

        <main className="w-full">
          <RegistrationForm />
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
