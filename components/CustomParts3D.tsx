import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { X, ChevronRight, CheckCircle, Package, Layers, Car, Mail, Phone, Wallet, RefreshCw, Copy, Send } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { sendAdminNotification } from '../src/utils/email';

interface CustomParts3DProps {
  isOpen: boolean;
  onClose: () => void;
}

const PART_TYPES = [
  { id: 'splitter', name: 'Front Splitter (프론트 스플리터)', basePrice: 800 },
  { id: 'diffuser', name: 'Rear Diffuser (리어 디퓨저)', basePrice: 1200 },
  { id: 'side_skirts', name: 'Side Skirts (사이드 스커트)', basePrice: 1000 },
  { id: 'mirror_caps', name: 'Mirror Caps (미러 캡)', basePrice: 400 },
  { id: 'spoiler', name: 'Rear Spoiler (리어 스포일러)', basePrice: 700 },
  { id: 'etc', name: 'Other (기타)', basePrice: 0 }
];

const MATERIALS = [
  { id: 'dry_carbon', name: 'Dry Carbon Fiber', multiplier: 2.0 },
  { id: 'forged_carbon', name: 'Forged Carbon', multiplier: 2.2 },
  { id: 'frp', name: 'FRP (Fiberglass)', multiplier: 1.0 }
];

const USDT_ADDRESS = "0x5c9856C32eAfF6659aAE211d816B45A8b50dE756";

