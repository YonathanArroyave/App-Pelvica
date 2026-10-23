'use client';

import React from 'react';

interface PelvicStretchIllustrationProps {
  stretchId: string;
  className?: string;
}

/**
 * PelvicStretchIllustration
 * Representaciones visuales 2D vectoriales médicas de alta fidelidad para los 5 estiramientos
 * pélvicos miofasciales de la app.
 *
 * Cada ilustración muestra:
 * 1. Postura corporal completa (alineación osteoarticular correcta).
 * 2. Esterilla y línea de tierra.
 * 3. Zona focal anatómica iluminada con resplandor neón esmeralda (#00E676).
 * 4. Vectores somáticos de respiración / gravedad / descompresión.
 */
export const PelvicStretchIllustration: React.FC<PelvicStretchIllustrationProps> = ({
  stretchId,
  className = ''
}) => {
  return (
    <div className={`w-full rounded-2xl bg-[#090D16] border border-[#1E2638] p-3 shadow-inner overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 320 175"
        className="w-full h-auto max-h-[160px] mx-auto overflow-visible"
      >
        <defs>
          {/* Brillo Esmeralda para el Suelo Pélvico y Descompresión */}
          <filter id="emeraldGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Brillo Intenso para Puntos de Anclaje */}
          <filter id="intenseGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradiente del Cuerpo / Silueta Anatómica */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252F48" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#141B2D" stopOpacity="0.9" />
          </linearGradient>

          {/* Gradiente de la Colchoneta / Mat */}
          <linearGradient id="matGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#182032" />
            <stop offset="50%" stopColor="#2A3550" />
            <stop offset="100%" stopColor="#182032" />
          </linearGradient>

          {/* Gradiente de Energía Esmeralda */}
          <radialGradient id="energyZone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00E676" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente Psoas / Cadera */}
          <linearGradient id="psoasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00E676" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 1. Colchoneta / Suelo de Apoyo Universal */}
        <rect
          x="15"
          y="152"
          width="290"
          height="6"
          rx="3"
          fill="url(#matGrad)"
          stroke="#334155"
          strokeWidth="0.8"
        />
        <line x1="25" y1="152" x2="295" y2="152" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* 2. RENDERIZADO CONDICIONAL DE CADA POSTURA */}

        {/* POSTURA 1: POSTURA DEL NIÑO PÉLVICA (CHILD'S POSE) */}
        {stretchId === 'child_pose' && (
          <g className="animate-fadeIn">
            {/* Aura de Expansión Somatosensorial en la Pelvis Posterior */}
            <circle cx="78" cy="112" r="32" fill="url(#energyZone)" />
            <circle
              cx="78"
              cy="112"
              r="22"
              fill="none"
              stroke="#00E676"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              className="animate-pulse"
              opacity="0.75"
            />

            {/* Silueta Corporal: Glúteos sobre talones, torso extendido, brazos al frente */}
            {/* Brazos extendidos */}
            <path
              d="M 180 126 C 205 136, 235 146, 268 150 C 273 151, 273 154, 266 154 C 235 152, 200 144, 175 134 Z"
              fill="url(#bodyGrad)"
              stroke="#94A3B8"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* Cabeza apoyada en colchoneta */}
            <ellipse
              cx="218"
              cy="142"
              rx="12"
              ry="10"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.8"
              transform="rotate(12 218 142)"
            />

            {/* Piernas / Muslos y Espinillas en el suelo */}
            <path
              d="M 46 153 C 46 142, 60 134, 76 128 C 92 122, 108 136, 114 153 Z"
              fill="#182032"
              stroke="#64748B"
              strokeWidth="1.5"
            />

            {/* Espalda y Torso en flexión relajada hacia adelante */}
            <path
              d="M 58 128 C 65 110, 85 96, 115 96 C 145 96, 172 108, 192 128 C 182 135, 168 140, 140 140 C 105 140, 75 136, 58 128 Z"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Zona Focal Anatómica: Sacro y Suelo Pélvico Posterior */}
            <path
              d="M 64 122 C 72 106, 92 102, 102 108"
              fill="none"
              stroke="#00E676"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#emeraldGlow)"
            />

            {/* Vectores de Respiración Diafragmática 360° */}
            <path
              d="M 74 95 Q 70 82 62 76"
              fill="none"
              stroke="#00E676"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <polygon points="60,74 65,78 61,81" fill="#00E676" />

            <path
              d="M 88 94 Q 92 80 98 74"
              fill="none"
              stroke="#00E676"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <polygon points="100,73 95,76 99,80" fill="#00E676" />

            {/* Tag / Marcador de Zona Focal */}
            <g transform="translate(48, 52)">
              <rect x="0" y="0" width="138" height="20" rx="10" fill="#090E17" stroke="#00E676" strokeWidth="1" />
              <circle cx="10" cy="10" r="3.5" fill="#00E676" filter="url(#intenseGlow)" />
              <text x="20" y="14" fill="#00E676" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                Apertura Sacro-Pélvica
              </text>
            </g>
          </g>
        )}

        {/* POSTURA 2: BEBÉ FELIZ (HAPPY BABY POSE) */}
        {stretchId === 'happy_baby' && (
          <g className="animate-fadeIn">
            {/* Aura de gravedad en la base pélvica central */}
            <circle cx="155" cy="140" r="35" fill="url(#energyZone)" />

            {/* Cabeza en el suelo a la izquierda */}
            <circle
              cx="58"
              cy="142"
              r="11"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* Torso apoyado plano en la colchoneta */}
            <path
              d="M 68 144 L 145 146 C 145 152, 68 152, 68 144 Z"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Pierna Izquierda (Muslo hacia axila + pantorrilla 90° hacia arriba + pie flexionado) */}
            <path
              d="M 140 144 C 130 115, 118 85, 114 78 C 114 78, 112 52, 114 42"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pie Izquierdo flexionado hacia el techo */}
            <path d="M 106 42 L 124 42" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Pierna Derecha (Muslo hacia otra axila + pantorrilla 90° hacia arriba + pie flexionado) */}
            <path
              d="M 155 144 C 168 115, 182 85, 186 78 C 186 78, 188 52, 186 42"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pie Derecho flexionado */}
            <path d="M 176 42 L 194 42" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Brazos sujetando los pies hacia abajo */}
            <path
              d="M 80 142 C 92 105, 105 65, 112 46"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 85 142 C 120 105, 160 65, 182 46"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Núcleo Anatómico: Elevador del Ano y Perineo Central Elongado */}
            <ellipse
              cx="148"
              cy="142"
              rx="18"
              ry="7"
              fill="#00E676"
              filter="url(#emeraldGlow)"
              opacity="0.85"
            />

            {/* Vectores de Gravedad Pasiva (Descenso del Diafragma Pélvico) */}
            <g stroke="#00E676" strokeWidth="1.8" fill="#00E676">
              <line x1="148" y1="118" x2="148" y2="135" strokeDasharray="2 2" />
              <polygon points="148,138 144,131 152,131" />

              <line x1="134" y1="118" x2="134" y2="132" strokeDasharray="2 2" />
              <polygon points="134,135 131,129 137,129" />

              <line x1="162" y1="118" x2="162" y2="132" strokeDasharray="2 2" />
              <polygon points="162,135 159,129 165,129" />
            </g>

            {/* Tag / Marcador de Zona Focal */}
            <g transform="translate(195, 50)">
              <rect x="0" y="0" width="115" height="34" rx="8" fill="#090E17" stroke="#00E676" strokeWidth="1" />
              <circle cx="10" cy="11" r="3.5" fill="#00E676" filter="url(#intenseGlow)" />
              <text x="20" y="14" fill="#00E676" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Elevador del Ano
              </text>
              <text x="20" y="27" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">
                Elongación por gravedad
              </text>
            </g>
          </g>
        )}

        {/* POSTURA 3: FIGURA 4 (PIRIFORME Y NERVIO PUDENDO) */}
        {stretchId === 'figure_four' && (
          <g className="animate-fadeIn">
            {/* Aura en la zona glútea profunda / canal pudendo */}
            <circle cx="148" cy="132" r="32" fill="url(#energyZone)" />

            {/* Cabeza en colchoneta */}
            <circle
              cx="55"
              cy="143"
              r="11"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* Espalda apoyada */}
            <path
              d="M 65 145 L 135 147 C 135 152, 65 152, 65 145 Z"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Pierna Base (Izquierda) levantada en ángulo de 90° hacia el pecho */}
            <path
              d="M 132 146 C 145 125, 162 105, 178 92"
              fill="none"
              stroke="#64748B"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Pantorrilla base flexionada */}
            <path
              d="M 178 92 C 196 106, 212 118, 222 126"
              fill="none"
              stroke="#475569"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Pierna Cruzada (Derecha) en "4" - Tobillo sobre rodilla opuesta */}
            <path
              d="M 134 144 C 136 128, 142 114, 150 108"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 150 108 L 175 96"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Brazos pasando por debajo del muslo para tirar suavemente */}
            <path
              d="M 75 142 C 105 125, 140 105, 170 98"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Zona Focal Anatómica: Piriforme y Descompresión del Nervio Pudendo */}
            <path
              d="M 134 142 C 142 130, 150 120, 160 115"
              fill="none"
              stroke="#00E676"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#emeraldGlow)"
            />

            {/* Destello de liberación nerviosa */}
            <circle cx="145" cy="128" r="4" fill="#00E5FF" filter="url(#intenseGlow)" />

            {/* Tag / Marcador de Zona Focal */}
            <g transform="translate(188, 48)">
              <rect x="0" y="0" width="122" height="34" rx="8" fill="#090E17" stroke="#00E676" strokeWidth="1" />
              <circle cx="10" cy="11" r="3.5" fill="#00E676" filter="url(#intenseGlow)" />
              <text x="20" y="14" fill="#00E676" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Músculo Piriforme
              </text>
              <text x="20" y="27" fill="#00E5FF" fontSize="8" fontFamily="sans-serif">
                Libera el nervio pudendo
              </text>
            </g>
          </g>
        )}

        {/* POSTURA 4: MARIPOSA RECLINADA (SUPTA BADDHA KONASANA) */}
        {stretchId === 'reclined_butterfly' && (
          <g className="animate-fadeIn">
            {/* Aura de apertura en aductores y perineo anterior */}
            <circle cx="165" cy="144" r="36" fill="url(#energyZone)" />

            {/* Cabeza relajada en suelo */}
            <circle
              cx="52"
              cy="143"
              r="11"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* Torso y Manos apoyadas (una en vientre, una en pecho) */}
            <path
              d="M 62 145 L 140 147 C 140 152, 62 152, 62 145 Z"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Brazo al vientre */}
            <path
              d="M 75 142 Q 95 132 118 138"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Rodilla del fondo (abierta hacia el suelo) */}
            <path
              d="M 138 146 Q 165 125 188 126 Q 212 136 226 148"
              fill="none"
              stroke="#475569"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Rodilla frontal (abierta hacia el suelo por gravedad - forma de diamante) */}
            <path
              d="M 138 146 Q 168 158 190 156 Q 214 154 226 148"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Plantas de los pies unidas en el extremo */}
            <ellipse cx="228" cy="148" rx="5" ry="6" fill="#94A3B8" />

            {/* Zona Focal Anatómica: Aductores y Suelo Pélvico Anterior */}
            <path
              d="M 142 146 Q 166 142 186 140"
              fill="none"
              stroke="#00E676"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#emeraldGlow)"
            />

            {/* Flechas de Apertura Lateral Bilateral */}
            <g stroke="#00E676" strokeWidth="1.6" fill="#00E676">
              {/* Hacia arriba/fondo */}
              <line x1="175" y1="138" x2="175" y2="128" />
              <polygon points="175,125 172,130 178,130" />

              {/* Hacia abajo/frente */}
              <line x1="175" y1="146" x2="175" y2="156" />
              <polygon points="175,159 172,154 178,154" />
            </g>

            {/* Tag / Marcador de Zona Focal */}
            <g transform="translate(188, 48)">
              <rect x="0" y="0" width="122" height="34" rx="8" fill="#090E17" stroke="#00E676" strokeWidth="1" />
              <circle cx="10" cy="11" r="3.5" fill="#00E676" filter="url(#intenseGlow)" />
              <text x="20" y="14" fill="#00E676" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Aductores e Ingle
              </text>
              <text x="20" y="27" fill="#00E676" fontSize="8" fontFamily="sans-serif">
                Elimina tensión compensatoria
              </text>
            </g>
          </g>
        )}

        {/* POSTURA 5: ZANCADA BAJA (PSOAS-ILÍACO Y FLEXORES DE CADERA) */}
        {stretchId === 'low_lunge_psoas' && (
          <g className="animate-fadeIn">
            {/* Aura de elongación en el psoas anterior */}
            <circle cx="128" cy="120" r="34" fill="url(#energyZone)" />

            {/* Pierna Trasera: Rodilla en suelo, empeine relajado hacia atrás */}
            <path
              d="M 38 152 L 78 152 C 86 152, 92 148, 96 142 L 128 116"
              fill="none"
              stroke="#64748B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pierna Delantera: Muslo a 90°, rodilla sobre tobillo */}
            <path
              d="M 132 116 L 186 116 C 190 116, 192 120, 192 126 L 192 152"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pie delantero apoyado plano */}
            <path d="M 186 153 L 204 153" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Torso Erguido / Columna alineada */}
            <path
              d="M 128 118 L 134 68"
              fill="none"
              stroke="url(#bodyGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Cabeza erguida mirando al frente */}
            <circle
              cx="136"
              cy="45"
              r="11"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* Brazos apoyados sobre la rodilla delantera */}
            <path
              d="M 134 72 Q 160 92 186 114"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Zona Focal Anatómica: Psoas-Ilíaco (Conexión Lumbar-Cadera-Fémur) */}
            <path
              d="M 133 85 C 130 102, 122 118, 108 132"
              fill="none"
              stroke="url(#psoasGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#emeraldGlow)"
            />

            {/* Flecha de Hundimiento Pélvico Suave (Hacia abajo y adelante) */}
            <g stroke="#00E676" strokeWidth="1.8" fill="#00E676">
              <line x1="135" y1="126" x2="148" y2="137" strokeDasharray="2 2" />
              <polygon points="151,139 143,137 148,131" />
            </g>

            {/* Tag / Marcador de Zona Focal */}
            <g transform="translate(188, 48)">
              <rect x="0" y="0" width="122" height="34" rx="8" fill="#090E17" stroke="#00E676" strokeWidth="1" />
              <circle cx="10" cy="11" r="3.5" fill="#00E676" filter="url(#intenseGlow)" />
              <text x="20" y="14" fill="#00E676" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Músculo Psoas-Ilíaco
              </text>
              <text x="20" y="27" fill="#00E5FF" fontSize="8" fontFamily="sans-serif">
                Desactiva anteversión pélvica
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
