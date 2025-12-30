import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { addMyRecruitment } from '../utils/localStorage';
import Loading from '../components/Loading';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    note: '',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
        setShowForm(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setAnalyzing(true);
    try {
      const analysisResult = await apiService.analyzeImage(imageFile);
      setResult(analysisResult);
    } catch (error) {
      alert('분석 실패: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setShowForm(false);
    setFormData({ date: '', location: '', note: '' });
  };

  const handleCreateRecruitment = () => {
    if (!result) return;
    setShowForm(true);
  };

  const handleGeneratePost = async () => {
    if (!formData.date || !formData.location) {
      alert('활동 날짜와 접선 장소를 입력해주세요.');
      return;
    }

    try {
      const recruitment = await apiService.createRecruitmentFromAnalysis(result.analysis_id, {
        activity_date: formData.date,
        meeting_place: formData.location,
        additional_note: formData.note || null,
      });

      // 로컬스토리지에 내가 생성한 공고로 저장
      addMyRecruitment(recruitment.recruitment_id);

      alert('공고가 생성되었습니다!');
      navigate(`/recruitment/${recruitment.recruitment_id}`);
    } catch (error) {
      alert('공고 생성 실패: ' + error.message);
    }
  };

  // 백엔드는 한국어 키로 반환하므로 변환
  const trashDetails = result ? {
    plastic: result.trash_summary['플라스틱'] || result.trash_summary.plastic || 0,
    can: result.trash_summary['캔'] || result.trash_summary.can || 0,
    vinyl: result.trash_summary['비닐'] || result.trash_summary.vinyl || 0,
    other: (result.trash_summary['기타'] || result.trash_summary.other || 0) +
           (result.trash_summary['망'] || result.trash_summary.net || 0) +
           (result.trash_summary['유리'] || result.trash_summary.glass || 0),
  } : null;

  return (
    <div className="px-4 py-0 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="mb-3 pt-1 px-1 flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[var(--text-headline)] tracking-tight leading-snug">
          분석
        </h1>
        {result && !showForm && (
          <button className="w-6 h-6 flex items-center justify-center text-[var(--text-article)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </button>
        )}
        {showForm && (
          <button onClick={() => setShowForm(false)} className="text-[var(--text-article)] flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-medium">분석</span>
          </button>
        )}
      </div>

      {/* 이미지 업로드 영역 */}
      <div className="bg-white rounded-xl p-6 mb-4 h-[192px] relative overflow-hidden">
        {!selectedImage ? (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="w-16 h-16 bg-[var(--primary-500)]/10 rounded-full flex items-center justify-center text-[var(--primary-500)] mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <p className="text-sm text-[var(--text-article)] font-medium">사진 업로드</p>
            <p className="text-xs text-[var(--text-support)] mt-1">쓰레기 현장 사진을 선택해주세요</p>
          </label>
        ) : (
          <div className="relative h-full">
            <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            {!analyzing && !result && (
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 분석 로딩 */}
      {analyzing && (
        <div className="py-10">
          <Loading />
          <p className="text-center text-[var(--text-support)] mt-4 text-sm">AI가 이미지를 분석하고 있습니다...</p>
        </div>
      )}

      {/* 분석 시작 버튼 */}
      {selectedImage && !analyzing && !result && (
        <button
          onClick={handleAnalyze}
          className="w-full py-3.5 bg-[var(--primary-500)] text-white rounded-lg font-semibold text-base hover:bg-[var(--primary-600)] transition-colors"
        >
          분석 시작하기
        </button>
      )}

      {/* 분석 결과 */}
      {result && !showForm && (
        <div className="space-y-4 pb-6">
          {/* 분석 결과 섹션 */}
          <div>
            <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
              분석 결과
            </h2>
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="border-b border-[var(--background-border)] p-4">
                {Object.entries(trashDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--text-article)]">
                      {key === 'plastic' ? '플라스틱' : key === 'can' ? '캔' : key === 'vinyl' ? '비닐' : '기타'}
                    </span>
                    <span className="text-sm text-[var(--text-article)]">{value}개</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 자원 추천 섹션 */}
          <div>
            <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
              자원 추천
            </h2>
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="border-b border-[var(--background-border)] p-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-[var(--text-article)]">사람</span>
                  <span className="text-sm text-[var(--text-article)]">{result.recommended_resources.people}명</span>
                </div>
                {Object.entries(result.recommended_resources.tools).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--text-article)]">
                      {key}
                    </span>
                    <span className="text-sm text-[var(--text-article)]">{value}개</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 예상 소요 시간 */}
          <div>
            <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
              예상 소요 시간
            </h2>
            <div className="bg-white rounded-xl p-4">
              <p className="text-[22px] font-semibold text-[var(--text-article)]">{result.recommended_resources.estimated_time_min}분</p>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--background-border)] p-4 flex gap-2 max-w-[480px] mx-auto">
            <button
              onClick={handleReset}
              className="flex-1 py-3 border border-[var(--background-border)] text-[var(--text-article)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleCreateRecruitment}
              className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors"
            >
              공고 만들기
            </button>
          </div>
        </div>
      )}

      {/* 공고 생성 폼 */}
      {showForm && result && (
        <div className="space-y-4 pb-24">
          <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
            구인 글 생성
          </h2>

          <div className="space-y-4">
            {/* 활동 날짜 */}
            <div>
              <label className="block text-xs font-normal text-[var(--text-article)] mb-2">활동 날짜</label>
              <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="flex-1 outline-none text-sm"
                  placeholder="0000.00.00"
                />
              </div>
            </div>

            {/* 접선 장소 */}
            <div>
              <label className="block text-xs font-normal text-[var(--text-article)] mb-2">접선 장소</label>
              <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="flex-1 outline-none text-sm"
                  placeholder="광안리 해수욕장 제 1 주차장"
                />
              </div>
            </div>

            {/* 추가 노트 */}
            <div>
              <label className="block text-xs font-normal text-[var(--text-article)] mb-2">추가 노트</label>
              <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)] mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="flex-1 outline-none text-sm resize-none"
                  placeholder="장갑 및 개인 물은 지참 바랍니다."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--background-border)] p-4 flex gap-2 max-w-[480px] mx-auto">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 border border-[var(--background-border)] text-[var(--text-article)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleGeneratePost}
              className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors"
            >
              AI로 공고 만들기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
