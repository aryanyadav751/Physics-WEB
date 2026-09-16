import React, { useState, useEffect } from 'react';
import { RotateCw, Power, Compass, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const MagneticFieldMotorSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'motor' | 'straight-wire' | 'solenoid'>('motor');
  const [isCurrentOn, setIsCurrentOn] = useState<boolean>(true);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [motorAngle, setMotorAngle] = useState<number>(0);
  const [hasIronCore, setHasIronCore] = useState<boolean>(true);

  // Motor animation loop
  useEffect(() => {
    if (!isCurrentOn || activeTab !== 'motor') return;
    const interval = setInterval(() => {
      setMotorAngle((prev) => (isReversed ? (prev - 4 + 360) % 360 : (prev + 4) % 360));
    }, 30);
    return () => clearInterval(interval);
  }, [isCurrentOn, isReversed, activeTab]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
              Experiment 07 • Magnetism
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Magnetic Fields, Solenoid & Fleming’s Motor Lab
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore Maxwell’s thumb rule, solenoid electromagnetism, and Fleming’s Left-Hand Rule in an electric motor.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('motor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'motor'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Electric Motor (DC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('straight-wire')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'straight-wire'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Straight Wire & Compass
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solenoid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'solenoid'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Solenoid & Core
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-3 select-none">
        {activeTab === 'motor' && (
          <svg viewBox="0 0 600 280" className="w-full h-64 sm:h-72">
            {/* North Pole Magnet (Left) */}
            <rect x="50" y="70" width="90" height="140" fill="#ef4444" rx="4" />
            <text x="95" y="145" fill="#ffffff" fontSize="24" fontWeight="bold" textAnchor="middle">
              N
            </text>

            {/* South Pole Magnet (Right) */}
            <rect x="460" y="70" width="90" height="140" fill="#3b82f6" rx="4" />
            <text x="505" y="145" fill="#ffffff" fontSize="24" fontWeight="bold" textAnchor="middle">
              S
            </text>

            {/* Uniform Magnetic Field Lines (N to S) */}
            {[90, 120, 140, 160, 190].map((y) => (
              <g key={y}>
                <line x1="140" y1={y} x2="460" y2={y} stroke="#64748b" strokeWidth="1" strokeDasharray="5 5" />
                <polygon points={`305,${y - 3} 315,${y} 305,${y + 3}`} fill="#94a3b8" />
              </g>
            ))}
            <text x="300" y="80" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Magnetic Field (B) →
            </text>

            {/* Rotating Armature Coil (Center) */}
            <g transform={`translate(300, 140) rotate(${motorAngle})`}>
              {/* Armature rectangle ABCD */}
              <rect
                x="-100"
                y="-55"
                width="200"
                height="110"
                fill="none"
                stroke={isCurrentOn ? '#f59e0b' : '#64748b'}
                strokeWidth="5"
                rx="8"
              />

              {/* Labels on Arms */}
              <text x="-90" y="0" fill="#f59e0b" fontSize="11" fontWeight="bold">AB</text>
              <text x="70" y="0" fill="#f59e0b" fontSize="11" fontWeight="bold">CD</text>

              {/* Fleming Force Vectors */}
              {isCurrentOn && (
                <>
                  {/* Downward force on Left Arm */}
                  <line x1="-100" y1="-20" x2="-100" y2={isReversed ? "-65" : "30"} stroke="#10b981" strokeWidth="3.5" />
                  <polygon points={isReversed ? "-104,-65 -96,-65 -100,-75" : "-104,30 -96,30 -100,40"} fill="#10b981" />
                  <text x="-140" y="25" fill="#10b981" fontSize="10" fontWeight="bold">Force F₁</text>

                  {/* Upward force on Right Arm */}
                  <line x1="100" y1="20" x2="100" y2={isReversed ? "65" : "-30"} stroke="#10b981" strokeWidth="3.5" />
                  <polygon points={isReversed ? "96,65 104,65 100,75" : "96,-30 104,-30 100,-40"} fill="#10b981" />
                  <text x="110" y="-15" fill="#10b981" fontSize="10" fontWeight="bold">Force F₂</text>
                </>
              )}
            </g>

            {/* Split-ring Commutator (P & Q) */}
            <g transform="translate(300, 230)">
              <path d="M -16 -12 A 16 16 0 0 1 -16 12" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <path d="M 16 -12 A 16 16 0 0 1 16 12" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <text x="0" y="24" fill="#cbd5e1" fontSize="9" textAnchor="middle">Split-Ring Commutator</text>
            </g>

            {/* Stationary Carbon Brushes X & Y */}
            <rect x="274" y="224" width="8" height="12" fill="#475569" />
            <rect x="318" y="224" width="8" height="12" fill="#475569" />
            <text x="260" y="234" fill="#94a3b8" fontSize="9">Brush X</text>
            <text x="332" y="234" fill="#94a3b8" fontSize="9">Brush Y</text>
          </svg>
        )}

        {activeTab === 'straight-wire' && (
          <svg viewBox="0 0 600 260" className="w-full h-64 select-none">
            {/* Horizontal Cardboard Plane */}
            <polygon
              points="140,80 460,80 420,200 100,200"
              fill="rgba(30, 41, 59, 0.7)"
              stroke="#475569"
              strokeWidth="2"
            />
            <text x="120" y="110" fill="#94a3b8" fontSize="10">Cardboard Plane</text>

            {/* Vertical Wire Piercing Center */}
            <line x1="280" y1="20" x2="280" y2="240" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <text x="290" y="40" fill="#f59e0b" fontSize="11" fontWeight="bold">
              Current I ({isReversed ? 'Downwards ↓' : 'Upwards ↑'})
            </text>

            {/* Concentric Magnetic Field Circles */}
            {[40, 70, 100].map((r, idx) => (
              <ellipse
                key={idx}
                cx="280"
                cy="140"
                rx={r}
                ry={r * 0.45}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            ))}

            {/* Compass Indicators showing direction according to Right-Hand Thumb Rule */}
            <g transform="translate(340, 140)">
              <circle cx="0" cy="0" r="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="0" y2={isReversed ? "-9" : "9"} stroke="#ef4444" strokeWidth="2.5" />
              <polygon points={isReversed ? "-3,-7 3,-7 0,-11" : "-3,7 3,7 0,11"} fill="#ef4444" />
            </g>

            {/* Right Hand Thumb Rule Explanation Badge */}
            <text x="280" y="225" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isReversed
                ? 'Thumb points Downwards ⇒ Magnetic field is Clockwise'
                : 'Thumb points Upwards ⇒ Magnetic field is Anti-Clockwise'}
            </text>
          </svg>
        )}

        {activeTab === 'solenoid' && (
          <svg viewBox="0 0 600 260" className="w-full h-64 select-none">
            {/* Soft Iron Core */}
            {hasIronCore && (
              <rect x="180" y="115" width="240" height="30" fill="#64748b" rx="4" />
            )}

            {/* Solenoid Helical Wire Coil */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((coil) => (
              <g key={coil} transform={`translate(${190 + coil * 28}, 100)`}>
                <ellipse cx="14" cy="30" rx="12" ry="24" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
                {/* Current arrow */}
                <polygon points="12,10 16,10 14,5" fill="#f59e0b" />
              </g>
            ))}

            {/* Uniform Internal Field Lines (Straight parallel lines inside) */}
            <line x1="160" y1="125" x2="440" y2="125" stroke="#38bdf8" strokeWidth="2" />
            <line x1="160" y1="135" x2="440" y2="135" stroke="#38bdf8" strokeWidth="2" />

            {/* External Looping Field Lines */}
            <path
              d="M 440 120 C 520 40 80 40 160 120"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 440 140 C 520 220 80 220 160 140"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Magnetic Poles */}
            <text x="130" y="135" fill="#ef4444" fontSize="16" fontWeight="bold">
              {isReversed ? 'S' : 'N'}
            </text>
            <text x="460" y="135" fill="#3b82f6" fontSize="16" fontWeight="bold">
              {isReversed ? 'N' : 'S'}
            </text>

            <text x="300" y="240" fill="#94a3b8" fontSize="11" textAnchor="middle">
              Inside a solenoid, magnetic field lines are uniform parallel straight lines.
            </text>
          </svg>
        )}

        {/* Controls Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCurrentOn(!isCurrentOn)}
            className={`px-3 py-1 text-xs font-semibold rounded-md shadow-xs transition-all ${
              isCurrentOn ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isCurrentOn ? 'Current ON' : 'Current OFF'}
          </button>
          <button
            type="button"
            onClick={() => setIsReversed(!isReversed)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
          >
            <RotateCw className="w-3 h-3" /> Reverse Polarity
          </button>
          {activeTab === 'solenoid' && (
            <button
              type="button"
              onClick={() => setHasIronCore(!hasIronCore)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                hasIronCore ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {hasIronCore ? 'Soft Iron Core (In)' : 'No Core (Air)'}
            </button>
          )}
        </div>
      </div>

      {/* Rules Explanations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-semibold text-slate-900 dark:text-white mb-1">
            Fleming’s Left-Hand Rule (Electric Motor)
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Stretch thumb, forefinger, and middle finger mutually perpendicular:
            <br />
            • <strong>Forefinger:</strong> Magnetic Field (N → S)
            <br />
            • <strong>Middle finger:</strong> Current (Positive → Negative)
            <br />
            • <strong>Thumb:</strong> Motion / Force experienced by the conductor
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-semibold text-slate-900 dark:text-white mb-1">
            Function of Split-Ring Commutator
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Reverses the direction of current in coil arms AB and CD after every 180° rotation. This keeps the couple of forces turning the rotor continuously in the same direction!
          </p>
        </div>
      </div>
    </div>
  );
};
