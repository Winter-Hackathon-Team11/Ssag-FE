/**
 * 이미지 분석 요청 데이터를 FormData로 변환
 * @param {File} imageFile - 이미지 파일
 * @param {string} [location] - 촬영 위치
 * @returns {FormData}
 */
export const createAnalysisFormData = (imageFile, location) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  if (location) {
    formData.append('location', location);
  }

  return formData;
};

/**
 * 분석 결과를 UI 표시용 데이터로 변환
 * @param {Object} analysisResult - API 응답 분석 결과
 * @returns {Object} UI 표시용 데이터
 */
export const mapAnalysisResultToUI = (analysisResult) => {
  if (!analysisResult) return null;

  return {
    id: analysisResult.analysis_id,
    imageUrl: analysisResult.image_url,
    location: analysisResult.location || '위치 정보 없음',
    areaType: analysisResult.area_type || 'unknown',
    trashSummary: {
      total: calculateTotalTrash(analysisResult.trash_summary),
      items: Object.entries(analysisResult.trash_summary || {}).map(([type, count]) => ({
        type: getTrashTypeName(type),
        count,
      })),
    },
    resources: {
      people: analysisResult.recommended_resources?.people || 0,
      tools: Object.entries(analysisResult.recommended_resources?.tools || {}).map(([type, count]) => ({
        type: getToolTypeName(type),
        count,
      })),
      estimatedTime: analysisResult.recommended_resources?.estimated_time_min || 0,
    },
    createdAt: new Date(analysisResult.created_at),
  };
};

/**
 * 분석 이력 목록을 UI 표시용 데이터로 변환
 * @param {Object[]} histories - 분석 이력 목록
 * @returns {Object[]} UI 표시용 데이터 배열
 */
export const mapHistoriesToUI = (histories) => {
  if (!Array.isArray(histories)) return [];

  return histories.map((history) => ({
    id: history.analysis_id,
    imageUrl: history.image_url,
    location: history.location || '위치 정보 없음',
    trashCount: calculateTotalTrash(history.trash_summary),
    trashTypes: Object.keys(history.trash_summary || {}).map(getTrashTypeName),
    createdAt: new Date(history.created_at),
  }));
};

/**
 * 쓰레기 총 개수 계산
 * @param {Object} trashSummary - 쓰레기 요약 객체
 * @returns {number} 총 개수
 */
const calculateTotalTrash = (trashSummary) => {
  if (!trashSummary) return 0;
  return Object.values(trashSummary).reduce((sum, count) => sum + count, 0);
};

/**
 * 쓰레기 타입 한글명 반환
 * @param {string} type - 쓰레기 타입
 * @returns {string} 한글명
 */
const getTrashTypeName = (type) => {
  const typeNames = {
    plastic: '플라스틱',
    can: '캔',
    net: '그물',
    glass: '유리',
    paper: '종이',
    other: '기타',
  };
  return typeNames[type] || type;
};

/**
 * 도구 타입 한글명 반환
 * @param {string} type - 도구 타입
 * @returns {string} 한글명
 */
const getToolTypeName = (type) => {
  const toolNames = {
    tongs: '집게',
    bags: '마대',
    gloves: '장갑',
    cutter: '커터',
  };
  return toolNames[type] || type;
};
