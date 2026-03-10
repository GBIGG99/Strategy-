
import React, { useState } from 'react';
import { generateBlueprint, validateBlueprint } from '../services/gemini';
import { AnalysisBlueprint, BusinessContext } from '../types';

interface StrategyUploadProps {
  onBlueprintGenerated: (blueprint: AnalysisBlueprint) => void;
}

const ContextSetup: React.FC<StrategyUploadProps> = ({ onBlueprintGenerated }) => {
  const [context, setContext] = useState<BusinessContext>({
    name: '',
    industry: '',
    location: '',
    situation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<string[]>([]);

  const handleProcess = async () => {
    if (!context.name || !context.industry) return;
    setIsLoading(true);
    setIsValidating(false);
    setError(null);
    setValidationFeedback([]);
    try {
      let blueprint = await generateBlueprint(context);
      
      setIsValidating(true);
      const validation = await validateBlueprint(blueprint);
      
      if (!validation.isValid && validation.correctedBlueprint) {
        blueprint = validation.correctedBlueprint;
      }
      
      setValidationFeedback(validation.feedback);
      
      // Add a slight delay so the user can see the validation feedback before transitioning
      setTimeout(() => {
        onBlueprintGenerated(blueprint);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during blueprint generation.');
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  const updateField = (field: keyof BusinessContext, value: string) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">Strategic Core: Active</span>
            <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full opacity-50"></div>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Analysis Context Definition</h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Provide the business parameters. The engine will blend the foundational 
            strategic logic to create a custom blueprint.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Business Name</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="e.g. Zenith Fitness"
                value={context.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Industry</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="e.g. High-End Real Estate"
                value={context.industry}
                onChange={(e) => updateField('industry', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Location / Region</label>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="e.g. London, UK / EMEA"
              value={context.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Specific Business Situation / Challenge</label>
            <textarea
              className="w-full h-24 md:h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              placeholder="Describe the current problem, goal, or market condition..."
              value={context.situation}
              onChange={(e) => updateField('situation', e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {validationFeedback.length > 0 && (
            <div className="p-4 bg-blue-900/30 border border-blue-500/50 text-blue-300 rounded-lg text-sm space-y-2">
              <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">Validation Feedback</h4>
              <ul className="list-disc pl-4 space-y-1">
                {validationFeedback.map((feedback, idx) => (
                  <li key={idx}>{feedback}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={isLoading || !context.name || !context.industry}
            className={`w-full py-3.5 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all flex items-center justify-center gap-3 ${
              isLoading || !context.name || !context.industry
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isValidating ? 'Validating against Strategic Core...' : 'Blending Core Strategy...'}
              </>
            ) : (
              'Generate Strategic Blueprint'
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { title: 'Core Blending', desc: 'Synthesizes foundational rules with your specific business case.' },
          { title: 'Privacy Shield', desc: 'Analysis parameters are used to build logic, not evaluate data.' },
          { title: 'Automation Ready', desc: 'Output is structured for downstream execution systems.' }
        ].map((feat, i) => (
          <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <h4 className="text-xs font-semibold text-slate-300 mb-1">{feat.title}</h4>
            <p className="text-[10px] text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextSetup;
