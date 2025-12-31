/**
 * 로컬스토리지 유틸리티
 * 사용자의 공고 참여 및 생성 이력 관리
 */

const STORAGE_KEYS = {
  MY_RECRUITMENTS: 'my_recruitments', // 내가 생성한 공고
  MY_PARTICIPATIONS: 'my_participations', // 내가 참여한 공고
  MY_ANALYSES: 'my_analyses', // 내가 분석한 이미지
};

/**
 * 내가 생성한 공고 목록 조회
 * @returns {number[]} 공고 ID 배열
 */
export function getMyRecruitments() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_RECRUITMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get my recruitments:', error);
    return [];
  }
}

/**
 * 내가 생성한 공고 추가
 * @param {number} recruitmentId - 공고 ID
 */
export function addMyRecruitment(recruitmentId) {
  try {
    const current = getMyRecruitments();
    if (!current.includes(recruitmentId)) {
      const updated = [...current, recruitmentId];
      localStorage.setItem(STORAGE_KEYS.MY_RECRUITMENTS, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to add my recruitment:', error);
  }
}

/**
 * 내가 참여한 공고 목록 조회
 * @returns {number[]} 공고 ID 배열
 */
export function getMyParticipations() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_PARTICIPATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get my participations:', error);
    return [];
  }
}

/**
 * 내가 참여한 공고 추가
 * @param {number} recruitmentId - 공고 ID
 */
export function addMyParticipation(recruitmentId) {
  try {
    const current = getMyParticipations();
    if (!current.includes(recruitmentId)) {
      const updated = [...current, recruitmentId];
      localStorage.setItem(STORAGE_KEYS.MY_PARTICIPATIONS, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to add my participation:', error);
  }
}

/**
 * 내가 참여한 공고인지 확인
 * @param {number} recruitmentId - 공고 ID
 * @returns {boolean}
 */
export function isMyParticipation(recruitmentId) {
  const participations = getMyParticipations();
  return participations.includes(recruitmentId);
}

/**
 * 내가 생성한 공고인지 확인
 * @param {number} recruitmentId - 공고 ID
 * @returns {boolean}
 */
export function isMyRecruitment(recruitmentId) {
  const recruitments = getMyRecruitments();
  return recruitments.includes(recruitmentId);
}

/**
 * 내가 분석한 이미지 목록 조회
 * @returns {number[]} 분석 ID 배열
 */
export function getMyAnalyses() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_ANALYSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get my analyses:', error);
    return [];
  }
}

/**
 * 내가 분석한 이미지 추가
 * @param {number} analysisId - 분석 ID
 */
export function addMyAnalysis(analysisId) {
  try {
    const current = getMyAnalyses();
    if (!current.includes(analysisId)) {
      const updated = [...current, analysisId];
      localStorage.setItem(STORAGE_KEYS.MY_ANALYSES, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to add my analysis:', error);
  }
}

/**
 * 로컬스토리지 초기화 (테스트용)
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MY_RECRUITMENTS);
    localStorage.removeItem(STORAGE_KEYS.MY_PARTICIPATIONS);
    localStorage.removeItem(STORAGE_KEYS.MY_ANALYSES);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
