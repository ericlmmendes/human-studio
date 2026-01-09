
import React, { useState, useEffect } from 'react';
import { AppState, InfluencerIdentity, GeneratedAsset } from './types';
import Sidebar from './components/Sidebar';
import InfluencerStudio from './components/InfluencerStudio';
import ApiKeyGuard from './components/ApiKeyGuard';
import { DB } from './services/db';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppState>(AppState.DASHBOARD);
  const [identities, setIdentities] = useState<InfluencerIdentity[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<InfluencerIdentity | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true); // Padrão como true para não bloquear o fluxo inicial

  useEffect(() => {
    const savedIdentities = DB.getIdentities();
    const savedAssets = DB.getAssets();
    setIdentities(savedIdentities);
    setAssets(savedAssets);

    // Verificar se já existe uma chave selecionada (específico para ambiente AI Studio)
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const addIdentity = (identity: InfluencerIdentity) => {
    DB.saveIdentity(identity);
    setIdentities(prev => [identity, ...prev]);
    setSelectedIdentity(identity);
    setCurrentView(AppState.STUDIO);
  };

  const deleteIdentity = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este influenciador? Todos os ativos relacionados também serão removidos.")) {
      DB.deleteIdentity(id);
      setIdentities(prev => prev.filter(item => item.id !== id));
      setAssets(prev => prev.filter(item => item.identityId !== id));
      
      if (selectedIdentity?.id === id) {
        setSelectedIdentity(null);
        setCurrentView(AppState.DASHBOARD);
      }
    }
  };

  const addAsset = (asset: GeneratedAsset) => {
    DB.saveAsset(asset);
    setAssets(prev => [asset, ...prev]);
  };

  if (!hasApiKey) {
    return <ApiKeyGuard onKeySelected={() => setHasApiKey(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        identities={identities} 
        onSelectIdentity={(id) => {
          setSelectedIdentity(id);
          setCurrentView(AppState.STUDIO);
        }}
        onDeleteIdentity={deleteIdentity}
        onGoHome={() => setCurrentView(AppState.DASHBOARD)}
        onAddIdentity={() => setCurrentView(AppState.DASHBOARD)}
      />

      <main className="flex-1 relative overflow-y-auto bg-[#0a0f1c]">
        {currentView === AppState.DASHBOARD && (
          <Dashboard 
            onIdentityAdded={addIdentity} 
            assets={assets} 
          />
        )}

        {currentView === AppState.STUDIO && selectedIdentity && (
          <InfluencerStudio 
            identity={selectedIdentity} 
            onAssetGenerated={addAsset}
          />
        )}
      </main>
    </div>
  );
};

const Dashboard: React.FC<{ 
  onIdentityAdded: (id: InfluencerIdentity) => void;
  assets: GeneratedAsset[];
}> = ({ onIdentityAdded, assets }) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('1.70');
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const createIdentity = () => {
    if (!name || !image || !height) return;
    onIdentityAdded({
      id: Math.random().toString(36).substr(2, 9),
      name,
      height: height.includes('m') ? height : `${height}m`,
      imageData: image,
      createdAt: Date.now()
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Criar <span className="gradient-text">DNA Digital</span></h1>
        <p className="text-slate-400 text-lg">Defina os parâmetros biometria que ficarão travados para sempre neste influenciador.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-morphism p-8 rounded-3xl border-t border-white/10 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">🧬</span> Configuração de Identidade
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nome de Palco</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Clara Digital"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Altura Fixa (DNA LOCK)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 1.70"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">m</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Referência de Imutabilidade (Face/Corpo)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="master-ref"
                />
                <label 
                  htmlFor="master-ref"
                  className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-700 rounded-2xl hover:border-purple-500 cursor-pointer transition-all bg-slate-900/50 overflow-hidden"
                >
                  {image ? (
                    <img src={image} alt="Ref" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-slate-400 font-medium">Upload da Referência Mestre</span>
                      <p className="text-[10px] text-slate-600 mt-2">Formatos aceitos: PNG, JPG, WEBP</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button 
              onClick={createIdentity}
              disabled={!name || !image || !height}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 transition-all uppercase tracking-widest text-sm"
            >
              Travar DNA & Iniciar Estúdio
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Protocolos de Segurança Lumina</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="glass-morphism p-6 rounded-2xl border-l-4 border-l-red-500">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-3">🔒</span>
                <h3 className="font-bold text-slate-100 uppercase text-xs tracking-widest">Bloqueio Facial 1:1</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">O sistema utiliza algoritmos de consistência latente para garantir que cada pixel do rosto gerado corresponda exatamente à imagem mestre.</p>
            </div>
            
            <div className="glass-morphism p-6 rounded-2xl border-l-4 border-l-purple-500">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-3">📐</span>
                <h3 className="font-bold text-slate-100 uppercase text-xs tracking-widest">Constância de Altura: {height}m</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">A proporção áurea do influenciador é calculada com base na altura informada. A IA ajusta o ângulo da câmera para refletir essa medida real.</p>
            </div>

            <div className="glass-morphism p-6 rounded-2xl border-l-4 border-l-blue-500">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-3">💇</span>
                <h3 className="font-bold text-slate-100 uppercase text-xs tracking-widest">Preservação Capilar</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">A textura, o brilho e o corte do cabelo são parâmetros fixos, impedindo que a IA altere o visual característico do influenciador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
