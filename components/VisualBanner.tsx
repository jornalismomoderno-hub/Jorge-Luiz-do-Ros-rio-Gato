
import React, { useRef, useEffect, useState } from 'react';
import { Product } from '../types';

interface VisualBannerProps {
  product: Product;
}

const VisualBanner: React.FC<VisualBannerProps> = ({ product }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  const drawBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Função de fallback para navegadores que não suportam roundRect (Safari antigo)
    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = product.imageUrl;

    img.onload = () => {
      // 1. Fundo limpo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1080, 1080);

      // 2. Imagem centralizada
      const scale = Math.max(1080 / img.width, 1080 / img.height);
      const x = (1080 - img.width * scale) / 2;
      const y = (1080 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // 3. Degradê de Luxo
      const gradient = ctx.createLinearGradient(0, 500, 0, 1080);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, '#0f172a'); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // 4. Logo Superior com Badge BRASIL
      ctx.fillStyle = '#ffffff';
      drawRoundRect(60, 60, 520, 100, 20);
      ctx.fill();
      
      // Texto "ALL MARKET"
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 38px sans-serif';
      ctx.fillText('ALL MARKET', 85, 125);

      // Badge Preto para BRASIL
      ctx.fillStyle = '#000000';
      drawRoundRect(340, 75, 220, 70, 12);
      ctx.fill();

      // "BRA" Verde
      ctx.fillStyle = '#22c55e';
      ctx.font = '900 38px sans-serif';
      ctx.fillText('BRA', 360, 125);
      
      // "SIL" Amarelo
      ctx.fillStyle = '#eab308';
      ctx.fillText('SIL', 445, 125);

      // 5. Textos de Oferta
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(product.niche.toUpperCase(), 70, 800);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 82px sans-serif';
      const name = product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name;
      ctx.fillText(name, 70, 900);

      ctx.font = '400 38px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Oferta Exclusiva: shopping.allmarket.com.br', 70, 970);

      // 6. Botão de Call to Action no Banner
      ctx.fillStyle = '#22c55e';
      drawRoundRect(70, 1010, 480, 50, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('✓ VERIFICADO PELA CURADORIA IA', 100, 1045);

      setLoading(false);
    };

    img.onerror = () => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Imagem em Processamento...', 540, 540);
      setLoading(false);
    };
  };

  useEffect(() => {
    drawBanner();
  }, [product]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `allmarket-${product.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-[450px] aspect-square rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerando Design...</span>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} width="1080" height="1080" className="w-full h-full object-contain" />
      </div>
      <button 
        onClick={download} 
        className="group relative px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 flex items-center gap-4 shadow-2xl active:scale-95"
      >
        <span>Baixar Material de Apoio</span>
        <svg className="w-5 h-5 group-hover:translate-y-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </button>
    </div>
  );
};

export default VisualBanner;
