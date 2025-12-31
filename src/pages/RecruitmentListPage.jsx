import { useState, useEffect } from 'react';
import RecruitmentCard from '../components/RecruitmentCard';
import { apiService } from '../services/api';
import Loading from '../components/Loading';

export default function RecruitmentListPage() {
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruitments();
  }, []);

  const loadRecruitments = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRecruitmentList('uploaded'); // 발행된 모집글만
      setRecruitments(response.recruitments);
    } catch (error) {
      alert('구인글 목록 조회 실패: ' + error.message);
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
          구인관리
        </h1>
      </div>

      <div>
        <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3 px-1">
          근처에 모집 중인 공고
        </h2>

        {recruitments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[var(--text-support)] text-sm">등록된 구인글이 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-6">
            {recruitments.map((recruitment) => (
              <RecruitmentCard key={recruitment.recruitment_id} recruitment={recruitment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
