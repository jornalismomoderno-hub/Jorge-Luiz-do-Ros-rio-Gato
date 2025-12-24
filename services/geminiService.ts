
import { GoogleGenAI, Type } from "@google/genai";
import { Product, MarketAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PRODUCT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      niche: { type: Type.STRING },
      description: { type: Type.STRING },
      link: { type: Type.STRING },
      platform: { type: Type.STRING },
      imageUrl: { type: Type.STRING },
      totalCommission: { type: Type.NUMBER },
      partnerCommission: { type: Type.NUMBER }
    },
    required: ["name", "niche", "description", "link", "platform", "imageUrl", "totalCommission", "partnerCommission"]
  }
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    marketingAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
    competitorStrategy: { type: Type.STRING }
  },
  required: ["targetAudience", "painPoints", "marketingAngles", "competitorStrategy"]
};

export const fetchMarketTrends = async (): Promise<Product[]> => {
  try {
    const prompt = `Gere 12 produtos tendência no Brasil hoje (Shopee, Amazon, Hotmart). Foco em alta conversão. Retorne JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: PRODUCT_SCHEMA
      }
    });
    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, idx: number) => ({ ...item, id: `prod-${idx}-${Date.now()}` }));
  } catch (error) {
    return [];
  }
};

export const analyzeNiche = async (niche: string): Promise<MarketAnalysis> => {
  const prompt = `Analise profundamente o nicho: "${niche}". Identifique: 
  1. 3 perfis de público-alvo ideais.
  2. 3 dores ou desejos latentes desse público.
  3. 2 ângulos de marketing (headlines matadoras) para vender produtos desse nicho.
  4. Uma breve análise de como os concorrentes estão atuando.
  Retorne em JSON estruturado.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  const raw = JSON.parse(response.text || "{}");
  return {
    id: Math.random().toString(36).substr(2, 9),
    niche,
    ...raw,
    createdAt: new Date().toISOString()
  };
};
