
import React, { useState } from 'react';
import { analyzeNiche } from '../services/geminiService';
import { MarketAnalysis } from '../types';

const MarketResearch: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche) return;
    setLoading(true);
    try {
      const data = await analyzeNiche(niche);
      setResult(data);
    } catch (error) {
      alert("Erro na análise. Tente um nicho diferente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Inteligência de Mercado</h2>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          Use nossa IA para dissecar nichos e encontrar as melhores estratégias de venda antes de anunciar.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="relative mb-16">
        <input 
          type="text"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          placeholder="Ex: Emagrecimento para mães, Teclados Mecânicos, Dropshipping..."
          className="w-full px-8 py-6 rounded-3xl bg-white border-2 border-slate-100 focus:border-blue-600 outline-none font-bold text-lg shadow-2xl shadow-slate-200 transition-all"
        />
        <button 
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Analisando...' : 'Gerar Relatório'}
        </button>
      </form>

      {result && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6">Público-Alvo</h3>
              <ul className="space-y-4">
                {result.targetAudience.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                    <span className="text-blue-200">#</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Dores e Desejos</h3>
              <ul className="space-y-4">
                {result.painPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium opacity-90 italic">
                    <span className="text-red-500">⚡</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6">Ângulos de Vendas (Copy)</h3>
            <div className="grid gap-4">
              {result.marketingAngles.map((a, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-blue-200 font-black text-slate-800 text-lg italic">
                  "{a}"
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Estratégia da Concorrência</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {result.competitorStrategy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketResearch;
