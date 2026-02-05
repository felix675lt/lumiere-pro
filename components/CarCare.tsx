import React, { useState, useMemo, useEffect } from 'react';
import { X, Wrench, Gauge, FileText, Search, ChevronRight, Check, MapPin, ArrowRight, Settings, Droplets, CheckSquare, Square, Plus, Minus, Info } from 'lucide-react';
import { CAR_DATABASE } from '../data/priceData';
import { CarSize } from '../types';

interface CarCareProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (carModel: string, price: number, region: string) => void;
}

const REGIONS = [
  '서울 강남/서초', 
  '서울 송파/강동',
  '서울 용산/성동/마포',
  '서울 영등포/강서/양천',
  '서울 강북/노원/기타',
  '경기 남부 (분당/판교/수원)',
  '경기 남부 (안양/하남/용인)',
  '경기 북부 (일산/파주/김포)',
  '인천/부천/송도',
  '대전/세종/충청',
  '대구/경북',
  '부산/경남',
  '광주/전라',
  '강원/제주'
];

type ItemType = 'package' | 'unit';

interface MaintenanceItem {
  id: string;
  name: string;
  type: ItemType;
  spec: string;
  interval: string;
  unitPrice: number;
  defaultQty: number;
}

export const CarCare: React.FC<CarCareProps> = ({ isOpen, onClose, onBook }) => {
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
        { id: 'oil', name: 'Engine Oil Package', type: 'package', spec: `${oilSpec} (${oilCapacity}) + Oil/Air Filters`, interval: '10,000km / 1년', unitPrice: oilPrice, defaultQty: 1 },
        { id: 'diff', name: 'Differential Oil', type: 'package', spec: '75W-90 Synthetic Gear Oil', interval: '40,000km / 2년', unitPrice: diffPrice, defaultQty: 1 },
        { id: 'brake_fluid', name: 'Brake Fluid Flush', type: 'package', spec: 'DOT 4 Plus / DOT 5.1 High Temp', interval: '20,000km / 2년', unitPrice: brakeFluidPrice, defaultQty: 1 },
        
        { id: 'spark_plugs', name: 'Spark Plugs', type: 'unit', spec: 'High Performance Iridium', interval: '40,000km / 3년', unitPrice: plugUnit, defaultQty: cylinders },
        { id: 'ignition_coils', name: 'Ignition Coils', type: 'unit', spec: 'OEM Grade / Reinforced', interval: '80,000km / 5년', unitPrice: coilUnit, defaultQty: cylinders },
        
        { id: 'brake_pads_f', name: 'Brake Pads (Front)', type: 'package', spec: 'Low-Dust / Low-Noise Ceramic', interval: 'Sensor Warning', unitPrice: padsFPrice, defaultQty: 1 },
        { id: 'brake_pads_r', name: 'Brake Pads (Rear)', type: 'package', spec: 'Low-Dust / Low-Noise Ceramic', interval: 'Sensor Warning', unitPrice: padsRPrice, defaultQty: 1 },
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
              <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6">Premium Mechanical Solution</h2>
              <h3 className="text-3xl font-serif text-white leading-tight word-keep-all">
                최고의 미케닉이<br />진단해주는<br />라이프 케어 시스템
              </h3>
           </div>
           <div className="text-neutral-500 text-sm leading-relaxed word-keep-all">
              <p className="mb-4 text-white font-serif">
                "Precision beyond Aesthetics"
              </p>
              단순한 외장 관리를 넘어, 차량의 심장인 엔진과 구동계 컨디션을 최상으로 유지하는 테크니컬 솔루션입니다.
           </div>
        </div>

        {/* Right Section - Dynamic Content */}
        <div className="w-full md:w-2/3 bg-neutral-900 flex flex-col">
           
           {/* Step: Intro */}
           {step === 'intro' && (
             <div className="p-10 md:p-14 space-y-12 overflow-y-auto flex-1">
                <div className="md:hidden mb-8">
                    <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-2">Premium Mechanical Solution</h2>
                    <h3 className="text-2xl font-serif text-white leading-tight">라이프 케어 시스템</h3>
                </div>

                <div className="flex gap-6 group">
                   <div className="mt-1 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                         <Settings className="w-5 h-5" />
                      </div>
                   </div>
                   <div>
                      <h4 className="text-lg text-white font-serif mb-3">정밀 기계 진단 (Mechanical Diagnosis)</h4>
                      <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                         전용 진단기를 통한 전자 제어 시스템 스캔부터 하체 누유 및 유격 점검까지.<br />마스터 미케닉이 차량의 기계적 결함을 조기에 발견하고 예방합니다.
                      </p>
                   </div>
                </div>

                <div className="flex gap-6 group">
                   <div className="mt-1 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                         <Droplets className="w-5 h-5" />
                      </div>
                   </div>
                   <div>
                      <h4 className="text-lg text-white font-serif mb-3">소모품 집중 관리 (Fluids & Filters)</h4>
                      <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                         기존 샵들과 차별화된 Lumière만의 집중 관리 시스템으로 최상의 퍼포먼스를 유지합니다. 단순한 소모품 교환을 넘어, 차량의 주행 환경과 특성에 맞춘 최적의 솔루션을 제공하여<br />엔진 및 구동계 컨디션을 완벽하게 보존합니다.
                      </p>
                   </div>
                </div>

                <div className="flex gap-6 group">
                   <div className="mt-1 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-gold-500 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                         <FileText className="w-5 h-5" />
                      </div>
                   </div>
                   <div>
                      <h4 className="text-lg text-white font-serif mb-3">디지털 정비 이력 (Digital Service Log)</h4>
                      <p className="text-neutral-400 text-sm leading-loose word-keep-all">
                         더 이상 직접 정비 이력을 기록하거나 소모품 교환 주기를 신경 쓸 필요가 없습니다. Lumière가 귀하의 차량에 대한 모든 메인터넌스 데이터를 체계적으로 관리하며,<br />최적의 시기에 필요한 서비스를 제안해 드립니다.
                      </p>
                   </div>
                </div>

                <div className="pt-8 border-t border-neutral-800">
                   <button 
                     onClick={() => setStep('search')}
                     className="w-full bg-gold-500 text-black py-4 font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors rounded-sm shadow-[0_0_20px_rgba(198,154,38,0.2)] hover:shadow-[0_0_30px_rgba(198,154,38,0.4)]"
                   >
                     내 차 소모품 견적 문의하기
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
                   <h3 className="text-xl font-serif text-white">차량 모델 검색</h3>
                </div>
                
                <div className="relative mb-6">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                   <input 
                      autoFocus
                      type="text" 
                      placeholder="모델명 입력 (예: 5시리즈, E클래스)"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-sm py-4 pl-12 pr-4 text-white focus:border-gold-500 focus:outline-none placeholder-neutral-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>

                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                   {searchQuery && filteredCars.length === 0 && (
                      <p className="text-neutral-500 text-center mt-10">검색 결과가 없습니다.</p>
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
                         차량 모델명을 입력해주세요.
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
                        <p className="text-neutral-500 text-xs mt-1">Select Maintenance Items</p>
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
                                               {item.name} 
                                               <span className="text-xs text-neutral-500 font-normal ml-2">
                                                   {item.type === 'unit' 
                                                       ? `(Set of ${currentQty})` 
                                                       : ''}
                                               </span>
                                           </h4>
                                           <div className="text-xs text-neutral-500 space-y-0.5">
                                              <p className="text-gold-400/80">{item.spec}</p>
                                              <p>권장주기: {item.interval}</p>
                                           </div>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <span className={`font-serif text-lg ${isSelected ? 'text-white' : 'text-neutral-500'}`}>
                                           ₩{itemTotal.toLocaleString()}
                                        </span>
                                        {!isSelected && item.type === 'unit' && (
                                            <p className="text-[10px] text-neutral-600 mt-1">
                                                Standard {currentQty}-Cylinder Set
                                            </p>
                                        )}
                                        {!isSelected && item.type === 'package' && (
                                            <p className="text-[10px] text-neutral-600 mt-1">
                                                Package Price
                                            </p>
                                        )}
                                     </div>
                                 </div>

                                 {/* Quantity Control (Only when selected) */}
                                 {isSelected && (
                                     <div className="flex items-center justify-between pt-4 border-t border-white/10 animate-fade-in">
                                         <div className="text-xs text-neutral-400 uppercase tracking-wider">
                                             Quantity ({item.type === 'unit' ? 'Parts' : 'Packages'})
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
                           <MapPin className="w-4 h-4" /> 시공 희망 지역
                        </label>
                        <select
                           value={selectedRegion}
                           onChange={(e) => setSelectedRegion(e.target.value)}
                           className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                        >
                           <option value="" disabled>지역을 선택해주세요</option>
                           {REGIONS.map(region => (
                              <option key={region} value={region}>{region}</option>
                           ))}
                        </select>
                     </div>

                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm text-neutral-400">Total Estimate (VAT Inc.)</span>
                        <span className="text-2xl font-serif text-gold-400">₩{totalPrice.toLocaleString()}</span>
                    </div>

                    <button 
                       disabled={!selectedRegion || Object.keys(selectedQuantities).length === 0}
                       onClick={handleBook}
                       className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                       <span>{Object.keys(selectedQuantities).length > 0 ? '선택 항목 예약하기' : '항목을 선택해주세요'}</span>
                       <ChevronRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-neutral-600 text-center mt-3">
                       * 예약금(10%) 결제 후 예약이 확정됩니다.
                    </p>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};