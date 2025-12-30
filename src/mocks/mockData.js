// 목 이미지 URL (unsplash 무료 이미지 사용)
const MOCK_IMAGES = {
  beach1: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
  beach2: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
  beach3: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
  park1: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=800',
};

// 분석 결과 목 데이터
export const mockAnalysisResults = [
  {
    analysis_id: 1,
    image_url: MOCK_IMAGES.beach1,
    location: '광안리 해변',
    area_type: 'beach',
    trash_summary: {
      plastic: 14,
      can: 6,
      net: 1,
    },
    recommended_resources: {
      people: 5,
      tools: {
        tongs: 5,
        bags: 8,
        gloves: 5,
        cutter: 1,
      },
      estimated_time_min: 80,
    },
    created_at: '2025-01-18T14:32:11',
  },
  {
    analysis_id: 2,
    image_url: MOCK_IMAGES.beach2,
    location: '해운대 해변',
    area_type: 'beach',
    trash_summary: {
      plastic: 8,
      can: 3,
      glass: 2,
    },
    recommended_resources: {
      people: 3,
      tools: {
        tongs: 3,
        bags: 5,
        gloves: 3,
      },
      estimated_time_min: 45,
    },
    created_at: '2025-01-17T10:21:03',
  },
  {
    analysis_id: 3,
    image_url: MOCK_IMAGES.beach3,
    location: '송정 해변',
    area_type: 'beach',
    trash_summary: {
      plastic: 20,
      can: 10,
      net: 2,
      glass: 5,
    },
    recommended_resources: {
      people: 8,
      tools: {
        tongs: 8,
        bags: 12,
        gloves: 8,
        cutter: 2,
      },
      estimated_time_min: 120,
    },
    created_at: '2025-01-16T09:15:22',
  },
  {
    analysis_id: 4,
    image_url: MOCK_IMAGES.park1,
    location: '수영구 민락 공원',
    area_type: 'park',
    trash_summary: {
      plastic: 5,
      paper: 3,
      can: 2,
    },
    recommended_resources: {
      people: 2,
      tools: {
        tongs: 2,
        bags: 3,
        gloves: 2,
      },
      estimated_time_min: 30,
    },
    created_at: '2025-01-15T16:45:30',
  },
];

// 구인글 목 데이터
export const mockRecruitments = [
  {
    recruitment_id: 1,
    title: '[자원봉사 모집] 광안리 해변 환경 정화 활동',
    content: `광안리 해변에서 플라스틱, 캔, 폐그물 쓰레기가 다수 발견되었습니다.

현재 분석 결과 기준으로 약 5명의 봉사 인원이 필요하며, 집게·마대·장갑이 제공될 예정입니다.

예상 소요 시간은 약 80분이며, 안전한 환경 정화를 위해 많은 참여 부탁드립니다.`,
    required_people: 5,
    recommended_tools: {
      tongs: 5,
      bags: 8,
      gloves: 5,
      cutter: 1,
    },
    activity_date: '2025-01-25',
    meeting_place: '광안리 해변 주차장',
    additional_note: '장갑 및 개인 물은 지참 바랍니다.',
    analysis_id: 1,
    created_at: '2025-01-18T15:10:44',
  },
  {
    recruitment_id: 2,
    title: '[자원봉사 모집] 해운대 해변 정화 활동',
    content: `해운대 해변 환경 정화 활동에 참여하실 자원봉사자를 모집합니다.

약 3명의 인원이 필요하며, 필요한 도구는 모두 제공됩니다.

예상 소요 시간은 45분 정도입니다.`,
    required_people: 3,
    recommended_tools: {
      tongs: 3,
      bags: 5,
      gloves: 3,
    },
    activity_date: '2025-01-24',
    meeting_place: '해운대 해변 센터',
    additional_note: '편한 복장으로 참여해주세요.',
    analysis_id: 2,
    created_at: '2025-01-17T11:30:00',
  },
  {
    recruitment_id: 3,
    title: '[긴급 모집] 송정 해변 대규모 정화 활동',
    content: `송정 해변에서 대량의 해양 쓰레기가 발견되어 긴급 정화 활동을 진행합니다.

8명의 자원봉사자가 필요하며, 예상 소요 시간은 약 2시간입니다.

모든 장비는 현장에서 제공됩니다.`,
    required_people: 8,
    recommended_tools: {
      tongs: 8,
      bags: 12,
      gloves: 8,
      cutter: 2,
    },
    activity_date: '2025-01-23',
    meeting_place: '송정 해변 입구',
    additional_note: '간식과 음료가 제공됩니다.',
    analysis_id: 3,
    created_at: '2025-01-16T10:00:00',
  },
];

