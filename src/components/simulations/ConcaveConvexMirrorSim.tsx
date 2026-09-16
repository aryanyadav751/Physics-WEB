import React, { useState } from 'react';
import { Eye, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

export const ConcaveConvexMirrorSim: React.FC = () => {
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>('concave');
  const [focalLength, setFocalLength] = useState<number>(60); // absolute magnitude in mm
  const [objectDistance, setObjectDistance] = useState<number>(120); // magnitude in mm (always on left)
  const [objectHeight, setObjectHeight] = useState<number>(40); // mm

  // Math based on sign convention:
  // Pole at (originX, originY)
  // Concave: f is negative (-focalLength)
  // Convex: f is positive (+focalLength)
  // Object is always at u = -objectDistance
  const f = mirrorType === 'concave' ? -focalLength : focalLength;
  const u = -objectDistance;

  // Mirror formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u => v = (f * u) / (u - f)
  const denominator = u - f;
  const v = Math.abs(denominator) < 0.001 ? (u < 0 ? -9999 : 9999) : (f * u) / denominator;

  // Magnification: m = -v / u
  const m = -v / u;
  const imageHeight = objectHeight * m;

  // Nature of image
  const isReal = v < 0 && mirrorType === 'concave';
  const isVirtual = v > 0 || mirrorType === 'convex';
  const isEnlarged = Math.abs(m) > 1.05;
  const isDiminished = Math.abs(m) < 0.95;
  const isSameSize = !isEnlarged && !isDiminished;
  const isAtInfinity = Math.abs(objectDistance - focalLength) < 2 && mirrorType === 'concave';

  // SVG coordinate transformation
  const svgWidth = 640;
  const svgHeight = 280;
  const poleX = 360;
  const principalAxisY = 140;
  const scale = 1.6; // pixels per mm

  const objX = poleX - objectDistance * scale;
  const objY = principalAxisY - objectHeight * scale;

  const focusX = mirrorType === 'concave' ? poleX - focalLength * scale : poleX + focalLength * scale;
  const centreX = mirrorType === 'concave' ? poleX - 2 * focalLength * scale : poleX + 2 * focalLength * scale;

  const imgX = poleX + v * scale;
  const imgY = principalAxisY - imageHeight * scale;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              Experiment 01 • Light
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Spherical Mirror Ray Tracing & Optics Bench
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verify 1/f = 1/v + 1/u and witness live reflection of rays meeting at the real/virtual focus.
          </p>
        </div>

        {/* Mirror Type Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => {
              setMirrorType('concave');
              setObjectDistance(120);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mirrorType === 'concave'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Concave Mirror (Converging)
          </button>
          <button
            type="button"
            onClick={() => {
              setMirrorType('convex');
              setObjectDistance(90);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mirrorType === 'convex'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Convex Mirror (Diverging)
          </button>
        </div>
      </div>

      {/* Interactive Ray Diagram Canvas */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 sm:h-72"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            {/* Arrow Marker for Light Rays */}
            <marker id="rayArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="redRayArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

          {/* Principal Axis */}
          <line
            x1="10"
            y1={principalAxisY}
            x2={svgWidth - 10}
            y2={principalAxisY}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Spherical Mirror Curved Arc */}
          {mirrorType === 'concave' ? (
            <path
              d={`M ${poleX + 18} 30 Q ${poleX - 6} ${principalAxisY} ${poleX + 18} 250`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d={`M ${poleX - 18} 30 Q ${poleX + 6} ${principalAxisY} ${poleX - 18} 250`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}

          {/* Mirror Hatching (Polished vs Silvered Backing) */}
          <line
            x1={poleX}
            y1="30"
            x2={poleX}
            y2="250"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Cardinal Optical Points */}
          {/* Pole P */}
          <circle cx={poleX} cy={principalAxisY} r="4" fill="#38bdf8" />
          <text x={poleX - 8} y={principalAxisY + 18} fill="#94a3b8" fontSize="11" fontWeight="600">
            P
          </text>

          {/* Focus F */}
          <circle cx={focusX} cy={principalAxisY} r="4" fill="#f59e0b" />
          <text x={focusX - 6} y={principalAxisY + 18} fill="#f59e0b" fontSize="11" fontWeight="600">
            F
          </text>

          {/* Centre of Curvature C */}
          <circle cx={centreX} cy={principalAxisY} r="4" fill="#a855f7" />
          <text x={centreX - 6} y={principalAxisY + 18} fill="#a855f7" fontSize="11" fontWeight="600">
            C
          </text>

          {/* OBJECT ARROW (AB) */}
          <line
            x1={objX}
            y1={principalAxisY}
            x2={objX}
            y2={objY}
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Arrowhead on Object */}
          <polygon
            points={`${objX},${objY - 4} ${objX - 5},${objY + 6} ${objX + 5},${objY + 6}`}
            fill="#10b981"
          />
          <text x={objX - 18} y={objY - 6} fill="#10b981" fontSize="11" fontWeight="bold">
            Object (AB)
          </text>

          {/* RAY TRACING 1: Parallel to Principal Axis -> Reflects through Focus */}
          {/* Incident ray 1 */}
          <line
            x1={objX}
            y1={objY}
            x2={poleX}
            y2={objY}
            stroke="#38bdf8"
            strokeWidth="1.8"
            markerEnd="url(#rayArrow)"
          />
          {/* Reflected ray 1 */}
          {mirrorType === 'concave' ? (
            <>
              {/* Converges through Focus F */}
              <line
                x1={poleX}
                y1={objY}
                x2={focusX - (poleX - focusX) * 2}
                y2={objY + (principalAxisY - objY) * 3}
                stroke="#38bdf8"
                strokeWidth="1.8"
              />
              {/* Virtual extension behind mirror if object is between P and F */}
              {objectDistance < focalLength && (
                <line
                  x1={poleX}
                  y1={objY}
                  x2={imgX}
                  y2={imgY}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )}
            </>
          ) : (
            <>
              {/* Diverges as if coming from Focus F */}
              <line
                x1={poleX}
                y1={objY}
                x2={poleX - 180}
                y2={objY - (principalAxisY - objY) * 1.5}
                stroke="#38bdf8"
                strokeWidth="1.8"
              />
              <line
                x1={poleX}
                y1={objY}
                x2={focusX}
                y2={principalAxisY}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </>
          )}

          {/* RAY TRACING 2: Ray to Pole P reflecting at equal angle */}
          <line
            x1={objX}
            y1={objY}
            x2={poleX}
            y2={principalAxisY}
            stroke="#f43f5e"
            strokeWidth="1.8"
            markerEnd="url(#redRayArrow)"
          />
          {/* Reflected ray 2 */}
          <line
            x1={poleX}
            y1={principalAxisY}
            x2={poleX - (poleX - objX)}
            y2={principalAxisY + (principalAxisY - objY)}
            stroke="#f43f5e"
            strokeWidth="1.8"
          />
          {/* Virtual extension for ray 2 */}
          {isVirtual && (
            <line
              x1={poleX}
              y1={principalAxisY}
              x2={imgX}
              y2={imgY}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* IMAGE ARROW (A'B') */}
          {!isAtInfinity && Math.abs(imgX) < 1200 && (
            <g>
              <line
                x1={imgX}
                y1={principalAxisY}
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
            Image Nature:
          </div>
          {isAtInfinity ? (
            <span className="text-amber-400 font-bold">At Infinity (Highly Magnified, Real)</span>
          ) : (
            <div className="space-y-0.5">
              <span className="font-medium text-emerald-400">{isReal ? 'Real & Inverted' : 'Virtual & Erect'}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-sky-300">
                {isEnlarged ? 'Magnified (Enlarged)' : isDiminished ? 'Diminished' : 'Same Size (at C)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Experiment Controls & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2">
        {/* Object Distance Slider */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Object Distance (|u|)</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{objectDistance} cm</span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            step="5"
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>20 cm (near)</span>
            <span>Focus: {focalLength} cm</span>
            <span>200 cm (far)</span>
          </div>
        </div>

        {/* Focal Length Slider */}
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
            <span>R = {2 * focalLength} cm</span>
            <span>C = 2F</span>
          </div>
        </div>

        {/* Object Height Slider */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Object Height (h_o)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{objectHeight} cm</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={objectHeight}
            onChange={(e) => setObjectHeight(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>10 cm</span>
            <span>60 cm</span>
          </div>
        </div>
      </div>

      {/* Real-time Optics Formula Calculations Panel */}
      <div className="mt-4 p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-semibold text-blue-900 dark:text-blue-200">
            CBSE Sign Convention Calculation:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-slate-800 dark:text-slate-200">
          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">u: </span>
            <strong className="text-blue-600 dark:text-blue-400">-{objectDistance} cm</strong>
          </div>

          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">f: </span>
            <strong className="text-amber-600 dark:text-amber-400">{f > 0 ? `+${f}` : f} cm</strong>
          </div>

          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">v = (f·u)/(u-f): </span>
            <strong className="text-purple-600 dark:text-purple-400">
              {isAtInfinity ? '∞' : `${v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)} cm`}
            </strong>
          </div>

          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">m = -v/u: </span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {isAtInfinity ? '∞' : `${m > 0 ? `+${m.toFixed(2)}` : m.toFixed(2)}`}
            </strong>
          </div>

          <div className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">h_i: </span>
            <strong className="text-rose-600 dark:text-rose-400">
              {isAtInfinity ? '∞' : `${imageHeight > 0 ? `+${imageHeight.toFixed(1)}` : imageHeight.toFixed(1)} cm`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
