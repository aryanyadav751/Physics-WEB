import React, { useState } from 'react';
import { Eye, RotateCcw, CheckCircle2 } from 'lucide-react';

export const PrismDispersionSim: React.FC = () => {
  const [lightMode, setLightMode] = useState<'white' | 'monochromatic'>('white');
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(48); // angle of incidence
  const [prismAngleDeg, setPrismAngleDeg] = useState<number>(60); // equilateral prism A = 60°

  // Spectrum data with refractive index in crown glass
  const spectralBands = [
    { color: 'Red', hex: '#ef4444', n: 1.513, lambda: '650 nm', devOffset: 0 },
    { color: 'Orange', hex: '#f97316', n: 1.516, lambda: '600 nm', devOffset: 1.2 },
    { color: 'Yellow', hex: '#eab308', n: 1.519, lambda: '580 nm', devOffset: 2.3 },
    { color: 'Green', hex: '#22c55e', n: 1.523, lambda: '530 nm', devOffset: 3.5 },
    { color: 'Blue', hex: '#3b82f6', n: 1.528, lambda: '470 nm', devOffset: 5.0 },
    { color: 'Indigo', hex: '#6366f1', n: 1.532, lambda: '430 nm', devOffset: 6.4 },
    { color: 'Violet', hex: '#a855f7', n: 1.538, lambda: '400 nm', devOffset: 8.0 },
  ];

  // Mean refractive index (yellow light)
  const meanN = 1.52;
  // Approximate deviation calculation D = i + e - A
  // Minimum deviation occurs near i = 48° for A = 60°: D ≈ 38°
  const baseDeviation = incidentAngleDeg * 0.75;

  const svgWidth = 620;
  const svgHeight = 280;

  // Prism triangle coordinates (Apex at top center)
  const apexX = 260;
  const apexY = 50;
  const baseLeftX = 170;
  const baseLeftY = 240;
  const baseRightX = 350;
  const baseRightY = 240;

  // Point of incidence on Left Face
  const incX = 215;
  const incY = 145;

  // Source Ray coordinates
  const sourceX = 40;
  const sourceY = incY - (incX - sourceX) * Math.tan((incidentAngleDeg - 35) * (Math.PI / 180));

  // Exit point on Right Face
  const exitX = 305;
  const exitY = 145;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300">
              Experiment 04 • Human Eye & Colourful World
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Prism Refraction & White Light Dispersion (VIBGYOR)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Split polychromatic white light into 7 constituent wavelengths; observe why Violet deviates most and Red least.
          </p>
        </div>

        {/* Light Mode Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setLightMode('white')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              lightMode === 'white'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            White Light (VIBGYOR)
          </button>
          <button
            type="button"
            onClick={() => setLightMode('monochromatic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              lightMode === 'monochromatic'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Monochromatic Laser (D)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 sm:h-72">
          {/* Triangular Prism Glass */}
          <polygon
            points={`${apexX},${apexY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
            fill="rgba(168, 85, 247, 0.12)"
            stroke="#a855f7"
            strokeWidth="2.5"
          />

          {/* Prism Apex Angle A Label */}
          <text x={apexX - 4} y={apexY + 28} fill="#c084fc" fontSize="11" fontWeight="bold">
            A = 60°
          </text>

          {/* Slit / Source Beam */}
          <rect x="25" y={sourceY - 8} width="14" height="16" fill="#475569" rx="2" />
          <text x="20" y={sourceY - 14} fill="#94a3b8" fontSize="10">
            {lightMode === 'white' ? 'White Light Slit' : 'Laser Diode'}
          </text>

          {/* Incident Beam to Prism Face */}
          <line
            x1={sourceX}
            y1={sourceY}
            x2={incX}
            y2={incY}
            stroke={lightMode === 'white' ? '#f8fafc' : '#38bdf8'}
            strokeWidth="3.5"
          />

          {/* Undeviated Dotted Incident Path */}
          <line
            x1={incX}
            y1={incY}
            x2={incX + 260}
            y2={incY + ((incY - sourceY) / (incX - sourceX)) * 260}
            stroke="#64748b"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {lightMode === 'white' ? (
            /* VIBGYOR Dispersion Fan */
            <>
              {spectralBands.map((band) => {
                const internalExitY = incY + band.devOffset * 1.5;
                const fanScreenX = 540;
                const fanScreenY = 120 + band.devOffset * 12;

                return (
                  <g key={band.color}>
                    {/* Ray inside prism */}
                    <line
                      x1={incX}
                      y1={incY}
                      x2={exitX}
                      y2={internalExitY}
                      stroke={band.hex}
                      strokeWidth="1.6"
                      strokeOpacity="0.85"
                    />
                    {/* Dispersed emergent ray */}
                    <line
                      x1={exitX}
                      y1={internalExitY}
                      x2={fanScreenX}
                      y2={fanScreenY}
                      stroke={band.hex}
                      strokeWidth="2.2"
                    />
                    {/* Spectral label at screen */}
                    <circle cx={fanScreenX + 4} cy={fanScreenY} r="3" fill={band.hex} />
                    <text
                      x={fanScreenX + 12}
                      y={fanScreenY + 3}
                      fill={band.hex}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {band.color} ({band.lambda})
                    </text>
                  </g>
                );
              })}

              {/* White screen capturing the spectrum */}
              <rect x="535" y="110" width="4" height="115" fill="#e2e8f0" rx="2" />
              <text x="510" y="98" fill="#e2e8f0" fontSize="10" fontWeight="600">
                Screen
              </text>
            </>
          ) : (
            /* Monochromatic Beam with Angle of Deviation */
            <>
              {/* Inside prism ray */}
              <line
                x1={incX}
                y1={incY}
                x2={exitX}
                y2={exitY}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Emergent ray */}
              <line
                x1={exitX}
                y1={exitY}
                x2={530}
                y2={exitY + baseDeviation * 2.2}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Angle of deviation D arc */}
              <text x={exitX + 65} y={exitY + 25} fill="#f43f5e" fontSize="12" fontWeight="bold">
                ∠D = {baseDeviation.toFixed(1)}°
              </text>
            </>
          )}
        </svg>

        {/* Live Observation Box */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
            CBSE Exam Rule:
          </div>
          <div className="text-violet-300 font-medium">
            n(violet) &gt; n(red) ⇒ Speed: v(red) &gt; v(violet)
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Red deviates the least; Violet deviates the most.
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-4 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Angle of Incidence (∠i)</span>
            <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="35"
            max="65"
            step="1"
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
            className="w-full accent-violet-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>35°</span>
            <span>Angle of Minimum Deviation ≈ 48°</span>
            <span>65°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
