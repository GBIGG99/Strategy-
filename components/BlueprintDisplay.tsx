
import React from 'react';
import { AnalysisBlueprint, BlueprintStep } from '../types';

interface BlueprintDisplayProps {
  blueprint: AnalysisBlueprint;
}

const DependencyBadge: React.FC<{ label: string; type: 'external' | 'input' }> = ({ label, type }) => (
  <div className={`px-2 py-0.5 rounded text-[9px] border font-mono flex items-center gap-1.5 ${
    type === 'external' 
      ? 'bg-amber-900/20 text-amber-400 border-amber-800/50' 
      : 'bg-blue-900/20 text-blue-400 border-blue-800/50'
  }`}>
    <span className={`w-1 h-1 rounded-full ${type === 'external' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
    {label}
  </div>
);

const GraphStepNode: React.FC<{ step: BlueprintStep; index: number; isLast: boolean }> = ({ step, index, isLast }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* The Node Card */}
        <div className="w-64 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl group-hover:border-blue-500 transition-all z-10 relative">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-500">STAGE_0{index + 1}</span>
            <span className="px-1.5 py-0.5 bg-slate-900 rounded text-[8px] text-blue-400 border border-slate-700 font-bold uppercase tracking-widest">
              Process
            </span>
          </div>
          <h4 className="text-xs font-bold text-white mb-3 line-clamp-1">{step.stepName}</h4>
          
          <div className="space-y-2">
            {/* Inputs/Dependencies inside node */}
            <div className="flex flex-wrap gap-1">
              {step.requiredInputs.slice(0, 3).map((input, i) => (
                <div key={i} className="text-[8px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  {input}
                </div>
              ))}
              {step.requiredInputs.length > 3 && (
                <span className="text-[8px] text-slate-600">+{step.requiredInputs.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        {/* Output Indicator Tag */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full hidden lg:block">
           <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[8px] text-slate-500 max-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis italic">
             → {step.expectedIntermediateOutput}
           </div>
        </div>

        {/* Downward Connector */}
        {!isLast && (
          <div className="flex flex-col items-center">
            <div className="w-px h-10 bg-gradient-to-b from-blue-500/50 to-slate-700"></div>
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500/10 rounded-full border border-blue-500/30"></div>
              <svg className="w-4 h-4 text-blue-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 14l-7 7-7-7" />
              </svg>
            </div>
            <div className="w-px h-10 bg-gradient-to-t from-blue-500/50 to-slate-700"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const BlueprintVisualizer: React.FC<{ blueprint: AnalysisBlueprint }> = ({ blueprint }) => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 mb-12 overflow-x-auto scrollbar-hide">
      <div className="min-w-max flex flex-col items-center">
        {/* Entry Points / Dependencies Section */}
        <div className="mb-12 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">External Requirements & Dependencies</span>
          <div className="flex flex-wrap justify-center gap-3">
            {blueprint.metadata.dependencies.map((dep, i) => (
              <DependencyBadge key={i} label={dep} type="external" />
            ))}
            {blueprint.metadata.requiredExternalDataTypes.map((ext, i) => (
              <DependencyBadge key={i} label={ext} type="input" />
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center">
             <div className="w-px h-12 bg-gradient-to-b from-slate-700 to-blue-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="flex flex-col items-center">
          {blueprint.steps.map((step, i) => (
            <GraphStepNode 
              key={step.stepId} 
              step={step} 
              index={i} 
              isLast={i === blueprint.steps.length - 1} 
            />
          ))}
        </div>

        {/* Final Objective */}
        <div className="mt-12 flex flex-col items-center">
           <div className="w-px h-8 bg-slate-700"></div>
           <div className="px-6 py-3 bg-blue-600/10 border border-blue-500/30 rounded-xl flex flex-col items-center">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Final Objective</span>
              <span className="text-xs font-bold text-white text-center">{blueprint.metadata.analysisName} Ready</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint }) => {
  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-blue-600/20 rounded-lg border border-blue-500/30 flex items-center justify-center text-xl">📋</div>
             <div>
               <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{blueprint.metadata.analysisName}</h2>
               <p className="text-slate-400 text-xs font-medium">Strategic Blueprint Engine v{blueprint.metadata.strategyVersion}</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 md:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
            <span>📥</span> Export JSON
          </button>
          <button className="hidden md:flex px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20 items-center gap-2">
            <span>🚀</span> Deploy System
          </button>
        </div>
      </div>

      {/* Dependency Flowchart Visualizer */}
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Analysis Dependency Graph
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">NODES: {blueprint.steps.length} | DEP_MAPPING: ACTIVE</span>
      </div>
      <BlueprintVisualizer blueprint={blueprint} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Context & Requirements Sidebar */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🔍</span> Contextual Requirements
            </h3>
            
            <div className="space-y-5">
              <section>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Complexity & Depth</label>
                <div className="flex items-center gap-3">
                   <span className="px-2 py-1 bg-blue-900/30 text-blue-300 border border-blue-800 rounded text-[10px] font-bold">
                    {blueprint.metadata.analysisComplexityLevel}
                   </span>
                   <span className="text-[10px] text-slate-400">{blueprint.metadata.estimatedAnalysisDepth}</span>
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Business Inputs Needed</label>
                <div className="space-y-2">
                  {blueprint.metadata.requiredBusinessInputs.map((input, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {input}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">External Dependencies</label>
                <div className="flex flex-wrap gap-2">
                  {blueprint.metadata.dependencies.map((dep, i) => (
                    <span key={i} className="px-2 py-1 bg-amber-900/20 text-amber-300 border border-amber-800/50 rounded text-[9px] font-mono">
                      {dep}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Theoretical Constraints */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Logic Constraints</h3>
            <div className="space-y-3">
              {blueprint.metadata.constraints.map((c, i) => (
                <div key={i} className="flex gap-3 text-[10px] text-slate-400 bg-slate-800/20 p-3 rounded-xl border border-slate-800/40 leading-relaxed italic">
                  <span className="text-amber-500/50 font-serif text-lg leading-none">“</span>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step Logic Panel */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-sm"></span>
              Analysis Sequence
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              SEQUENCE_STABLE_v1.0
            </span>
          </div>
          
          {blueprint.steps.map((step, index) => (
            <div key={step.stepId} className="relative pl-6 md:pl-8 pb-10 border-l border-slate-800/80 last:pb-0 group">
              {/* Vertical Timeline Marker */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-800 group-hover:border-blue-500 transition-all z-10 flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-blue-500 group-hover:scale-125 transition-all"></div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-slate-600 hover:bg-slate-800">
                <div className="px-6 py-4 bg-slate-700/20 border-b border-slate-700/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-blue-500/60 font-mono tracking-tighter">0{index + 1}</span>
                    <h4 className="font-bold text-white text-sm md:text-base tracking-tight">{step.stepName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-800 uppercase">
                      ID: {step.stepId}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        Functional Purpose
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{step.purpose}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        Success Condition
                      </h5>
                      <p className="text-xs text-slate-400 italic bg-slate-900/30 p-2 rounded border border-slate-800/50 leading-relaxed">
                        "{step.conditionsToProceed}"
                      </p>
                    </div>
                  </div>

                  {/* Logic Instructions - The "Meat" of the blueprint */}
                  <div className="bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-inner relative">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                       <svg className="w-20 h-20 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                       </svg>
                    </div>
                    <div className="px-4 py-2 bg-blue-600/5 border-b border-slate-700/60 flex justify-between items-center">
                      <span className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em]">Processing Logic Instruction</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                      </div>
                    </div>
                    <div className="p-4 md:p-5">
                      <p className="text-xs md:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-words">
                        {step.processingLogic}
                      </p>
                    </div>
                  </div>

                  {/* Inputs & Outputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                         <span className="text-blue-500">→</span> Required Inputs
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {step.requiredInputs.map(input => (
                          <span key={input} className="px-2 py-1 bg-slate-700/40 text-slate-400 rounded-md text-[9px] border border-slate-700/40 font-medium">
                            {input}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                         <span className="text-green-500">←</span> Intermediate Artifact
                      </h5>
                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-start gap-3">
                         <div className="w-1.5 h-1.5 bg-green-500/40 rounded-full mt-1.5 shrink-0"></div>
                         <p className="text-[10px] text-slate-400 font-medium leading-normal tracking-wide italic">{step.expectedIntermediateOutput}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintDisplay;
