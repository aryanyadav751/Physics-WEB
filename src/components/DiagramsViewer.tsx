import React, { useState } from 'react';
import { DIAGRAMS_DATA } from '../data/diagramsData';
import { DiagramItem } from '../types/physics';
import {
  Layers,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

export const DiagramsViewer: React.FC = () => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(DIAGRAMS_DATA[0].id);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedDiagram = DIAGRAMS_DATA.find((d) => d.id === selectedDiagramId) || DIAGRAMS_DATA[0];

  const renderDiagramSvg = (id: string) => {
    switch (id) {
      case 'diag-concave-mirror-c':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-64 select-none">
            {/* Principal Axis */}
            <line x1="20" y1="120" x2="480" y2="120" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="485" y="124" fill="#64748b" fontSize="10">X</text>

            {/* Concave Mirror Arc */}
            <path d="M 400 30 A 150 150 0 0 0 400 210" fill="none" stroke="#38bdf8" strokeWidth="4" />
            {/* Mirror Silvering dashes */}
            {[40, 60, 80, 100, 120, 140, 160, 180, 200].map((y) => (
              <line key={y} x1="400" y1={y} x2="415" y2={y - 8} stroke="#475569" strokeWidth="1.5" />
            ))}

            {/* Points on Principal axis */}
            <circle cx="400" cy="120" r="3.5" fill="#f8fafc" />
            <text x="400" y="140" fill="#f8fafc" fontSize="11" fontWeight="bold">P</text>

            <circle cx="280" cy="120" r="3.5" fill="#f8fafc" />
            <text x="280" y="140" fill="#f8fafc" fontSize="11" fontWeight="bold">F</text>

            <circle cx="160" cy="120" r="3.5" fill="#f8fafc" />
            <text x="160" y="140" fill="#f8fafc" fontSize="11" fontWeight="bold">C</text>

            {/* Object AB at C */}
            <line x1="160" y1="120" x2="160" y2="60" stroke="#f59e0b" strokeWidth="3" />
            <polygon points="156,62 164,62 160,50" fill="#f59e0b" />
            <text x="145" y="55" fill="#f59e0b" fontSize="12" fontWeight="bold">A</text>
            <text x="145" y="115" fill="#f59e0b" fontSize="12" fontWeight="bold">B</text>

            {/* Image A'B' at C (Inverted) */}
            <line x1="160" y1="120" x2="160" y2="180" stroke="#10b981" strokeWidth="3" />
            <polygon points="156,178 164,178 160,190" fill="#10b981" />
            <text x="140" y="190" fill="#10b981" fontSize="12" fontWeight="bold">A'</text>

            {/* Ray 1: Parallel to axis -> Passes through Focus */}
            <line x1="160" y1="60" x2="396" y2="60" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="275,57 285,60 275,63" fill="#e2e8f0" />
            <line x1="396" y1="60" x2="160" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="265,123 255,128 262,135" fill="#e2e8f0" />

            {/* Ray 2: Through Focus -> Reflected parallel to axis */}
            <line x1="160" y1="60" x2="396" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="275,115 285,125 278,127" fill="#cbd5e1" />
            <line x1="396" y1="180" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="280,177 270,180 280,183" fill="#cbd5e1" />
          </svg>
        );

      case 'diag-glass-slab':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-64 select-none">
            {/* Glass Slab Body */}
            <rect x="100" y="60" width="300" height="120" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2" rx="4" />
            <text x="120" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">Glass Slab (Medium 2: Denser)</text>
            <text x="120" y="45" fill="#94a3b8" fontSize="10">Air (Medium 1: Rarer)</text>

            {/* Normal 1 at Entry */}
            <line x1="200" y1="30" x2="200" y2="110" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="185" y="40" fill="#64748b" fontSize="10">N₁N₁'</text>

            {/* Incident Ray */}
            <line x1="120" y1="10" x2="200" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
            <polygon points="155,30 165,37 159,41" fill="#f59e0b" />
            <text x="110" y="30" fill="#f59e0b" fontSize="10" fontWeight="bold">Incident Ray</text>

            {/* Refracted Ray through Glass (Bends towards normal) */}
            <line x1="200" y1="60" x2="270" y2="180" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="230,115 240,128 232,133" fill="#38bdf8" />

            {/* Normal 2 at Exit */}
            <line x1="270" y1="130" x2="270" y2="210" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="275" y="210" fill="#64748b" fontSize="10">N₂N₂'</text>

            {/* Emergent Ray (Bends away from normal, parallel to original direction) */}
            <line x1="270" y1="180" x2="350" y2="230" stroke="#10b981" strokeWidth="2.5" />
            <polygon points="305,200 315,207 309,211" fill="#10b981" />
            <text x="355" y="235" fill="#10b981" fontSize="10" fontWeight="bold">Emergent Ray</text>

            {/* Original Path Dotted Line */}
            <line x1="200" y1="60" x2="420" y2="197" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Lateral Displacement Indicator */}
            <line x1="310" y1="128" x2="270" y2="180" stroke="#ef4444" strokeWidth="1.5" />
            <text x="320" y="160" fill="#ef4444" fontSize="10" fontWeight="bold">Lateral Shift (d)</text>
          </svg>
        );

      case 'diag-prism-dispersion':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-64 select-none">
            {/* Triangular Glass Prism */}
            <polygon points="250,30 150,200 350,200" fill="rgba(255, 255, 255, 0.05)" stroke="#e2e8f0" strokeWidth="2" />
            <text x="250" y="25" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">A (Angle of Prism)</text>

            {/* Incident White Light Beam */}
            <line x1="70" y1="150" x2="190" y2="125" stroke="#ffffff" strokeWidth="3.5" />
            <polygon points="125,137 135,135 130,143" fill="#ffffff" />
            <text x="60" y="140" fill="#ffffff" fontSize="11" fontWeight="bold">Narrow White Light</text>

            {/* Dispersed inside prism */}
            <line x1="190" y1="125" x2="280" y2="120" stroke="#ef4444" strokeWidth="2" />
            <line x1="190" y1="125" x2="285" y2="145" stroke="#8b5cf6" strokeWidth="2" />

            {/* Spectrum Emerging */}
            <line x1="280" y1="120" x2="430" y2="100" stroke="#ef4444" strokeWidth="2.5" />
            <text x="440" y="104" fill="#ef4444" fontSize="10" fontWeight="bold">Red (Least Deviated)</text>

            <line x1="282" y1="128" x2="430" y2="125" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="283" y1="134" x2="430" y2="150" stroke="#22c55e" strokeWidth="2.5" />
            <line x1="284" y1="140" x2="430" y2="175" stroke="#3b82f6" strokeWidth="2.5" />

            <line x1="285" y1="145" x2="430" y2="200" stroke="#8b5cf6" strokeWidth="2.5" />
            <text x="440" y="204" fill="#8b5cf6" fontSize="10" fontWeight="bold">Violet (Most Deviated)</text>

            {/* Screen */}
            <rect x="425" y="80" width="6" height="135" fill="#94a3b8" rx="2" />
            <text x="420" y="70" fill="#94a3b8" fontSize="10" textAnchor="middle">White Screen</text>
          </svg>
        );

      case 'diag-eye-defects':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-64 select-none">
            {/* Myopic Eye (Elongated eyeball) */}
            <ellipse cx="160" cy="110" rx="70" ry="60" fill="none" stroke="#64748b" strokeWidth="2" />
            <path d="M 95 90 A 25 25 0 0 1 95 130" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <text x="160" y="40" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">Myopic Eye (Image in front of Retina)</text>

            {/* Rays converging before retina */}
            <line x1="60" y1="95" x2="100" y2="95" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="60" y1="125" x2="100" y2="125" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="100" y1="95" x2="185" y2="110" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="100" y1="125" x2="185" y2="110" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="185" cy="110" r="3" fill="#ef4444" />
            <circle cx="230" cy="110" r="3" fill="#22c55e" />
            <text x="185" y="130" fill="#ef4444" fontSize="9" textAnchor="middle">Focus</text>
            <text x="230" y="130" fill="#22c55e" fontSize="9" textAnchor="middle">Retina</text>

            {/* Corrected with Concave Lens */}
            <g transform="translate(260, 0)">
              <ellipse cx="160" cy="110" rx="70" ry="60" fill="none" stroke="#64748b" strokeWidth="2" />
              <path d="M 95 90 A 25 25 0 0 1 95 130" fill="none" stroke="#38bdf8" strokeWidth="3" />

              {/* Concave Spectacle Lens in front */}
              <path d="M 50 85 Q 56 110 50 135" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 58 85 Q 52 110 58 135" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x="54" y="75" fill="#10b981" fontSize="9" textAnchor="middle">Concave Lens</text>

              {/* Corrected Focus directly onto Retina */}
              <line x1="100" y1="95" x2="230" y2="110" stroke="#10b981" strokeWidth="1.5" />
              <line x1="100" y1="125" x2="230" y2="110" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="230" cy="110" r="3.5" fill="#10b981" />
              <text x="160" y="40" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Correction: Image on Retina</text>
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 500 240" className="w-full h-64 select-none">
            {/* Generic ray tracing placeholder */}
            <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
            <ellipse cx="250" cy="120" rx="14" ry="70" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="3" />
            <text x="250" y="30" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">Optical Device Schematic</text>
            <line x1="120" y1="120" x2="120" y2="70" stroke="#f59e0b" strokeWidth="3" />
            <polygon points="116,72 124,72 120,60" fill="#f59e0b" />
            <line x1="120" y1="70" x2="250" y2="70" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="250" y1="70" x2="380" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="380" y1="120" x2="380" y2="160" stroke="#10b981" strokeWidth="3" />
            <polygon points="376,158 384,158 380,170" fill="#10b981" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
          Diagram Mastery
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          CBSE Class 10 High-Yield Ray Diagrams & Schematics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-3xl">
          Ray diagrams account for over 6 to 8 marks in the CBSE board question paper. Master the exact drawing sequence, directional arrow placements, and avoid mark deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Diagram Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Mandatory CBSE Diagrams ({DIAGRAMS_DATA.length})
          </span>

          {DIAGRAMS_DATA.map((diag) => {
            const active = diag.id === selectedDiagram.id;
            return (
              <button
                key={diag.id}
                type="button"
                onClick={() => setSelectedDiagramId(diag.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  active
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span className="capitalize">{diag.category}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{diag.chapterId}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {diag.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Diagram Display & Step-by-Step Drawing Rules (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  CBSE Standard Diagram
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedDiagram.title}
                </h2>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showLabels
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {showLabels ? 'Labels Visible' : 'Hide Labels'}
                </button>
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 relative overflow-hidden flex items-center justify-center">
              <div style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }} className="w-full">
                {renderDiagramSvg(selectedDiagram.id)}
              </div>
            </div>

            {/* Interactive Labels List */}
            {showLabels && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Anatomical Labels & Optical Points
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {selectedDiagram.labels.map((lab, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate">{lab}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step-by-Step Drawing Protocol */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              CBSE Drawing Instructions & Guidelines
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDiagram.boardTips}
            </div>

            {/* Warning Box */}
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
              <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">CBSE Mark Loss Alert:</strong>
                {selectedDiagram.commonErrors}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
