import React, { useState } from 'react';
import { SIMULATIONS_LIST } from '../data/simulationsData';
import { SimulationMeta } from '../types/physics';
import { ConcaveConvexMirrorSim } from './simulations/ConcaveConvexMirrorSim';
import { ConvexConcaveLensSim } from './simulations/ConvexConcaveLensSim';
import { GlassSlabSim } from './simulations/GlassSlabSim';
import { PrismDispersionSim } from './simulations/PrismDispersionSim';
import { OhmsLawSim } from './simulations/OhmsLawSim';
import { CircuitBuilderSim } from './simulations/CircuitBuilderSim';
import { MagneticFieldMotorSim } from './simulations/MagneticFieldMotorSim';
import {
  FlaskConical,
  Play,
  FileText,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  Sliders,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface SimulationsHubProps {
  initialSimId?: string;
  onMarkCompleted?: (simId: string) => void;
  completedSimulations?: string[];
}

export const SimulationsHub: React.FC<SimulationsHubProps> = ({
  initialSimId,
  onMarkCompleted,
  completedSimulations = [],
}) => {
  const [selectedSimId, setSelectedSimId] = useState<string>(initialSimId || SIMULATIONS_LIST[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLabTab, setActiveLabTab] = useState<'simulator' | 'theory' | 'procedure' | 'viva'>('simulator');

  const selectedSim = SIMULATIONS_LIST.find((s) => s.id === selectedSimId) || SIMULATIONS_LIST[0];

  const filteredSims = SIMULATIONS_LIST.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const renderActiveSimulation = () => {
    switch (selectedSim.id) {
      case 'sim-concave-mirror':
        return <ConcaveConvexMirrorSim />;
      case 'sim-spherical-lens':
        return <ConvexConcaveLensSim />;
      case 'sim-glass-slab':
        return <GlassSlabSim />;
      case 'sim-prism-dispersion':
        return <PrismDispersionSim />;
      case 'sim-ohms-law':
        return <OhmsLawSim />;
      case 'sim-circuit-builder':
        return <CircuitBuilderSim />;
      case 'sim-magnetic-field-motor':
        return <MagneticFieldMotorSim />;
      default:
        return <ConcaveConvexMirrorSim />;
    }
  };

  const isCompleted = completedSimulations.includes(selectedSim.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          <FlaskConical className="w-4 h-4" /> Discover Lab • Virtual Physics Experiments
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          CBSE Class 10 Virtual Physics Laboratory
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">
          Perform curriculum-aligned CBSE practical experiments virtually. Move optical objects, vary electrical potentials,
          trace rays, plot live V-I curves, and review complete lab records with viva questions.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {['all', 'Light', 'Electricity', 'Magnetism'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Experiments (7)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Experiment List (Left) + Active Lab Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Experiments Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Curriculum Experiments
          </div>

          <div className="space-y-2.5">
            {filteredSims.map((sim, index) => {
              const active = sim.id === selectedSim.id;
              const done = completedSimulations.includes(sim.id);

              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => {
                    setSelectedSimId(sim.id);
                    setActiveLabTab('simulator');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    active
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/70 shadow-xs ring-1 ring-blue-500/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        EXP 0{index + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {sim.category}
                      </span>
                      {done && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {sim.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {sim.tagline}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                      active ? 'text-blue-600 dark:text-blue-400 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Lab Experiment (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sub-Tabs for the Experiment Record */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveLabTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLabTab === 'simulator'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Interactive Apparatus
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('theory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLabTab === 'theory'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Aim & Theory
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('procedure')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLabTab === 'procedure'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Procedure & Precautions
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('viva')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLabTab === 'viva'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Viva Voce Q&A
              </button>
            </div>

            {/* Mark as Completed Button */}
            {onMarkCompleted && (
              <button
                type="button"
                onClick={() => onMarkCompleted(selectedSim.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </button>
            )}
          </div>

          {/* Tab Content Display */}
          {activeLabTab === 'simulator' && <div>{renderActiveSimulation()}</div>}

          {activeLabTab === 'theory' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                  Aim of the Experiment
                </h3>
                <p className="text-slate-900 dark:text-slate-100 font-medium text-base">
                  {selectedSim.aim}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Apparatus Required
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
                  {selectedSim.apparatus.map((app, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Underlying Physics Theory
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono leading-relaxed">
                  {selectedSim.theory}
                </div>
              </div>
            </div>
          )}

          {activeLabTab === 'procedure' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                  Step-by-Step Practical Procedure
                </h3>
                <ol className="space-y-3">
                  {selectedSim.procedure.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Lab Precautions (Crucial for Full Practical Marks)
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {selectedSim.precautions.map((pre, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{pre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeLabTab === 'viva' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  CBSE External Examiner Viva Voce Questions
                </h3>
              </div>

              <div className="space-y-4">
                {selectedSim.vivaQuestions.map((viva, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold font-mono">Q{idx + 1}.</span>
                      <span>{viva.question}</span>
                    </div>
                    <div className="mt-2.5 pl-6 border-l-2 border-purple-400 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>Answer:</strong> {viva.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
