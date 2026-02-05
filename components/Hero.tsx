import React from 'react';

interface HeroProps {
  onOpenEstimator: () => void;
  onOpenCarCare: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEstimator, onOpenCarCare }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-obsidian">
      {/* Abstract Background Element - Simulating light reflecting on curves */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-gradient-to-br from-neutral-800 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-neutral-800 via-neutral-900 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-gold-400 tracking-[0.3em] uppercase text-xs mb-6 animate-fade-in">
          Premium Automotive Protection Atelier
        </h2>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight animate-slide-up">
          Invisible Armor,<br />
          <span className="italic text-neutral-400">Timeless</span> Value.
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto mb-12 font-light leading-relaxed animate-slide-up word-keep-all" style={{ animationDelay: '0.2s' }}>
          Experience the pinnacle of automotive protection. 
          Lumière curates the legacy of your vehicle with uncompromising materials and surgical precision, 
          preserving its original beauty for eternity.
        </p>
        
        <div className="animate-slide-up flex flex-col md:flex-row gap-12 justify-center items-center mt-12" style={{ animationDelay: '0.4s' }}>
           <button 
             onClick={onOpenEstimator}
             className="group relative pb-2"
           >
             <span className="text-sm tracking-[0.2em] uppercase text-white/80 group-hover:text-gold-400 transition-colors duration-500 ease-out">
               프리미엄 견적 상담 시작하기
             </span>
             <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-gold-400 transition-colors duration-500 ease-out"></span>
           </button>

           <button 
             onClick={onOpenCarCare}
             className="group relative pb-2"
           >
             <span className="text-sm tracking-[0.2em] uppercase text-white/80 group-hover:text-gold-400 transition-colors duration-500 ease-out">
               프리미엄 롱텀 라이프케어 상담 시작하기
             </span>
             <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-gold-400 transition-colors duration-500 ease-out"></span>
           </button>
        </div>
      </div>
    </section>
  );
};