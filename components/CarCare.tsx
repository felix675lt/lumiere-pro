import React, { useState, useMemo, useEffect } from 'react';
import { X, Wrench, Gauge, FileText, Search, ChevronRight, Check, MapPin, ArrowRight, Settings, Droplets, CheckSquare, Square, Plus, Minus, Info } from 'lucide-react';
import { CAR_DATABASE } from '../data/priceData';
import { CarSize } from '../types';
import { useTranslation, Trans } from 'react-i18next';

interface CarCareProps {
   isOpen: boolean;
   onClose: () => void;
   onBook: (carModel: string, price: number, region: string) => void;
}

const REGIONS = [
   'gangnam',
   'songpa',
   'yongsan',
   'yeongdeungpo',
   'gangbuk',
   'bundang',
   'anyang',
   'ilsan',
   'incheon',
   'daejeon',
   'daegu',
   'busan',
   'gwangju',
   'gangwon'
];

type ItemType = 'package' | 'unit';

interface MaintenanceItem {
   id: string;
   nameKey: string;
   type: ItemType;
   spec: string;
   intervalKey: string;
   unitPrice: number;
   defaultQty: number;
}

export const CarCare: React.FC<CarCareProps> = ({ isOpen, onClose, onBook }) => {
   const { t } = useTranslation();
   const [step, setStep] = useState<'intro' | 'search' | 'result'>('intro');
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCar, setSelectedCar] = useState<string | null>(null);
   const [selectedRegion, setSelectedRegion] = useState<string>('');
   const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

   const filteredCars = useMemo(() => {
      if (!searchQuery) return [];
      return Object.keys(CAR_DATABASE).filter(c =>
         c.toLowerCase().includes(searchQuery.toLowerCase())
      );
   }, [searchQuery]);

   const getMaintenanceItems = (model: string): MaintenanceItem[] => {
      const data = CAR_DATABASE[model];
      const size = data?.size || CarSize.SEDAN;

      // Base Logic
      let oilPrice = 180000;
      let diffPrice = 120000;
      let brakeFluidPrice = 100000;
      let plugPrice = 200000; // 6cyl default total
      let coilPrice = 300000; // 6cyl default total
      let padsFPrice = 250000;
      let padsRPrice = 200000;

      let oilSpec = '5W-30 Premium Synthetic';
      let oilCapacity = '6.5L';

      // Cylinder Estimation
      let cylinders = 6;

      if (size === CarSize.COMPACT) {
         oilPrice = 150000;
         oilSpec = '0W-20 Long-life Synthetic';
         oilCapacity = '4.5L';
         plugPrice = 160000; // 4cyl approx total
         coilPrice = 200000;
         padsFPrice = 180000;
         padsRPrice = 150000;
         cylinders = 4;
      } else if (size === CarSize.SUV) {
         oilPrice = 280000;
         oilSpec = '5W-40 Heavy Duty Synthetic';
         oilCapacity = '7.5L';
         diffPrice = 180000; // AWD likely
         padsFPrice = 300000;
         padsRPrice = 250000;
         cylinders = 6;
      } else if (size === CarSize.SUPERCAR) {
         oilPrice = 550000;
         oilSpec = '10W-60 Racing Grade Ester';
         oilCapacity = '9.5L';
         diffPrice = 350000;
         brakeFluidPrice = 200000;
         plugPrice = 480000; // 8cyl high end
         coilPrice = 800000;
         padsFPrice = 800000;
         padsRPrice = 600000;
         cylinders = 8;
      }

      // Calculate Unit Prices for Plugs & Coils (Rounded)
      // We derive a clean unit price from the estimated total for the cylinder count
      const plugUnit = Math.round((plugPrice / cylinders) / 1000) * 1000;
      const coilUnit = Math.round((coilPrice / cylinders) / 1000) * 1000;

      return [
         { id: 'oil', nameKey: 'oil', type: 'package', spec: `${oilSpec} (${oilCapacity}) + Oil/Air Filters`, intervalKey: '10,000km / 1y', unitPrice: oilPrice, defaultQty: 1 },
         { id: 'diff', nameKey: 'diff', type: 'package', spec: '75W-90 Synthetic Gear Oil', intervalKey: '40,000km / 2y', unitPrice: diffPrice, defaultQty: 1 },
         { id: 'brake_fluid', nameKey: 'brake_fluid', type: 'package', spec: 'DOT 4 Plus / DOT 5.1 High Temp', intervalKey: '20,000km / 2y', unitPrice: brakeFluidPrice, defaultQty: 1 },

         { id: 'spark_plugs', nameKey: 'spark_plugs', type: 'unit', spec: 'High Performance Iridium', intervalKey: '40,000km / 3y', unitPrice: plugUnit, defaultQty: cylinders },
         { id: 'ignition_coils', nameKey: 'ignition_coils', type: 'unit', spec: 'OEM Grade / Reinforced', intervalKey: '80,000km / 5y', unitPrice: coilUnit, defaultQty: cylinders },

         { id: 'brake_pads_f', nameKey: 'brake_pads_f', type: 'package', spec: 'Low-Dust / Low-Noise Ceramic', intervalKey: 'Sensor', unitPrice: padsFPrice, defaultQty: 1 },
         { id: 'brake_pads_r', nameKey: 'brake_pads_r', type: 'package', spec: 'Low-Dust / Low-Noise Ceramic', intervalKey: 'Sensor', unitPrice: padsRPrice, defaultQty: 1 },
      ];
   };

   const currentItems = useMemo(() => {
      if (!selectedCar) return [];
      return getMaintenanceItems(selectedCar);
   }, [selectedCar]);

   const totalPrice = useMemo(() => {
      return currentItems
         .reduce((acc, item) => {
            const qty = selectedQuantities[item.id] || 0;
            return acc + (item.unitPrice * qty);
         }, 0);
   }, [currentItems, selectedQuantities]);

   useEffect(() => {
      if (step === 'result' && selectedCar) {
         // Default select oil with default qty
         const oilItem = currentItems.find(i => i.id === 'oil');
         if (oilItem) {
            setSelectedQuantities({ [oilItem.id]: oilItem.defaultQty });
         }
      }
   }, [step, selectedCar, currentItems]);

   const toggleService = (item: MaintenanceItem) => {
      setSelectedQuantities(prev => {
         if (prev[item.id]) {
            const next = { ...prev };
            delete next[item.id];
            return next;
         } else {
            return { ...prev, [item.id]: item.defaultQty };
         }
      });
   };

   const updateQuantity = (e: React.MouseEvent, id: string, delta: number) => {
      e.stopPropagation();
      setSelectedQuantities(prev => {
         const current = prev[id] || 0;
         const next = Math.max(1, current + delta);
         return { ...prev, [id]: next };
      });
   };

   const handleBook = () => {
      if (selectedCar && selectedRegion) {
         onBook(selectedCar, totalPrice, selectedRegion);
         onClose();
         setTimeout(() => {
            setStep('intro');
            setSelectedCar(null);
            setSearchQuery('');
            setSelectedRegion('');
            setSelectedQuantities({});
         }, 500);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
         <div
            className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[90vh]"
            onClick={e => e.stopPropagation()}
         >
            <button
               onClick={onClose}
               className="absolute top-6 right-6 z-10 p-2 text-neutral-500 hover:text-white transition-colors"
            >
               <X className="w-6 h-6" />
            </button>

            {/* Left Section - Static Info */}
            <div className="w-full md:w-1/3 bg-neutral-800 p-10 flex flex-col justify-between hidden md:flex">
               <div>
                  <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6">{t('carCare.title')}</h2>
                  <h3
                     className="text-3xl font-serif text-white leading-tight word-keep-all"
                     dangerouslySetInnerHTML={{ __html: t('carCare.subtitle') }}
                  />
               </div>
               <div className="text-neutral-500 text-sm leading-relaxed word-keep-all">
                  <p className="mb-4 text-white font-serif">
                     {t('carCare.descPrefix')}
                  </p>
                  {t('carCare.desc')}
               </div>
            </div>

            {/* Right Section - Dynamic Content */}
            <div className="w-full md:w-2/3 bg-neutral-900 flex flex-col">

               {/* Step: Intro */}
               {step === 'intro' && (
                  <div className="p-10 md:p-14 space-y-12 overflow-y-auto flex-1">
                     <div className="md:hidden mb-8">
                        <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-2">{t('carCare.title')}</h2>
                        <h3
                           className="text-2xl font-serif text-white leading-tight"
                           dangerouslySetInnerHTML={{ __html: t('carCare.subtitle') }}
                        />
                     </div>

                     <div className="flex gap-6 group">
                        <div className="mt-1 flex-shrink-0">
                           <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                              <Settings className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <h4 className="text-lg text-white font-serif mb-3">{t('carCare.intro.diagnosis')}</h4>
                           <p
                              className="text-neutral-400 text-sm leading-loose word-keep-all"
                              dangerouslySetInnerHTML={{ __html: t('carCare.intro.diagnosisDesc') }}
                           />
                        </div>
                     </div>

                     <div className="flex gap-6 group">
                        <div className="mt-1 flex-shrink-0">
                           <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                              <Droplets className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <h4 className="text-lg text-white font-serif mb-3">{t('carCare.intro.maintenance')}</h4>
                           <p
                              className="text-neutral-400 text-sm leading-loose word-keep-all"
                              dangerouslySetInnerHTML={{ __html: t('carCare.intro.maintenanceDesc') }}
                           />
                        </div>
                     </div>

                     <div className="flex gap-6 group">
                        <div className="mt-1 flex-shrink-0">
                           <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                              <FileText className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <h4 className="text-lg text-white font-serif mb-3">{t('carCare.intro.log')}</h4>
                           <p
                              className="text-neutral-400 text-sm leading-loose word-keep-all"
                              dangerouslySetInnerHTML={{ __html: t('carCare.intro.logDesc') }}
                           />
                        </div>
                     </div>

                     <div className="pt-8 border-t border-neutral-800">
                        <button
                           onClick={() => setStep('search')}
                           className="w-full bg-gold-500 text-black py-4 font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors rounded-sm shadow-[0_0_20px_rgba(198,154,38,0.2)] hover:shadow-[0_0_30px_rgba(198,154,38,0.4)]"
                        >
                           {t('carCare.inquiryBtn')}
                        </button>
                     </div>
                  </div>
               )}

               {/* Step: Search */}
               {step === 'search' && (
                  <div className="p-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setStep('intro')} className="text-neutral-500 hover:text-white">
                           <ArrowRight className="w-6 h-6 rotate-180" />
                        </button>
                        <h3 className="text-xl font-serif text-white">{t('carCare.searchTitle')}</h3>
                     </div>

                     <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                        <input
                           autoFocus
                           type="text"
                           placeholder={t('carCare.searchPlaceholder')}
                           className="w-full bg-neutral-800 border border-neutral-700 rounded-sm py-4 pl-12 pr-4 text-white focus:border-gold-500 focus:outline-none placeholder-neutral-600"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>

                     <div className="flex-1 overflow-y-auto -mx-4 px-4">
                        {searchQuery && filteredCars.length === 0 && (
                           <p className="text-neutral-500 text-center mt-10">{t('estimator.searchResultEmpty')}</p>
                        )}
                        {filteredCars.map(car => (
                           <button
                              key={car}
                              onClick={() => {
                                 setSelectedCar(car);
                                 setStep('result');
                              }}
                              className="w-full text-left p-4 border-b border-neutral-800 text-neutral-300 hover:text-white hover:bg-white/5 flex justify-between items-center group transition-colors"
                           >
                              {car}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                           </button>
                        ))}
                        {!searchQuery && (
                           <div className="text-neutral-600 text-sm text-center mt-20">
                              {t('booking.selectDatePlaceholder').replace('Date', 'Vehicle')}
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* Step: Result & Region */}
               {step === 'result' && selectedCar && (
                  <div className="p-10 flex flex-col h-full overflow-hidden">
                     <div className="flex items-center gap-4 mb-6 shrink-0">
                        <button onClick={() => setStep('search')} className="text-neutral-500 hover:text-white">
                           <ArrowRight className="w-6 h-6 rotate-180" />
                        </button>
                        <div>
                           <h3 className="text-xl font-serif text-white truncate">{selectedCar}</h3>
                           <p className="text-neutral-500 text-xs mt-1">{t('carCare.selectItems')}</p>
                        </div>
                     </div>

                     {/* Scrollable List of Items */}
                     <div className="flex-1 overflow-y-auto pr-2 -mr-2 mb-6">
                        <div className="space-y-3">
                           {currentItems.map((item) => {
                              const qty = selectedQuantities[item.id];
                              const isSelected = qty !== undefined && qty > 0;
                              const currentQty = isSelected ? qty : item.defaultQty;
                              const itemTotal = item.unitPrice * currentQty;

                              return (
                                 <div
                                    key={item.id}
                                    onClick={() => toggleService(item)}
                                    className={`p-5 rounded-sm border transition-all cursor-pointer group flex flex-col gap-4
                                    ${isSelected
                                          ? 'bg-gold-500/10 border-gold-500'
                                          : 'bg-neutral-800/30 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/50'
                                       }`}
                                 >
                                    <div className="flex items-start justify-between">
                                       <div className="flex items-start gap-4">
                                          <div className={`mt-1 ${isSelected ? 'text-gold-500' : 'text-neutral-600'}`}>
                                             {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                          </div>
                                          <div>
                                             <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                                                {t(`carCare.items.${item.nameKey}`)}
                                                <span className="text-xs text-neutral-500 font-normal ml-2">
                                                   {item.type === 'unit'
                                                      ? `(Box of ${currentQty})`
                                                      : ''}
                                                </span>
                                             </h4>
                                             <div className="text-xs text-neutral-500 space-y-0.5">
                                                <p className="text-gold-400/80">{item.spec}</p>
                                                <p>{t('carCare.recommendedInterval')}: {item.intervalKey}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <span className={`font-serif text-lg ${isSelected ? 'text-white' : 'text-neutral-500'}`}>
                                             ₩{itemTotal.toLocaleString()}
                                          </span>
                                          {!isSelected && item.type === 'unit' && (
                                             <p className="text-[10px] text-neutral-600 mt-1">
                                                {t('carCare.standardSet', { cyl: currentQty })}
                                             </p>
                                          )}
                                          {!isSelected && item.type === 'package' && (
                                             <p className="text-[10px] text-neutral-600 mt-1">
                                                {t('carCare.packagePrice')}
                                             </p>
                                          )}
                                       </div>
                                    </div>

                                    {/* Quantity Control (Only when selected) */}
                                    {isSelected && (
                                       <div className="flex items-center justify-between pt-4 border-t border-white/10 animate-fade-in">
                                          <div className="text-xs text-neutral-400 uppercase tracking-wider">
                                             {t('carCare.quantity')}
                                          </div>
                                          <div className="flex items-center gap-4 bg-black/20 rounded-full px-2 py-1 border border-white/10">
                                             <button
                                                onClick={(e) => updateQuantity(e, item.id, -1)}
                                                className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                             >
                                                <Minus className="w-3 h-3" />
                                             </button>
                                             <span className="text-white font-serif w-8 text-center">{currentQty}</span>
                                             <button
                                                onClick={(e) => updateQuantity(e, item.id, 1)}
                                                className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                             >
                                                <Plus className="w-3 h-3" />
                                             </button>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Total & Region Selection */}
                     <div className="shrink-0 bg-neutral-900 pt-4 border-t border-neutral-800">
                        <div className="mb-6">
                           <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> {t('carCare.regionLabel')}
                           </label>
                           <select
                              value={selectedRegion}
                              onChange={(e) => setSelectedRegion(e.target.value)}
                              className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                           >
                              <option value="" disabled>{t('carCare.regionPlaceholder')}</option>
                              {REGIONS.map(region => (
                                 <option key={region} value={region}>{t(`regions.${region}`)}</option>
                              ))}
                           </select>
                        </div>

                        <div className="flex items-center justify-between mb-4 px-2">
                           <span className="text-sm text-neutral-400">{t('carCare.totalEstimate')}</span>
                           <span className="text-2xl font-serif text-gold-400">₩{totalPrice.toLocaleString()}</span>
                        </div>

                        <button
                           disabled={!selectedRegion || Object.keys(selectedQuantities).length === 0}
                           onClick={handleBook}
                           className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm flex items-center justify-center gap-2"
                        >
                           <span>{Object.keys(selectedQuantities).length > 0 ? t('carCare.bookSelected') : t('carCare.selectRequired')}</span>
                           <ChevronRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-neutral-600 text-center mt-3">
                           {t('carCare.depositNote')}
                        </p>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};