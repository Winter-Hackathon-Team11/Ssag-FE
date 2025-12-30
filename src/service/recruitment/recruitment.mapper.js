/**
 * 구인글 생성 요청 데이터 변환
 * @param {string} activityDate - 활동 날짜
 * @param {string} meetingPlace - 집합 장소
 * @param {string} [additionalNote] - 추가 안내사항
 * @returns {Object} API 요청용 데이터
 */
export const createRecruitmentRequest = (activityDate, meetingPlace, additionalNote) => {
  const request = {
    activity_date: activityDate,
    meeting_place: meetingPlace,
  };

  if (additionalNote) {
    request.additional_note = additionalNote;
  }

  return request;
};

/**
 * 구인글 상세 정보를 UI 표시용 데이터로 변환
 * @param {Object} recruitment - API 응답 구인글 데이터
 * @returns {Object} UI 표시용 데이터
 */
export const mapRecruitmentToUI = (recruitment) => {
  if (!recruitment) return null;

  return {
    id: recruitment.recruitment_id,
    title: recruitment.title,
    content: recruitment.content,
    requiredPeople: recruitment.required_people,
    tools: Object.entries(recruitment.recommended_tools || {}).map(([type, count]) => ({
      type: getToolTypeName(type),
      count,
    })),
    activityDate: recruitment.activity_date,
    meetingPlace: recruitment.meeting_place,
    additionalNote: recruitment.additional_note,
    analysisId: recruitment.analysis_id,
    createdAt: new Date(recruitment.created_at),
    updatedAt: recruitment.updated_at ? new Date(recruitment.updated_at) : null,
  };
};

/**
 * 구인글 목록을 UI 표시용 데이터로 변환
 * @param {Object[]} recruitments - 구인글 목록
 * @returns {Object[]} UI 표시용 데이터 배열
 */
export const mapRecruitmentsToUI = (recruitments) => {
  if (!Array.isArray(recruitments)) return [];

  return recruitments.map((recruitment) => ({
    id: recruitment.recruitment_id,
    title: recruitment.title,
    requiredPeople: recruitment.required_people,
    activityDate: recruitment.activity_date,
    meetingPlace: recruitment.meeting_place,
    createdAt: new Date(recruitment.created_at),
  }));
};

/**
 * 구인글 수정 요청 데이터 변환
 * @param {Object} updateData - 수정할 데이터
 * @returns {Object} API 요청용 데이터
 */
export const createUpdateRequest = (updateData) => {
  const request = {};

  if (updateData.title) request.title = updateData.title;
  if (updateData.content) request.content = updateData.content;
  if (updateData.requiredPeople) request.required_people = updateData.requiredPeople;
  if (updateData.activityDate) request.activity_date = updateData.activityDate;
  if (updateData.meetingPlace) request.meeting_place = updateData.meetingPlace;
  if (updateData.additionalNote !== undefined) {
    request.additional_note = updateData.additionalNote;
  }

  return request;
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
