/**
 * @typedef {Object} TrashSummary
 * @property {number} [plastic] - 플라스틱 개수
 * @property {number} [can] - 캔 개수
 * @property {number} [net] - 그물 개수
 * @property {number} [glass] - 유리 개수
 * @property {number} [paper] - 종이 개수
 * @property {number} [other] - 기타 쓰레기 개수
 */

/**
 * @typedef {Object} RecommendedTools
 * @property {number} [tongs] - 집게 개수
 * @property {number} [bags] - 마대 개수
 * @property {number} [gloves] - 장갑 개수
 * @property {number} [cutter] - 커터 개수
 */

/**
 * @typedef {Object} RecommendedResources
 * @property {number} people - 필요 인원 수
 * @property {RecommendedTools} tools - 필요 도구
 * @property {number} estimated_time_min - 예상 소요 시간 (분)
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {number} analysis_id - 분석 ID
 * @property {string} image_url - 이미지 URL
 * @property {string} [location] - 촬영 위치
 * @property {string} [area_type] - 지역 타입 (beach, park, street 등)
 * @property {TrashSummary} trash_summary - 쓰레기 요약
 * @property {RecommendedResources} recommended_resources - 권장 자원
 * @property {string} created_at - 생성 시간 (ISO 8601)
 */

/**
 * @typedef {Object} AnalysisHistoryItem
 * @property {number} analysis_id - 분석 ID
 * @property {string} image_url - 이미지 URL
 * @property {string} [location] - 촬영 위치
 * @property {TrashSummary} trash_summary - 쓰레기 요약
 * @property {string} created_at - 생성 시간 (ISO 8601)
 */

/**
 * @typedef {Object} AnalysisHistoryResponse
 * @property {AnalysisHistoryItem[]} histories - 분석 이력 목록
 */

export {};
