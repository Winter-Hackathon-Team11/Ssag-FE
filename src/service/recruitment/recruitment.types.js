/**
 * @typedef {Object} RecruitmentTools
 * @property {number} [tongs] - 집게 개수
 * @property {number} [bags] - 마대 개수
 * @property {number} [gloves] - 장갑 개수
 * @property {number} [cutter] - 커터 개수
 */

/**
 * @typedef {Object} RecruitmentData
 * @property {string} activity_date - 활동 날짜 (YYYY-MM-DD)
 * @property {string} meeting_place - 집합 장소
 * @property {string} [additional_note] - 추가 안내사항
 */

/**
 * @typedef {Object} RecruitmentDetail
 * @property {number} recruitment_id - 구인글 ID
 * @property {string} title - 구인글 제목
 * @property {string} content - 구인글 내용
 * @property {number} required_people - 필요 인원 수
 * @property {RecruitmentTools} recommended_tools - 제공 도구
 * @property {string} activity_date - 활동 날짜 (YYYY-MM-DD)
 * @property {string} meeting_place - 집합 장소
 * @property {string} [additional_note] - 추가 안내사항
 * @property {number} [analysis_id] - 연관된 분석 ID
 * @property {string} created_at - 생성 시간 (ISO 8601)
 * @property {string} [updated_at] - 수정 시간 (ISO 8601)
 */

/**
 * @typedef {Object} RecruitmentListItem
 * @property {number} recruitment_id - 구인글 ID
 * @property {string} title - 구인글 제목
 * @property {number} required_people - 필요 인원 수
 * @property {string} activity_date - 활동 날짜
 * @property {string} meeting_place - 집합 장소
 * @property {string} created_at - 생성 시간
 */

/**
 * @typedef {Object} RecruitmentListResponse
 * @property {RecruitmentListItem[]} recruitments - 구인글 목록
 */

export {};
