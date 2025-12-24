
export type AppView = 'MARKETPLACE' | 'RESEARCH' | 'LANDING' | 'ADMIN';

export interface Product {
  id: string;
  name: string;
  niche: string;
  description: string;
  link: string;
  imageUrl: string;
  platform: string;
  affiliateLink?: string;
  totalCommission?: number;
  partnerCommission?: number;
}

export interface MarketAnalysis {
  id: string;
  niche: string;
  targetAudience: string[];
  painPoints: string[];
  marketingAngles: string[];
  competitorStrategy: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  email: string;
  productId: string;
  productName: string;
  niche: string;
  consentedAt: string;
  profile?: string; // Informação extra coletada no quiz
}

export interface ResearchResult {
  lastUpdated: string;
  items: Product[];
}

export interface AppSettings {
  globalAffiliatePrefix: string;
  autoApplyPrefix: boolean;
}
