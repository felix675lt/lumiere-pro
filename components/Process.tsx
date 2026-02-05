import React from 'react';
import { X, Clock, ShieldCheck, Gem } from 'lucide-react';

interface ProcessProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Process: React.FC<ProcessProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Section: Title & Philosophy */}
        <div className="w-full md:w-1/3 bg-neutral-800 p-10 flex flex-col justify-between">
           <div>
              <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6">The Process</h2>
              <h3 className="text-3xl font-serif text-white leading-tight word-keep-all">
                완벽을 향한<br />집요한 여정
              </h3>
           </div>
           <div className="mt-10 md:mt-0 text-neutral-500 text-sm leading-relaxed word-keep-all">
              <p className="mb-4">
                "빠름보다 바름을 추구합니다."
              </p>
              LUMIÈRE는 도장의 본질적인 보호와 미적 완성을 위해 타협하지 않는 공정을 준수합니다.
           </div>
        </div>

        {/* Right Section: Details */}
        <div className="w-full md:w-2/3 p-10 md:p-14 space-y-12 bg-neutral-900">
           
           {/* Step 1 */}
           <div className="flex gap-6 group">
              <div className="mt-1 flex-shrink-0">
                 <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                    <Clock className="w-5 h-5" />
                 </div>
              </div>
              <div>
                 <h4 className="text-lg text-white font-serif mb-3">시간이 빚어내는 디테일</h4>
                 <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                    우리는 남들만큼의 시간, 혹은 그 이상의 시간을 오롯이 한 대의 차량에 쏟습니다. 
                    이는 작업 속도가 느려서가 아닙니다. 보이지 않는 마감 안쪽까지 완벽하게 말아 넣고, 미세한 이물질 하나 허용하지 않는 디테일에 집중하기 때문입니다. 
                    LUMIÈRE는 출고 시간을 맞추기 위해 퀄리티와 타협하지 않습니다.
                 </p>
              </div>
           </div>

           {/* Step 2 */}
           <div className="flex gap-6 group">
              <div className="mt-1 flex-shrink-0">
                 <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>
              <div>
                 <h4 className="text-lg text-white font-serif mb-3">도장을 위한 안전한 고집</h4>
                 <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                    당장의 손쉬운 시공과 강력한 초기 접착을 위해 본드가 강한 필름이나 자극적인 접착 증진제를 절대 사용하지 않습니다. 
                    이는 시공자에게는 편리함을 주지만, 도장면에는 되돌릴 수 없는 데미지를 줄 수 있습니다. 
                    우리는 시공 과정이 까다롭더라도, 도장면에 가장 안전하고 순수한 보호력을 제공하는 정품 필름만을 고집합니다.
                 </p>
              </div>
           </div>

           {/* Step 3 */}
           <div className="flex gap-6 group">
              <div className="mt-1 flex-shrink-0">
                 <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                    <Gem className="w-5 h-5" />
                 </div>
              </div>
              <div>
                 <h4 className="text-lg text-white font-serif mb-3">제거의 순간까지 생각하는 장인정신</h4>
                 <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                    PPF의 진정한 가치는 오염과 사고로부터의 방어뿐만 아니라, 
                    수년 뒤 필름을 제거했을 때 비로소 증명됩니다. 
                    필름을 떼어냈을 때 도장의 손상 없이 신차의 광택이 그대로 살아있도록 하는 것. 
                    그것이 시작부터 끝을 생각하는 LUMIÈRE의 장인정신이자 약속입니다.
                 </p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};