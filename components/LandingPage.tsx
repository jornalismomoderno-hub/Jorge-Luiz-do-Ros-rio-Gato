import React, { useState, useEffect } from 'react';
import { Product, Lead } from '../types';
import { saveLead } from '../services/leadStore';

interface LandingPageProps {
  product: Product;
  onSuccess: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ product, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'quiz1' | 'quiz2' | 'form'>('intro');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState('');
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 40) + 12);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consented) return;

    setSubmitting(true);
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      productId: product.id,
      productName: product.name,
      niche: product.niche,
      profile,
      consentedAt: new Date().toISOString()
    };

    // Simulando delay de processamento de IA
    setTimeout(() => {
      saveLead(newLead);
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        if (product.affiliateLink || product.link) {
            window.location.href = product.affiliateLink || product.link;
        } else {
            onSuccess();
        }
      }, 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 animate-pulse"></div>
          <div className="relative z-10 scale-110 animate-bounce">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(37,99,235,0.6)]">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Acesso VIP Validado!</h2>
        <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed mb-12">
          Seu perfil foi qualificado para a oferta de <strong>{product.name}</strong>. Redirecionando para o portal oficial...
        </p>
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_3s_linear]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden">
      {/* Esquerda: Conteúdo Visual */}
      <div className="lg:w-1/2 bg-slate-900 relative p-12 lg:p-24 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <img src={product.imageUrl} alt="Contexto" className="w-full h-full object-cover opacity-20 blur-md scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <button onClick={onSuccess} className="mb-12 text-white/50 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
             Voltar ao Shopping
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{viewers} interessados agora</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase italic">
            Oferta <br/><span className="text-blue-500">Exclusiva.</span>
          </h2>
          <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-md">
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Você está a segundos de acessar o menor preço histórico para <strong>{product.name}</strong>.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-10 items-center grayscale opacity-30 mt-12">
           <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Verified by IA</span>
           <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">LGPD Compliant</span>
        </div>
      </div>

      {/* Direita: Fluxo de Captura (Quiz) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full">
          {step === 'intro' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Verificação de Cupom</h3>
              <p className="text-slate-500 font-medium mb-10 text-lg">Responda 2 perguntas rápidas para liberar seu acesso VIP e o link oficial.</p>
              <button 
                onClick={() => setStep('quiz1')}
                className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition shadow-2xl active:scale-95"
              >
                Começar Verificação
              </button>
            </div>
          )}

          {step === 'quiz1' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Pergunta 1 de 2</span>
              <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">Qual o seu principal objetivo com este produto?</h3>
              <div className="grid gap-4">
                {['Uso Pessoal', 'Presente', 'Revenda / Negócio', 'Apenas Curiosidade'].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => { setProfile(opt); setStep('quiz2'); }}
                    className="w-full p-6 text-left rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:border-blue-600 hover:bg-blue-50 transition active:scale-[0.98]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'quiz2' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Pergunta 2 de 2</span>
              <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">Já comprou na {product.platform} antes?</h3>
              <div className="grid gap-4">
                {['Sim, frequentemente', 'Já comprei algumas vezes', 'Nunca comprei lá', 'Não tenho certeza'].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => setStep('form')}
                    className="w-full p-6 text-left rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:border-blue-600 hover:bg-blue-50 transition active:scale-[0.98]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Quase lá!</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">Para onde devemos enviar o seu **Link VIP com Cupom**?</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail para recebimento</label>
                  <input 
                    required
                    type="email" 
                    placeholder="exemplo@email.com"
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold text-lg transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-2xl cursor-pointer group border border-blue-100/50">
                    <input 
                      required
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded-md border-2 border-slate-300 text-blue-600"
                      checked={consented}
                      onChange={e => setConsented(e.target.checked)}
                    />
                    <span className="text-[10px] text-slate-600 font-bold leading-tight uppercase tracking-tight">
                      Aceito receber ofertas de {product.niche} e concordo com o processamento dos meus dados conforme a LGPD.
                    </span>
                  </label>
                </div>

                <button 
                  disabled={!consented || submitting}
                  className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                    consented && !submitting 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'VALIDANDO...' : 'LIBERAR LINK AGORA'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;