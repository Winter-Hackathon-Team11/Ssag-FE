import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Loading from '../components/Loading';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisDetail();
  }, [id]);

  const loadAnalysisDetail = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAnalysisDetail(Number(id));
      setAnalysis(result);
    } catch (error) {
      alert('분석 결과 조회 실패: ' + error.message);
      navigate('/analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  // 백엔드는 한글 키로 반환 - 그대로 사용
  const trashDetails = analysis.trash_summary;

  return (
    <div className="px-4 py-0 max-w-2xl mx-auto pb-24">
      {/* 헤더 */}
      <div className="mb-3 pt-1 px-1 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--text-article)] flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-[28px] font-semibold text-[var(--text-headline)] tracking-tight leading-snug">
          분석 상세
        </h1>
      </div>

      {/* 이미지 */}
      {analysis.image_url && (
        <div className="h-[192px] bg-white rounded-xl overflow-hidden mb-4">
          <img src={analysis.image_url} alt={analysis.location} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-4">
        {/* 위치 정보 */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-headline)] mb-1">
                {analysis.location}
              </h2>
              <p className="text-sm text-[var(--text-support)]">{analysis.area_type}</p>
            </div>
          </div>
        </div>

        {/* 분석 결과 */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">분석 결과</h3>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              {Object.entries(trashDetails).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-article)]">
                    {key}
                  </span>
                  <span className="text-sm text-[var(--text-article)]">{value}개</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 자원 추천 */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">자원 추천</h3>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-article)]">사람</span>
                <span className="text-sm text-[var(--text-article)]">{analysis.recommended_resources.people}명</span>
              </div>
              {Object.entries(analysis.recommended_resources.tools).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
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
          <h3 className="text-lg font-semibold text-black mb-2">예상 소요 시간</h3>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xl font-semibold text-[var(--text-article)]">
              {analysis.recommended_resources.estimated_time_min}분
            </p>
          </div>
        </div>

      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full bg-white border-t border-[var(--background-border)] px-4 py-3 max-w-[480px] z-40">
        <button
          onClick={() => navigate(`/recruitment/create/${id}`)}
          className="w-full py-3 bg-[var(--primary-500)] text-white rounded-lg font-semibold text-base hover:bg-[var(--primary-600)] transition-colors"
        >
          이 분석으로 공고 만들기
        </button>
      </div>
    </div>
  );
}