// 목 서비스 (실제 API 대신 사용)
export const mockService = {
  // 이미지 분석
  analyzeImage: async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newAnalysis = {
      analysis_id: mockAnalysisResults.length + 1,
      image_url: MOCK_IMAGES.beach1,
      location: formData.get('location') || '위치 미지정',
      area_type: 'beach',
      trash_summary: {
        plastic: Math.floor(Math.random() * 20) + 5,
        can: Math.floor(Math.random() * 10) + 2,
        net: Math.floor(Math.random() * 3),
      },
      recommended_resources: {
        people: Math.floor(Math.random() * 5) + 3,
        tools: {
          tongs: Math.floor(Math.random() * 5) + 3,
          bags: Math.floor(Math.random() * 8) + 5,
          gloves: Math.floor(Math.random() * 5) + 3,
          cutter: Math.floor(Math.random() * 2) + 1,
        },
        estimated_time_min: Math.floor(Math.random() * 60) + 40,
      },
      created_at: new Date().toISOString(),
    };

    mockAnalysisResults.unshift(newAnalysis);
    return newAnalysis;
  },

  // 분석 이력 조회
  getAnalysisHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { histories: mockAnalysisResults };
  },

  // 분석 상세 조회
  getAnalysisDetail: async (analysisId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const analysis = mockAnalysisResults.find((a) => a.analysis_id === analysisId);
    if (!analysis) throw new Error('Analysis not found');
    return analysis;
  },

  // 구인글 생성
  createRecruitmentFromAnalysis: async (analysisId, recruitmentData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const analysis = mockAnalysisResults.find((a) => a.analysis_id === analysisId);
    if (!analysis) throw new Error('Analysis not found');

    const newRecruitment = {
      recruitment_id: mockRecruitments.length + 1,
      title: `[자원봉사 모집] ${analysis.location} 환경 정화 활동`,
      content: `${analysis.location}에서 환경 정화 활동을 진행합니다.\n\n약 ${analysis.recommended_resources.people}명의 봉사 인원이 필요하며, 필요한 도구는 모두 제공됩니다.\n\n예상 소요 시간은 약 ${analysis.recommended_resources.estimated_time_min}분입니다.`,
      required_people: analysis.recommended_resources.people,
      recommended_tools: analysis.recommended_resources.tools,
      activity_date: recruitmentData.activity_date,
      meeting_place: recruitmentData.meeting_place,
      additional_note: recruitmentData.additional_note,
      analysis_id: analysisId,
      created_at: new Date().toISOString(),
    };

    mockRecruitments.unshift(newRecruitment);
    return newRecruitment;
  },

  // 구인글 목록 조회
  getRecruitmentList: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { recruitments: mockRecruitments };
  },

  // 구인글 상세 조회
  getRecruitmentDetail: async (recruitmentId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const recruitment = mockRecruitments.find((r) => r.recruitment_id === recruitmentId);
    if (!recruitment) throw new Error('Recruitment not found');
    return recruitment;
  },

  // 구인글 수정
  updateRecruitment: async (recruitmentId, updateData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockRecruitments.findIndex((r) => r.recruitment_id === recruitmentId);
    if (index === -1) throw new Error('Recruitment not found');

    mockRecruitments[index] = {
      ...mockRecruitments[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    return mockRecruitments[index];
  },

  // 구인글 삭제
  deleteRecruitment: async (recruitmentId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockRecruitments.findIndex((r) => r.recruitment_id === recruitmentId);
    if (index === -1) throw new Error('Recruitment not found');

    mockRecruitments.splice(index, 1);
    return { message: 'Deleted successfully' };
  },
};
