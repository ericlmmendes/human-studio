
export interface InfluencerIdentity {
  id: string;
  name: string;
  height: string; // Altura bloqueada (ex: 1.75m)
  imageData: string; // base64 da referência mestre
  createdAt: number;
}

export interface GeneratedAsset {
  id: string;
  identityId: string;
  imageUrl: string;
  prompt: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}

export enum AppState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO'
}
