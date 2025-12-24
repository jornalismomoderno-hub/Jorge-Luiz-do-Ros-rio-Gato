import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Product } from './types';
import { fetchMarketTrends } from './services/geminiService';
import { getResearch, saveResearch, saveCustomLink } from './services/leadStore';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import MarketResearch from './components/MarketResearch';
import ShareModal from './components/ShareModal';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('MARKETPLACE');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState<string>('');
  const [notification, setNotification] = useState<{name: string, city: string} | null>(null);

  const loadData = useCallback(async (force = false) => {
    setLoading(true);
    const cached = getResearch();
    if (!cached || force) {
      const data = await fetchMarketTrends();
      if (data.length > 0) {
        setProducts(data);
        saveResearch({ lastUpdated: new Date().toISOString(), items: data });
        setLastSync(new Date().toLocaleTimeString());
      }
    } else {
      setProducts(cached.items);
      setLastSync(new Date(cached.lastUpdated).toLocaleTimeString());
    }
    setLoading(false);
  }, []);

  useEffect(() => { 
    loadData();
    
    // Prova Social Fake para aumentar conversão
    const names = ["Ricardo", "Juliana", "Marcos", "Ana", "Beatriz", "Felipe", "Sandra"];
    const cities = ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Fortaleza", "Salvador"];
    
    const interval = setInterval(() => {
      const show = Math.random() > 0.7;
      if (show) {
        setNotification({
          name: names[Math.floor(Math.random() * names.length)],
          city: cities[Math.floor(Math.random() * cities.length)]
        });
        setTimeout(() => setNotification(null), 4000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [loadData]);

  const copyQuickLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado para a área de transferência!");
  };

  if (view === 'LANDING' && selectedProduct) {
    return <LandingPage product={selectedProduct} onSuccess={() => setView('MARKETPLACE')} />;
  }

  if (view === 'ADMIN') {
    return (
      <AdminDashboard 
        products={products} 
        onBack={() => setView('MARKETPLACE')} 
        onUpdateProductLink={(id, link) => { saveCustomLink(id, link); loadData(); }} 
        onForceSync={() => loadData(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      {/* Notificação de Prova Social */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-[100] bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-4 animate-slide-in max-w-[280px]">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">
              {notification.name} de {notification.city}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Acaba de ativar uma oferta VIP!</p>
          </div>
        </div>
      )}

      <div className="bg-slate-950 text-[10px] font-black text-white py-2 px-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] sticky top-0 z-[60]">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema de Inteligência Ativo
        </span>
        <span className="text-blue-400 hidden sm:inline">Sync: {lastSync}</span>
      </div>

      <header className="bg-white/90 backdrop-blur-xl sticky top-[28px] z-50 border-b border-slate-100 h-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('MARKETPLACE')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">AM</div>
            <h1 className="text-xl font-black tracking-tighter uppercase hidden md:block">All Market <span className="text-blue-600">Brasil</span></h1>
          </div>
          
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setView('MARKETPLACE')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${view === 'MARKETPLACE' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Vitrine
            </button>
            <button 
              onClick={() => setView('RESEARCH')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${view === 'RESEARCH' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              IA Pesquisa
            </button>
            <div className="w-px h-4 bg-slate-100 mx-2"></div>
            <button 
              onClick={() => setView('ADMIN')} 
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
            >
              Painel
            </button>
          </nav>
        </div>
      </header>

      <main className="animate-fade-in">
        {view === 'RESEARCH' ? (
          <MarketResearch />
        ) : (
          <>
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-6 tracking-tighter leading-[1.1]">
                Curadoria <br/><span className="text-blue-600">Ultra Lucrativa.</span>
              </h2>
              <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto">
                Mineramos os produtos com maior potencial de escala e conversão no mercado brasileiro usando IA de ponta.
              </p>
              <div className="relative max-w-xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Pesquisar por nicho ou produto..."
                  className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-600 shadow-xl shadow-slate-100/50 outline-none font-bold text-lg transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12">
              {loading ? (
                <div className="flex flex-col items-center py-32 gap-6">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA analisando tendências...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.niche.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                    <div key={p.id} className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-blue-100 transition-all duration-500 shadow-sm hover:shadow-2xl">
                      <div className="relative h-64 overflow-hidden rounded-[2rem] bg-slate-50 mb-6">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                          {p.platform}
                        </div>
                        
                        {/* Ações Flutuantes */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            onClick={() => copyQuickLink(p.affiliateLink || p.link)}
                            className="w-12 h-12 bg-white/95 backdrop-blur rounded-2xl flex items-center justify-center text-slate-900 hover:bg-green-600 hover:text-white transition shadow-lg"
                            title="Copiar Link Rápido"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                          </button>
                          <button 
                            onClick={() => setSharingProduct(p)}
                            className="w-12 h-12 bg-white/95 backdrop-blur rounded-2xl flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition shadow-lg"
                            title="Gerar Material de Marketing"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                          </button>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{p.niche}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</h3>
                        <div className="flex gap-2">
                           <button 
                            onClick={() => { setSelectedProduct(p); setView('LANDING'); }}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                          >
                            Ativar Landing Page
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {sharingProduct && (
        <ShareModal 
          product={sharingProduct} 
          onClose={() => setSharingProduct(null)} 
          isOfficial={true} 
        />
      )}

      <footer className="bg-slate-50 py-16 mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-3 mb-8">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">AM</div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">All Market Brasil &copy; 2025</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 opacity-40">
            <span className="text-[8px] font-bold uppercase tracking-widest">Tecnologia Gemini 3</span>
            <span className="text-[8px] font-bold uppercase tracking-widest">LGPD Compliant</span>
            <span className="text-[8px] font-bold uppercase tracking-widest">Market Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;