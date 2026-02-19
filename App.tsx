import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from './components/Hero';
import { Estimator } from './components/Estimator';
import { Atelier } from './components/Atelier';
import { Process } from './components/Process';
import { CarCare } from './components/CarCare';
import { BookingModal } from './components/BookingModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();
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
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-serif font-bold tracking-tighter text-white mix-blend-difference">
          {t('nav.brand')}
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-widest text-white/80 items-center">
          <div className="hidden md:flex gap-8 items-center mix-blend-difference">
            <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-white transition-colors uppercase">{t('nav.estimator')}</button>
            <button onClick={() => setIsCarCareOpen(true)} className="hover:text-white transition-colors uppercase">{t('nav.carCare')}</button>
            <button onClick={() => setIsProcessOpen(true)} className="hover:text-white transition-colors uppercase">{t('nav.process')}</button>
            <button onClick={() => setIsAtelierOpen(true)} className="hover:text-white transition-colors uppercase">{t('nav.atelier')}</button>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <main>
        <Hero
          onOpenEstimator={() => setIsEstimatorOpen(true)}
          onOpenCarCare={() => setIsCarCareOpen(true)}
        />
        <Estimator isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} onOpenBooking={(region, carModel, price) => { setBookingData({ region, carModel, price }); setIsBookingOpen(true); }} />
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
              <h2 className="text-3xl font-serif mb-6">{t('nav.brand')}</h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm word-keep-all">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6">{t('footer.contact')}</h4>
              <ul className="space-y-4 text-neutral-500 text-sm">
                <li>concierge@lumiere-ppf.com</li>
                <li>02-1234-5678</li>
                <li>{t('footer.address')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6">{t('footer.social')}</h4>
              <ul className="space-y-4 text-neutral-500 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
                <li className="hover:text-white cursor-pointer transition-colors">YouTube</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 mt-20 text-neutral-800 text-xs flex justify-between">
            <span>{t('footer.rights')}</span>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-neutral-500 transition-colors">{t('footer.privacy')}</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;