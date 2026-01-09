
import React from 'react';
import { GeneratedAsset } from '../types';

interface GenerationHistoryProps {
  videos: GeneratedAsset[]; // Mantendo o nome da prop por compatibilidade no App.tsx
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ videos: assets }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset) => (
        <div key={asset.id} className="glass-morphism rounded-2xl overflow-hidden group hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer">
          <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden">
            <img 
              src={asset.imageUrl} 
              alt={asset.prompt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
               <p className="text-[10px] text-white/70 line-clamp-2 mb-3">"{asset.prompt}"</p>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-purple-400">#InfluencerAsset</span>
                  <a 
                    href={asset.imageUrl} 
                    download={`lumina-photo-${asset.id}.png`}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenerationHistory;
