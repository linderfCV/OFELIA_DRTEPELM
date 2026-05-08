'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from "@/lib/utils";

// Diccionario exhaustivo de coordenadas para Lima Metropolitana
// Basado en los nombres exactos usados en DiagnosticFlow.tsx
const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Ancón": [-11.7733, -77.1758],
  "Ate": [-12.0464, -76.9000],
  "Barranco": [-12.1492, -77.0211],
  "Breña": [-12.0583, -77.0458],
  "Carabayllo": [-11.8903, -77.0269],
  "Chaclacayo": [-11.9708, -76.7694],
  "Chorrillos": [-12.1724, -77.0247],
  "Cieneguilla": [-12.1000, -76.7667],
  "Comas": [-11.9572, -77.0496],
  "El Agustino": [-12.0453, -77.0036],
  "Independencia": [-11.9922, -77.0536],
  "Jesús María": [-12.0764, -77.0486],
  "La Molina": [-12.0875, -76.9286],
  "La Victoria": [-12.0653, -77.0286],
  "Lince": [-12.0833, -77.0333],
  "Los Olivos": [-11.9914, -77.0708],
  "Lurigancho-Chosica": [-11.9383, -76.7094],
  "Lurín": [-12.2750, -76.8694],
  "Magdalena del Mar": [-12.0911, -77.0694],
  "Miraflores": [-12.1211, -77.0297],
  "Pachacámac": [-12.1286, -76.8589],
  "Pucusana": [-12.4831, -76.7972],
  "Pueblo Libre": [-12.0736, -77.0658],
  "Puente Piedra": [-11.8667, -77.0769],
  "Punta Hermosa": [-12.3333, -76.8333],
  "Punta Negra": [-12.3667, -76.8000],
  "Rímac": [-12.0292, -77.0286],
  "San Bartolo": [-12.3833, -76.7833],
  "San Borja": [-12.1069, -76.9992],
  "San Isidro": [-12.0977, -77.0365],
  "San Juan de Lurigancho": [-11.9828, -77.0086],
  "San Juan de Miraflores": [-12.1625, -76.9639],
  "San Luis": [-12.0750, -76.9944],
  "San Martín de Porres": [-12.0300, -77.0833],
  "San Miguel": [-12.0914, -77.0944],
  "Santa Anita": [-12.0428, -76.9667],
  "Santa María del Mar": [-12.4069, -76.7761],
  "Santa Rosa": [-11.8081, -77.1611],
  "Santiago de Surco": [-12.1450, -76.9911],
  "Surquillo": [-12.1153, -77.0211],
  "Villa El Salvador": [-12.2133, -76.9369],
  "Villa María del Triunfo": [-12.1625, -76.9436],
  "Cercado de Lima": [-12.0464, -77.0428]
};

interface DistrictStats {
  name: string;
  total: number;
  diagnostics: number;
  queries: number;
  entrepreneurs: number;
  domestic: number;
  topThemes: string[];
}

interface RealLimaMapProps {
  events: any[];
}

export default function RealLimaMap({ events }: RealLimaMapProps) {
  const districtData = React.useMemo(() => {
    const stats: Record<string, DistrictStats> = {};

    events.forEach(event => {
      const dName = event.distrito;
      if (!dName || !DISTRICT_COORDS[dName]) return;

      if (!stats[dName]) {
        stats[dName] = {
          name: dName,
          total: 0,
          diagnostics: 0,
          queries: 0,
          entrepreneurs: 0,
          domestic: 0,
          topThemes: []
        };
      }

      stats[dName].total += 1;
      
      // Clasificación por tipo de evento
      if (event.tipoEvento === 'diagnostico_usuario') stats[dName].diagnostics += 1;
      if (event.tipoEvento === 'consulta_chatbot') stats[dName].queries += 1;
      
      // Clasificación por tipo de usuario
      if (event.tipoUsuario === 'emprendedor') stats[dName].entrepreneurs += 1;
      if (event.tipoUsuario === 'empleador_hogar') stats[dName].domestic += 1;
      
      // Colección de temas para el popup
      if (event.temasDetectados && Array.isArray(event.temasDetectados)) {
        const uniqueThemes = new Set([...stats[dName].topThemes, ...event.temasDetectados]);
        stats[dName].topThemes = Array.from(uniqueThemes).slice(0, 3);
      }
    });

    return Object.values(stats);
  }, [events]);

  return (
    <div className="w-full h-[450px] bg-gray-100 rounded-[40px] border border-gray-100 overflow-hidden relative shadow-inner group">
      <MapContainer 
        center={[-12.0464, -77.0428]} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {districtData.map((d) => {
          const coords = DISTRICT_COORDS[d.name];
          
          // Cálculo dinámico del tamaño: mínimo 8px, máximo 40px
          const radius = Math.min(8 + (d.total * 2), 40);
          
          // Color institucional según volumen de datos
          const color = d.total > 15 ? '#D91E18' : d.total > 5 ? '#f59e0b' : '#1a73e8';

          return (
            <CircleMarker
              key={d.name}
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor: color,
                color: 'white',
                weight: 2.5,
                fillOpacity: 0.8,
                className: "drop-shadow-xl animate-pulse"
              }}
            >
              <Popup className="ofelia-popup">
                <div className="p-4 min-w-[220px] font-body">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <h4 className="font-black text-sm text-[#1A1A1A] uppercase tracking-tight">
                      {d.name}
                    </h4>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                      {d.total} EVENTOS
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Diagnósticos</p>
                      <p className="text-xs font-black text-[#1A1A1A]">{d.diagnostics}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Consultas IA</p>
                      <p className="text-xs font-black text-[#1A1A1A]">{d.queries}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Predominancia</p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Emprendedores
                      </span>
                      <span>{d.entrepreneurs}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        Empleadores Hogar
                      </span>
                      <span>{d.domestic}</span>
                    </div>
                  </div>
                  
                  {d.topThemes.length > 0 && (
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Temas Críticos</p>
                      <div className="flex flex-wrap gap-1">
                        {d.topThemes.map((t, i) => (
                          <span key={i} className="text-[8px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-black uppercase truncate max-w-full">
                            {t.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Leyenda flotante premium */}
      <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none transition-transform group-hover:scale-105">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-[28px] border border-gray-100 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-[10px] font-black uppercase text-[#1A1A1A] tracking-widest">Demanda Ciudadana</h4>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-lg shadow-primary/20" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-tight">Alta (&gt;15 registros)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-tight">Media (6-15 registros)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-lg shadow-blue-200" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-tight">Baja (1-5 registros)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
