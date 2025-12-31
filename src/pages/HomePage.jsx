import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RecruitmentCard from '../components/RecruitmentCard';
import { apiService } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruitments();
  }, []);

  const loadRecruitments = async () => {
    try {
      const data = await apiService.getRecruitmentList('uploaded');
      // 최신 3개만 표시
      setRecruitments(data.recruitments.slice(0, 3));
    } catch (error) {
      console.error('Failed to load recruitments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-0 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="mb-3 pt-1 px-1 flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[var(--text-headline)] tracking-tight leading-snug">
          홈
        </h1>
        <button className="w-6 h-6 flex items-center justify-center text-[var(--text-article)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* 배너 */}
        <div className="bg-[var(--primary-500)] rounded-xl p-6 relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute w-[100px] h-[100px] rounded-full bg-[var(--primary-600)] opacity-50 -left-5 top-16" />
          <div className="absolute w-[100px] h-[100px] rounded-full bg-[var(--primary-600)] opacity-50 -right-8 -top-11" />

          <div className="relative z-10 flex items-end justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">
                  쓰레기 사진을 업로드하세요
                </p>
                <p className="text-xs text-[var(--netural-300)] leading-snug">
                  AI가 분석부터 구인 글<br />작성까지 도와드릴게요
                </p>
              </div>

              <button
                onClick={() => navigate('/analysis')}
                className="bg-white border border-[var(--background-border)] rounded-lg px-3 py-2 text-sm font-semibold text-[var(--primary-600)] hover:bg-gray-50 transition-colors inline-flex items-center justify-center self-start"
              >
                바로 분석 시작하기 →
              </button>
            </div>

            {/* 일러스트 영역 (나중에 이미지로 교체 가능) */}
            <div className="w-[123px] h-[100px] bg-white/10 rounded-lg flex items-center justify-center text-white/50 text-4xl">
              🗑️
            </div>
          </div>
        </div>

        {/* 공고 목록 */}
        <div>
          <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-2">
            근처에 모집 중인 공고
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-500)]" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recruitments.map((recruitment) => (
                <RecruitmentCard key={recruitment.recruitment_id} recruitment={recruitment} />
              ))}
            </div>
          )}

          {!loading && recruitments.length > 0 && (
            <button
              onClick={() => navigate('/recruitment')}
              className="w-full mt-4 py-3 text-[var(--primary-500)] text-sm font-semibold hover:bg-gray-50 rounded-lg transition-colors"
            >
              더 많은 공고 보기 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