export const CustomParts3D: React.FC<CustomParts3DProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'selection' | 'details' | 'payment' | 'success'>('selection');

  const [partType, setPartType] = useState(PART_TYPES[0]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [carModel, setCarModel] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    customOrder: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'PAYPAL' | 'USDT'>('PAYPAL');
  const [txid, setTxid] = useState('');

  if (!isOpen) return null;

  const isEtc = partType.id === 'etc';
  const estimatedPrice = isEtc ? 0 : partType.basePrice * material.multiplier;
  const usdtAmount = estimatedPrice.toFixed(2);

  const handleNext = () => {
    if (step === 'selection') setStep('details');
    else if (step === 'details') {
      if (!carModel || !customerInfo.name || !customerInfo.email) {
        alert("Please fill in all required fields. (Car Model, Name, Email)");
        return;
      }
      setStep('payment');
    }
  };

  const handlePayPalApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      await sendAdminNotification("3D 커스텀 파츠 주문 (PayPal)", {
        이름: customerInfo.name,
        연락처: customerInfo.phone,
        이메일: customerInfo.email,
        차종: carModel,
        주문부품: partType.name,
        재질: isEtc ? '해당없음' : material.name,
        결제방식: 'PayPal',
        결제금액: `$${estimatedPrice} USD`,
        요구사항: customerInfo.customOrder,
        추가메모: customerInfo.notes
      });
      setStep('success');
    });
  };

  const initialOptions = {
    clientId: "AdDd-Uz8w-5a-wGlsyroZcP0EdQDg7EgPB5LtQOCvQIGsfQ7o8Hu6pRQI5uOjNgMPTV3YqfGubTBKIjD",
    currency: "USD",
    intent: "capture",
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${USDT_ADDRESS}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] max-w-[95vw]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 text-neutral-500 hover:text-white transition-colors bg-neutral-900/50 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Section - Intro */}
        <div className="w-full md:w-1/3 bg-neutral-800 p-10 flex col justify-between hidden md:flex flex-col">
          <div>
            <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6">{t('customParts.title')}</h2>
            <h3 className="text-3xl font-serif text-white leading-tight word-keep-all whitespace-pre-line">
              Bespoke 3D Printed Parts
            </h3>
            <p className="text-neutral-500 text-sm mt-6 leading-relaxed">
              Design and order your custom fit aerodynamics and exterior parts. Precision measured, 3D modeled, and manufactured with the highest grade materials.
            </p>
          </div>
          <div className="text-neutral-500 text-sm">
            <p className="text-white font-serif mb-2">"Precision beyond Aesthetics"</p>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="w-full md:w-2/3 bg-neutral-900 overflow-y-auto flex-1 min-h-0 p-6 md:p-10">

          {/* Step Breadcrumbs */}
          <div className="flex items-center gap-2 mb-10 text-xs uppercase tracking-widest text-neutral-600">
            <span className={step === 'selection' ? 'text-gold-400 font-bold' : ''}>1. Design</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step === 'details' ? 'text-gold-400 font-bold' : ''}>2. Details</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step === 'payment' ? 'text-gold-400 font-bold' : ''}>
              {isEtc ? '3. Submit' : '3. Payment'}
            </span>
          </div>

          {step === 'selection' && (
            <div className="space-y-8 animate-fade-in pb-10">
              {/* Part Type Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Select Part Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PART_TYPES.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => setPartType(part)}
                      className={`p-4 border text-left transition-all rounded-sm flex items-center justify-between
                        ${partType.id === part.id
                          ? 'border-gold-500 bg-gold-500/10 text-white'
                          : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                    >
                      <span className="text-sm font-medium">{part.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Selection */}
              <div className={`transition-opacity duration-300 ${isEtc ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Select Material
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setMaterial(mat)}
                      className={`p-4 border text-center transition-all rounded-sm flex flex-col items-center gap-2
                        ${material.id === mat.id
                          ? 'border-gold-500 bg-gold-500/10 text-white font-medium'
                          : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                    >
                      <span className="text-xs">{mat.name}</span>
                      <span className="text-[10px] text-neutral-500 opacity-80">(x{mat.multiplier})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-800 p-4 rounded-sm flex justify-between items-center mt-6 border border-neutral-700 shrink-0">
                <span className="text-sm text-neutral-400">Estimated Base Price</span>
                <span className="text-xl font-serif text-gold-400">
                  {isEtc ? t('estimator.ask_separately') : `$${estimatedPrice.toLocaleString()}`}
                </span>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm flex items-center justify-center gap-2 mt-8 shrink-0"
              >
                <span>Continue to Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6 animate-fade-in pb-10">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BMW M4 G82 2023"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                    User Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email *
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                  Custom Order Details (커스텀 오더 내역)
                </label>
                <textarea
                  placeholder="원하시는 부품의 디테일, 재질, 핏먼트 등 커스텀 오더 요구사항을 자유롭게 적어주세요."
                  rows={4}
                  value={customerInfo.customOrder}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customOrder: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm resize-none mb-4"
                />

                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Special requests or custom fitment details..."
                  rows={2}
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-gold-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm resize-none"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('selection')}
                  className="w-1/3 border border-neutral-700 text-neutral-400 py-4 font-bold tracking-widest uppercase hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-2/3 bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  {isEtc ? 'Proceed to Submission' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-fade-in pb-10">
              <div className="bg-neutral-800 p-5 rounded-sm border border-neutral-700 space-y-3 mb-4 shrink-0">
                <h4 className="text-white font-serif border-b border-neutral-700 pb-2 mb-3">Order Summary</h4>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Part Type</span>
                  <span className="text-white">{partType.name}</span>
                </div>
                {!isEtc && (
                  <div className="flex justify-between text-sm text-neutral-400">
                    <span>Material</span>
                    <span className="text-white">{material.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Vehicle</span>
                  <span className="text-white">{carModel}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-3 border-t border-neutral-700 text-white mt-4">
                  <span>Total Estimated Price</span>
                  <span className="text-gold-400">
                    {isEtc ? t('estimator.ask_separately') : `$${estimatedPrice.toLocaleString()} USD`}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                {isEtc ? (
                  <button
                    onClick={async () => {
                      await sendAdminNotification("3D 커스텀 파츠 견적 문의 (기타)", {
                        이름: customerInfo.name,
                        연락처: customerInfo.phone,
                        이메일: customerInfo.email,
                        차종: carModel,
                        요구사항: customerInfo.customOrder,
                        추가메모: customerInfo.notes
                      });
                      setStep('success');
                    }}
                    className="w-full bg-gold-500 text-black py-4 font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors rounded-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-4 h-4" /> Submit Inquiry
                  </button>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-white text-sm uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Select Payment Method
                      </h4>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setPaymentMethod('PAYPAL')}
                          className={`flex-1 py-4 border rounded-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'PAYPAL' ? 'bg-gold-500 text-black border-gold-500 font-bold' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}
                        >
                          PayPal
                        </button>
                        <button
                          onClick={() => setPaymentMethod('USDT')}
                          className={`flex-1 py-4 border rounded-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'USDT' ? 'bg-green-500 text-black border-green-500 font-bold' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}
                        >
                          <RefreshCw className="w-4 h-4" /> USDT (Arbitrum)
                        </button>
                      </div>

                      {paymentMethod === 'PAYPAL' ? (
                        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-sm animate-fade-in">
                          <PayPalScriptProvider options={initialOptions}>
                            <PayPalButtons
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  intent: "CAPTURE",
                                  purchase_units: [
                                    {
                                      description: `Lumiere 3D Custom: ${partType.name} (${material.name}) for ${carModel}`,
                                      amount: {
                                        currency_code: "USD",
                                        value: estimatedPrice.toString(),
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={handlePayPalApprove}
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      ) : (
                        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-sm animate-fade-in space-y-6">
                          <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-neutral-600 rounded-sm">
                            <div className="w-32 h-32 bg-white rounded-sm mb-4 flex items-center justify-center p-2 overflow-hidden overflow-hidden shrink-0">
                              <img src={qrUrl} alt="USDT QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <p className="text-neutral-400 text-xs">Scan to pay with USDT</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-neutral-800">
                              <span className="text-neutral-500">Network</span>
                              <span className="text-white font-bold text-green-500">Arbitrum One</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-neutral-800">
                              <span className="text-neutral-500 shrink-0 mr-4">Address</span>
                              <div className="flex items-center gap-2 justify-end min-w-0">
                                <span className="text-white font-mono text-[10px] sm:text-xs truncate">{USDT_ADDRESS}</span>
                                <Copy className="w-4 h-4 text-neutral-500 cursor-pointer hover:text-white shrink-0" onClick={() => navigator.clipboard.writeText(USDT_ADDRESS)} />
                              </div>
                            </div>
                            <div className="flex justify-between py-2 border-b border-neutral-800">
                              <span className="text-neutral-500">Amount</span>
                              <span className="text-white font-bold">{usdtAmount} USDT</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">{t('booking.txid_label', 'TXID Last Digits')}</label>
                            <input
                              type="text"
                              placeholder="e.g. 8f2a"
                              maxLength={10}
                              value={txid}
                              onChange={(e) => setTxid(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-green-500 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm text-center font-mono uppercase"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              if (!txid) { alert("Please enter the last digits of TXID."); return; }
                              await sendAdminNotification("3D 커스텀 파츠 주문 (USDT)", {
                                이름: customerInfo.name,
                                연락처: customerInfo.phone,
                                이메일: customerInfo.email,
                                차종: carModel,
                                주문부품: partType.name,
                                재질: material.name,
                                결제방식: 'USDT (Arbitrum)',
                                결제금액: `${usdtAmount} USDT`,
                                TXID: txid,
                                요구사항: customerInfo.customOrder,
                                추가메모: customerInfo.notes
                              });
                              setStep('success');
                            }}
                            className="w-full bg-green-500 text-black py-4 font-bold tracking-widest uppercase hover:bg-green-400 transition-colors rounded-sm flex items-center justify-center gap-2 mt-4"
                          >
                            <CheckCircle className="w-4 h-4" /> Complete Order Request
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full border border-neutral-700 text-neutral-400 py-4 font-bold tracking-widest uppercase hover:text-white transition-colors rounded-sm mt-4 shrink-0"
              >
                Return to Details
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center min-h-[400px]">
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">
                {isEtc ? 'Inquiry Submitted' : 'Order Successful'}
              </h3>
              <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed word-keep-all whitespace-pre-line">
                {isEtc
                  ? `Your inquiry has been successfully sent.\nOur design team will contact you shortly at\n${customerInfo.email}`
                  : `Your bespoke 3D custom part order has been confirmed.\nOur design team will contact you shortly at\n${customerInfo.email}`
                }
              </p>

              <button
                onClick={onClose}
                className="w-full max-w-xs px-8 py-4 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors uppercase font-bold tracking-widest rounded-sm"
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
