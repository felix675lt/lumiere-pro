import React from 'react';
import { X } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface AtelierProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Atelier: React.FC<AtelierProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 p-8 md:p-16 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-10">
          <div>
            <h2 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">{t('atelier.sectionTitle')}</h2>
            <h3
              className="text-3xl md:text-4xl font-serif text-white leading-tight mb-2"
              dangerouslySetInnerHTML={{ __html: t('atelier.title') }}
            />
          </div>

          <div className="space-y-8 text-neutral-400 font-light leading-loose word-keep-all max-w-2xl mx-auto text-sm md:text-base">
            <p>
              <Trans i18nKey="atelier.intro">
                <strong className="text-white font-serif text-lg">LUMIÈRE</strong>는 단순한 시공 중개 플랫폼이 아닙니다.
                우리는 '완벽함'이라는 하나의 철학 아래 모인 대한민국 최상위 PPF 아틀리에들의 프라이빗 컬렉션입니다.
              </Trans>
            </p>

            <div className="w-10 h-[1px] bg-neutral-800 mx-auto"></div>

            <p>
              <Trans i18nKey="atelier.material">
                시중의 수많은 필름 중에서도 물성, 광도, 그리고 내구성이 완벽하게 검증된
                <span className="text-gold-200"> 최상위 등급의 필름(High-End Grade Film)</span>만을 엄선하여 사용합니다.
                작은 기포 하나, 미세한 마감의 오차조차 허용하지 않는 엄격한<br className="hidden md:block" /> 기준은 Lumière가 고객님께 드리는 약속입니다.
              </Trans>
            </p>

            <p>
              <Trans i18nKey="atelier.network">
                우리는 <span className="text-white">수도권의 하이엔드 스튜디오</span>를 기점으로 시작하여,
                독보적인 기술력과 장인정신을 보유한 <span className="text-white">전국 각지의 마스터 아틀리에</span>를
                엄선하고 리스팅합니다. 아무나 등록될 수 없으며, 오직 실력으로 증명된 곳만이 Lumière의 이름을 사용할 수 있습니다.
              </Trans>
            </p>

            <p>
              <Trans i18nKey="atelier.technical">
                또한, 외장의 아름다움을 넘어 차량의 심장인 엔진과 파워트레인을 위한 <span className="text-gold-200">프리미엄 테크니컬 솔루션</span>을 함께 제안합니다.
                슈퍼카와 럭셔리 세단의 메커니즘을 완벽히 이해하는 마스터 미케닉의 집요한 진단과 정교한<br className="hidden md:block" /> 정비를 통해,
                귀하의 차량이 처음 설계된 그 순간의 퍼포먼스를 오랫동안 유지할 수 있도록 관리합니다.
              </Trans>
            </p>

            <div className="w-10 h-[1px] bg-neutral-800 mx-auto"></div>

            <p dangerouslySetInnerHTML={{ __html: t('atelier.outtro') }} />
          </div>

          <div className="pt-8">
            <span className="font-serif italic text-gold-500 text-xl">{t('atelier.studio')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};