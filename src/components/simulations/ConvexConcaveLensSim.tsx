import React, { useState } from 'react';
import { Eye, Info, CheckCircle2 } from 'lucide-react';

export const ConvexConcaveLensSim: React.FC = () => {
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [focalLength, setFocalLength] = useState<number>(60); // absolute magnitude in mm
  const [objectDistance, setObjectDistance] = useState<number>(120); // magnitude in mm (always left, u < 0)
  const [objectHeight, setObjectHeight] = useState<number>(40); // mm

  // Sign Convention:
  // Convex lens: f is positive (+focalLength)
  // Concave lens: f is negative (-focalLength)
  // Object: u is always negative (-objectDistance)
  const f = lensType === 'convex' ? focalLength : -focalLength;
  const u = -objectDistance;

  // Lens formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  const denom = u + f;
  const isAtFocus = Math.abs(denom) < 0.001;
  const v = isAtFocus ? 99999 : (f * u) / denom;

  // Magnification for lens: m = +v / u
  const m = isAtFocus ? 999 : v / u;
  const imageHeight = objectHeight * m;

  // Power in Dioptres: P = 100 / f(cm)
  const powerDioptres = 100 / (f / 10);

  // Nature
  const isReal = v > 0;
  const isVirtual = v < 0;
  const isMagnified = Math.abs(m) > 1.05;
  const isDiminished = Math.abs(m) < 0.95;

  const svgWidth = 640;
  const svgHeight = 280;
  const opticalCentreX = 320;
  const axisY = 140;
  const scale = 1.6;

  const objX = opticalCentreX - objectDistance * scale;
  const objY = axisY - objectHeight * scale;

  const f1X = opticalCentreX - focalLength * scale;
  const twoF1X = opticalCentreX - 2 * focalLength * scale;
  const f2X = opticalCentreX + focalLength * scale;
  const twoF2X = opticalCentreX + 2 * focalLength * scale;

  const imgX = opticalCentreX + v * scale;
  const imgY = axisY - imageHeight * scale;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              Experiment 02 • Light
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Spherical Lens Optical Bench & Power Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore refraction through thin lenses, power in Dioptres (P = 1/f), and the lens formula (1/f = 1/v - 1/u).
          </p>
        </div>

        {/* Lens Type Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => {
              setLensType('convex');
              setObjectDistance(120);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              lensType === 'convex'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Convex Lens (Converging)
          </button>
          <button
            type="button"
            onClick={() => {
              setLensType('concave');
              setObjectDistance(90);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              lensType === 'concave'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Concave Lens (Diverging)
          </button>
        </div>
      </div>

      {/* Interactive Ray Diagram Canvas */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 sm:h-72">
          {/* Subtle Grid */}
          <defs>
            <pattern id="lensGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#lensGrid)" />

          {/* Principal Axis */}
          <line
            x1="10"
            y1={axisY}
            x2={svgWidth - 10}
            y2={axisY}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Lens Glass Profile */}
          {lensType === 'convex' ? (
            <path
              d={`M ${opticalCentreX} 25 Q ${opticalCentreX + 16} ${axisY} ${opticalCentreX} 255 Q ${opticalCentreX - 16} ${axisY} ${opticalCentreX} 25 Z`}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          ) : (
            <path
              d={`M ${opticalCentreX - 12} 25 Q ${opticalCentreX} ${axisY} ${opticalCentreX - 12} 255 L ${opticalCentreX + 12} 255 Q ${opticalCentreX} ${axisY} ${opticalCentreX + 12} 25 Z`}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          )}

          {/* Optical Plane Vertical Reference */}
          <line
            x1={opticalCentreX}
            y1="25"
            x2={opticalCentreX}
            y2="255"
            stroke="#0284c7"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Cardinal Points */}
          <circle cx={opticalCentreX} cy={axisY} r="4" fill="#38bdf8" />
          <text x={opticalCentreX - 4} y={axisY + 18} fill="#38bdf8" fontSize="11" fontWeight="bold">
            O
          </text>

          {/* F1, 2F1 (Left Side) */}
          <circle cx={f1X} cy={axisY} r="3" fill="#f59e0b" />
          <text x={f1X - 6} y={axisY + 18} fill="#f59e0b" fontSize="10" fontWeight="bold">
            F₁
          </text>
          <circle cx={twoF1X} cy={axisY} r="3" fill="#a855f7" />
          <text x={twoF1X - 8} y={axisY + 18} fill="#a855f7" fontSize="10" fontWeight="bold">
            2F₁
          </text>

          {/* F2, 2F2 (Right Side) */}
          <circle cx={f2X} cy={axisY} r="3" fill="#f59e0b" />
          <text x={f2X - 6} y={axisY + 18} fill="#f59e0b" fontSize="10" fontWeight="bold">
            F₂
          </text>
          <circle cx={twoF2X} cy={axisY} r="3" fill="#a855f7" />
          <text x={twoF2X - 8} y={axisY + 18} fill="#a855f7" fontSize="10" fontWeight="bold">
            2F₂
          </text>

          {/* OBJECT ARROW (AB) */}
          <line
            x1={objX}
            y1={axisY}
            x2={objX}
            y2={objY}
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon
            points={`${objX},${objY - 4} ${objX - 4},${objY + 6} ${objX + 4},${objY + 6}`}
            fill="#10b981"
          />
          <text x={objX - 20} y={objY - 6} fill="#10b981" fontSize="11" fontWeight="bold">
            Object
          </text>

          {/* RAY 1: Parallel to Principal Axis */}
          <line
            x1={objX}
            y1={objY}
            x2={opticalCentreX}
            y2={objY}
            stroke="#38bdf8"
            strokeWidth="1.8"
          />
          {lensType === 'convex' ? (
            <>
              {/* Bends through Focus F2 */}
              <line
                x1={opticalCentreX}
                y1={objY}
                x2={opticalCentreX + (f2X - opticalCentreX) * 2.5}
                y2={axisY + (axisY - objY) * 1.5}
                stroke="#38bdf8"
                strokeWidth="1.8"
              />
              {/* Virtual backward extension if object is inside F */}
              {objectDistance < focalLength && (
                <line
                  x1={opticalCentreX}
                  y1={objY}
                  x2={imgX}
                  y2={imgY}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}
            </>
          ) : (
            <>
              {/* Diverges away from F1 */}
              <line
                x1={opticalCentreX}
                y1={objY}
                x2={opticalCentreX + 200}
                y2={objY - (axisY - objY) * 1.5}
                stroke="#38bdf8"
                strokeWidth="1.8"
              />
              <line
                x1={opticalCentreX}
                y1={objY}
                x2={f1X}
                y2={axisY}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* RAY 2: Through Optical Centre O (Undeviated) */}
          <line
            x1={objX}
            y1={objY}
            x2={opticalCentreX + (opticalCentreX - objX) * 1.8}
            y2={axisY + (axisY - objY) * 1.8}
            stroke="#f43f5e"
            strokeWidth="1.8"
          />
          {/* Virtual backward extension for concave or inside focus */}
          {(isVirtual || lensType === 'concave') && (
            <line
              x1={opticalCentreX}
              y1={axisY}
              x2={imgX}
              y2={imgY}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* IMAGE ARROW (A'B') */}
          {!isAtFocus && Math.abs(imgX) < 1400 && (
            <g>
              <line
                x1={imgX}
                y1={axisY}
                x2={imgX}
                y2={imgY}
                stroke={isReal ? '#f59e0b' : '#a855f7'}
                strokeWidth="3"
                strokeDasharray={isVirtual ? '4 3' : undefined}
                strokeLinecap="round"
              />
              <polygon
                points={
                  imageHeight < 0
                    ? `${imgX},${imgY + 4} ${imgX - 4},${imgY - 6} ${imgX + 4},${imgY - 6}`
                    : `${imgX},${imgY - 4} ${imgX - 4},${imgY + 6} ${imgX + 4},${imgY + 6}`
                }
                fill={isReal ? '#f59e0b' : '#a855f7'}
              />
              <text
                x={imgX + 8}
                y={imgY + (imageHeight < 0 ? 12 : -6)}
                fill={isReal ? '#f59e0b' : '#a855f7'}
                fontSize="11"
                fontWeight="bold"
              >
                Image (A'B')
              </text>
            </g>
          )}
        </svg>

        {/* Live Nature Overlay Pill */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/70 rounded-lg p-2.5 text-xs text-slate-200">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Image Formation Details:
          </div>
          {isAtFocus ? (
            <span className="text-amber-400 font-bold">At Infinity (Highly Magnified, Real)</span>
          ) : (
            <div className="space-y-0.5">
              <span className="font-medium text-emerald-400">{isReal ? 'Real & Inverted' : 'Virtual & Erect'}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-sky-300">
                {isMagnified ? 'Magnified' : isDiminished ? 'Diminished' : 'Same Size (at 2F)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Object Distance (|u|)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{objectDistance} cm</span>
          </div>
          <input
            type="range"
            min="20"
            max="220"
            step="5"
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>20 cm (near)</span>
            <span>Focus: {focalLength} cm</span>
            <span>220 cm (far)</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Focal Length (|f|)</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{focalLength} cm</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            step="5"
            value={focalLength}
            onChange={(e) => setFocalLength(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>F = {focalLength} cm</span>
            <span>2F = {2 * focalLength} cm</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Lens Power (P = 1/f)</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
              {powerDioptres > 0 ? `+${powerDioptres.toFixed(2)}` : powerDioptres.toFixed(2)} D
            </span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
            {lensType === 'convex' ? (
              <span className="text-emerald-600 font-semibold">+ve Power (Hypermetropia correction)</span>
            ) : (
              <span className="text-rose-600 font-semibold">-ve Power (Myopia correction)</span>
            )}
          </div>
        </div>
      </div>

      {/* Calculations Breakdown */}
      <div className="mt-4 p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">
            Lens Formula: 1/f = 1/v - 1/u
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-slate-800 dark:text-slate-200">
          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">u: </span>
            <strong className="text-blue-600 dark:text-blue-400">-{objectDistance} cm</strong>
          </div>
          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">f: </span>
            <strong className="text-amber-600 dark:text-amber-400">{f > 0 ? `+${f}` : f} cm</strong>
          </div>
          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">v: </span>
            <strong className="text-purple-600 dark:text-purple-400">
              {isAtFocus ? '∞' : `${v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)} cm`}
            </strong>
          </div>
          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">m = +v/u: </span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {isAtFocus ? '∞' : `${m > 0 ? `+${m.toFixed(2)}` : m.toFixed(2)}`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
