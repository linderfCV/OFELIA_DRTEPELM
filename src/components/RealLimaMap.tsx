'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from "@/lib/utils";

// Diccionario de coordenadas proporcionado
const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Carabayllo": [-11.8903, -77.0269],
  "Comas": [-11.9572, -77.0496],
  "San Juan de Lurigancho": [-11.9828, -77.0086],
  "Cercado de Lima": [-12.0464, -77.0428],
  "Ate": [-12.0464, -76.9000],
  "San Martín de Porres": [-12.0300, -77.0833],
  "Los Olivos": [-11.9914, -77.0708],
  "Villa El Salvador": [-12.2133, -76.9369],
  "Villa María del Triunfo": [-12.1625, -76.9436],
  "Miraflores": [-12.1211, -77.0297],
  "Surco": [-12.1450, -76.9911],
  "Santiago de Surco": [-12.1450, -76.9911],
  "San Isidro": [-12.0977, -77.0365],
  "La Molina": [-12.0875, -76.9286],
  "Chorrillos": [-12.1724, -77.0247],
  "Puente Piedra": [-11.8667, -77.0769],
  "Jesus Maria": [-12.0764, -77.0486],
  "Jesús María": [-12.0764, -77.0486],
  "Lince": [-12.0833, -77.0333],
  "San Miguel": [-12.0914, -77.0944],
  "Magdalena del Mar": [-12.0911, -77.0694],
  "Barranco": [-12.1492, -77.0211],
  "Pueblo Libre": [-12.0736, -77.0658],
  "La Victoria": [-12.0653, -77.0286],
  "San Borja": [-12.1069, -76.9992],
  "Surquillo": [-12.1153, -77.0211],
  "Santa Anita": [-12.0428, -76.9667],
  "Rimac": [-12.0292, -77.0286],
  "Rímac": [-12.0292, -77.0286],
  "Breña": [-12.0583, -77.0458],
  "Independencia": [-11.9922, -77.0536]
};

interface DistrictStats {
  name: string;
  total: number;
  diagnostics: number;
  queries: number;
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
          topThemes: []
        };
      }

      stats[dName].total += 1;
      if (event.tipoEvento === 'diagnostico_usuario') stats[dName].diagnostics += 1;
      if (event.tipoEvento === 'consulta_chatbot') stats[dName].queries += 1;
      
      if (event.temasDetectados) {
        stats[dName].topThemes = Array.from(new Set([...stats[dName].topThemes, ...event.temasDetectados])).slice(0, 3);
      }
    });

    return Object.values(stats);
  }, [events]);

  return (
    <div className="w-full h-[450px] bg-gray-100 rounded-[40px] border border-gray-100 overflow-hidden relative shadow-inner">
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
          const radius = 8 + (d.total * 1.5);
          const color = d.total > 15 ? '#D91E18' : d.total > 5 ? '#f59e0b' : '#1a73e8';

          return (
            <CircleMarker
              key={d.name}
              center={coords}
              radius={Math.min(radius, 35)}
              pathOptions={{
                fillColor: color,
                color: 'white',
                weight: 2,
                fillOpacity: 0.7,
              }}
            >
              <Popup className="ofelia-popup">
                <div className="p-3 min-w-[180px] font-body">
                  <h4 className="font-black text-sm text-[#1A1A1A] uppercase tracking-tight mb-2 border-b border-gray-100 pb-1">
                    {d.name}
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Total Eventos</span>
                      <span className="text-xs font-black text-primary">{d.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Diagnósticos</span>
                      <span className="text-xs font-black text-emerald-600">{d.diagnostics}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Consultas IA</span>
                      <span className="text-xs font-black text-blue-600">{d.queries}</span>
                    </div>
                  </div>
                  
                  {d.topThemes.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Temas Críticos</p>
                      <div className="flex flex-wrap gap-1">
                        {d.topThemes.map((t, i) => (
                          <span key={i} className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase truncate max-w-full">
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
      
      <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 shadow-xl">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Demanda Distrital</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[9px] font-bold uppercase text-gray-600">Alta Concentración (&gt;15)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-[9px] font-bold uppercase text-gray-600">Media (6-15)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[9px] font-bold uppercase text-gray-600">Baja (1-5)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}