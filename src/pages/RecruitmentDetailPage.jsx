import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import Loading from '../components/Loading';

export default function RecruitmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruitmentDetail();
  }, [id]);

  const loadRecruitmentDetail = async () => {
    setLoading(true);
    try {
      const result = await mockService.getRecruitmentDetail(Number(id));
      setRecruitment(result);
    } catch (error) {
      alert('구인글 조회 실패: ' + error.message);
      navigate('/recruitment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace('.', '');
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 구인글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await mockService.deleteRecruitment(Number(id));
      alert('구인글이 삭제되었습니다.');
      navigate('/recruitment');
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (!recruitment) {
    return null;
  }

  const isRecruiting = recruitment.status === 'recruiting';

  return (
    <div className="px-4 py-0 max-w-2xl mx-auto pb-32">
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
          공고 상세
        </h1>
      </div>

      {/* 이미지 */}
      {recruitment.image_url && (
        <div className="h-[192px] bg-white rounded-xl overflow-hidden mb-4">
          <img src={recruitment.image_url} alt={recruitment.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-4">
        {/* 공고 제목 및 정보 */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-[22px] font-semibold text-[var(--text-headline)] mb-2 leading-snug">
            {recruitment.title}
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-[var(--text-support)]">
              {formatDate(recruitment.activity_date)}
            </span>
            <span className="text-[var(--text-support)]">·</span>
            <span className="text-sm text-[var(--text-support)]">
              {recruitment.meeting_place}
            </span>
          </div>
          <p className="text-sm text-[var(--text-article)] leading-relaxed whitespace-pre-line">
            {recruitment.content}
          </p>
        </div>

        {/* 필요 인원 */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">필요 인원</h3>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-[var(--text-article)]">모집 인원</span>
              <span className="text-xl font-semibold text-[var(--text-article)]">
                {recruitment.required_people}명
              </span>
            </div>
          </div>
        </div>

        {/* 지원 물품 */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">지원 물품</h3>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              {Object.entries(recruitment.recommended_tools).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-article)]">
                    {key === 'tongs' ? '집게' : key === 'bags' ? '가방' : key === 'gloves' ? '장갑' : '가위'}
                  </span>
                  <span className="text-sm text-[var(--text-article)]">{value}개</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 추가 노트 */}
        {recruitment.additional_note && (
          <div className="bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-xl p-4">
            <p className="text-sm text-[var(--primary-700)]">
              📌 {recruitment.additional_note}
            </p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full bg-white border-t border-[var(--background-border)] px-4 py-3 flex gap-3 max-w-[480px] z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-2 px-4 border-[1.5px] border-[var(--primary-600)] text-[var(--primary-500)] rounded-lg font-bold text-sm hover:bg-[var(--primary-50)] transition-colors"
        >
          취소
        </button>
        <button
          onClick={() => {
            if (isRecruiting) {
              alert('참가 신청이 완료되었습니다!');
            }
          }}
          disabled={!isRecruiting}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${isRecruiting
              ? 'bg-[var(--primary-500)] border-[1.5px] border-[var(--primary-600)] text-white hover:bg-[var(--primary-600)]'
              : 'bg-[var(--netural-200)] text-[var(--text-disabled)] cursor-not-allowed'
            }`}
        >
          {isRecruiting ? '참여하기' : '모집 종료'}
        </button>
      </div>
    </div>
  );
}
