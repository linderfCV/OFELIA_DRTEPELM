'use client';

import * as React from "react";
import { logOfeliaEvent } from "@/services/event-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TestFirebasePage() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = React.useState<any>(null);

  const runTest = async () => {
    setStatus('loading');
    const response = await logOfeliaEvent({
      tipoEvento: "prueba",
      mensaje: "Conexión Firestore exitosa",
      fuente: "Página de verificación"
    });

    if (response.success) {
      setStatus('success');
      setResult(response.id);
    } else {
      setStatus('error');
      setResult(response.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center bg-primary text-white rounded-t-lg">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Verificación Firebase</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-sm text-gray-600 font-medium text-center">
            Haz clic abajo para intentar crear el documento de prueba en la colección <strong>ofelia_eventos</strong>.
          </p>

          <div className="flex flex-col items-center gap-4">
            {status === 'idle' && (
              <Button onClick={runTest} className="w-full bg-primary font-bold h-12 rounded-xl">
                Ejecutar Prueba de Escritura
              </Button>
            )}

            {status === 'loading' && (
              <div className="flex flex-col items-center gap-2 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold uppercase">Conectando con Firestore...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-2 text-emerald-600 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-sm font-black uppercase">¡Conexión Exitosa!</span>
                <p className="text-[10px] text-gray-400 bg-gray-100 p-2 rounded border">Doc ID: {result}</p>
                <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4 text-xs font-bold uppercase">Probar de nuevo</Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-2 text-destructive animate-in zoom-in-95">
                <XCircle className="w-12 h-12" />
                <span className="text-sm font-black uppercase">Fallo en la conexión</span>
                <div className="text-[10px] text-red-500 bg-red-50 p-3 rounded border border-red-100 max-h-32 overflow-auto">
                  {result}
                </div>
                <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4 text-xs font-bold uppercase">Reintentar</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}