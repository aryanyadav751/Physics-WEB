import React, { useState } from 'react';
import { Power, PlusCircle, Trash2, CheckCircle2, TrendingUp } from 'lucide-react';

interface DataPoint {
  voltage: number;
  current: number;
}

export const OhmsLawSim: React.FC = () => {
  const [circuitClosed, setCircuitClosed] = useState<boolean>(true);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(6.0); // Volts
  const [wireResistance, setWireResistance] = useState<number>(10.0); // Ohms
  const [rheostatResistance, setRheostatResistance] = useState<number>(5.0); // Ohms
  const [recordedPoints, setRecordedPoints] = useState<DataPoint[]>([
    { voltage: 1.5, current: 0.15 },
    { voltage: 3.0, current: 0.30 },
    { voltage: 4.5, current: 0.45 },
  ]);

  // Circuit calculation
  const totalR = wireResistance + rheostatResistance;
  const current = circuitClosed ? batteryVoltage / totalR : 0;
  // Voltage drop across the test wire
  const measuredV = circuitClosed ? current * wireResistance : 0;

  const handleRecordPoint = () => {
    if (!circuitClosed) return;
    const newPt = {
      voltage: Number(measuredV.toFixed(2)),
      current: Number(current.toFixed(2)),
    };
    // Don't add duplicate
    if (!recordedPoints.some((p) => Math.abs(p.voltage - newPt.voltage) < 0.05)) {
      setRecordedPoints([...recordedPoints, newPt].sort((a, b) => a.voltage - b.voltage));
    }
  };

  const handleResetGraph = () => {
    setRecordedPoints([]);
  };

  // Graph dimensions
  const graphWidth = 320;
  const graphHeight = 220;
  const padLeft = 40;
  const padBottom = 30;
  const maxV = 10;
  const maxI = 1.0;

  const toGraphX = (v: number) => padLeft + (v / maxV) * (graphWidth - padLeft - 20);
  const toGraphY = (i: number) => graphHeight - padBottom - (i / maxI) * (graphHeight - padBottom - 20);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              Experiment 05 • Electricity
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ohm’s Law Verification & V-I Graph Plotter
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vary battery voltage and rheostat resistance, read live meters, and plot the real-time V-I linear curve.
          </p>
        </div>

        {/* Plug Key Switch */}
        <button
          type="button"
          onClick={() => setCircuitClosed(!circuitClosed)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
            circuitClosed
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {circuitClosed ? 'Circuit ON (Key In)' : 'Circuit OFF (Key Out)'}
        </button>
      </div>

      {/* Main Simulation View: Circuit Workbench + Live V-I Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Interactive Circuit Schematic & Dials */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Circuit Workbench</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${circuitClosed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {circuitClosed ? 'CURRENT FLOWING' : 'OPEN CIRCUIT'}
            </span>
          </div>

          {/* SVG Schematic */}
          <svg viewBox="0 0 320 180" className="w-full h-44 select-none">
            {/* Battery */}
            <g transform="translate(40, 90)">
              <line x1="-20" y1="0" x2="-8" y2="0" stroke="#94a3b8" strokeWidth="2" />
              <line x1="-8" y1="-16" x2="-8" y2="16" stroke="#f59e0b" strokeWidth="3" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#94a3b8" strokeWidth="2" />
              <line x1="8" y1="-16" x2="8" y2="16" stroke="#f59e0b" strokeWidth="3" />
              <line x1="16" y1="-8" x2="16" y2="8" stroke="#94a3b8" strokeWidth="2" />
              <line x1="16" y1="0" x2="28" y2="0" stroke="#94a3b8" strokeWidth="2" />
              <text x="-12" y="-22" fill="#f59e0b" fontSize="9" fontWeight="bold">+{batteryVoltage}V -</text>
            </g>

            {/* Circuit Wire Rectangle */}
            <path
              d="M 68 90 L 290 90 L 290 30 L 220 30 M 140 30 L 20 30 L 20 90"
              fill="none"
              stroke={circuitClosed ? '#38bdf8' : '#475569'}
              strokeWidth="2.5"
            />

            {/* Ammeter in Series (Top Right) */}
            <circle cx="260" cy="30" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="256" y="34" fill="#38bdf8" fontSize="12" fontWeight="bold">A</text>
            <text x="245" y="56" fill="#94a3b8" fontSize="9">{current.toFixed(2)} A</text>

            {/* Test Resistor Wire (Top Middle) */}
            <rect x="150" y="24" width="60" height="12" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
            <text x="160" y="18" fill="#f59e0b" fontSize="9" fontWeight="bold">R = {wireResistance} Ω</text>

            {/* Voltmeter in Parallel across Test Wire */}
            <path d="M 145 30 L 145 70 L 165 70" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="180" cy="70" r="14" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <text x="176" y="74" fill="#a855f7" fontSize="12" fontWeight="bold">V</text>
            <path d="M 195 70 L 215 70 L 215 30" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="165" y="96" fill="#a855f7" fontSize="9">{measuredV.toFixed(2)} V</text>

            {/* Rheostat (Bottom Right) */}
            <g transform="translate(190, 90)">
              <rect x="0" y="-6" width="50" height="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              {/* Arrow wiper */}
              <line x1="25" y1="-18" x2="25" y2="-6" stroke="#e2e8f0" strokeWidth="2" />
              <polygon points="22,-6 28,-6 25,-1" fill="#e2e8f0" />
              <text x="5" y="20" fill="#94a3b8" fontSize="9">Rh = {rheostatResistance} Ω</text>
            </g>

            {/* Plug Key (Bottom Left) */}
            <circle cx="120" cy="90" r="6" fill={circuitClosed ? '#10b981' : '#f43f5e'} />
            <text x="110" y="112" fill="#94a3b8" fontSize="9">Key ({circuitClosed ? 'closed' : 'open'})</text>
          </svg>

          {/* Digital Readout Tiles */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Voltmeter (V):</span>
              <span className="font-mono text-base font-bold text-purple-400">{measuredV.toFixed(2)} V</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Ammeter (I):</span>
              <span className="font-mono text-base font-bold text-sky-400">{current.toFixed(2)} A</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time V-I Graph Plotter */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live V-I Graph (Ohm’s Law)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRecordPoint}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-all shadow-xs"
              >
                <PlusCircle className="w-3 h-3" /> Record (V, I)
              </button>
              <button
                type="button"
                onClick={handleResetGraph}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
                title="Clear Plot"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Coordinate Graph */}
          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-44 select-none">
            {/* Axes */}
            <line x1={padLeft} y1={graphHeight - padBottom} x2={graphWidth - 10} y2={graphHeight - padBottom} stroke="#64748b" strokeWidth="1.5" />
            <line x1={padLeft} y1={10} x2={padLeft} y2={graphHeight - padBottom} stroke="#64748b" strokeWidth="1.5" />

            {/* Labels */}
            <text x={graphWidth - 35} y={graphHeight - padBottom + 18} fill="#94a3b8" fontSize="10" fontWeight="bold">V (Volts)</text>
            <text x="8" y="20" fill="#94a3b8" fontSize="10" fontWeight="bold">I (Amps)</text>

            {/* Grid markings */}
            {[2, 4, 6, 8].map((v) => (
              <g key={`v-${v}`}>
                <line x1={toGraphX(v)} y1={graphHeight - padBottom} x2={toGraphX(v)} y2={graphHeight - padBottom + 4} stroke="#64748b" />
                <text x={toGraphX(v) - 4} y={graphHeight - padBottom + 15} fill="#64748b" fontSize="8">{v}</text>
              </g>
            ))}
            {[0.2, 0.4, 0.6, 0.8].map((i) => (
              <g key={`i-${i}`}>
                <line x1={padLeft - 4} y1={toGraphY(i)} x2={padLeft} y2={toGraphY(i)} stroke="#64748b" />
                <text x={padLeft - 22} y={toGraphY(i) + 3} fill="#64748b" fontSize="8">{i}</text>
              </g>
            ))}

            {/* Theoretical Ohm's Law straight line through origin */}
            <line
              x1={toGraphX(0)}
              y1={toGraphY(0)}
              x2={toGraphX(8)}
              y2={toGraphY(8 / wireResistance)}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Recorded Plot Points */}
            {recordedPoints.map((pt, idx) => (
              <g key={idx}>
                <circle cx={toGraphX(pt.voltage)} cy={toGraphY(pt.current)} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <text x={toGraphX(pt.voltage) + 5} y={toGraphY(pt.current) - 4} fill="#38bdf8" fontSize="8">
                  ({pt.voltage}V, {pt.current}A)
                </text>
              </g>
            ))}

            {/* Current Active Dot */}
            {circuitClosed && (
              <circle
                cx={toGraphX(measuredV)}
                cy={toGraphY(current)}
                r="5"
                fill="#f59e0b"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Slope & Resistance Result */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Slope = ΔI / ΔV = 1/R:</span>
            <span className="text-emerald-400 font-bold">
              R = {(measuredV / (current || 0.0001)).toFixed(1)} Ω (Constant)
            </span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Battery Voltage (V_total)</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{batteryVoltage} V</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="12.0"
            step="0.5"
            value={batteryVoltage}
            onChange={(e) => setBatteryVoltage(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1.5 V</span>
            <span>12.0 V</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Wire Resistance (R)</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{wireResistance} Ω</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="25.0"
            step="1.0"
            value={wireResistance}
            onChange={(e) => setWireResistance(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>2.0 Ω</span>
            <span>25.0 Ω</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Rheostat Slider (Rh)</span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{rheostatResistance} Ω</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={rheostatResistance}
            onChange={(e) => setRheostatResistance(Number(e.target.value))}
            className="w-full accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0 Ω (Min)</span>
            <span>20 Ω (Max)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
