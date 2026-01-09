
import { InfluencerIdentity, GeneratedAsset } from '../types';

const STORAGE_KEYS = {
  IDENTITIES: 'lumina_identities',
  ASSETS: 'lumina_assets'
};

export class DB {
  // --- IDENTIDADES ---
  static getIdentities(): InfluencerIdentity[] {
    const data = localStorage.getItem(STORAGE_KEYS.IDENTITIES);
    return data ? JSON.parse(data) : [];
  }

  static saveIdentity(identity: InfluencerIdentity): void {
    const identities = this.getIdentities();
    const index = identities.findIndex(i => i.id === identity.id);
    if (index > -1) {
      identities[index] = identity;
    } else {
      identities.unshift(identity);
    }
    localStorage.setItem(STORAGE_KEYS.IDENTITIES, JSON.stringify(identities));
  }

  static deleteIdentity(id: string): void {
    const identities = this.getIdentities().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.IDENTITIES, JSON.stringify(identities));
    
    // Opcional: Remover também os assets vinculados a esse influenciador
    const assets = this.getAssets().filter(a => a.identityId !== id);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }

  // --- ATIVOS (IMAGENS) ---
  static getAssets(): GeneratedAsset[] {
    const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return data ? JSON.parse(data) : [];
  }

  static saveAsset(asset: GeneratedAsset): void {
    const assets = this.getAssets();
    assets.unshift(asset);
    // Limitamos a 50 ativos no localStorage para evitar estourar o limite de 5MB
    // Em um sistema real, usaríamos IndexedDB para arquivos grandes
    const limitedAssets = assets.slice(0, 50); 
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(limitedAssets));
  }

  static deleteAsset(id: string): void {
    const assets = this.getAssets().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }
}
