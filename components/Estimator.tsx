import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CarSize, CoverageType, FilmGrade } from '../types';
import { Button } from './Button';
import { getConciergeAdvice } from '../services/geminiService';
import { Loader2, Sparkles, ChevronRight, Check, Search, X, Shield, Palette, Layers, CarFront, Wrench, Menu, MapPin, ChevronDown } from 'lucide-react';
import { CAR_DATABASE } from '../data/priceData';
import { BookingModal } from './BookingModal';

interface EstimatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FullEstimate {
  transparent: PriceRange;
  matte: PriceRange;
  color: PriceRange;
  wrap: PriceRange;
}

// Fixed price list for ETC category with basePrice for calculation
const ETC_PRICES = [
  { name: '포인트 랩핑', price: '40만원 ~ 110만원', basePrice: 400000 },
  { name: '샌딩 추가', price: '10만원 ~ 30만원', basePrice: 100000 },
  { name: '윈드쉴드', price: '60만원 ~ 80만원', basePrice: 600000 },
  { name: '랩핑 제거', price: '30만원 (타사 50만원)', basePrice: 300000 },
  { name: '도어 PPF', price: '개당 40만원', basePrice: 400000 },
  { name: '크롬 딜리트', price: '70만원 ~ 130만원', basePrice: 700000 },
  { name: '도어 크롬 딜리트', price: '50만원', basePrice: 500000 },
  { name: '전면 PPF (본넷+휀다+범퍼)', price: '170만원', basePrice: 1700000 },
  { name: '사이드미러', price: '20만원', basePrice: 200000 },
  { name: '라이트 PPF', price: '20만원', basePrice: 200000 },
  { name: '도어잼', price: '50만원', basePrice: 500000 },
  { name: '실내 PPF', price: '30만원 ~ 60만원', basePrice: 300000 },
  { name: 'B필러 하이그로시', price: '15만원', basePrice: 150000 },
  { name: '헤드라이트 스모그', price: '25만원', basePrice: 250000 },
];

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

