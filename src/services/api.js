const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * API 서비스 클래스
 * OpenAPI 스펙 기반 API 호출 함수들
 */
class ApiService {
  /**
   * 이미지 분석 API
   * POST /analyze
   * @param {File} file - 분석할 이미지 파일
   * @returns {Promise<Object>} 분석 결과 (analysis_id, trash_summary, recommended_resources 등)
   */
  async analyzeImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`분석 실패: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * 분석 상세 조회 API
   * GET /analysis/{analysis_id}
   * @param {number} analysisId - 분석 ID
   * @returns {Promise<Object>} 분석 상세 정보
   */
  async getAnalysisDetail(analysisId) {
    const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`분석 조회 실패: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * 분석 결과로부터 공고 생성 API
   * POST /recruitment/from-analysis/{analysis_id}
   * @param {number} analysisId - 분석 ID
   * @param {Object} recruitmentData - 공고 정보
   * @param {string} recruitmentData.activity_date - 활동 날짜
   * @param {string} recruitmentData.meeting_place - 만남 장소
   * @param {string} [recruitmentData.additional_note] - 추가 메모 (선택)
   * @returns {Promise<Object>} 생성된 공고 정보
   */
  async createRecruitmentFromAnalysis(analysisId, recruitmentData) {
    const response = await fetch(`${API_BASE_URL}/recruitment/from-analysis/${analysisId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recruitmentData),
    });

    if (!response.ok) {
      throw new Error(`공고 생성 실패: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * 헬스 체크 API
   * GET /health
   * @returns {Promise<Object>} 서버 상태
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`헬스 체크 실패: ${response.status}`);
    }

    return await response.json();
  }
}

export const apiService = new ApiService();
