import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruitmentCard from '../components/RecruitmentCard';
import { apiService } from '../services/api';
import { getMyRecruitments, getMyParticipations, getMyAnalyses } from '../utils/localStorage';
import Loading from '../components/Loading';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myRecruitments, setMyRecruitments] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [myAnalyses, setMyAnalyses] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // 로컬스토리지에서 내가 생성/참여한 공고 ID, 분석 ID 가져오기
      const myRecruitmentIds = getMyRecruitments();
      const myParticipationIds = getMyParticipations();
      const myAnalysisIds = getMyAnalyses();

      // 모든 공고 목록 가져오기
      const allRecruitments = await apiService.getRecruitmentList();

      // 로컬스토리지 ID와 매칭해서 필터링
      const myRecruited = allRecruitments.recruitments.filter((r) =>
        myRecruitmentIds.includes(r.recruitment_id)
      );

      const myParticipated = allRecruitments.recruitments.filter((r) =>
        myParticipationIds.includes(r.recruitment_id)
      );

      // 분석 이력 가져오기 (병렬 처리)
      const analysisPromises = myAnalysisIds.map(id =>
        apiService.getAnalysisDetail(id).catch(() => null)
      );
      const analysisResults = await Promise.all(analysisPromises);
      const validAnalyses = analysisResults.filter(item => item !== null);

      setMyRecruitments(myRecruited);
      setMyParticipations(myParticipated);
      setMyAnalyses(validAnalyses);
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
        {/* 분석 이력 */}
        <div>
          <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3 px-1">
            분석 이력
          </h2>

          {myAnalyses.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl">
              <p className="text-[var(--text-support)] text-sm">분석한 이미지가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myAnalyses.map((analysis) => (
                <div
                  key={analysis.analysis_id}
                  onClick={() => navigate(`/analysis/${analysis.analysis_id}`)}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {/* 이미지 */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {analysis.image_url && (
                        <img
                          src={analysis.image_url}
                          alt={analysis.location}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-semibold text-base text-[var(--text-headline)] mb-1">
                          {analysis.location}
                        </h3>
                        <p className="text-sm text-[var(--text-support)] mb-2">
                          {Object.entries(analysis.trash_summary)
                            .slice(0, 3)
                            .map(([key, value]) => `${key} ${value}개`)
                            .join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-support)]">
                        <span>{analysis.recommended_resources.people}명</span>
                        <span>·</span>
                        <span>{analysis.recommended_resources.estimated_time_min}분</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-[var(--background-border)] mx-1" />

        {/* 진행한 공고 */}
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

        {/* 참여한 공고 */}
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