export const Estimator: React.FC<EstimatorProps> = ({ isOpen, onClose }) => {
  const [carModel, setCarModel] = useState('');
  const [size, setSize] = useState<CarSize>(CarSize.SEDAN);
  const [coverage, setCoverage] = useState<CoverageType>(CoverageType.FULL_BODY);
  
  const [estimates, setEstimates] = useState<FullEstimate | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reservation / Region Selection State
  const [isRegionSelectMode, setIsRegionSelectMode] = useState(false);
  
  // Booking Modal State
  const [bookingRegion, setBookingRegion] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Selected Package State for Pricing
  const [selectedPackage, setSelectedPackage] = useState<'transparent' | 'matte' | 'color' | 'wrap'>('transparent');
  
  // Selected ETC Item State
  const [selectedEtcIndex, setSelectedEtcIndex] = useState<number | null>(null);

  // Scroll Hint State
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Track if we are in "live update" mode (after first explicit consultation request)
  const isLiveMode = useRef(false);

  // Get list of models filtered by selected size
  const vehicleList = useMemo(() => {
    return Object.entries(CAR_DATABASE)
      .filter(([_, data]) => data.size === size) // Filter by the currently selected size
      .map(([name]) => name);
  }, [size]);

  // Reset car model if size changes and the current model doesn't belong to the new size
  useEffect(() => {
    if (carModel && CAR_DATABASE[carModel] && CAR_DATABASE[carModel].size !== size) {
      setCarModel(''); 
      setEstimates(null);
    }
  }, [size, carModel]);

  // Reset selected etc index and manage scroll hint when coverage changes
  useEffect(() => {
    if (coverage !== CoverageType.ETC) {
      setSelectedEtcIndex(null);
      setShowScrollHint(false);
    } else {
      // Small delay to show hint after transition
      const timer = setTimeout(() => setShowScrollHint(true), 500);
      return () => clearTimeout(timer);
    }
  }, [coverage]);

  const filteredCars = useMemo(() => {
    if (!searchQuery) return vehicleList;
    return vehicleList.filter(c => 
      c.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, vehicleList]);

  // Handle vehicle selection
  const handleSelectVehicle = (model: string) => {
    setCarModel(model);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const calculateEstimate = (): FullEstimate => {
    // Helper to calc final price (Amounts in DB are already VAT inclusive)
    const calcFinalRange = (amount: number): PriceRange => {
      if (amount === 0) return { min: 0, max: 0 };
      const finalAmount = amount;
      const minPrice = Math.round(finalAmount / 10000) * 10000;
      const maxPrice = Math.round((finalAmount * 1.05) / 10000) * 10000;
      return { min: minPrice, max: maxPrice };
    };

    // 1. Special Case: Front Package (Fixed Price)
    if (coverage === CoverageType.FRONT_PACKAGE) {
      const frontPackagePrice = 2600000;
      
      return {
        transparent: calcFinalRange(frontPackagePrice),
        matte: { min: 0, max: 0 }, 
        color: { min: 0, max: 0 },
        wrap: { min: 0, max: 0 }
      };
    }

    // 2. Special Case: Etc (Handled in UI, return zeros here)
    if (coverage === CoverageType.ETC) {
      return {
        transparent: { min: 0, max: 0 },
        matte: { min: 0, max: 0 },
        color: { min: 0, max: 0 },
        wrap: { min: 0, max: 0 }
      };
    }

    // 3. Standard Case: Full Body
    let ppfBase = 4800000;
    let wrapBase = 2800000;
    let colorBase = 6000000;
    let matteBase = 0;

    let hasSpecificMatte = false;

    if (CAR_DATABASE[carModel]) {
      const data = CAR_DATABASE[carModel];
      ppfBase = data.priceTransparent;
      wrapBase = data.priceWrap;
      colorBase = data.priceColor;
      if (data.priceMatte) {
        matteBase = data.priceMatte;
        hasSpecificMatte = true;
      }
    } else {
      // Fallback based on size if model not found
       switch (size) {
        case CarSize.COMPACT: 
          ppfBase = 4500000; wrapBase = 2500000; colorBase = 5800000; break;
        case CarSize.SEDAN: 
          ppfBase = 4800000; wrapBase = 2800000; colorBase = 6200000; break;
        case CarSize.SUV: 
          ppfBase = 5500000; wrapBase = 3200000; colorBase = 6800000; break;
        case CarSize.SUPERCAR: 
          ppfBase = 5500000; wrapBase = 3100000; colorBase = 7000000; break;
      }
    }

    const coverageMult = 1.0;

    const rawTransparent = ppfBase * coverageMult;
    const rawWrap = wrapBase * coverageMult;
    const rawColor = colorBase * coverageMult;
    
    let rawMatte = 0;
    if (hasSpecificMatte) {
        rawMatte = matteBase * coverageMult;
    } else {
        const derivedMatteBase = ppfBase + 300000;
        rawMatte = derivedMatteBase * coverageMult;
    }

    return {
      transparent: calcFinalRange(rawTransparent),
      matte: calcFinalRange(rawMatte),
      color: calcFinalRange(rawColor),
      wrap: calcFinalRange(rawWrap)
    };
  };

  const handleConsultation = useCallback(async () => {
    setLoading(true);
    setEstimates(null);
    setAiAdvice('');
    setIsRegionSelectMode(false); 

    // If ETC is selected, we don't calculate, we just show the list
    if (coverage === CoverageType.ETC) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setEstimates({
        transparent: { min: 0, max: 0 },
        matte: { min: 0, max: 0 },
        color: { min: 0, max: 0 },
        wrap: { min: 0, max: 0 }
      });
      setAiAdvice("부분 시공 및 커스텀 작업은 고객님의 니즈에 따라 다양한 옵션이 준비되어 있습니다. 위 리스트를 참고하시어 전문가와 상세 상담을 진행해보세요.");
      setLoading(false);
      return;
    }

    const result = calculateEstimate();
    const advice = await getConciergeAdvice(carModel, size, coverage, FilmGrade.PREMIUM);

    setEstimates(result);
    setAiAdvice(advice);
    setSelectedPackage('transparent'); 
    setLoading(false);
  }, [carModel, size, coverage]);

  // Auto-update effect
  useEffect(() => {
    if (isLiveMode.current) {
      handleConsultation();
    }
  }, [handleConsultation]);

  const handleRegionClick = (region: string) => {
    setBookingRegion(region);
    setIsBookingModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // Determine base price for booking
  const getSelectedPrice = () => {
    if (coverage === CoverageType.ETC) {
      return selectedEtcIndex !== null ? ETC_PRICES[selectedEtcIndex].basePrice : 0;
    }

    if (!estimates) return 0;
    if (coverage === CoverageType.FRONT_PACKAGE) return estimates.transparent.min;

    switch (selectedPackage) {
        case 'matte': return estimates.matte.min;
        case 'color': return estimates.color.min;
        case 'wrap': return estimates.wrap.min;
        case 'transparent': default: return estimates.transparent.min;
    }
  };

  const bookingPrice = getSelectedPrice();

  const getCardClasses = (type: 'transparent' | 'matte' | 'color' | 'wrap') => {
      const isSelected = selectedPackage === type;
      return `w-full text-left bg-white/5 p-5 border rounded-sm transition-all duration-300 relative group ${
          isSelected 
          ? 'border-gold-500 bg-gold-500/5 ring-1 ring-gold-500/50' 
          : 'border-white/10 hover:border-white/30'
      }`;
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] bg-charcoal border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-20 p-2 text-neutral-500 hover:text-white bg-black/20 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column: Controls */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-serif text-white mb-2 word-keep-all">맞춤형 프로텍션 구성</h3>
                <p className="text-neutral-500 text-sm word-keep-all">차량 크기에 맞는 모델을 선택하고, 원하시는 시공 범위를 지정하세요.</p>
              </div>

              <div className="space-y-8">
                {/* 1. Size Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4">1. 차량 크기 선택 (Size)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(CarSize).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`text-left px-4 py-3 border text-sm transition-all duration-300 ${size === s ? 'border-white text-white bg-white/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Vehicle Selector */}
                <div className={`group ${coverage === CoverageType.ETC ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label className="block text-xs uppercase tracking-widest text-gold-400 mb-3 cursor-pointer">
                    2. 차량 모델 선택 {size ? `(${size.split('(')[1].replace(')', '')})` : ''}
                  </label>
                  <div 
                    className="flex justify-between items-center w-full border-b border-neutral-700 py-3 transition-colors cursor-pointer hover:border-white"
                    onClick={() => coverage !== CoverageType.ETC && setIsSearchOpen(true)}
                  >
                    <span className={`text-lg font-serif ${carModel ? 'text-white' : 'text-neutral-700'}`}>
                      {carModel || (vehicleList.length > 0 ? "모델을 선택해주세요..." : "해당 크기의 차량 데이터가 없습니다.")}
                    </span>
                    <Search className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* 3. Coverage Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4">3. 시공 범위 (Coverage)</label>
                  <div className="space-y-2">
                    {Object.values(CoverageType).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCoverage(c)}
                        className={`w-full flex justify-between items-center px-4 py-3 border text-sm transition-all duration-300 ${coverage === c ? 'border-white text-white bg-white/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                      >
                        <span>{c}</span>
                        {coverage === c && <Check className="w-4 h-4 text-gold-400" />}
                      </button>
                    ))}
                  </div>
                  {coverage === CoverageType.FRONT_PACKAGE && (
                    <p className="text-xs text-gold-400 mt-2 px-2">
                      * 구성: 전면 + 사이드미러 + 윈드실드 + 라이트 PPF
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={() => {
                        isLiveMode.current = true;
                        handleConsultation();
                    }} 
                    disabled={loading} 
                    className="w-full flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? '견적 분석 확인 중' : (coverage === CoverageType.ETC ? '기타 시공 항목 보기' : '컨시어지 견적 분석 요청')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="relative border-l border-neutral-800 pl-0 lg:pl-16 flex flex-col justify-center min-h-[500px]">
              {!estimates && !loading && (
                <div className="text-neutral-700 text-center lg:text-left">
                  <p className="font-serif italic text-2xl mb-4 word-keep-all">"완벽함은 사소한 디테일에서 결정됩니다."</p>
                  <p className="text-sm tracking-widest uppercase">옵션을 선택하여 상담을 시작하세요.</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gold-400">
                   <div className="w-12 h-12 border-t-2 border-b-2 border-gold-400 rounded-full animate-spin mb-4"></div>
                   <p className="text-xs tracking-widest uppercase animate-pulse">Consulting Concierge...</p>
                </div>
              )}

              {estimates && !loading && (
                <div className="animate-fade-in space-y-10">
                  
                  {/* ETC View */}
                  {coverage === CoverageType.ETC ? (
                    <div className="border-b border-neutral-800 pb-6 relative group/list">
                      <p className="text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        기타 시공 및 부분 작업 가격표
                      </p>
                      
                      {/* Scrollable List Container */}
                      <div className="relative">
                        <div 
                          className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-2"
                          onScroll={(e) => {
                             if (e.currentTarget.scrollTop > 20) setShowScrollHint(false);
                          }}
                        >
                          {ETC_PRICES.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedEtcIndex(index)}
                              className={`w-full flex justify-between items-center p-4 rounded-sm border transition-all group shrink-0 ${
                                selectedEtcIndex === index
                                  ? 'bg-gold-500/10 border-gold-500 text-white'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {selectedEtcIndex === index && <Check className="w-4 h-4 text-gold-500" />}
                                <span className={`font-medium ${selectedEtcIndex === index ? 'text-white' : 'text-neutral-300'}`}>{item.name}</span>
                              </div>
                              <span className={`font-serif ${selectedEtcIndex === index ? 'text-gold-400' : 'text-white'}`}>{item.price}</span>
                            </button>
                          ))}
                        </div>

                        {/* Scroll Hint Popup */}
                        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-20 ${showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            <div className="bg-gold-500 text-black px-4 py-2 rounded-full shadow-[0_0_15px_rgba(198,154,38,0.4)] flex items-center gap-2 animate-bounce">
                                <span className="text-xs font-bold whitespace-nowrap">아래로 스크롤하여 더 보기</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Gradient Fade */}
                        <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-charcoal to-transparent pointer-events-none transition-opacity duration-300 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`} />
                      </div>

                      <p className="text-neutral-500 text-xs mt-4">*부분 시공은 차종에 따라 견적이 상이할 수 있습니다.</p>
                    </div>
                  ) : (
                    /* Standard & Front Package View */
                    <div className="border-b border-neutral-800 pb-6">
                      <p className="text-xs text-gold-400 uppercase tracking-widest mb-4">예상 시공 견적 (VAT 포함)</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Transparent PPF (Show for Full & Front) */}
                        <button 
                          className={getCardClasses('transparent')}
                          onClick={() => setSelectedPackage('transparent')}
                        >
                          {selectedPackage === 'transparent' && (
                              <div className="absolute top-3 right-3 text-gold-500 animate-fade-in">
                                  <Check className="w-4 h-4" />
                              </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className={`w-4 h-4 ${selectedPackage === 'transparent' ? 'text-gold-400' : 'text-blue-200'}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${selectedPackage === 'transparent' ? 'text-white' : 'text-neutral-300'}`}>투명 (Clear) PPF</span>
                          </div>
                          <div className="text-xl font-serif text-white">
                             {coverage === CoverageType.FRONT_PACKAGE 
                               ? '₩2,600,000' 
                               : `₩${formatPrice(estimates.transparent.min)}~`}
                          </div>
                          {coverage === CoverageType.FRONT_PACKAGE && (
                            <p className="text-[10px] text-neutral-500 mt-1">*전면 패키지 특가</p>
                          )}
                        </button>

                        {/* Matte PPF (Hide for Front Package unless custom logic needed) */}
                        {coverage === CoverageType.FULL_BODY && (
                          <button 
                            className={getCardClasses('matte')}
                            onClick={() => setSelectedPackage('matte')}
                          >
                            {selectedPackage === 'matte' && (
                                <div className="absolute top-3 right-3 text-gold-500 animate-fade-in">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Layers className={`w-4 h-4 ${selectedPackage === 'matte' ? 'text-gold-400' : 'text-neutral-400'}`} />
                              <span className={`text-xs font-bold uppercase tracking-wider ${selectedPackage === 'matte' ? 'text-white' : 'text-neutral-300'}`}>무광 (Matte) PPF</span>
                            </div>
                            <div className="text-xl font-serif text-white">
                               ₩{formatPrice(estimates.matte.min)}~
                            </div>
                          </button>
                        )}

                         {/* Color PPF (Hide for Front Package) */}
                         {coverage === CoverageType.FULL_BODY && (
                           <button 
                             className={getCardClasses('color')}
                             onClick={() => setSelectedPackage('color')}
                           >
                            {selectedPackage === 'color' && (
                                <div className="absolute top-3 right-3 text-gold-500 animate-fade-in">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Palette className={`w-4 h-4 ${selectedPackage === 'color' ? 'text-gold-400' : 'text-purple-300'}`} />
                              <span className={`text-xs font-bold uppercase tracking-wider ${selectedPackage === 'color' ? 'text-white' : 'text-neutral-300'}`}>컬러 (Color) PPF</span>
                            </div>
                            <div className="text-xl font-serif text-white">
                               {estimates.color.min > 0 
                                 ? `₩${formatPrice(estimates.color.min)}~` 
                                 : <span className="text-sm text-neutral-500">별도 문의</span>}
                            </div>
                          </button>
                         )}

                        {/* Wrap (Hide for Front Package) */}
                        {coverage === CoverageType.FULL_BODY && (
                          <button 
                            className={getCardClasses('wrap')}
                            onClick={() => setSelectedPackage('wrap')}
                          >
                            {selectedPackage === 'wrap' && (
                                <div className="absolute top-3 right-3 text-gold-500 animate-fade-in">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <CarFront className={`w-4 h-4 ${selectedPackage === 'wrap' ? 'text-gold-400' : 'text-yellow-500'}`} />
                              <span className={`text-xs font-bold uppercase tracking-wider ${selectedPackage === 'wrap' ? 'text-white' : 'text-neutral-300'}`}>프리미엄 랩핑</span>
                            </div>
                            <div className="text-xl font-serif text-white">
                               ₩{formatPrice(estimates.wrap.min)}~
                            </div>
                          </button>
                        )}
                      </div>
                      
                      <p className="text-neutral-500 text-xs mt-4">*실차 검수 및 필름 브랜드 선택에 따라 최종 견적이 확정됩니다.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <h4 className="text-sm font-medium text-white tracking-wide">컨시어지 코멘트</h4>
                    </div>
                    <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                      <p className="text-neutral-300 font-light leading-relaxed text-sm word-keep-all">
                        {aiAdvice}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                     {!isRegionSelectMode ? (
                        <Button 
                          variant="outline" 
                          className="w-full group flex items-center justify-center gap-2"
                          onClick={() => setIsRegionSelectMode(true)}
                        >
                          예약 상담 신청하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     ) : (
                        <div className="animate-fade-in bg-white/5 border border-white/10 rounded-sm p-5">
                          <div className="flex items-center justify-between mb-4">
                             <span className="text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
                               <MapPin className="w-3 h-3" />
                               시공 희망 지역 선택
                             </span>
                             <button onClick={() => setIsRegionSelectMode(false)} className="text-neutral-500 hover:text-white transition-colors">
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                             {REGIONS.map((region) => (
                               <button 
                                 key={region}
                                 className="px-3 py-3 text-xs border border-neutral-700 hover:border-gold-400 hover:text-gold-400 hover:bg-gold-400/5 transition-all text-neutral-300 rounded-sm text-left flex justify-between group"
                                 onClick={() => handleRegionClick(region)}
                               >
                                 {region}
                                 <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                               </button>
                             ))}
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-4 text-center leading-relaxed word-keep-all">
                            선택하신 지역 내, Lumière가 엄선한 최상위 등급의 마스터 아틀리에로 연결됩니다.
                          </p>
                        </div>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsSearchOpen(false)}>
            <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-neutral-800 flex items-center gap-4">
                <Search className="w-5 h-5 text-gold-400" />
                <input 
                  autoFocus
                  type="text"
                  placeholder={`차량 모델명을 검색하세요 (${size.split('(')[0]})`}
                  className="flex-1 bg-transparent text-white text-xl focus:outline-none placeholder-neutral-700 font-serif"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-500 hover:text-white" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredCars.map(car => (
                  <button
                    key={car}
                    className="w-full text-left px-8 py-5 text-neutral-400 hover:bg-neutral-800 hover:text-white border-b border-neutral-800/50 transition-colors flex justify-between items-center group"
                    onClick={() => handleSelectVehicle(car)}
                  >
                    <span className="font-light tracking-wide">{car}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gold-400" />
                  </button>
                ))}
                
                {/* Custom Input Option */}
                {searchQuery && !filteredCars.some(c => c.toLowerCase() === searchQuery.toLowerCase()) && (
                   <button
                    className="w-full text-left px-8 py-5 bg-gold-900/10 text-gold-400 hover:bg-gold-900/20 border-b border-neutral-800/50 transition-colors flex justify-between items-center group"
                    onClick={() => {
                      setCarModel(searchQuery);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span className="font-medium tracking-wide">직접 입력하기: "{searchQuery}"</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}
                
                {filteredCars.length === 0 && !searchQuery && (
                  <div className="p-8 text-center text-neutral-600 text-sm">
                    해당 크기 등급에서 찾으시는 모델이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        region={bookingRegion}
        carModel={carModel}
        estimatedPrice={bookingPrice}
      />
    </div>
    </>
  );
};