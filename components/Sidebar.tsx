
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  hasBlueprint: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, hasBlueprint, isOpen, setIsOpen }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppView.CONTEXT_SETUP, label: 'Setup Context', icon: '🛠️' },
    { id: AppView.BLUEPRINT_VIEW, label: 'Blueprint', icon: '📋', disabled: !hasBlueprint },
    { id: AppView.CHAT, label: 'Assistant', icon: '💬' },
    { id: AppView.LIVE_VOICE, label: 'Voice Mode', icon: '🎙️' },
  ];

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <span className="text-2xl">⚡</span> StratArchitect
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Blueprint Engine</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : item.disabled
                  ? 'opacity-30 cursor-not-allowed text-slate-600'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3 text-[10px] text-slate-500 mono leading-relaxed">
            <p>STRATEGIC CORE: LOADED</p>
            <p>ENGINE: GEMINI-3-PRO</p>
            <p>STABLE v2.5</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
