
import { GoogleGenAI } from "@google/genai";

export class VeoService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateIdentityLockedVideo(
    identityImageBase64: string,
    prompt: string,
    onProgress: (msg: string) => void
  ) {
    const ai = this.getAI();
    
    const model = 'veo-3.1-generate-preview';
    
    try {
      onProgress("Inicializando renderização temporal de alta fidelidade...");
      
      let operation = await ai.models.generateVideos({
        model: model,
        prompt: `Photorealistic 8K video of the exact same person from the reference image. ${prompt}. Cinematic lighting, 8K ultra-detailed, professional photography look, no AI artifacts. IDENTITY LOCK: Face must remain 100% identical. Body proportions must remain identical. Natural human micro-movements.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
          referenceImages: [
            {
              image: {
                imageBytes: identityImageBase64.split(',')[1] || identityImageBase64,
                mimeType: 'image/png'
              },
              referenceType: 'ASSET' as any
            }
          ]
        }
      });

      onProgress("Analisando dinâmica de movimento e geometria facial...");
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        const stages = [
          "Preservando textura da pele e micro-detalhes...",
          "Calculando física de tecidos para roupas...",
          "Sincronizando iluminação ambiental cinematográfica...",
          "Otimizando consistência temporal...",
          "Finalizando renderização 8K fotorrealista..."
        ];
        onProgress(stages[Math.floor(Math.random() * stages.length)]);
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      
      throw new Error("Geração concluída, mas nenhum URI de vídeo foi retornado.");
    } catch (error: any) {
      console.error("Erro Veo:", error);
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_EXPIRED");
      }
      throw error;
    }
  }
}
