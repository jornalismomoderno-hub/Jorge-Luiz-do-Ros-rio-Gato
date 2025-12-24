
import React, { useState } from 'react';
import { Product } from '../types';
import VisualBanner from './VisualBanner';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
  isOfficial?: boolean; // Se true, o link gerado será o da All Market (100% comissão)
}

const ShareModal: React.FC<ShareModalProps> = ({ product, onClose, isOfficial = false }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text');
  const [copied, setCopied] = useState<'wa' | 'tg' | null>(null);

  const finalLink = isOfficial ? (product.affiliateLink || product.link) : (product.affiliateLink || product.link);
  // Nota: No futuro, o link de parceiro teria um ?ref=ID_DO_PARCEIRO aqui.

  const waTemplate = `🛍️ *OFERTA EXCLUSIVA: ${product.name.toUpperCase()}* 🛍️

${product.description}

✅ Visto no Shopping All Market Brasil
🔥 Garanta o seu pelo link oficial abaixo:
👉 ${finalLink}

#AllMarketBrasil #OfertaDoDia`;

  const tgTemplate = `🔥 **OPORTUNIDADE DETECTADA NO ALL MARKET** 🔥

📦 **Produto:** ${product.name}
💡 **Nicho:** ${product.niche}

🚀 __${product.description}__

🛒 **COMPRE COM SEGURANÇA AQUI:**
[ACESSAR OFERTA NO ALL MARKET](${finalLink})

---
#Promoção #AllMarketBrasil`;

  const copyToClipboard = (text: string, type: 'wa' | 'tg') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-gray-50 border-b border-gray-100 p-4">
          <div className="flex justify-between items-center px-4 pt-4 mb-6">
            <div>
               <h3 className="text-2xl font-black text-blue-950 tracking-tight">Kit de Divulgação</h3>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                 {isOfficial ? 'Link Oficial All Market' : 'Seu Link de Parceiro'}
               </p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-200 text-gray-400 rounded-2xl transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex gap-2 px-2">
            <button 
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest transition ${
                activeTab === 'text' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest transition ${
                activeTab === 'visual' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              Banner Gráfico
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {activeTab === 'text' ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.415-8.412z"/></svg>
                  </div>
                  <span className="font-black text-gray-800 uppercase text-xs tracking-widest">Post para WhatsApp</span>
                </div>
                <div className="relative">
                  <pre className="bg-gray-50 p-6 rounded-3xl text-sm text-gray-600 whitespace-pre-wrap font-sans border border-gray-100 max-h-40 overflow-y-auto">
                    {waTemplate}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(waTemplate, 'wa')}
                    className={`absolute top-4 right-4 px-5 py-2 rounded-xl text-xs font-black transition-all ${
                      copied === 'wa' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                    }`}
                  >
                    {copied === 'wa' ? 'COPIADO!' : 'COPIAR'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.17.575-.412.768-.617.786-.45.041-.791-.298-1.226-.583-.68-.446-1.065-.724-1.724-1.158-.762-.502-.268-.778.166-1.229.114-.118 2.086-1.914 2.124-2.076.005-.021.009-.098-.037-.138s-.114-.027-.163-.016c-.07.016-1.182.751-3.328 2.198-.314.216-.598.322-.852.316-.28-.006-.82-.153-1.221-.283-.492-.16-.883-.245-.849-.517.018-.142.213-.287.584-.435 2.288-1 3.812-1.66 4.572-1.98 2.169-.912 2.618-1.07 2.912-1.075.065-.001.21.016.304.093.079.065.101.152.109.219.008.066.012.214-.001.353z"/></svg>
                  </div>
                  <span className="font-black text-gray-800 uppercase text-xs tracking-widest">Post para Telegram</span>
                </div>
                <div className="relative">
                  <pre className="bg-gray-50 p-6 rounded-3xl text-sm text-gray-600 whitespace-pre-wrap font-sans border border-gray-100 max-h-40 overflow-y-auto">
                    {tgTemplate}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(tgTemplate, 'tg')}
                    className={`absolute top-4 right-4 px-5 py-2 rounded-xl text-xs font-black transition-all ${
                      copied === 'tg' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                    }`}
                  >
                    {copied === 'tg' ? 'COPIADO!' : 'COPIAR'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <VisualBanner product={product} />
            </div>
          )}
        </div>

        <div className="p-6 bg-blue-50 text-center border-t border-blue-100">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-relaxed">
            {isOfficial 
              ? "Este compartilhamento gera 100% de comissão para a All Market Brasil." 
              : "Vendas por este link serão contabilizadas no seu painel de parceiro."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
