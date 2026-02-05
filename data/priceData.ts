import { CarSize } from "../types";

export interface CarPriceData {
  size: CarSize;
  priceTransparent: number; // 투명 PPF
  priceWrap: number;        // 랩핑
  priceColor: number;       // 컬러 PPF
  priceMatte?: number;      // 무광 PPF (Optional, overrides default +300k rule)
}

// 만원 단위를 원 단위로 변환하는 헬퍼
const M = 10000;

export const CAR_DATABASE: Record<string, CarPriceData> = {
  // BMW
  "BMW 1시리즈": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 250 * M, priceColor: 580 * M },
  "BMW 3시리즈": { size: CarSize.SEDAN, priceTransparent: 470 * M, priceWrap: 270 * M, priceColor: 580 * M },
  "BMW 5시리즈": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 580 * M },
  "BMW 7시리즈": { size: CarSize.SEDAN, priceTransparent: 520 * M, priceWrap: 310 * M, priceColor: 620 * M },
  "BMW M2 (F바디)": { size: CarSize.COMPACT, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 580 * M },
  "BMW M2 (G바디)": { size: CarSize.COMPACT, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 640 * M },
  "BMW M3 (F바디)": { size: CarSize.SEDAN, priceTransparent: 470 * M, priceWrap: 280 * M, priceColor: 640 * M },
  "BMW M3 (G바디)": { size: CarSize.SEDAN, priceTransparent: 490 * M, priceWrap: 290 * M, priceColor: 640 * M },
  "BMW M4 (F바디)": { size: CarSize.COMPACT, priceTransparent: 470 * M, priceWrap: 280 * M, priceColor: 660 * M },
  "BMW M4 (G바디)": { size: CarSize.COMPACT, priceTransparent: 490 * M, priceWrap: 290 * M, priceColor: 660 * M },
  "BMW M5 (F바디)": { size: CarSize.SEDAN, priceTransparent: 500 * M, priceWrap: 300 * M, priceColor: 680 * M },
  "BMW M5 (G바디)": { size: CarSize.SEDAN, priceTransparent: 510 * M, priceWrap: 300 * M, priceColor: 680 * M },
  "BMW M8 (그란쿠페)": { size: CarSize.SEDAN, priceTransparent: 500 * M, priceWrap: 300 * M, priceColor: 680 * M },
  "BMW Z4": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 250 * M, priceColor: 600 * M },
  "BMW X1": { size: CarSize.SUV, priceTransparent: 460 * M, priceWrap: 280 * M, priceColor: 600 * M },
  "BMW X3 / X4": { size: CarSize.SUV, priceTransparent: 480 * M, priceWrap: 290 * M, priceColor: 620 * M },
  "BMW X5": { size: CarSize.SUV, priceTransparent: 530 * M, priceWrap: 320 * M, priceColor: 700 * M },
  "BMW X6": { size: CarSize.SUV, priceTransparent: 540 * M, priceWrap: 340 * M, priceColor: 720 * M },
  "BMW X7": { size: CarSize.SUV, priceTransparent: 580 * M, priceWrap: 360 * M, priceColor: 740 * M },
  "BMW i3": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 250 * M, priceColor: 560 * M },
  "BMW i8": { size: CarSize.SUPERCAR, priceTransparent: 460 * M, priceWrap: 270 * M, priceColor: 630 * M },

  // MINI
  "미니 쿠퍼": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 220 * M, priceColor: 530 * M },
  "미니 컨트리맨": { size: CarSize.COMPACT, priceTransparent: 430 * M, priceWrap: 240 * M, priceColor: 560 * M },
  "미니 클럽맨": { size: CarSize.COMPACT, priceTransparent: 430 * M, priceWrap: 230 * M, priceColor: 540 * M },

  // Rolls-Royce
  "롤스로이스 고스트": { size: CarSize.SEDAN, priceTransparent: 570 * M, priceWrap: 340 * M, priceColor: 700 * M },
  "롤스로이스 레이스": { size: CarSize.COMPACT, priceTransparent: 560 * M, priceWrap: 320 * M, priceColor: 690 * M },
  "롤스로이스 팬텀": { size: CarSize.SEDAN, priceTransparent: 630 * M, priceWrap: 370 * M, priceColor: 800 * M },
  "롤스로이스 컬리넌": { size: CarSize.SUV, priceTransparent: 620 * M, priceWrap: 360 * M, priceColor: 760 * M },
  "롤스로이스 스펙터": { size: CarSize.COMPACT, priceTransparent: 600 * M, priceWrap: 320 * M, priceColor: 700 * M },

  // Mercedes-Benz
  "벤츠 A클래스": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 250 * M, priceColor: 550 * M },
  "벤츠 C클래스": { size: CarSize.SEDAN, priceTransparent: 470 * M, priceWrap: 270 * M, priceColor: 560 * M },
  "벤츠 CLS": { size: CarSize.SEDAN, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 630 * M },
  "벤츠 E클래스": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 260 * M, priceColor: 570 * M },
  "벤츠 S클래스": { size: CarSize.SEDAN, priceTransparent: 520 * M, priceWrap: 310 * M, priceColor: 630 * M },
  "벤츠 AMG GT": { size: CarSize.SUPERCAR, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 620 * M },
  "벤츠 SL63": { size: CarSize.SUPERCAR, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 650 * M },
  "벤츠 G바겐": { size: CarSize.SUV, priceTransparent: 600 * M, priceWrap: 360 * M, priceColor: 700 * M },
  "벤츠 GT43 / GT63": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 650 * M },
  "벤츠 GLA / GLB / GLC": { size: CarSize.SUV, priceTransparent: 480 * M, priceWrap: 290 * M, priceColor: 620 * M },
  "벤츠 GLE": { size: CarSize.SUV, priceTransparent: 520 * M, priceWrap: 320 * M, priceColor: 630 * M },
  "벤츠 GLS": { size: CarSize.SUV, priceTransparent: 590 * M, priceWrap: 340 * M, priceColor: 680 * M },
  "벤츠 EQA / EQB / EQC": { size: CarSize.SUV, priceTransparent: 460 * M, priceWrap: 270 * M, priceColor: 620 * M },
  "벤츠 EQE": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 300 * M, priceColor: 670 * M },
  "벤츠 EQS": { size: CarSize.SEDAN, priceTransparent: 500 * M, priceWrap: 320 * M, priceColor: 680 * M },
  "벤츠 스프린터": { size: CarSize.SUV, priceTransparent: 790 * M, priceWrap: 460 * M, priceColor: 880 * M },
  "스마트 포투": { size: CarSize.COMPACT, priceTransparent: 350 * M, priceWrap: 210 * M, priceColor: 450 * M },

  // Audi
  "아우디 TT": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 250 * M, priceColor: 550 * M },
  "아우디 A6": { size: CarSize.SEDAN, priceTransparent: 450 * M, priceWrap: 260 * M, priceColor: 580 * M },
  "아우디 RS6": { size: CarSize.SEDAN, priceTransparent: 450 * M, priceWrap: 280 * M, priceColor: 580 * M },
  "아우디 A7 / RS7": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 630 * M },
  "아우디 A8 / S8": { size: CarSize.SEDAN, priceTransparent: 520 * M, priceWrap: 290 * M, priceColor: 640 * M },
  "아우디 Q5": { size: CarSize.SUV, priceTransparent: 530 * M, priceWrap: 320 * M, priceColor: 640 * M },
  "아우디 Q7": { size: CarSize.SUV, priceTransparent: 550 * M, priceWrap: 340 * M, priceColor: 690 * M },
  "아우디 Q8": { size: CarSize.SUV, priceTransparent: 550 * M, priceWrap: 340 * M, priceColor: 730 * M },
  "아우디 Q4 이트론": { size: CarSize.SUV, priceTransparent: 490 * M, priceWrap: 290 * M, priceColor: 620 * M },
  "아우디 이트론 55": { size: CarSize.SUV, priceTransparent: 490 * M, priceWrap: 310 * M, priceColor: 640 * M },
  "아우디 이트론 GT": { size: CarSize.SEDAN, priceTransparent: 510 * M, priceWrap: 290 * M, priceColor: 640 * M },
  "아우디 R8": { size: CarSize.SUPERCAR, priceTransparent: 490 * M, priceWrap: 290 * M, priceColor: 650 * M },

  // Volkswagen
  "폭스바겐 골프": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 250 * M, priceColor: 540 * M },

  // Bentley
  "벤틀리 컨티넨탈 GT": { size: CarSize.COMPACT, priceTransparent: 560 * M, priceWrap: 320 * M, priceColor: 740 * M },
  "벤틀리 플라잉스퍼": { size: CarSize.SEDAN, priceTransparent: 580 * M, priceWrap: 340 * M, priceColor: 740 * M },
  "벤틀리 벤테이가": { size: CarSize.SUV, priceTransparent: 600 * M, priceWrap: 350 * M, priceColor: 780 * M },

  // Lamborghini
  "람보르기니 가야르도": { size: CarSize.SUPERCAR, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 0 },
  "람보르기니 우라칸": { size: CarSize.SUPERCAR, priceTransparent: 530 * M, priceWrap: 290 * M, priceColor: 650 * M },
  "람보르기니 아벤타도르": { size: CarSize.SUPERCAR, priceTransparent: 560 * M, priceWrap: 320 * M, priceColor: 720 * M },
  "람보르기니 우루스": { size: CarSize.SUV, priceTransparent: 600 * M, priceWrap: 340 * M, priceColor: 770 * M },

  // Porsche
  "포르쉐 박스터 / 카이맨": { size: CarSize.COMPACT, priceTransparent: 460 * M, priceWrap: 260 * M, priceColor: 560 * M },
  "포르쉐 911": { size: CarSize.SUPERCAR, priceTransparent: 500 * M, priceWrap: 290 * M, priceColor: 650 * M },
  "포르쉐 마칸": { size: CarSize.SUV, priceTransparent: 510 * M, priceWrap: 290 * M, priceColor: 650 * M },
  "포르쉐 카이엔": { size: CarSize.SUV, priceTransparent: 510 * M, priceWrap: 340 * M, priceColor: 700 * M },
  "포르쉐 타이칸": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 700 * M },
  "포르쉐 파나메라": { size: CarSize.SEDAN, priceTransparent: 540 * M, priceWrap: 290 * M, priceColor: 700 * M },

  // Volvo
  "볼보 XC40": { size: CarSize.SUV, priceTransparent: 470 * M, priceWrap: 260 * M, priceColor: 620 * M },
  "볼보 XC60": { size: CarSize.SUV, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 630 * M },
  "볼보 XC90": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 310 * M, priceColor: 650 * M },
  "볼보 S90": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 630 * M },

  // JLR
  "랜드로버 디스커버리": { size: CarSize.SUV, priceTransparent: 470 * M, priceWrap: 280 * M, priceColor: 630 * M, priceMatte: 580 * M },
  "랜드로버 디펜더": { size: CarSize.SUV, priceTransparent: 540 * M, priceWrap: 310 * M, priceColor: 620 * M, priceMatte: 580 * M },
  "레인지로버 벨라": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 290 * M, priceColor: 580 * M, priceMatte: 570 * M },
  "레인지로버 이보크": { size: CarSize.SUV, priceTransparent: 520 * M, priceWrap: 270 * M, priceColor: 580 * M, priceMatte: 540 * M },
  "레인지로버 (보그)": { size: CarSize.SUV, priceTransparent: 600 * M, priceWrap: 340 * M, priceColor: 660 * M, priceMatte: 620 * M },
  "레인지로버 스포츠": { size: CarSize.SUV, priceTransparent: 580 * M, priceWrap: 320 * M, priceColor: 620 * M, priceMatte: 600 * M },
  "재규어 F-TYPE": { size: CarSize.COMPACT, priceTransparent: 490 * M, priceWrap: 250 * M, priceColor: 560 * M },
  "재규어 F-PACE": { size: CarSize.SUV, priceTransparent: 520 * M, priceWrap: 290 * M, priceColor: 630 * M },

  // Maserati
  "마세라티 기블리": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 620 * M },
  "마세라티 콰트로포르테": { size: CarSize.SEDAN, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 620 * M },
  "마세라티 MC20": { size: CarSize.SUPERCAR, priceTransparent: 540 * M, priceWrap: 310 * M, priceColor: 650 * M },
  "마세라티 르반떼": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 310 * M, priceColor: 640 * M },

  // Aston Martin
  "애스턴마틴 DBX": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 330 * M, priceColor: 720 * M },
  "애스턴마틴 DBS": { size: CarSize.COMPACT, priceTransparent: 530 * M, priceWrap: 290 * M, priceColor: 700 * M },
  "애스턴마틴 DB11": { size: CarSize.COMPACT, priceTransparent: 510 * M, priceWrap: 280 * M, priceColor: 670 * M },

  // Ferrari
  "페라리 458": { size: CarSize.SUPERCAR, priceTransparent: 530 * M, priceWrap: 310 * M, priceColor: 720 * M },
  "페라리 488": { size: CarSize.SUPERCAR, priceTransparent: 530 * M, priceWrap: 310 * M, priceColor: 720 * M },
  "페라리 F8 트리뷰토": { size: CarSize.SUPERCAR, priceTransparent: 550 * M, priceWrap: 330 * M, priceColor: 760 * M },
  "페라리 812 슈퍼패스트": { size: CarSize.SUPERCAR, priceTransparent: 600 * M, priceWrap: 310 * M, priceColor: 770 * M },
  "페라리 포르토피노": { size: CarSize.SUPERCAR, priceTransparent: 580 * M, priceWrap: 310 * M, priceColor: 760 * M },
  "페라리 296": { size: CarSize.SUPERCAR, priceTransparent: 580 * M, priceWrap: 320 * M, priceColor: 760 * M },
  "페라리 푸로산게": { size: CarSize.SUV, priceTransparent: 600 * M, priceWrap: 340 * M, priceColor: 780 * M },
  "페라리 로마": { size: CarSize.SUPERCAR, priceTransparent: 540 * M, priceWrap: 280 * M, priceColor: 740 * M },

  // McLaren (Trans == Matte)
  "맥라렌 570S": { size: CarSize.SUPERCAR, priceTransparent: 480 * M, priceWrap: 290 * M, priceColor: 700 * M, priceMatte: 480 * M },
  "맥라렌 720S": { size: CarSize.SUPERCAR, priceTransparent: 530 * M, priceWrap: 340 * M, priceColor: 750 * M, priceMatte: 530 * M },
  "맥라렌 600LT / 675LT": { size: CarSize.SUPERCAR, priceTransparent: 500 * M, priceWrap: 310 * M, priceColor: 730 * M, priceMatte: 500 * M },
  "맥라렌 765LT": { size: CarSize.SUPERCAR, priceTransparent: 540 * M, priceWrap: 350 * M, priceColor: 770 * M, priceMatte: 540 * M },

  // Asian / Others (Specific Matte Prices)
  "도요타 GR86": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 240 * M, priceColor: 0, priceMatte: 480 * M },
  "도요타 GR수프라": { size: CarSize.COMPACT, priceTransparent: 460 * M, priceWrap: 260 * M, priceColor: 0, priceMatte: 490 * M },
  "도요타 알파드": { size: CarSize.SUV, priceTransparent: 530 * M, priceWrap: 320 * M, priceColor: 0, priceMatte: 560 * M },
  "렉서스 LC500": { size: CarSize.COMPACT, priceTransparent: 490 * M, priceWrap: 270 * M, priceColor: 0, priceMatte: 520 * M },
  "렉서스 LM500h": { size: CarSize.SUV, priceTransparent: 530 * M, priceWrap: 320 * M, priceColor: 0, priceMatte: 560 * M },
  "마쯔다 MX-5": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 230 * M, priceColor: 0, priceMatte: 480 * M },
  "마쯔다 미아타유노스": { size: CarSize.COMPACT, priceTransparent: 430 * M, priceWrap: 230 * M, priceColor: 0, priceMatte: 460 * M },
  "닛산 GT-R": { size: CarSize.SUPERCAR, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 0, priceMatte: 480 * M },
  "닛산 370Z": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 280 * M, priceColor: 0, priceMatte: 450 * M },

  // Tesla
  "테슬라 모델3": { size: CarSize.SEDAN, priceTransparent: 430 * M, priceWrap: 260 * M, priceColor: 560 * M },
  "테슬라 모델Y": { size: CarSize.SUV, priceTransparent: 450 * M, priceWrap: 270 * M, priceColor: 580 * M },
  "테슬라 모델S": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 600 * M },
  "테슬라 모델X": { size: CarSize.SUV, priceTransparent: 500 * M, priceWrap: 290 * M, priceColor: 580 * M },

  // US / KR / Lotus
  "쉐보레 콜벳 C7": { size: CarSize.SUPERCAR, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 640 * M },
  "쉐보레 콜벳 C8": { size: CarSize.SUPERCAR, priceTransparent: 510 * M, priceWrap: 280 * M, priceColor: 660 * M },
  "캐딜락 에스컬레이드": { size: CarSize.SUV, priceTransparent: 580 * M, priceWrap: 340 * M, priceColor: 740 * M },
  "링컨 네비게이터": { size: CarSize.SUV, priceTransparent: 580 * M, priceWrap: 360 * M, priceColor: 640 * M },
  "로터스 엑시지": { size: CarSize.COMPACT, priceTransparent: 480 * M, priceWrap: 270 * M, priceColor: 700 * M },
  "로터스 에미라/에보라": { size: CarSize.COMPACT, priceTransparent: 500 * M, priceWrap: 270 * M, priceColor: 720 * M },
  "포드 브롱코": { size: CarSize.SUV, priceTransparent: 440 * M, priceWrap: 330 * M, priceColor: 620 * M },
  "포드 익스플로러": { size: CarSize.SUV, priceTransparent: 450 * M, priceWrap: 340 * M, priceColor: 630 * M },
  "포드 머스탱": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 270 * M, priceColor: 600 * M },
  "닷지 챌린저": { size: CarSize.COMPACT, priceTransparent: 420 * M, priceWrap: 280 * M, priceColor: 600 * M },
  "닷지 램 (RAM)": { size: CarSize.SUV, priceTransparent: 520 * M, priceWrap: 340 * M, priceColor: 700 * M },
  "현대 아반떼 N": { size: CarSize.SEDAN, priceTransparent: 450 * M, priceWrap: 250 * M, priceColor: 550 * M },
  "현대 아이오닉 5N": { size: CarSize.SUV, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 590 * M },
  "기아 카니발 하이리무진": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 340 * M, priceColor: 650 * M },
  "제네시스 G70": { size: CarSize.SEDAN, priceTransparent: 470 * M, priceWrap: 280 * M, priceColor: 600 * M },
  "제네시스 G80 / 그랜저": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 620 * M },
  "제네시스 G90": { size: CarSize.SEDAN, priceTransparent: 490 * M, priceWrap: 300 * M, priceColor: 630 * M },
  "제네시스 GV60": { size: CarSize.SUV, priceTransparent: 490 * M, priceWrap: 280 * M, priceColor: 640 * M },
  "제네시스 GV70": { size: CarSize.SUV, priceTransparent: 520 * M, priceWrap: 280 * M, priceColor: 700 * M },
  "제네시스 GV80 / 팰리세이드": { size: CarSize.SUV, priceTransparent: 560 * M, priceWrap: 300 * M, priceColor: 720 * M },
  "올드카 소형": { size: CarSize.COMPACT, priceTransparent: 450 * M, priceWrap: 260 * M, priceColor: 580 * M },
  "올드카 중형": { size: CarSize.SEDAN, priceTransparent: 480 * M, priceWrap: 280 * M, priceColor: 600 * M },
};