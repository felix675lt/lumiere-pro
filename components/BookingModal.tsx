import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle, ShieldCheck, ChevronLeft, ChevronRight, Clock, User, Wallet, Copy, RefreshCw, Smartphone, Crown, Star, Layers } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: string;
  carModel: string;
  estimatedPrice: number;
}

const PRESET_TIMES = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, region, carModel, estimatedPrice }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'schedule' | 'payment' | 'success' | 'membership'>('schedule');

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Time State
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');

  // Payment State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'USDT'>('BANK');
  const [usdtRate, setUsdtRate] = useState<number>(1450); // Fallback rate
  const [txid, setTxid] = useState('');
  const [isRateLoading, setIsRateLoading] = useState(false);

  // 10% Deposit
  const depositAmount = Math.round(estimatedPrice * 0.1);
  const usdtAmount = (depositAmount / usdtRate).toFixed(2);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset step on open
  useEffect(() => {
    if (isOpen) {
      setStep('schedule');
    }
  }, [isOpen]);

  // Fetch USDT Rate
  useEffect(() => {
    if (isOpen && step === 'payment' && paymentMethod === 'USDT') {
      fetchUsdtRate();
    }
  }, [isOpen, step, paymentMethod]);

  const fetchUsdtRate = async () => {
    setIsRateLoading(true);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=krw');
      const data = await res.json();
      if (data.tether && data.tether.krw) {
        setUsdtRate(data.tether.krw);
      }
    } catch (e) {
      console.error("Rate fetch error", e);
    } finally {
      setIsRateLoading(false);
    }
  };

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!customerName || !customerPhone) {
      alert("Please enter your name and phone number.");
      return;
    }
    if (paymentMethod === 'USDT' && !txid) {
      alert("Please enter the last 4 digits of your TXID.");
      return;
    }

    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => handleDateSelect(i)}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all
            ${isPast ? 'text-neutral-700 cursor-not-allowed' : 'hover:bg-neutral-800 text-white'}
            ${isSelected ? 'bg-gold-500 text-black font-bold hover:bg-gold-400' : ''}
            ${isToday && !isSelected ? 'border border-gold-500 text-gold-500' : ''}
          `}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const formatDateDisplay = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const formatWeekday = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  };

  // Helper to translate region if it's a key, otherwise return as is (fallback)
  const displayRegion = region.includes('_') ? t(`regions.${region}`) : region;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900/50">
          <div>
            <h3 className="text-white font-serif text-xl tracking-wide">
              {step === 'membership' ? t('booking.membershipTitle') : (step === 'success' ? t('booking.successTitle') : t('booking.title'))}
            </h3>
            {step !== 'membership' && (
              <p className="text-xs text-gold-400 uppercase tracking-widest mt-1">
                {displayRegion} • {carModel}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8 min-h-[400px]">

          {step === 'schedule' && (
            <div className="space-y-8 animate-fade-in pb-20">
              {/* Atelier Info */}
              <div className="bg-white/5 p-4 border border-white/10 rounded-sm flex items-start gap-4">
                <div className="bg-neutral-800 p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{t('booking.masterAtelier')}</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {t('booking.atelierInfo', { region: displayRegion })}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="relative" ref={calendarRef}>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {t('booking.selectDate')}
                </label>

                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`w-full text-left p-4 border rounded-sm flex justify-between items-center transition-all ${showCalendar || selectedDate ? 'border-gold-500 bg-gold-500/5 text-white' : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                >
                  <span className="font-serif text-lg">
                    {selectedDate ? formatDateDisplay(selectedDate) : t('booking.selectDatePlaceholder')}
                  </span>
                  {selectedDate && <span className="text-xs uppercase tracking-wider text-gold-400">{formatWeekday(selectedDate)}</span>}
                </button>

                {/* Calendar Popup */}
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-sm shadow-2xl z-20 p-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={handlePrevMonth} className="p-1 hover:text-white text-neutral-400"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="text-white font-serif font-medium">
                        {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate)}
                      </span>
                      <button onClick={handleNextMonth} className="p-1 hover:text-white text-neutral-400"><ChevronRight className="w-5 h-5" /></button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-[10px] uppercase text-neutral-500 tracking-wider py-2">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 justify-items-center">
                      {renderCalendar()}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Selection */}
              <div className={!selectedDate ? 'opacity-30 pointer-events-none' : ''}>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('booking.selectTime')}
                </label>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {PRESET_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setIsCustomTime(false);
                      }}
                      className={`
                        py-3 border text-sm transition-all rounded-sm
                        ${selectedTime === time && !isCustomTime
                          ? 'border-gold-500 bg-gold-500 text-black font-bold'
                          : 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-white/5'}
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Custom Time Option */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setIsCustomTime(true);
                      setSelectedTime('');
                    }}
                    className={`w-full py-3 border text-sm transition-all rounded-sm flex items-center justify-center gap-2
                      ${isCustomTime
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'}
                    `}
                  >
                    <span>{t('booking.customTime')}</span>
                  </button>

                  {isCustomTime && (
                    <div className="mt-3 animate-fade-in">
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => {
                          setCustomTime(e.target.value);
                          setSelectedTime(e.target.value);
                        }}
                        className="w-full bg-neutral-900 border border-gold-500 p-4 text-white text-center text-lg focus:outline-none rounded-sm"
                      />
                      <p className="text-[10px] text-neutral-500 mt-2 text-center">
                        {t('booking.timeNote')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('payment')}
                className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm mt-8"
              >
                {t('booking.proceedBtn')}
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-8 animate-fade-in">
              {/* Summary */}
              <div className="bg-neutral-800/50 p-6 rounded-sm border border-neutral-700">
                <div className="flex justify-between text-neutral-400 text-sm mb-3">
                  <span>{t('booking.serviceEstimate')}</span>
                  <span>₩{estimatedPrice.toLocaleString()}~</span>
                </div>
                <div className="flex justify-between text-white text-base font-medium pt-3 border-t border-neutral-700">
                  <span>{t('booking.deposit')}</span>
                  <span className="text-gold-400">₩{depositAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="text-white text-sm uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> {t('booking.customerInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('booking.namePlaceholder')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                  />
                  <input
                    type="tel"
                    placeholder={t('booking.phonePlaceholder')}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h4 className="text-white text-sm uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> {t('booking.depositMethod')}
                </h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('BANK')}
                    className={`flex-1 py-4 border rounded-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'BANK' ? 'bg-gold-500 text-black border-gold-500 font-bold' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}
                  >
                    <Smartphone className="w-4 h-4" /> {t('booking.bankTransfer')}
                  </button>
                  <button
                    onClick={() => setPaymentMethod('USDT')}
                    className={`flex-1 py-4 border rounded-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'USDT' ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}
                  >
                    <Layers className="w-4 h-4" /> {t('booking.arbitrum')}
                  </button>
                </div>

                {/* Payment Details */}
                <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-sm animate-fade-in">
                  {paymentMethod === 'BANK' ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-neutral-600 rounded-sm">
                        <div className="w-32 h-32 bg-neutral-800 rounded-sm mb-4 flex items-center justify-center">
                          <span className="text-neutral-500 text-xs">QR CODE AREA</span>
                        </div>
                        <p className="text-neutral-400 text-xs">{t('booking.scanKakao')}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.bank')}</span>
                          <span className="text-white">Shinhan Bank (신한은행)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.account')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono">110-123-456789</span>
                            <Copy className="w-3 h-3 text-neutral-500 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText('110-123-456789')} />
                          </div>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.holder')}</span>
                          <span className="text-white">Lumière Studio</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-neutral-600 rounded-sm">
                        <div className="w-32 h-32 bg-white rounded-sm mb-4 flex items-center justify-center overflow-hidden">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x5c9856c32eaff6659aae211d816b45a8b50de756`}
                            alt="Arbitrum QR Code"
                            className="w-full h-full"
                          />
                        </div>
                        <p className="text-neutral-400 text-xs">{t('booking.scanArbitrum')}</p>
                      </div>

                      <div className="bg-neutral-800 p-4 rounded-sm flex justify-between items-center">
                        <div className="text-xs">
                          <p className="text-neutral-400 mb-1">{t('booking.exchangeRate')}</p>
                          <p className="text-blue-400 font-bold">1 USDT ≈ ₩{usdtRate.toLocaleString()}</p>
                        </div>
                        <button onClick={fetchUsdtRate} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <RefreshCw className={`w-4 h-4 text-neutral-400 ${isRateLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.network')}</span>
                          <span className="text-white font-bold text-blue-500">Arbitrum One</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.address')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs truncate max-w-[150px]">0x5c98...e756</span>
                            <Copy className="w-3 h-3 text-neutral-500 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText('0x5c9856c32eaff6659aae211d816b45a8b50de756')} />
                          </div>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-800">
                          <span className="text-neutral-500">{t('booking.totalUSDT')}</span>
                          <span className="text-white font-bold">{usdtAmount} USDT</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">{t('booking.txid')}</label>
                        <input
                          type="text"
                          placeholder="e.g. 8f2a"
                          maxLength={10}
                          value={txid}
                          onChange={(e) => setTxid(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-blue-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm text-center font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePayment}
                className={`w-full py-4 font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 rounded-sm
                    ${paymentMethod === 'BANK'
                    ? 'bg-gold-500 text-black hover:bg-gold-400'
                    : 'bg-blue-600 text-white hover:bg-blue-500'}`
                }
              >
                {t('booking.completeBtn')}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">{t('booking.successTitle')}</h3>
              <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed word-keep-all">
                <Trans i18nKey="booking.successDesc" />
              </p>
              <div className="bg-neutral-800 p-6 w-full max-w-sm rounded-sm mb-8 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500 text-xs uppercase">Customer</span>
                  <span className="text-white text-sm">{customerName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500 text-xs uppercase">Date</span>
                  <span className="text-white text-sm">
                    {selectedDate ? formatDateDisplay(selectedDate) : ''}, {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 text-xs uppercase">Deposit ({paymentMethod === 'BANK' ? 'Bank' : 'Arbitrum'})</span>
                  <span className="text-gold-400 text-sm">
                    {paymentMethod === 'BANK' ? `₩${depositAmount.toLocaleString()}` : `${usdtAmount} USDT`}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <button
                  onClick={() => setStep('membership')}
                  className="w-full px-8 py-3 bg-white/5 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors uppercase text-sm tracking-widest rounded-sm flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" /> {t('booking.membershipBtn')}
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-8 py-3 border border-neutral-700 text-white hover:bg-white hover:text-black transition-colors uppercase text-sm tracking-widest rounded-sm"
                >
                  {t('booking.closeBtn')}
                </button>
              </div>
            </div>
          )}

          {step === 'membership' && (
            <div className="flex flex-col items-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,154,38,0.5)]">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-serif text-white mb-2">{t('booking.membershipTitle')}</h3>
              <p className="text-gold-400 text-sm uppercase tracking-[0.3em] mb-10">{t('booking.membershipSubtitle')}</p>

              <div className="w-full space-y-4 mb-10">
                <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex items-center gap-4">
                  <div className="p-2 bg-gold-500/10 rounded-full text-gold-400"><Star className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-white font-medium">Engine Oil 50% Off</h4>
                    <p className="text-neutral-500 text-xs">연 2회 합성유 교환 비용 50% 지원</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex items-center gap-4">
                  <div className="p-2 bg-gold-500/10 rounded-full text-gold-400"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-white font-medium">Free Basic Checkup</h4>
                    <p className="text-neutral-500 text-xs">상시 무상 정밀 진단 & 워셔액 보충</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex items-center gap-4">
                  <div className="p-2 bg-gold-500/10 rounded-full text-gold-400"><User className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-white font-medium">Priority Service</h4>
                    <p className="text-neutral-500 text-xs">전국 마스터 아틀리에 우선 예약권</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <button className="w-full bg-gold-500 text-black py-4 font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors rounded-sm">
                  {t('booking.membershipInquiry')}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest"
                >
                  {t('booking.closeBtn')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};