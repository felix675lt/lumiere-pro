import { GoogleGenAI } from "@google/genai";
import { CarSize, CoverageType, FilmGrade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConciergeAdvice = async (
  carModel: string,
  carSize: CarSize,
  coverage: CoverageType,
  grade: FilmGrade
): Promise<string> => {
  try {
    const prompt = `
      당신은 하이엔드 럭셔리 자동차 디테일링 스튜디오의 전문 컨시어지입니다. 
      고객이 차량의 PPF(Paint Protection Film) 시공에 대해 문의하고 있습니다.
      
      고객 정보:
      - 차량 모델: ${carModel || "미지정 (럭셔리 차량)"}
      - 차량 크기 등급: ${carSize}
      - 희망 시공 범위: ${coverage}
      - 선택한 필름 등급: ${grade}

      위 정보를 바탕으로 고객에게 매우 정중하고 고급스러운 톤으로 간결한 분석(공백 포함 300자 이내)을 제공하세요.
      1. 고객의 차량(또는 등급)의 가치를 인정해주는 멘트로 시작하세요.
      2. 선택한 시공 범위와 필름이 해당 차량에 왜 현명한 투자인지 설명하세요.
      3. 시공 시 주의해야 할 디테일이나 기술적인 면을 언급하여 전문가다운 면모를 보여주세요.
      4. 주의사항: 보증 기간(예: 10년, 5년 등)에 대한 구체적인 숫자는 절대 언급하지 마세요. 대신 '장기간', '오랫동안' 등의 표현을 사용하세요.
      
      톤앤매너: "우아함", "신뢰감", "전문적임". 존댓말을 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "현재 컨시어지 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주십시오.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "문의량이 많아 실시간 분석이 지연되고 있습니다. 전문 상담원에게 직접 문의해 주시면 상세히 안내해 드리겠습니다.";
  }
};