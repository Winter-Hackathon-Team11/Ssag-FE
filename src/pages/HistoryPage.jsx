import { useState, useEffect } from 'react';
import RecruitmentCard from '../components/RecruitmentCard';
import { mockRecruitments, mockMyParticipations, mockMyRecruitments } from '../mocks/mockData';
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const myRecruited = mockRecruitments.filter((r) =>
        mockMyRecruitments.includes(r.recruitment_id)
      );

      const myParticipated = mockRecruitments.filter((r) =>
        mockMyParticipations.includes(r.recruitment_id)
      );

      setMyRecruitments(myRecruited);
      setMyParticipations(myParticipated);
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
