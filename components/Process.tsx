import React from 'react';
import { X, Clock, ShieldCheck, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProcessProps {
   isOpen: boolean;
   onClose: () => void;
}

export const Process: React.FC<ProcessProps> = ({ isOpen, onClose }) => {
   const { t } = useTranslation();
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
                  <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6">{t('process.sectionTitle')}</h2>
                  <h3
                     className="text-3xl font-serif text-white leading-tight word-keep-all"
                     dangerouslySetInnerHTML={{ __html: t('process.title') }}
                  />
               </div>
               <div className="mt-10 md:mt-0 text-neutral-500 text-sm leading-relaxed word-keep-all">
                  <p className="mb-4">
                     {t('process.quote')}
                  </p>
                  {t('process.desc')}
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
                     <h4 className="text-lg text-white font-serif mb-3">{t('process.step1.title')}</h4>
                     <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                        {t('process.step1.desc')}
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
                     <h4 className="text-lg text-white font-serif mb-3">{t('process.step2.title')}</h4>
                     <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                        {t('process.step2.desc')}
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
                     <h4 className="text-lg text-white font-serif mb-3">{t('process.step3.title')}</h4>
                     <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                        {t('process.step3.desc')}
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};