const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * API 서비스 클래스
 * OpenAPI 스펙 기반 API 호출 함수들
 */
class ApiService {
  /**
   * 이미지 분석 API
   * POST /analysis/image
   * @param {File} file - 분석할 이미지 파일
   * @param {string} location - 위치 정보 (선택)
   * @returns {Promise<Object>} 분석 결과 (analysis_id, image_name, trash_summary, recommended_resources)
   */
  async analyzeImage(file, location = null) {
    const formData = new FormData();
    formData.append('image', file);
    if (location) {
      formData.append('location', location);
    }

    const response = await fetch(`${API_BASE_URL}/analysis/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`분석 실패: ${response.status}`);
    }

    const data = await response.json();

    // 백엔드 응답을 프론트 형식에 맞게 변환
    return {
      analysis_id: data.analysis_id,
      image_name: data.image_name,
      image_url: `${API_BASE_URL}/uploads/${data.image_name}`,
      trash_summary: data.trash_summary,
      recommended_resources: data.recommended_resources,
      created_at: data.created_at,
    };
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

    const data = await response.json();

    // 백엔드 응답을 프론트 형식에 맞게 변환
    return {
      analysis_id: data.analysis_id,
      image_url: `${API_BASE_URL}${data.image_url}`,
      location: data.location || '위치 정보 없음',
      area_type: '해변', // 백엔드에 area_type 없으므로 기본값
      trash_summary: data.trash_summary,
      recommended_resources: data.recommended_resources,
    };
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
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `공고 생성 실패: ${response.status}`);
    }

    const data = await response.json();

    // 백엔드 응답을 프론트 형식에 맞게 변환
    return {
      recruitment_id: data.recruitment_id || analysisId, // 백엔드에서 ID 반환 안 하면 분석 ID 사용
      image_url: `${API_BASE_URL}/uploads/${data.image_name}`,
      title: data.title,
      content: data.content,
      required_people: data.required_people,
      recommended_tools: data.recommended_tools,
      activity_date: data.activity_date,
      meeting_place: data.meeting_place,
    };
  }

  /**
   * 모집글 목록 조회 API
   * GET /recruitment
   * @param {string} status - 상태 필터 (선택: "analyzed", "uploaded", "expired")
   * @returns {Promise<Object>} 모집글 목록
   */
  async getRecruitmentList(status = null) {
    const url = new URL(`${API_BASE_URL}/recruitment`);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`모집글 목록 조회 실패: ${response.status}`);
    }

    const data = await response.json();

    // 백엔드 응답을 프론트 형식에 맞게 변환
    return {
      recruitments: data.recruitments.map(item => ({
        recruitment_id: item.id,
        image_url: `${API_BASE_URL}/uploads/${item.image_name}`,
        title: item.title,
        meeting_place: item.location || '위치 미정',
        required_people: item.required_people,
        current_applicants: 0, // 백엔드에서 제공 안 함, 기본값
        activity_date: item.activity_date,
        status: item.status === 'uploaded' ? 'recruiting' : 'completed',
        recommended_tools: {}, // 목록에서는 제공 안 함
      })),
    };
  }

  /**
   * 모집글 상세 조회 API
   * GET /recruitment/{recruitment_id}
   * @param {number} recruitmentId - 모집글 ID
   * @returns {Promise<Object>} 모집글 상세 정보
   */
  async getRecruitmentDetail(recruitmentId) {
    const response = await fetch(`${API_BASE_URL}/recruitment/${recruitmentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`모집글 조회 실패: ${response.status}`);
    }

    const data = await response.json();

    // 백엔드 응답을 프론트 형식에 맞게 변환
    return {
      recruitment_id: data.recruitment_id,
      image_url: `${API_BASE_URL}/uploads/${data.image_name}`,
      title: data.title,
      content: data.content,
      required_people: data.required_people,
      current_applicants: 0, // 백엔드에서 제공 안 함
      recommended_tools: data.recommended_tools,
      activity_date: data.activity_date,
      meeting_place: data.meeting_place,
      additional_note: data.additional_note || null,
      status: data.status.toLowerCase() === 'published' ? 'recruiting' : 'completed',
      created_at: data.created_at,
      published_at: data.published_at,
    };
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
