
import { Lead, Product, ResearchResult, AppSettings } from "../types";

const LEADS_KEY = 'allmarket_leads';
const RESEARCH_KEY = 'allmarket_research';
const CUSTOM_LINKS_KEY = 'allmarket_custom_links';
const SETTINGS_KEY = 'allmarket_settings';

const DEFAULT_SETTINGS: AppSettings = {
  globalAffiliatePrefix: '',
  autoApplyPrefix: true
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveLead = (lead: Lead): void => {
  const existing = getLeads();
  localStorage.setItem(LEADS_KEY, JSON.stringify([...existing, lead]));
};

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(LEADS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveResearch = (data: ResearchResult): void => {
  localStorage.setItem(RESEARCH_KEY, JSON.stringify(data));
};

export const getResearch = (): ResearchResult | null => {
  const data = localStorage.getItem(RESEARCH_KEY);
  const research = data ? JSON.parse(data) : null;
  
  if (research) {
    const customLinks = getCustomLinks();
    const settings = getSettings();

    // Aplica a lógica de links em tempo real ao ler do banco
    research.items = research.items.map((item: Product) => {
      let finalLink = customLinks[item.id] || item.affiliateLink;
      
      // Se não tem link manual mas a regra global está ativa, gera o link
      if (!finalLink && settings.autoApplyPrefix && settings.globalAffiliatePrefix) {
        finalLink = `${settings.globalAffiliatePrefix}${encodeURIComponent(item.link)}`;
      }
      
      return {
        ...item,
        affiliateLink: finalLink || item.link
      };
    });
  }
  return research;
};

export const saveCustomLink = (productId: string, link: string): void => {
  const links = getCustomLinks();
  links[productId] = link;
  localStorage.setItem(CUSTOM_LINKS_KEY, JSON.stringify(links));
};

const getCustomLinks = (): Record<string, string> => {
  const data = localStorage.getItem(CUSTOM_LINKS_KEY);
  return data ? JSON.parse(data) : {};
};

export const exportLeadsToCSV = (leads: Lead[]): string => {
  const headers = ["ID", "Email", "Produto", "Nicho", "Data"];
  const rows = leads.map(l => [l.id, l.email, l.productName, l.niche, l.consentedAt]);
  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
};
