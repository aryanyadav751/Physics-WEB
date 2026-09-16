import React, { useState } from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export const GlassSlabSim: React.FC = () => {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45); // degrees
  const [slabThickness, setSlabThickness] = useState<number>(80); // mm
  const [medium, setMedium] = useState<{ name: string; n: number }>({ name: 'Crown Glass', n: 1.52 });

  const mediaList = [
    { name: 'Water', n: 1.33 },
    { name: 'Crown Glass', n: 1.52 },
    { name: 'Dense Flint Glass', n: 1.65 },
    { name: 'Diamond', n: 2.42 },
  ];

  // Snell's law: n1 * sin(i) = n2 * sin(r) where n1 = 1 (air)
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinR = Math.sin(iRad) / medium.n;
  const rRad = Math.asin(Math.min(sinR, 0.9999));
  const refractionAngleDeg = (rRad * 180) / Math.PI;

  // At second boundary (glass to air): angle of emergence e = i
  const emergenceAngleDeg = incidentAngleDeg;

  // Lateral displacement: d = [t * sin(i - r)] / cos(r)
  const lateralShift = (slabThickness * Math.sin(iRad - rRad)) / Math.cos(rRad);

  // SVG drawing dimensions
  const svgWidth = 620;
  const svgHeight = 280;
  const slabTopY = 80;
  const slabBottomY = slabTopY + slabThickness;
  const hitX = 260;

  // Coordinate math
  const incidentRayLen = 90;
  const startX = hitX - incidentRayLen * Math.sin(iRad);
  const startY = slabTopY - incidentRayLen * Math.cos(iRad);

  // Inside slab ray
  const slabExitX = hitX + slabThickness * Math.tan(rRad);
  const slabExitY = slabBottomY;

  // Emergent ray
  const exitRayLen = 90;
  const endX = slabExitX + exitRayLen * Math.sin(iRad);
  const endY = slabExitY + exitRayLen * Math.cos(iRad);

  // Undeviated original path dotted line
  const undeviatedTotalLen = incidentRayLen + slabThickness / Math.cos(iRad) + exitRayLen;
  const unshiftedEndX = hitX + (slabThickness + exitRayLen) * Math.tan(iRad);
  const unshiftedEndY = slabExitY + exitRayLen;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
              Experiment 03 • Light
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Refraction & Lateral Displacement in Glass Slab
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Observe Snell’s Law (sin i / sin r = n), verify ∠i = ∠e, and measure the lateral shift (d).
          </p>
        </div>

        {/* Medium Selector */}
        <div className="flex flex-wrap items-center gap-1.5 self-start">
          {mediaList.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => setMedium(m)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                medium.name === m.name
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {m.name} (n={m.n})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Slab Canvas */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 sm:h-72">
          <defs>
            <marker id="rayMarker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Air Medium Top Label */}
          <text x="30" y="45" fill="#94a3b8" fontSize="11" fontWeight="600">
            Medium 1: Air (n₁ ≈ 1.00)
          </text>

          {/* The Slab Rectangle */}
          <rect
            x="80"
            y={slabTopY}
            width={svgWidth - 160}
            height={slabThickness}
            fill="rgba(99, 102, 241, 0.12)"
            stroke="#6366f1"
            strokeWidth="2"
            rx="4"
          />

          <text x="95" y={slabTopY + 24} fill="#818cf8" fontSize="12" fontWeight="bold">
            {medium.name} Slab (n₂ = {medium.n})
          </text>

          {/* Air Medium Bottom Label */}
          <text x="30" y={slabBottomY + 45} fill="#94a3b8" fontSize="11" fontWeight="600">
            Medium 1: Air (n₁ ≈ 1.00)
          </text>

          {/* Normal N1 at Top Interface */}
          <line
            x1={hitX}
            y1={slabTopY - 55}
            x2={hitX}
            y2={slabTopY + 45}
            stroke="#e2e8f0"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x={hitX + 6} y={slabTopY - 40} fill="#cbd5e1" fontSize="10">
            Normal N₁
          </text>

          {/* Incident Ray */}
          <line
            x1={startX}
            y1={startY}
            x2={hitX}
            y2={slabTopY}
            stroke="#38bdf8"
            strokeWidth="2.5"
            markerEnd="url(#rayMarker)"
          />

          {/* Angle of incidence arc */}
          <text x={hitX - 28} y={slabTopY - 14} fill="#38bdf8" fontSize="11" fontWeight="bold">
            i = {incidentAngleDeg}°
          </text>

          {/* Refracted Ray Inside Slab */}
          <line
            x1={hitX}
            y1={slabTopY}
            x2={slabExitX}
            y2={slabExitY}
            stroke="#38bdf8"
            strokeWidth="2.5"
            markerEnd="url(#rayMarker)"
          />

          {/* Angle of refraction label */}
          <text x={hitX + 10} y={slabTopY + 22} fill="#a855f7" fontSize="10" fontWeight="bold">
            r = {refractionAngleDeg.toFixed(1)}°
          </text>

          {/* Normal N2 at Bottom Interface */}
          <line
            x1={slabExitX}
            y1={slabBottomY - 45}
            x2={slabExitX}
            y2={slabBottomY + 55}
            stroke="#e2e8f0"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x={slabExitX + 6} y={slabBottomY + 45} fill="#cbd5e1" fontSize="10">
            Normal N₂
          </text>

          {/* Emergent Ray */}
          <line
            x1={slabExitX}
            y1={slabExitY}
            x2={endX}
            y2={endY}
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#rayMarker)"
          />
          <text x={slabExitX + 16} y={slabBottomY + 22} fill="#10b981" fontSize="11" fontWeight="bold">
            e = {emergenceAngleDeg}°
          </text>

          {/* Undeviated Incident Ray Extension (Dotted Pink) */}
          <line
            x1={hitX}
            y1={slabTopY}
            x2={unshiftedEndX}
            y2={unshiftedEndY}
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Lateral Displacement Indicator */}
          <line
            x1={endX}
            y1={endY}
            x2={unshiftedEndX}
            y2={unshiftedEndY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text
            x={Math.min(endX, unshiftedEndX) - 30}
            y={endY - 10}
            fill="#fbbf24"
            fontSize="11"
            fontWeight="bold"
          >
            d = {lateralShift.toFixed(1)} mm
          </text>
        </svg>

        {/* Info overlay */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            CBSE Verification:
          </div>
          <div className="text-emerald-400 font-mono">∠i = ∠e = {incidentAngleDeg}°</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Emergent ray is parallel to incident ray.</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Angle of Incidence (∠i)</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="75"
            step="1"
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>10° (near normal)</span>
            <span>45°</span>
            <span>75° (glancing)</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Slab Thickness (t)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{slabThickness} mm</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            step="5"
            value={slabThickness}
            onChange={(e) => setSlabThickness(Number(e.target.value))}
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>40 mm (thin)</span>
            <span>80 mm</span>
            <span>120 mm (thick)</span>
          </div>
        </div>
      </div>

      {/* Math Banner */}
      <div className="mt-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-800 dark:text-slate-200">
        <div>
          <span className="text-slate-500">Snell's Law: </span>
          <strong className="text-indigo-600 dark:text-indigo-400">sin({incidentAngleDeg}°) / sin({refractionAngleDeg.toFixed(1)}°) = {medium.n}</strong>
        </div>
        <div>
          <span className="text-slate-500">Lateral Shift d = [t·sin(i-r)]/cos(r) = </span>
          <strong className="text-amber-600 dark:text-amber-400">{lateralShift.toFixed(2)} mm</strong>
        </div>
      </div>
    </div>
  );
};
