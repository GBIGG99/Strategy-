
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ContextSetup from './components/StrategyUpload';
import BlueprintDisplay from './components/BlueprintDisplay';
import Chat from './components/Chat';
import LiveVoice from './components/LiveVoice';
import { AppView, AnalysisBlueprint } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [blueprint, setBlueprint] = useState<AnalysisBlueprint | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleBlueprintGenerated = (bp: AnalysisBlueprint) => {
    setBlueprint(bp);
    setCurrentView(AppView.BLUEPRINT_VIEW);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-8 md:space-y-12">
            <header>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-widest">v2.5 BLENDER ACTIVE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Strategic Architecture Engine.</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                StratArchitect blends foundational strategic wisdom into high-precision analysis blueprints.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div 
                onClick={() => setCurrentView(AppView.CONTEXT_SETUP)}
                className="bg-slate-800 border border-slate-700 p-6 md:p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group shadow-xl"
              >
                <div className="text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform origin-left">🛠️</div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Define Context</h3>
                <p className="text-slate-400 text-sm">Input business situation to blend the Strategic Core into a custom schema.</p>
              </div>

              <div 
                onClick={() => setCurrentView(AppView.CHAT)}
                className="bg-slate-800 border border-slate-700 p-6 md:p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group shadow-xl"
              >
                <div className="text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform origin-left">💬</div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Refine Architecture</h3>
                <p className="text-slate-400 text-sm">Consult the Pro-series assistant on logic, sourcing, and framework blending.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 md:mb-6">Strategic Core Status</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: 'Copywriting Frameworks', status: 'Loaded' },
                    { label: 'Funnel Architectures', status: 'Loaded' },
                    { label: 'Persona Psychology', status: 'Loaded' }
                  ].map((core, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
                       <span className="text-xs text-slate-400">{core.label}</span>
                       <span className="text-[10px] font-bold text-green-500 px-2 py-0.5 bg-green-900/20 rounded border border-green-900/50 uppercase">{core.status}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case AppView.CONTEXT_SETUP:
        return <ContextSetup onBlueprintGenerated={handleBlueprintGenerated} />;
      case AppView.BLUEPRINT_VIEW:
        return blueprint ? <BlueprintDisplay blueprint={blueprint} /> : <div className="p-12 text-center text-slate-500">No blueprint generated yet.</div>;
      case AppView.CHAT:
        return <Chat blueprint={blueprint} />;
      case AppView.LIVE_VOICE:
        return <LiveVoice />;
      default:
        return <div>View not found.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        hasBlueprint={!!blueprint}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-sm tracking-tight text-white uppercase">StratArchitect</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
