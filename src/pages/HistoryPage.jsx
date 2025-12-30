import { useState, useEffect } from 'react';
import RecruitmentCard from '../components/RecruitmentCard';
import { apiService } from '../services/api';
import Loading from '../components/Loading';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [myRecruitments, setMyRecruitments] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // 백엔드에 사용자별 필터링 API가 없으므로 모든 공고를 가져옴
      const allRecruitments = await apiService.getRecruitmentList();

      // TODO: 백엔드에 사용자 인증 및 필터링 기능 추가되면 수정 필요
      // 현재는 임시로 모든 공고를 두 섹션에 나눠서 표시
      const half = Math.ceil(allRecruitments.recruitments.length / 2);
      setMyRecruitments(allRecruitments.recruitments.slice(0, half));
      setMyParticipations(allRecruitments.recruitments.slice(half));
    } catch (error) {
      alert('이력 조회 실패: ' + error.message);
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

  return (
    <div className="px-4 py-0 max-w-2xl mx-auto">
      <div className="mb-3 pt-1 px-1">
        <h1 className="text-[28px] font-semibold text-[var(--text-headline)] tracking-tight leading-snug">
          이력
        </h1>
      </div>

      <div className="space-y-8 pb-6">
        <div>
          <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3 px-1">
            진행한 공고
          </h2>

          {myRecruitments.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl">
              <p className="text-[var(--text-support)] text-sm">진행한 공고가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myRecruitments.map((recruitment) => (
                <RecruitmentCard key={recruitment.recruitment_id} recruitment={recruitment} />
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-[var(--background-border)] mx-1" />

        <div>
          <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3 px-1">
            참여한 공고
          </h2>

          {myParticipations.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl">
              <p className="text-[var(--text-support)] text-sm">참여한 공고가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myParticipations.map((recruitment) => (
                <RecruitmentCard key={recruitment.recruitment_id} recruitment={recruitment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
