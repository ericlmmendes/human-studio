
import React from 'react';
import { InfluencerIdentity } from '../types';

interface SidebarProps {
  identities: InfluencerIdentity[];
  onSelectIdentity: (id: InfluencerIdentity) => void;
  onDeleteIdentity: (id: string) => void;
  onGoHome: () => void;
  onAddIdentity: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ identities, onSelectIdentity, onDeleteIdentity, onGoHome, onAddIdentity }) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={onGoHome}>
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <span className="text-xl font-bold tracking-tight">LUMINA</span>
        </div>

        <button 
          onClick={onAddIdentity}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors mb-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Identidade</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Influenciadores</h3>
        <div className="space-y-1">
          {identities.length === 0 ? (
            <p className="text-xs text-slate-600 px-2 italic">Nenhuma identidade criada</p>
          ) : (
            identities.map((id) => (
              <div key={id.id} className="relative group">
                <button
                  onClick={() => onSelectIdentity(id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-left group"
                >
                  <img 
                    src={id.imageData} 
                    alt={id.name} 
                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-800 group-hover:ring-purple-500 transition-all" 
                  />
                  <div className="overflow-hidden pr-8">
                    <p className="text-sm font-medium text-slate-200 truncate">{id.name}</p>
                    <p className="text-xs text-slate-500">Locked Identity</p>
                  </div>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteIdentity(id.id); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-500 transition-all"
                  title="Excluir Influenciador"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="glass-morphism p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">Status do Motor</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-200">Gemini Flash Image (Free Tier)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
