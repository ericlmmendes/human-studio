
import { GoogleGenAI } from "@google/genai";
import { InfluencerIdentity } from "../types";

interface ClothingRefs {
  top?: string;
  bottom?: string;
  shoes?: string;
  cap?: string;
  phone?: string;
}

export class ImageService {
  private static processImageData(dataUrl: string) {
    if (!dataUrl) return null;
    const parts = dataUrl.split(',');
    const header = parts[0];
    const data = parts[1] || parts[0];
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    return { data, mimeType };
  }

  static async generateIdentityLockedImage(
    identity: InfluencerIdentity,
    prompt: string,
    aspectRatio: "1:1" | "4:3" | "16:9" | "9:16" = "1:1",
    onProgress: (msg: string) => void,
    clothing?: ClothingRefs,
    productImage?: string
  ) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image';
    
    try {
      onProgress("Sincronizando DNA e Mapeamento de Contato...");
      
      const parts: any[] = [];
      
      // 1. DNA MESTRE (Referência Soberana)
      const masterImage = this.processImageData(identity.imageData);
      if (masterImage) {
        parts.push({ text: "DNA MESTRE (IDENTIDADE TRAVADA - COPIAR ROSTO E CORPO 1:1):" });
        parts.push({
          inlineData: {
            data: masterImage.data,
            mimeType: masterImage.mimeType,
          },
        });
      }

      // 2. OBJETO DE INTERAÇÃO (Prioridade de contato manual)
      if (productImage) {
        const img = this.processImageData(productImage);
        if (img) {
          parts.push({ text: "OBJETO PARA SER SEGURADO PELA MODELO (INTERAÇÃO FÍSICA OBRIGATÓRIA NAS MÃOS):" });
          parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        }
      }

      // 3. ROUPAS E ESTILO
      if (clothing?.top || clothing?.bottom || clothing?.shoes || clothing?.cap) {
        parts.push({ text: "REFERÊNCIAS DE VESTUÁRIO (IGNORAR O ROSTO DESTAS IMAGENS, USAR APENAS AS ROUPAS):" });
        
        if (clothing?.top) {
          const img = this.processImageData(clothing.top);
          if (img) parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        }
        if (clothing?.bottom) {
          const img = this.processImageData(clothing.bottom);
          if (img) parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        }
        if (clothing?.shoes) {
          const img = this.processImageData(clothing.shoes);
          if (img) parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        }
      }

      // 4. SISTEMA DE REGRAS INVIOLÁVEIS
      const systemRules = `
        PROTOCOLO DE SEGURANÇA BIOMÉTRICA:
        1. IDENTIDADE: Gere EXATAMENTE a mesma pessoa da imagem 'DNA MESTRE'. Não altere traços faciais, cor de olhos ou estrutura óssea.
        2. ESTATURA: Mantenha a altura de ${identity.height}.
        3. INTERAÇÃO FÍSICA: Se houver um 'OBJETO PARA SER SEGURADO', a modelo DEVE estar segurando-o com as mãos de forma natural e realista (segurando, abraçando ou usando o item).
        4. VESTIMENTA: Aplique as roupas das referências sobre o corpo da modelo do DNA Mestre.
      `;

      parts.push({
        text: `${systemRules}\n\nSOLICITAÇÃO DE CENA: ${prompt}. Fotorrealismo extremo, pele com poros visíveis, iluminação cinematográfica, 8k.`
      });

      const response = await ai.models.generateContent({
        model: model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });

      onProgress("Validando Consistência Biometria...");

      const candidates = response.candidates?.[0]?.content?.parts;
      if (!candidates) throw new Error("A IA não retornou pixels válidos.");

      for (const part of candidates) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("Falha na renderização da imagem.");
    } catch (error: any) {
      console.error("Erro no motor Lumina:", error);
      throw error;
    }
  }
}
