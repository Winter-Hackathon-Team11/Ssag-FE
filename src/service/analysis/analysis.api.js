import client from '../client';

/**
 * 이미지 업로드 & 분석
 * @param {FormData} formData - 이미지 파일과 위치 정보를 포함한 FormData
 * @returns {Promise<Object>} 분석 결과
 */
export const analyzeImage = async (formData) => {
  return await client.post('/analysis/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 분석 이력 전체 조회
 * @returns {Promise<Object>} 분석 이력 목록
 */
export const getAnalysisHistory = async () => {
  return await client.get('/analysis/history');
};

/**
 * 분석 ID 기반 단일 결과 조회
 * @param {number} analysisId - 분석 ID
 * @returns {Promise<Object>} 분석 상세 결과
 */
export const getAnalysisDetail = async (analysisId) => {
  return await client.get(`/analysis/${analysisId}`);
};
