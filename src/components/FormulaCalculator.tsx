import React, { useState } from 'react';
import { Calculator, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export const FormulaCalculator: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<
    'mirror' | 'lens' | 'ohms-law' | 'resistance' | 'series-parallel' | 'joules-power'
  >('mirror');

  // Mirror state
  const [mU, setMU] = useState<number>(-30); // cm
  const [mF, setMF] = useState<number>(-20); // cm (concave)
  const [mH, setMH] = useState<number>(4); // cm

  // Mirror calculation: 1/v = 1/f - 1/u => v = (f*u) / (u - f)
  const mirrorDenom = mU - mF;
  const mirrorV = Math.abs(mirrorDenom) < 0.001 ? 99999 : (mF * mU) / mirrorDenom;
  const mirrorM = -mirrorV / mU;
  const mirrorHi = mH * mirrorM;

  // Lens state
  const [lU, setLU] = useState<number>(-25); // cm
  const [lF, setLF] = useState<number>(15); // cm (convex)
  const [lH, setLH] = useState<number>(3); // cm

  // Lens calculation: 1/v = 1/f + 1/u => v = (f*u) / (u + f)
  const lensDenom = lU + lF;
  const lensV = Math.abs(lensDenom) < 0.001 ? 99999 : (lF * lU) / lensDenom;
  const lensM = lensV / lU;
  const lensHi = lH * lensM;
  const lensP = 100 / lF;

  // Ohm's law state
  const [ohmV, setOhmV] = useState<number>(12); // V
  const [ohmR, setOhmR] = useState<number>(4); // Ω
  const ohmI = ohmR > 0 ? ohmV / ohmR : 0;
  const ohmP = ohmV * ohmI;

  // Conductor Resistance: R = ρ * l / A
  const [resRho, setResRho] = useState<number>(1.68e-8); // Copper
  const [resL, setResL] = useState<number>(10); // metres
  const [resA, setResA] = useState<number>(1e-6); // 1 mm² = 1e-6 m²
  const calcR = (resRho * resL) / resA;

  // Combination of Resistors
  const [cr1, setCr1] = useState<number>(10);
  const [cr2, setCr2] = useState<number>(20);
  const [cr3, setCr3] = useState<number>(30);
  const combSeries = cr1 + cr2 + cr3;
  const combParallel = 1 / (1 / (cr1 || 1) + 1 / (cr2 || 1) + 1 / (cr3 || 1));

  // Joule's Heating: H = I²Rt
  const [heatI, setHeatI] = useState<number>(5); // A
  const [heatR, setHeatR] = useState<number>(20); // Ω
  const [heatT, setHeatT] = useState<number>(60); // seconds
  const heatJoules = Math.pow(heatI, 2) * heatR * heatT;
  const heatPower = Math.pow(heatI, 2) * heatR;
  const heatKwh = (heatPower * (heatT / 3600)) / 1000;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
          Interactive Physics Calculator
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          CBSE Formula Solver & Step-by-Step Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
          Enter variables with proper CBSE Cartesian signs to inspect the exact mathematical substitutions, intermediate steps, and SI units.
        </p>

        {/* Calculator Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'mirror', label: 'Spherical Mirror Formula' },
            { id: 'lens', label: 'Lens Formula & Power (P = 1/f)' },
            { id: 'ohms-law', label: 'Ohm’s Law & Power' },
            { id: 'resistance', label: 'Resistivity R = ρ·l/A' },
            { id: 'series-parallel', label: 'Series & Parallel Combinations' },
            { id: 'joules-power', label: 'Joule’s Heating & Energy Bill' },
          ].map((calc) => (
            <button
              key={calc.id}
              type="button"
              onClick={() => setActiveCalc(calc.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCalc === calc.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {calc.label}
            </button>
          ))}
        </div>
      </div>

      {/* CALCULATOR 1: MIRROR FORMULA */}
      {activeCalc === 'mirror' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mirror Formula & Linear Magnification
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              1/f = 1/v + 1/u &nbsp;|&nbsp; m = -v / u = h_i / h_o
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Object Distance u (cm)
              </label>
              <input
                type="number"
                value={mU}
                onChange={(e) => setMU(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">Always negative in front of mirror</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Focal Length f (cm)
              </label>
              <input
                type="number"
                value={mF}
                onChange={(e) => setMF(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">-ve for Concave, +ve for Convex</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Object Height h_o (cm)
              </label>
              <input
                type="number"
                value={mH}
                onChange={(e) => setMH(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">Usually positive (+h_o)</span>
            </div>
          </div>

          {/* Mathematical Step Breakdown */}
          <div className="p-5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-3">
            <span className="text-blue-400 font-bold block">CBSE Step-by-Step Mathematical Derivation:</span>
            <div className="space-y-1 text-slate-300">
              <p>Step 1: Formula: 1/v = 1/f - 1/u</p>
              <p>Step 2: Substitute: 1/v = 1/({mF}) - 1/({mU})</p>
              <p>Step 3: Image Distance v = ({mF} × {mU}) / ({mU} - {mF}) = <strong className="text-amber-400">{mirrorV.toFixed(2)} cm</strong></p>
              <p>Step 4: Magnification m = -v / u = -({mirrorV.toFixed(2)}) / ({mU}) = <strong className="text-emerald-400">{mirrorM.toFixed(2)}</strong></p>
              <p>Step 5: Image Height h_i = m × h_o = {mirrorM.toFixed(2)} × {mH} = <strong className="text-purple-400">{mirrorHi.toFixed(2)} cm</strong></p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-bold">
              <span className={mirrorV < 0 ? 'text-emerald-400' : 'text-purple-400'}>
                Nature: {mirrorV < 0 ? 'Real & Inverted (in front of mirror)' : 'Virtual & Erect (behind mirror)'}
              </span>
              <span className="text-sky-300">
                Size: {Math.abs(mirrorM) > 1.05 ? 'Magnified' : Math.abs(mirrorM) < 0.95 ? 'Diminished' : 'Same Size'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: LENS FORMULA & POWER */}
      {activeCalc === 'lens' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Lens Formula & Power of Lens
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              1/f = 1/v - 1/u &nbsp;|&nbsp; m = +v / u &nbsp;|&nbsp; P = 1 / f(in m) = 100 / f(in cm)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Object Distance u (cm)
              </label>
              <input
                type="number"
                value={lU}
                onChange={(e) => setLU(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">Always negative (-ve)</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Focal Length f (cm)
              </label>
              <input
                type="number"
                value={lF}
                onChange={(e) => setLF(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">+ve for Convex, -ve for Concave</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Object Height h_o (cm)
              </label>
              <input
                type="number"
                value={lH}
                onChange={(e) => setLH(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          {/* Mathematical Step Breakdown */}
          <div className="p-5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-3">
            <span className="text-emerald-400 font-bold block">CBSE Step-by-Step Mathematical Derivation:</span>
            <div className="space-y-1 text-slate-300">
              <p>Step 1: Formula: 1/v = 1/f + 1/u</p>
              <p>Step 2: Substitute: 1/v = 1/({lF}) + 1/({lU})</p>
              <p>Step 3: Image Distance v = ({lF} × {lU}) / ({lU} + {lF}) = <strong className="text-amber-400">{lensV.toFixed(2)} cm</strong></p>
              <p>Step 4: Magnification m = +v / u = ({lensV.toFixed(2)}) / ({lU}) = <strong className="text-emerald-400">{lensM.toFixed(2)}</strong></p>
              <p>Step 5: Image Height h_i = m × h_o = {lensM.toFixed(2)} × {lH} = <strong className="text-purple-400">{lensHi.toFixed(2)} cm</strong></p>
              <p>Step 6: Power of Lens P = 100 / f(cm) = 100 / ({lF}) = <strong className="text-sky-400">{lensP > 0 ? `+${lensP.toFixed(2)}` : lensP.toFixed(2)} Dioptres (D)</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: OHM'S LAW */}
      {activeCalc === 'ohms-law' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Ohm’s Law, Current & Power
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              V = I · R &nbsp;|&nbsp; I = V / R &nbsp;|&nbsp; P = V · I = I² · R = V² / R
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Potential Difference V (Volts)
              </label>
              <input
                type="number"
                value={ohmV}
                onChange={(e) => setOhmV(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistance R (Ohms, Ω)
              </label>
              <input
                type="number"
                value={ohmR}
                onChange={(e) => setOhmR(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-2">
            <p>Current I = V / R = {ohmV} V / {ohmR} Ω = <strong className="text-sky-400">{ohmI.toFixed(2)} Amperes (A)</strong></p>
            <p>Electric Power P = V × I = {ohmV} V × {ohmI.toFixed(2)} A = <strong className="text-amber-400">{ohmP.toFixed(2)} Watts (W)</strong></p>
            <p>Conductance G = 1 / R = 1 / {ohmR} = <strong className="text-emerald-400">{(1 / ohmR).toFixed(3)} Siemens (S)</strong></p>
          </div>
        </div>
      )}

      {/* CALCULATOR 4: CONDUCTOR RESISTIVITY */}
      {activeCalc === 'resistance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Resistance & Resistivity of Conductor
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              R = ρ · (l / A) &nbsp;|&nbsp; ρ in Ω·m, l in m, A in m²
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Length of Wire l (m)
              </label>
              <input
                type="number"
                value={resL}
                onChange={(e) => setResL(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Area of Cross-section A (m²)
              </label>
              <input
                type="number"
                step="0.000001"
                value={resA}
                onChange={(e) => setResA(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400">1 mm² = 1.0 × 10^-6 m²</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistivity ρ (Ω·m)
              </label>
              <select
                onChange={(e) => setResRho(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
              >
                <option value={1.68e-8}>Copper (1.68 × 10^-8)</option>
                <option value={2.63e-8}>Aluminium (2.63 × 10^-8)</option>
                <option value={1.0e-6}>Nichrome (1.0 × 10^-6)</option>
                <option value={1.0e-4}>Iron (1.0 × 10^-7)</option>
              </select>
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-2">
            <p>Calculated Resistance R = ρ · (l / A) = <strong className="text-amber-400">{calcR.toFixed(3)} Ω</strong></p>
            <p className="text-slate-400 text-xs">
              Board Tip: If the wire is stretched to double its length (l' = 2l), volume V remains constant, so A' = A/2. The new resistance becomes 4R!
            </p>
          </div>
        </div>
      )}

      {/* CALCULATOR 5: SERIES & PARALLEL */}
      {activeCalc === 'series-parallel' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Series vs Parallel Equivalent Resistance
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              R_s = R₁ + R₂ + R₃ &nbsp;|&nbsp; 1/R_p = 1/R₁ + 1/R₂ + 1/R₃
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistor R₁ (Ω)
              </label>
              <input
                type="number"
                value={cr1}
                onChange={(e) => setCr1(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistor R₂ (Ω)
              </label>
              <input
                type="number"
                value={cr2}
                onChange={(e) => setCr2(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistor R₃ (Ω)
              </label>
              <input
                type="number"
                value={cr3}
                onChange={(e) => setCr3(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-1">
              <span className="text-cyan-400 font-bold block">In Series Connection:</span>
              <p>R_s = R₁ + R₂ + R₃</p>
              <p>R_s = {cr1} + {cr2} + {cr3} = <strong className="text-emerald-400">{combSeries} Ω</strong></p>
              <span className="text-slate-400 text-xs block pt-1">
                Note: Greater than the highest resistor ({Math.max(cr1, cr2, cr3)} Ω).
              </span>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-1">
              <span className="text-purple-400 font-bold block">In Parallel Connection:</span>
              <p>1/R_p = 1/{cr1} + 1/{cr2} + 1/{cr3}</p>
              <p>R_p = <strong className="text-emerald-400">{combParallel.toFixed(2)} Ω</strong></p>
              <span className="text-slate-400 text-xs block pt-1">
                Note: Smaller than the lowest resistor ({Math.min(cr1, cr2, cr3)} Ω).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 6: JOULE'S HEATING & BILL */}
      {activeCalc === 'joules-power' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Joule’s Law of Heating & Commercial Energy Bill
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              H = I² · R · t &nbsp;|&nbsp; 1 kWh = 1 Unit = 3.6 × 10^6 Joules
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Current I (Amperes, A)
              </label>
              <input
                type="number"
                value={heatI}
                onChange={(e) => setHeatI(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Resistance R (Ω)
              </label>
              <input
                type="number"
                value={heatR}
                onChange={(e) => setHeatR(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                Time t (Seconds)
              </label>
              <input
                type="number"
                value={heatT}
                onChange={(e) => setHeatT(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs sm:text-sm space-y-2">
            <p>Heat Generated H = I² · R · t = ({heatI})² × {heatR} × {heatT} = <strong className="text-rose-400">{heatJoules.toLocaleString()} Joules (J)</strong></p>
            <p>Electrical Power P = I² · R = <strong className="text-amber-400">{heatPower} Watts (W)</strong></p>
            <p>Commercial Energy = (P × t) / (1000 × 3600) = <strong className="text-emerald-400">{heatKwh.toFixed(4)} kWh (Units)</strong></p>
            <p className="text-slate-400 text-xs pt-1">
              At ₹7 per unit, cost of operation for this duration = ₹{(heatKwh * 7).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
