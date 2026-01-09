
import React from 'react';

interface ApiKeyGuardProps {
  onKeySelected: () => void;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ onKeySelected }) => {
  const handleOpenKeySelection = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      onKeySelected();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative glass-morphism max-w-md w-full p-10 rounded-[2rem] border-slate-800 shadow-2xl text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-purple-500/20 rotate-3 transition-transform hover:rotate-0">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Acesso ao Estúdio Pro</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Para gerar imagens de influenciadores hiper-realistas com bloqueio de identidade, conecte sua chave de API faturável.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleOpenKeySelection}
            className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
          >
            Vincular Projeto Google Cloud
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-sm text-slate-500 hover:text-purple-400 transition-colors"
          >
            Saiba mais sobre faturamento e cotas
          </a>
        </div>

        <div className="mt-10 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-left">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Padrões de Qualidade</p>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Motor Gemini 3 Pro-Image</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Protocolo de Identidade Travada</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Saída em Alta Resolução (8K Ready)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGuard;
