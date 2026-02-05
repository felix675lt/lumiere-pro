import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur sticky top-0 z-10">
          <h2 className="text-xl font-serif text-white">개인정보처리방침</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-8 text-neutral-400 font-light text-sm leading-relaxed word-keep-all scrollbar-hide">
          <p className="text-xs text-neutral-600 mb-4">시행일자: 2024년 1월 1일</p>
          
          <section>
            <h3 className="text-white font-medium mb-3 text-base">1. 총칙</h3>
            <p>LUMIÈRE(이하 '회사')는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
          </section>

          <section>
            <h3 className="text-white font-medium mb-3 text-base">2. 개인정보의 수집 및 이용 목적</h3>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
              <li><strong className="text-gold-400">서비스 제공 및 계약의 이행</strong>: 차량 견적 산출, 시공 상담 예약, 카케어 솔루션 제공, 계약서 작성, 본인 확인</li>
              <li><strong className="text-gold-400">고객 관리</strong>: 서비스 이용에 따른 본인 식별, 불량 회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 불만 처리 등 민원 처리, 고지사항 전달</li>
              <li><strong className="text-gold-400">마케팅 및 광고 활용 (선택 시)</strong>: 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-medium mb-3 text-base">3. 수집하는 개인정보의 항목</h3>
            <div className="bg-neutral-800/50 p-4 rounded-sm border border-neutral-800">
               <ul className="space-y-2">
                 <li><span className="text-neutral-300">필수항목</span>: 성명, 휴대전화번호, 차량정보(모델명, 연식 등), 거주 지역</li>
                 <li><span className="text-neutral-300">선택항목</span>: 기타 요청사항, 시공 희망일자</li>
                 <li><span className="text-neutral-300">자동수집</span>: IP주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
               </ul>
            </div>
          </section>

          <section>
            <h3 className="text-white font-medium mb-3 text-base">4. 개인정보의 처리 및 보유 기간</h3>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: <strong>3년</strong> (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>계약 또는 청약철회 등에 관한 기록: <strong>5년</strong> (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: <strong>5년</strong> (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-medium mb-3 text-base">5. 개인정보의 제3자 제공</h3>
            <p>회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
              <li>이용자들이 사전에 동의한 경우 (예: 지역별 마스터 아틀리에 시공 연계를 위한 필수 정보 전달)</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
             <h3 className="text-white font-medium mb-3 text-base">6. 개인정보 보호책임자</h3>
             <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
             <div className="mt-4 border-l-2 border-gold-500 pl-4">
                <p className="text-white font-serif">Lumière Privacy Team</p>
                <p className="mt-1">E-mail: privacy@lumiere-ppf.com</p>
                <p>Tel: 02-1234-5678</p>
             </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors rounded-sm"
           >
             확인 (Close)
           </button>
        </div>
      </div>
    </div>
  );
};
