import client from '../client';

/**
 * 분석 결과 기반 구인글 생성
 * @param {number} analysisId - 분석 ID
 * @param {Object} recruitmentData - 구인글 추가 정보
 * @param {string} recruitmentData.activity_date - 활동 날짜
 * @param {string} recruitmentData.meeting_place - 집합 장소
 * @param {string} [recruitmentData.additional_note] - 추가 안내사항
 * @returns {Promise<Object>} 생성된 구인글 정보
 */
export const createRecruitmentFromAnalysis = async (analysisId, recruitmentData) => {
  return await client.post(`/recruitment/from-analysis/${analysisId}`, recruitmentData);
};

/**
 * 구인글 목록 조회
 * @returns {Promise<Object>} 구인글 목록
 */
export const getRecruitmentList = async () => {
  return await client.get('/recruitment');
};

/**
 * 구인글 상세 조회
 * @param {number} recruitmentId - 구인글 ID
 * @returns {Promise<Object>} 구인글 상세 정보
 */
export const getRecruitmentDetail = async (recruitmentId) => {
  return await client.get(`/recruitment/${recruitmentId}`);
};

/**
 * 구인글 수정
 * @param {number} recruitmentId - 구인글 ID
 * @param {Object} updateData - 수정할 구인글 정보
 * @returns {Promise<Object>} 수정된 구인글 정보
 */
export const updateRecruitment = async (recruitmentId, updateData) => {
  return await client.put(`/recruitment/${recruitmentId}`, updateData);
};

/**
 * 구인글 삭제
 * @param {number} recruitmentId - 구인글 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteRecruitment = async (recruitmentId) => {
  return await client.delete(`/recruitment/${recruitmentId}`);
};
