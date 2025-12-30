# Service Layer Documentation

이 디렉토리는 백엔드 API와 통신하는 서비스 레이어를 포함합니다.

## 📁 구조

```
service/
├── client.js                    # Axios 클라이언트 설정
├── index.js                     # 통합 export
├── analysis/
│   ├── analysis.api.js         # 이미지 분석 API
│   ├── analysis.mapper.js      # 데이터 변환 유틸리티
│   └── analysis.types.js       # 타입 정의
├── recruitment/
│   ├── recruitment.api.js      # 구인글 API
│   ├── recruitment.mapper.js   # 데이터 변환 유틸리티
│   └── recruitment.types.js    # 타입 정의
└── upload/
    └── upload.api.js           # 파일 업로드 API
```

## 🚀 사용 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 API 베이스 URL을 설정합니다.

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 2. 이미지 분석

```javascript
import { analyzeImage, createAnalysisFormData } from '@/service';

// 이미지 파일과 위치를 FormData로 변환
const formData = createAnalysisFormData(imageFile, '광안리 해변');

// 이미지 분석 요청
try {
  const result = await analyzeImage(formData);
  console.log('분석 결과:', result);
  // {
  //   analysis_id: 12,
  //   image_url: '/uploads/2025-01-18/uuid.jpg',
  //   trash_summary: { plastic: 14, can: 6, net: 1 },
  //   recommended_resources: { people: 5, tools: {...}, estimated_time_min: 80 },
  //   created_at: '2025-01-18T14:32:11'
  // }
} catch (error) {
  console.error('분석 실패:', error.message);
}
```

### 3. 분석 이력 조회

```javascript
import { getAnalysisHistory, mapHistoriesToUI } from '@/service';

try {
  const response = await getAnalysisHistory();
  const histories = mapHistoriesToUI(response.histories);

  console.log('분석 이력:', histories);
  // [
  //   {
  //     id: 12,
  //     imageUrl: '/uploads/2025-01-18/uuid.jpg',
  //     location: '광안리',
  //     trashCount: 20,
  //     trashTypes: ['플라스틱', '캔'],
  //     createdAt: Date
  //   }
  // ]
} catch (error) {
  console.error('조회 실패:', error.message);
}
```

### 4. 분석 상세 조회

```javascript
import { getAnalysisDetail, mapAnalysisResultToUI } from '@/service';

try {
  const result = await getAnalysisDetail(12);
  const uiData = mapAnalysisResultToUI(result);

  console.log('상세 정보:', uiData);
  // {
  //   id: 12,
  //   imageUrl: '/uploads/2025-01-18/uuid.jpg',
  //   location: '해변',
  //   trashSummary: { total: 21, items: [...] },
  //   resources: { people: 5, tools: [...], estimatedTime: 80 },
  //   createdAt: Date
  // }
} catch (error) {
  console.error('조회 실패:', error.message);
}
```

### 5. 구인글 생성

```javascript
import { createRecruitmentFromAnalysis, createRecruitmentRequest } from '@/service';

const recruitmentData = createRecruitmentRequest(
  '2025-01-25',
  '해변 A구역 주차장',
  '장갑 및 개인 물은 지참 바랍니다.'
);

try {
  const recruitment = await createRecruitmentFromAnalysis(12, recruitmentData);
  console.log('구인글 생성:', recruitment);
  // {
  //   recruitment_id: 7,
  //   title: '[자원봉사 모집] 해변 A구역 환경 정화 활동',
  //   content: '...',
  //   required_people: 5,
  //   recommended_tools: {...},
  //   activity_date: '2025-01-25',
  //   meeting_place: '해변 A구역 주차장',
  //   created_at: '2025-01-18T15:10:44'
  // }
} catch (error) {
  console.error('생성 실패:', error.message);
}
```

### 6. 구인글 목록 조회

```javascript
import { getRecruitmentList, mapRecruitmentsToUI } from '@/service';

try {
  const response = await getRecruitmentList();
  const recruitments = mapRecruitmentsToUI(response.recruitments);

  console.log('구인글 목록:', recruitments);
} catch (error) {
  console.error('조회 실패:', error.message);
}
```

### 7. 구인글 수정

```javascript
import { updateRecruitment, createUpdateRequest } from '@/service';

const updateData = createUpdateRequest({
  title: '수정된 제목',
  requiredPeople: 10,
  meetingPlace: '새로운 장소'
});

try {
  const updated = await updateRecruitment(7, updateData);
  console.log('수정 완료:', updated);
} catch (error) {
  console.error('수정 실패:', error.message);
}
```

### 8. 구인글 삭제

```javascript
import { deleteRecruitment } from '@/service';

try {
  await deleteRecruitment(7);
  console.log('삭제 완료');
} catch (error) {
  console.error('삭제 실패:', error.message);
}
```

### 9. 이미지 URL 가져오기

```javascript
import { getImageUrl } from '@/service';

const imageUrl = getImageUrl('2025-01-18/uuid.jpg');
console.log('이미지 URL:', imageUrl);
// http://localhost:3000/uploads/2025-01-18/uuid.jpg
```

### 10. 파일 업로드

```javascript
import { uploadFile } from '@/service';

try {
  const result = await uploadFile(file, { location: '광안리' });
  console.log('업로드 완료:', result);
} catch (error) {
  console.error('업로드 실패:', error.message);
}
```

## 🔧 에러 처리

모든 API 호출은 에러 발생 시 `Error` 객체를 throw합니다. 서버에서 반환한 에러 메시지가 있다면 해당 메시지를 포함합니다.

```javascript
try {
  const result = await analyzeImage(formData);
} catch (error) {
  if (error.message === 'Invalid request or image file') {
    // 400 에러 처리
  } else if (error.message === 'Analysis not found') {
    // 404 에러 처리
  } else if (error.message === 'Image size exceeds limit') {
    // 413 에러 처리
  } else {
    // 기타 에러 처리
  }
}
```

## 📝 타입 정의

JSDoc을 사용한 타입 정의가 각 파일에 포함되어 있습니다. VSCode 등의 IDE에서 자동완성 지원을 받을 수 있습니다.

- `analysis.types.js`: 분석 관련 타입
- `recruitment.types.js`: 구인글 관련 타입

## 🎯 Mapper 함수

Mapper 함수는 API 응답 데이터를 UI에서 사용하기 편한 형태로 변환합니다.

- `analysis.mapper.js`: 분석 데이터 변환
- `recruitment.mapper.js`: 구인글 데이터 변환

주요 기능:
- 한글 레이블 변환 (plastic → 플라스틱)
- 날짜 객체 변환
- UI 친화적인 데이터 구조로 재구성
