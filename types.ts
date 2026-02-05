
export enum CarSize {
  COMPACT = '소형 / 쿠페 (Compact)',
  SEDAN = '세단 / 중형 (Sedan)',
  SUV = 'SUV / 대형 (Large)',
  SUPERCAR = '슈퍼카 / 럭셔리 (Exotic)'
}

export enum CoverageType {
  FULL_BODY = '전체 풀 패키지 (Full Body)',
  FRONT_PACKAGE = '프론트 패키지 (Front Package)',
  ETC = '기타 시공 / 부분 시공 (Etc)'
}

export enum FilmGrade {
  STANDARD = '스탠다드 글로스',
  PREMIUM = '프리미엄 셀프힐링',
  MATTE = '매트/사틴 변환',
  COLORED = '컬러 체인지 PPF'
}

export interface EstimateResult {
  minPrice: number;
  maxPrice: number;
  currency: string;
}

export interface ConciergeMessage {
  role: 'user' | 'model';
  text: string;
}
