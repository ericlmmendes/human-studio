
import React, { useState } from 'react';
import { InfluencerIdentity, GeneratedAsset } from '../types';
import { ImageService } from '../services/imageService';

interface InfluencerStudioProps {
  identity: InfluencerIdentity;
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

interface ClothingRefs {
  top?: string;
  bottom?: string;
  shoes?: string;
  cap?: string;
}

interface Enhancements {
  lighting: string;
  brazil: string;
  mood: string;
  angle: string;
  pose: string;
  action: string;
}

const PRESETS = {
  brazil: [
    { id: 'copa', label: 'Copacabana, RJ', prompt: 'at Copacabana beach boardwalk Rio de Janeiro' },
    { id: 'ipa', label: 'Ipanema, RJ', prompt: 'at Arpoador sunset Ipanema' },
    { id: 'arraial', label: 'Arraial do Cabo, RJ', prompt: 'at Pontal do Atalaia crystal water' },
    { id: 'paulista', label: 'Av. Paulista, SP', prompt: 'at Avenida Paulista urban vibe' },
    { id: 'batman', label: 'Beco do Batman, SP', prompt: 'at Beco do Batman graffiti background' },
    { id: 'pelo', label: 'Pelourinho, BA', prompt: 'at Pelourinho historic colorful streets' },
    { id: 'gramado', label: 'Gramado, RS', prompt: 'at Gramado European architecture' },
    { id: 'noronha', label: 'F. de Noronha', prompt: 'at Fernando de Noronha beach paradise' },
    { id: 'lencois', label: 'Lençóis Maranhenses', prompt: 'at Lençois Maranhenses sand dunes' },
    { id: 'cataratas', label: 'Cataratas Iguaçu', prompt: 'at Iguacu Falls waterfalls' },
    { id: 'paraty', label: 'Paraty, RJ', prompt: 'at Paraty colonial streets stone floor' },
    { id: 'pante', label: 'Pantanal, MS', prompt: 'at Pantanal wetlands nature background' },
    { id: 'jalapao', label: 'Jalapão, TO', prompt: 'at Jalapão crystal fervedouro' },
    { id: 'ouro', label: 'Ouro Preto, MG', prompt: 'at Ouro Preto historic churches' },
    { id: 'olinda', label: 'Olinda, PE', prompt: 'at Olinda colorful carnival slopes' },
    { id: 'florianopolis', label: 'Floripa, SC', prompt: 'at Hercilio Luz bridge background' },
    { id: 'manaus', label: 'Manaus, AM', prompt: 'at Amazonas Theatre jungle city' },
    { id: 'balneario', label: 'B. Camboriú, SC', prompt: 'at Balneario Camboriu skyscrapers beach' },
    { id: 'jericoacoara', label: 'Jeri, CE', prompt: 'at Jericoacoara hammock in water' },
    { id: 'oscar', label: 'Oscar Freire, SP', prompt: 'at Oscar Freire luxury shopping street' }
  ],
  angle: [
    { id: 'selfie', label: 'Selfie Realista', prompt: 'POV mobile phone selfie shot' },
    { id: 'mirror', label: 'Selfie Espelho', prompt: 'full body mirror selfie' },
    { id: 'eye', label: 'Nível Olhos', prompt: 'eye-level natural photography' },
    { id: 'low', label: 'Baixo (Hero)', prompt: 'low angle hero shot looking up' },
    { id: 'high', label: 'Cima (Cute)', prompt: 'high angle looking down shot' },
    { id: 'close', label: 'Close-up Face', prompt: 'extreme close-up macro portrait' },
    { id: 'wide', label: 'Plano Geral', prompt: 'wide angle full body shot' },
    { id: 'fisheye', label: 'Fisheye 90s', prompt: 'fisheye lens creative urban look' },
    { id: 'drone', label: 'Vista Drone', prompt: 'aerial drone shot from above' },
    { id: 'side', label: 'Perfil 90°', prompt: 'perfect profile side view' },
    { id: 'dutch', label: 'Ângulo Holandês', prompt: 'tilted dutch angle cinematic' },
    { id: 'over', label: 'Sobre Ombro', prompt: 'over the shoulder perspective' },
    { id: 'back', label: 'Costa (Misterioso)', prompt: 'shot from behind looking back' },
    { id: 'telephoto', label: 'Teleobjetiva', prompt: 'long distance telephoto lens compressed' },
    { id: 'candid', label: 'Candid (Paparazzi)', prompt: 'candid paparazzi style motion blur' },
    { id: 'ground', label: 'Rente ao Chão', prompt: 'camera placed on the ground looking up' },
    { id: 'macro', label: 'Macro Detalhe', prompt: 'macro shot focus on eyes/details' },
    { id: 'cinematic-v', label: 'Cinematográfico', prompt: 'anamorphic widescreen look' },
    { id: 'pov-hand', label: 'POV Segurando', prompt: 'POV shot looking at hands' },
    { id: 'bust', label: 'Plano Médio', prompt: 'waist up medium shot' }
  ],
  pose: [
    { id: 'stand', label: 'Em Pé (Elegante)', prompt: 'standing elegantly straight posture' },
    { id: 'sit', label: 'Sentada (Sofá)', prompt: 'sitting relaxed on luxury sofa' },
    { id: 'walk', label: 'Caminhando', prompt: 'walking dynamic motion towards camera' },
    { id: 'lean', label: 'Encostada', prompt: 'leaning against a wall casually' },
    { id: 'squat', label: 'Agachada Street', prompt: 'street style squatting pose' },
    { id: 'arms', label: 'Braços Cruzados', prompt: 'arms crossed confident gaze' },
    { id: 'hair', label: 'Mão no Cabelo', prompt: 'hand fixing hair naturally' },
    { id: 'pocket', label: 'Mãos no Bolso', prompt: 'hands in pockets relaxed' },
    { id: 'shoulder', label: 'Olhar p/ Trás', prompt: 'looking back over shoulder' },
    { id: 'runway', label: 'Passarela', prompt: 'fashion runway final pose' },
    { id: 'floor', label: 'Sentada Chão', prompt: 'sitting on floor aesthetic pose' },
    { id: 'hips', label: 'Mãos Quadril', prompt: 'hands on hips empowering pose' },
    { id: 'face-touch', label: 'Toque Suave', prompt: 'finger touching lips/face soft' },
    { id: 'lay', label: 'Deitada', prompt: 'laying down gracefully' },
    { id: 'jump', label: 'Pulando', prompt: 'jumping in mid-air frozen motion' },
    { id: 'yoga', label: 'Yoga Zen', prompt: 'yoga meditation lotus pose' },
    { id: 'dynamic', label: 'Giro Dinâmico', prompt: 'spinning around hair movement' },
    { id: 'shush', label: 'Segredo (Psiu)', prompt: 'finger on lips shushing pose' },
    { id: 'kneel', label: 'Ajoelhada', prompt: 'kneeling on one knee artistic' },
    { id: 'hug', label: 'Auto-Abraço', prompt: 'holding herself cozy pose' }
  ],
  action: [
    { id: 'phone', label: 'Usando Celular', prompt: 'interacting with smartphone naturally' },
    { id: 'coffee', label: 'Tomando Café', prompt: 'holding and drinking hot coffee' },
    { id: 'shopping', label: 'Shopping', prompt: 'holding many luxury shopping bags' },
    { id: 'laptop', label: 'No Notebook', prompt: 'typing on a slim laptop' },
    { id: 'gym', label: 'Treinando', prompt: 'fitness training lifting weights' },
    { id: 'eating', label: 'Comendo', prompt: 'eating colorful gourmet food' },
    { id: 'car', label: 'No Carro', prompt: 'sitting in a luxury car seat' },
    { id: 'music', label: 'Ouvindo Música', prompt: 'wearing headphones eyes closed' },
    { id: 'reading', label: 'Lendo Livro', prompt: 'reading an elegant physical book' },
    { id: 'makeup', label: 'Maquiagem', prompt: 'applying lipstick with mirror' },
    { id: 'vlog', label: 'Gravando Vlog', prompt: 'talking to a camera/vlog style' },
    { id: 'cooking', label: 'Cozinhando', prompt: 'chopping vegetables in kitchen' },
    { id: 'cycling', label: 'Pedalando', prompt: 'riding a stylish bicycle' },
    { id: 'running', label: 'Correndo', prompt: 'jogging in the park active' },
    { id: 'dancing', label: 'Dançando', prompt: 'graceful dance movement' },
    { id: 'wine', label: 'Taça de Vinho', prompt: 'holding a glass of red wine' },
    { id: 'camera', label: 'Fotografando', prompt: 'holding a professional camera' },
    { id: 'pet', label: 'Com Pet', prompt: 'playing with a small cute dog' },
    { id: 'skate', label: 'No Skate', prompt: 'standing on a skateboard' },
    { id: 'tablet', label: 'No Tablet', prompt: 'drawing on a tablet stylus' }
  ],
  mood: [
    { id: 'smile', label: 'Feliz/Sorridente', prompt: 'big natural beautiful smile' },
    { id: 'serious', label: 'Séria/Mistério', prompt: 'intense serious mysterious gaze' },
    { id: 'vogue', label: 'Vogue/Blasé', prompt: 'high fashion blasé bored look' },
    { id: 'laugh', label: 'Rindo Forte', prompt: 'genuine laughter eyes closed' },
    { id: 'wink', label: 'Piscadinha', prompt: 'playful wink at camera' },
    { id: 'dreamy', label: 'Sonhadora', prompt: 'dreamy soft expression looking away' },
    { id: 'fierce', label: 'Poderosa', prompt: 'fierce determined powerful look' },
    { id: 'surprised', label: 'Surpresa', prompt: 'positive surprised expression' },
    { id: 'sad', label: 'Melancólica', prompt: 'soft melancolic thoughtful mood' },
    { id: 'angry', label: 'Rebelde', prompt: 'rebel angry cool attitude' },
    { id: 'shy', label: 'Tímida', prompt: 'cute shy embarrassed look' },
    { id: 'professional', label: 'Executiva', prompt: 'professional smart confident look' },
    { id: 'flirty', label: 'Charmosa', prompt: 'flirty charming playful expression' },
    { id: 'zen', label: 'Paz/Zen', prompt: 'peaceful calm meditation face' },
    { id: 'tired', label: 'Cansada/Chill', prompt: 'relaxed sleepy lazy mood' },
    { id: 'bored', label: 'Entediada', prompt: 'fashionably bored expression' },
    { id: 'ecstatic', label: 'Eufórica', prompt: 'extremely excited energy' },
    { id: 'cold', label: 'Gélida/Fria', prompt: 'cold distant fashion look' },
    { id: 'kind', label: 'Gentil', prompt: 'warm kind motherly smile' },
    { id: 'star', label: 'Superstar', prompt: 'superstar diva confident face' }
  ],
  lighting: [
    { id: 'studio', label: 'Estúdio Profissional', prompt: 'studio softbox lighting clean' },
    { id: 'golden', label: 'Hora Dourada', prompt: 'golden hour sunset warm light' },
    { id: 'neon', label: 'Cyber Neon', prompt: 'pink and blue neon lighting' },
    { id: 'natural', label: 'Luz Janela', prompt: 'natural window side lighting' },
    { id: 'dramatic', label: 'Dramático', prompt: 'chiaroscuro dramatic shadows' },
    { id: 'cinematic', label: 'Teal & Orange', prompt: 'cinematic teal and orange grade' },
    { id: 'ring', label: 'Ring Light', prompt: 'ring light beauty lighting' },
    { id: 'flash', label: 'Flash Direto', prompt: 'hard flash paparazzi look' },
    { id: 'soft', label: 'Soft Glam', prompt: 'soft dreamlike glow lighting' },
    { id: 'blue', label: 'Hora Azul', prompt: 'blue hour twilight cold light' },
    { id: 'rays', label: 'Raios de Sol', prompt: 'god rays through trees lighting' },
    { id: 'candle', label: 'Luz de Velas', prompt: 'warm flickering candle light' },
    { id: 'night', label: 'Noturno Urbano', prompt: 'city street lights at night' },
    { id: 'backlight', label: 'Contra-Luz', prompt: 'backlit rim lighting silhouette' },
    { id: 'rainbow', label: 'Prisma/Arco-íris', prompt: 'rainbow prism light refraction' },
    { id: 'fire', label: 'Luz de Fogueira', prompt: 'orange fire light reflection' },
    { id: 'uv', label: 'Luz UV/Negra', prompt: 'UV blacklight glowing effect' },
    { id: 'disco', label: 'Festa/Disco', prompt: 'colorful disco party lights' },
    { id: 'moon', label: 'Luar', prompt: 'soft moonlight night scene' },
    { id: 'highkey', label: 'High Key', prompt: 'bright white high key fashion' }
  ]
};

const InfluencerStudio: React.FC<InfluencerStudioProps> = ({ identity, onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "9:16">("1:1");
  const [clothing, setClothing] = useState<ClothingRefs>({});
  const [productImage, setProductImage] = useState<string | null>(null);
  const [enhancements, setEnhancements] = useState<Enhancements>({
    lighting: '',
    brazil: '',
    mood: '',
    angle: '',
    pose: '',
    action: '',
  });

  const handleFileChange = (category: keyof ClothingRefs | 'product', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (category === 'product') {
          setProductImage(reader.result as string);
        } else {
          setClothing(prev => ({ ...prev, [category]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (category: keyof ClothingRefs | 'product') => {
    if (category === 'product') {
      setProductImage(null);
    } else {
      setClothing(prev => {
        const next = { ...prev };
        delete next[category];
        return next;
      });
    }
  };

  const toggleEnhancement = (category: keyof Enhancements, promptPart: string) => {
    setEnhancements((prev) => ({
      ...prev,
      [category]: prev[category] === promptPart ? '' : promptPart,
    }));
  };

  const handleGenerate = async () => {
    const activeEnhancements = Object.values(enhancements).filter(Boolean);
    if (!prompt && activeEnhancements.length === 0 && !productImage) return;
    if (generating) return;

    setGenerating(true);
    try {
      const finalPromptParts = [prompt, ...activeEnhancements].filter(Boolean);

      const imageUrl = await ImageService.generateIdentityLockedImage(
        identity,
        finalPromptParts.join(', '),
        aspectRatio,
        setStatus,
        clothing,
        productImage || undefined
      );

      const newAsset: GeneratedAsset = {
        id: Math.random().toString(36).substr(2, 9),
        identityId: identity.id,
        imageUrl,
        prompt: finalPromptParts.join(', '),
        status: 'completed',
        createdAt: Date.now(),
      };

      setLastImage(imageUrl);
      onAssetGenerated(newAsset);
    } catch (error: any) {
      alert('Erro Lumina: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setGenerating(false);
      setStatus('');
    }
  };

  const handleDownload = () => {
    if (!lastImage) return;
    const link = document.createElement('a');
    link.href = lastImage;
    link.download = `lumina-${identity.name}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <span className="text-slate-500 font-medium">Influencer:</span> 
            <span className="gradient-text">{identity.name}</span>
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-full border border-slate-700 uppercase tracking-widest">DNA: {identity.id}</span>
            <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-[10px] font-bold rounded-full border border-purple-800/50 uppercase">H: {identity.height}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <span className="px-4 py-2 bg-red-900/40 text-red-400 text-[10px] font-black rounded-full border border-red-800/50 uppercase tracking-tighter animate-pulse shadow-lg shadow-red-500/20">🔒 IDENTIDADE TRAVADA 1:1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Lado Esquerdo: Preview e Opções */}
        <div className="xl:col-span-2 space-y-6 flex flex-col overflow-hidden">
          <div className="relative flex-1 bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center min-h-[500px]">
            {lastImage ? (
              <>
                <img src={lastImage} alt="Gerada" className="w-full h-full object-contain" />
                <div className="absolute top-6 right-6 flex space-x-2">
                  <button onClick={handleDownload} className="p-4 bg-white/10 hover:bg-white/30 backdrop-blur-xl text-white rounded-2xl transition-all shadow-2xl border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </>
            ) : generating ? (
              <div className="text-center space-y-8 p-12 relative w-full h-full flex flex-col items-center justify-center bg-slate-950/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/80 shadow-[0_0_30px_rgba(168,139,250,1)] animate-[scan_2.5s_ease-in-out_infinite] z-20"></div>
                <div className="relative">
                  <div className="w-40 h-40 border-[6px] border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl animate-pulse">🧬</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-[0.3em]">{status || 'SYNC DNA...'}</h3>
                  <div className="flex items-center justify-center gap-4">
                     <span className="px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 text-[10px] text-emerald-400 font-black rounded-lg">FACE SYNC 100%</span>
                     <span className="px-3 py-1 bg-blue-950/50 border border-blue-500/30 text-[10px] text-blue-400 font-black rounded-lg">CONTACT GRIP ACTIVE</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-700 shadow-2xl ring-4 ring-slate-800/30">
                   <span className="text-5xl">👤</span>
                </div>
                <h3 className="text-3xl font-black text-slate-100 mb-4 tracking-tight">Câmera Pronta</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Todos os parâmetros de <b>{identity.name}</b> estão carregados. O motor de consistência garantirá o fotorrealismo.
                </p>
              </div>
            )}
          </div>

          <div className="glass-morphism p-8 rounded-[2rem] space-y-10 overflow-y-auto max-h-[600px] custom-scrollbar border-slate-800">
            <div className="flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl z-20 border border-white/5 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Painel de Controle Profissional (Presets 20x)</h3>
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 shadow-inner">
                {(["1:1", "4:3", "16:9", "9:16"] as const).map(ratio => (
                  <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${aspectRatio === ratio ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {[
                { label: 'Cenários Brasil (20)', key: 'brazil', data: PRESETS.brazil, color: 'emerald' },
                { label: 'Ângulos de Câmera (20)', key: 'angle', data: PRESETS.angle, color: 'orange' },
                { label: 'Poses Profissionais (20)', key: 'pose', data: PRESETS.pose, color: 'indigo' },
                { label: 'Ação & Lifestyle (20)', key: 'action', data: PRESETS.action, color: 'pink' },
                { label: 'Mood & Expressão (20)', key: 'mood', data: PRESETS.mood, color: 'blue' },
                { label: 'Iluminação Profissional (20)', key: 'lighting', data: PRESETS.lighting, color: 'purple' }
              ].map(cat => (
                <div key={cat.key} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <span className={`w-2 h-2 rounded-full bg-${cat.color}-500 mr-3 shadow-[0_0_10px_rgba(var(--tw-color-${cat.color}-500),0.5)]`}></span>
                    {cat.label}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {cat.data.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => toggleEnhancement(cat.key as keyof Enhancements, p.prompt)} 
                        className={`px-3 py-3 rounded-xl text-[10px] font-bold transition-all border text-center leading-tight ${enhancements[cat.key as keyof Enhancements] === p.prompt ? `bg-${cat.color}-600 border-${cat.color}-400 text-white shadow-lg scale-105` : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-10 border-t border-slate-800">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Prompt Customizado</label>
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Ex: Segurando um copo de suco, rindo espontaneamente..." 
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner" 
              />
            </div>
          </div>
        </div>

        {/* Lado Direito: DNA e Closet */}
        <div className="space-y-8 overflow-y-auto custom-scrollbar pr-2">
          {/* Identidade */}
          <div className="glass-morphism p-6 rounded-[2rem] border-t-4 border-red-600 shadow-2xl bg-slate-900/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 bg-red-600 text-[9px] font-black text-white uppercase tracking-widest rounded-bl-2xl z-10">DNA TRAVADO</div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Biometria Mestre</h3>
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[3/4] shadow-2xl">
              <img src={identity.imageData} alt="DNA" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-white font-black text-2xl uppercase tracking-tighter mb-1">{identity.name}</p>
                 <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Consistência 1.0</span>
                    <span className="flex items-center text-[10px] text-emerald-400 font-black"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span> ACTIVE</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Closet Digital */}
          <div className="glass-morphism p-8 rounded-[2rem] border-slate-800 space-y-8 bg-slate-900/60 shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
               <span className="mr-3 text-lg">👗</span> Closet & Produto
            </h3>
            
            <div className="space-y-6">
              {/* Product */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Item para as Mãos (Interação)</label>
                <div className="relative aspect-square bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden group transition-all hover:ring-2 hover:ring-purple-500/50">
                  {productImage ? (
                    <>
                      <img src={productImage} alt="Produto" className="w-full h-full object-cover" />
                      <button onClick={() => removeFile('product')} className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-900 transition-all border-2 border-dashed border-slate-800">
                      <span className="text-4xl mb-3">🎁</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Carregar Objeto</span>
                      <p className="text-[8px] text-slate-700 mt-1 uppercase">A IA fará a modelo segurar este item</p>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('product', e)} />
                    </label>
                  )}
                </div>
              </div>

              {/* Roupas */}
              <div className="grid grid-cols-2 gap-4">
                {(['top', 'bottom', 'shoes', 'cap'] as const).map((cat) => (
                  <div key={cat}>
                    <label className="block text-[9px] font-black text-slate-600 uppercase mb-2 tracking-tighter">{cat} Ref</label>
                    <div className="relative aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group transition-all hover:ring-1 hover:ring-slate-700">
                      {clothing[cat] ? (
                        <>
                          <img src={clothing[cat]} alt={cat} className="w-full h-full object-cover" />
                          <button onClick={() => removeFile(cat)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-900 transition-all border border-dashed border-slate-800">
                          <svg className="w-6 h-6 text-slate-800 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                          <span className="text-[8px] text-slate-700 font-black uppercase">ADD</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(cat, e)} />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
              <button 
                onClick={handleGenerate} 
                disabled={generating} 
                className="w-full py-7 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 transition-all flex flex-col items-center justify-center space-y-1 uppercase tracking-[0.3em] text-sm"
              >
                {generating ? (
                  <>
                    <div className="w-7 h-7 border-[4px] border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs">RENDERIZANDO DNA...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">GERAR IMAGEM PRO</span>
                    <span className="text-[9px] opacity-60 font-medium">IDENTIDADE LOCK ATIVO</span>
                  </>
                )}
              </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0% }
          50% { top: 100% }
          100% { top: 0% }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default InfluencerStudio;
