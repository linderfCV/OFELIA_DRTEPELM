import Image from "next/image"
import { RegistrationForm } from "@/components/registration-form"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Home() {
  const logo = PlaceHolderImages.find(img => img.id === "mtpe-logo")

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:justify-center">
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        <header className="flex flex-col items-center gap-4 pt-8">
          <div className="relative w-48 h-16">
            <Image
              src={logo?.imageUrl || "https://picsum.photos/seed/mtpe/300/100"}
              alt="MTPE Perú"
              fill
              className="object-contain"
              data-ai-hint="government logo"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-primary tracking-tight">
              OFELIA
            </h1>
            <p className="text-[#1A1A1A] font-medium mt-2">
              Accede a tu panel de formalización
            </p>
          </div>
        </header>

        <main className="flex-1">
          <RegistrationForm />
        </main>

        <footer className="py-8 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Iniciativa de la DRTPE - Innova Región 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
