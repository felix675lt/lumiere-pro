import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Estimator } from './components/Estimator';
import { Atelier } from './components/Atelier';
import { Process } from './components/Process';
import { CarCare } from './components/CarCare';
import { BookingModal } from './components/BookingModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';

function App() {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isCarCareOpen, setIsCarCareOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // App-level Booking Modal State (for Car Care)
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    region: '',
    carModel: '',
    price: 0
  });

  const handleCarCareBook = (carModel: string, price: number, region: string) => {
    setBookingData({ carModel, price, region });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-serif font-bold tracking-tighter text-white">
          LUMIÈRE
        </div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest text-white/80">
          <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-white transition-colors uppercase">견적 산출</button>
          <button onClick={() => setIsCarCareOpen(true)} className="hover:text-white transition-colors uppercase">카케어 솔루션</button>
          <button onClick={() => setIsProcessOpen(true)} className="hover:text-white transition-colors uppercase">시공 프로세스</button>
          <button onClick={() => setIsAtelierOpen(true)} className="hover:text-white transition-colors uppercase">아틀리에 소개</button>
        </div>
      </nav>

      <main>
        <Hero
          onOpenEstimator={() => setIsEstimatorOpen(true)}
          onOpenCarCare={() => setIsCarCareOpen(true)}
        />
        <Estimator isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} />
        <Atelier isOpen={isAtelierOpen} onClose={() => setIsAtelierOpen(false)} />
        <Process isOpen={isProcessOpen} onClose={() => setIsProcessOpen(false)} />
        <CarCare
          isOpen={isCarCareOpen}
          onClose={() => setIsCarCareOpen(false)}
          onBook={handleCarCareBook}
        />
        <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />

        {/* Booking Modal for Car Care */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          region={bookingData.region}
          carModel={bookingData.carModel}
          estimatedPrice={bookingData.price}
        />

        {/* Simple Footer Section */}
        <footer className="bg-black py-20 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-serif mb-6">LUMIÈRE</h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm word-keep-all">
                진보된 소재와 장인정신을 통해 자동차 보존의 새로운 기준을 제시합니다.
                단순한 보호를 넘어, 귀하의 차량이 가진 유산을 큐레이팅합니다.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-4 text-neutral-500 text-sm">
                <li>concierge@lumiere-ppf.com</li>
                <li>02-1234-5678</li>
                <li>서울특별시 강남구 도산대로</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6">Social</h4>
              <ul className="space-y-4 text-neutral-500 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
                <li className="hover:text-white cursor-pointer transition-colors">YouTube</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 mt-20 text-neutral-800 text-xs flex justify-between">
            <span>© 2024 Lumière PPF Studio. All rights reserved.</span>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-neutral-500 transition-colors">개인정보처리방침</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;