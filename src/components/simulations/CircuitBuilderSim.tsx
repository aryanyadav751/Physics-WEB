import React, { useState } from 'react';
import { Zap, GitMerge, Layers, CheckCircle2, Info } from 'lucide-react';

export const CircuitBuilderSim: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [supplyVoltage, setSupplyVoltage] = useState<number>(12); // V
  const [r1, setR1] = useState<number>(6); // Ω
  const [r2, setR2] = useState<number>(12); // Ω
  const [r3, setR3] = useState<number>(4); // Ω

  // Math:
  // Series: R_eq = R1 + R2 + R3
  // Current: I = V / R_eq
  // Voltage drops: V1 = I * R1, V2 = I * R2, V3 = I * R3
  const seriesReq = r1 + r2 + r3;
  const seriesI = supplyVoltage / seriesReq;
  const seriesV1 = seriesI * r1;
  const seriesV2 = seriesI * r2;
  const seriesV3 = seriesI * r3;
  const seriesPower = supplyVoltage * seriesI;

  // Parallel: 1/R_eq = 1/R1 + 1/R2 + 1/R3
  const parallelReq = 1 / (1 / r1 + 1 / r2 + 1 / r3);
  const parallelI1 = supplyVoltage / r1;
  const parallelI2 = supplyVoltage / r2;
  const parallelI3 = supplyVoltage / r3;
  const parallelTotalI = parallelI1 + parallelI2 + parallelI3;
  const parallelPower = supplyVoltage * parallelTotalI;

  const currentReq = circuitType === 'series' ? seriesReq : parallelReq;
  const currentTotalI = circuitType === 'series' ? seriesI : parallelTotalI;
  const currentTotalPower = circuitType === 'series' ? seriesPower : parallelPower;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
              Experiment 06 • Electricity
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Series & Parallel Resistor Networks Workbench
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle between series & parallel combinations; inspect branch currents, voltage drops, and equivalent resistance.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setCircuitType('series')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              circuitType === 'series'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Series Network
          </button>
          <button
            type="button"
            onClick={() => setCircuitType('parallel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              circuitType === 'parallel'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" /> Parallel Network
          </button>
        </div>
      </div>

      {/* Interactive Circuit Schematic */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-3 select-none">
        <svg viewBox="0 0 600 240" className="w-full h-52 sm:h-64">
          {/* Battery (Left Side) */}
          <g transform="translate(60, 120)">
            <line x1="0" y1="-50" x2="0" y2="-10" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="-15" y1="-10" x2="15" y2="-10" stroke="#f59e0b" strokeWidth="3" />
            <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#94a3b8" strokeWidth="2" />
            <line x1="-15" y1="6" x2="15" y2="6" stroke="#f59e0b" strokeWidth="3" />
            <line x1="-8" y1="14" x2="8" y2="14" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="14" x2="0" y2="50" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-48" y="4" fill="#f59e0b" fontSize="11" fontWeight="bold">+{supplyVoltage}V -</text>
          </g>

          {circuitType === 'series' ? (
            /* Series Topology */
            <g>
              {/* Loop Wires */}
              <path
                d="M 60 70 L 60 40 L 520 40 L 520 200 L 60 200 L 60 170"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Resistor 1 */}
              <g transform="translate(130, 40)">
                <rect x="0" y="-12" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                <text x="35" y="-16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₁: {r1} Ω</text>
                <text x="35" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">V₁ = {seriesV1.toFixed(2)} V</text>
              </g>

              {/* Resistor 2 */}
              <g transform="translate(250, 40)">
                <rect x="0" y="-12" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                <text x="35" y="-16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₂: {r2} Ω</text>
                <text x="35" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">V₂ = {seriesV2.toFixed(2)} V</text>
              </g>

              {/* Resistor 3 */}
              <g transform="translate(370, 40)">
                <rect x="0" y="-12" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                <text x="35" y="-16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₃: {r3} Ω</text>
                <text x="35" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">V₃ = {seriesV3.toFixed(2)} V</text>
              </g>

              {/* Current Label on Return Wire */}
              <text x="290" y="192" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                Current I is constant everywhere = {seriesI.toFixed(2)} A
              </text>
            </g>
          ) : (
            /* Parallel Topology */
            <g>
              {/* Main Feed Rails */}
              <line x1="60" y1="70" x2="60" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="60" y1="40" x2="200" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="200" y1="40" x2="200" y2="200" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="200" y1="200" x2="60" y2="200" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="60" y1="200" x2="60" y2="170" stroke="#38bdf8" strokeWidth="2.5" />

              <line x1="440" y1="40" x2="440" y2="200" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Branch 1 (Top) */}
              <path d="M 200 60 L 260 60" stroke="#38bdf8" strokeWidth="2" />
              <rect x="260" y="48" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="295" y="44" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₁: {r1} Ω</text>
              <text x="295" y="64" fill="#ffffff" fontSize="9" textAnchor="middle">{supplyVoltage} V</text>
              <path d="M 330 60 L 440 60" stroke="#38bdf8" strokeWidth="2" />
              <text x="385" y="55" fill="#10b981" fontSize="9" fontWeight="bold">I₁ = {parallelI1.toFixed(2)} A</text>

              {/* Branch 2 (Middle) */}
              <path d="M 200 120 L 260 120" stroke="#38bdf8" strokeWidth="2" />
              <rect x="260" y="108" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="295" y="104" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₂: {r2} Ω</text>
              <text x="295" y="124" fill="#ffffff" fontSize="9" textAnchor="middle">{supplyVoltage} V</text>
              <path d="M 330 120 L 440 120" stroke="#38bdf8" strokeWidth="2" />
              <text x="385" y="115" fill="#10b981" fontSize="9" fontWeight="bold">I₂ = {parallelI2.toFixed(2)} A</text>

              {/* Branch 3 (Bottom) */}
              <path d="M 200 180 L 260 180" stroke="#38bdf8" strokeWidth="2" />
              <rect x="260" y="168" width="70" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="295" y="164" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">R₃: {r3} Ω</text>
              <text x="295" y="184" fill="#ffffff" fontSize="9" textAnchor="middle">{supplyVoltage} V</text>
              <path d="M 330 180 L 440 180" stroke="#38bdf8" strokeWidth="2" />
              <text x="385" y="175" fill="#10b981" fontSize="9" fontWeight="bold">I₃ = {parallelI3.toFixed(2)} A</text>

              {/* Main Total Current Label */}
              <text x="130" y="32" fill="#f59e0b" fontSize="10" fontWeight="bold">
                Total I = I₁ + I₂ + I₃ = {parallelTotalI.toFixed(2)} A
              </text>
            </g>
          )}
        </svg>

        {/* Live Network Metrics Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Network Results:
          </div>
          <div className="space-y-0.5 font-mono">
            <div>
              <span className="text-slate-400">Equivalent R: </span>
              <strong className="text-cyan-300">{currentReq.toFixed(2)} Ω</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Current: </span>
              <strong className="text-emerald-300">{currentTotalI.toFixed(2)} A</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Power: </span>
              <strong className="text-amber-300">{currentTotalPower.toFixed(2)} W</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Resistor Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Battery V</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{supplyVoltage} V</span>
          </div>
          <input
            type="range"
            min="2"
            max="24"
            step="1"
            value={supplyVoltage}
            onChange={(e) => setSupplyVoltage(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Resistor R₁</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{r1} Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={r1}
            onChange={(e) => setR1(Number(e.target.value))}
            className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Resistor R₂</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{r2} Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={r2}
            onChange={(e) => setR2(Number(e.target.value))}
            className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Resistor R₃</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{r3} Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={r3}
            onChange={(e) => setR3(Number(e.target.value))}
            className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
