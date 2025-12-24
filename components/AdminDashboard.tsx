import React, { useState, useMemo } from 'react';
import { Product, Lead, AppSettings } from '../types';
import { getLeads, exportLeadsToCSV, saveCustomLink, getSettings, saveSettings } from '../services/leadStore';

interface AdminDashboardProps {
  products: Product[];
  onBack: () => void;
  onUpdateProductLink: (id: string, link: string) => void;
  onForceSync: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onBack, onUpdateProductLink, onForceSync }) => {
  const allLeads = useMemo(() => getLeads(), []);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSync = () => {
    setSyncing(true);
    onForceSync();
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-50 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">BI</div>
           <h1 className="text-lg font-black uppercase tracking-tighter">Market <span className="text-blue-600">Intelligence</span></h1>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={syncing}
            onClick={handleSync}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition flex items-center gap-2 ${syncing ? 'bg-slate-100 text-slate-400' : 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-100'}`}
          >
            {syncing ? 'Sincronizando...' : '🔄 Sincronizar IA'}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition"
          >
            {showSettings ? 'Ver Inventário' : 'Regras de Afiliado'}
          </button>
          <button onClick={onBack} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition">
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12">
        {showSettings ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Piloto Automático</h2>
            <p className="text-slate-500 font-medium mb-12">Defina seu link global e deixe a IA cuidar do resto.</p>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu Prefixo de Afiliado</label>
                <input 
                  type="text"
                  placeholder="Ex: https://shopee.com.br/universal-link?aff_id=MEU_ID&url="
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600 transition-all"
                  value={settings.globalAffiliatePrefix}
                  onChange={e => handleUpdateSettings({...settings, globalAffiliatePrefix: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 italic font-medium">Os links originais serão codificados e anexados a este prefixo automaticamente.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition cursor-pointer" onClick={() => handleUpdateSettings({...settings, autoApplyPrefix: !settings.autoApplyPrefix})}>
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${settings.autoApplyPrefix ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                    {settings.autoApplyPrefix && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                  <div>
                    <span className="block font-black text-slate-900 text-sm uppercase">Ativar Link Inteligente</span>
                    <span className="text-[10px] text-slate-500 font-medium">Aplica seu prefixo em todos os produtos da vitrine automaticamente.</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowSettings(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-xl shadow-slate-200">
                Salvar Configurações
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Leads Totais</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-slate-900">{allLeads.length}</span>
                </div>
              </div>
              <div className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl text-white md:col-span-2">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-6">Insights de Conversão</p>
                <div className="space-y-4">
                   <p className="text-2xl font-black leading-tight">Os nichos de <span className="underline decoration-wavy decoration-yellow-400">Eletrônicos</span> e <span className="underline decoration-wavy decoration-green-400">Casa</span> estão com 40% mais cliques hoje.</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">IA Prediction: Alta demanda para o próximo final de semana.</p>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Produtos Ativos</p>
                <span className="text-7xl font-black text-slate-900">{products.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inventário de Produtos</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">Gerencie os links e acompanhe a curadoria da IA.</p>
                </div>
                <button 
                  onClick={() => {
                    const csv = exportLeadsToCSV(allLeads);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }}
                  className="bg-slate-50 text-slate-900 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                >
                  Baixar Leads ({allLeads.length})
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-10 py-6">Produto / Plataforma</th>
                      <th className="px-10 py-6">Status do Link</th>
                      <th className="px-10 py-6 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition duration-300" />
                            <div>
                              <p className="font-black text-slate-900 text-sm">{p.name}</p>
                              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{p.platform}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${p.affiliateLink ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                             <span className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">
                               {p.affiliateLink?.includes('http') ? 'Configurado' : 'Original'}
                             </span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button 
                            onClick={() => {
                              const next = prompt('Sobrescrever link para este produto:', p.affiliateLink || '');
                              if (next !== null) onUpdateProductLink(p.id, next);
                            }}
                            className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition"
                          >
                            Alterar Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;