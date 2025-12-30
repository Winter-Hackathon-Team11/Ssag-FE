import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { mapRecruitmentToUI } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
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
      const uiData = mapRecruitmentToUI(result);
      setRecruitment(uiData);
    } catch (error) {
      alert('구인글 조회 실패: ' + error.message);
      navigate('/recruitment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
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

  const handleViewAnalysis = () => {
    if (recruitment?.analysisId) {
      navigate(`/analysis/${recruitment.analysisId}`);
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

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="mb-2 px-1">
        <Button variant="text" onClick={() => navigate('/recruitment')} className="!px-0 !py-2 text-[17px] text-ios-blue hover:opacity-60">
          <span className="flex items-center gap-1">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L2 10L11 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            목록
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="px-2">
          <h1 className="text-[28px] font-bold text-ios-text-primary leading-tight mb-2">{recruitment.title}</h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-ios-green/10 text-ios-green rounded-md text-[13px] font-semibold">모집 중</span>
            <span className="text-[13px] text-ios-text-secondary">
               {new Date(recruitment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">모집 정보</h2>
          <Card className="!p-0">
            <div className="divide-y divide-ios-separator/20">
              <div className="flex justify-between items-center p-4">
                <span className="text-[17px] text-ios-text-primary">활동 날짜</span>
                <span className="text-[17px] text-ios-text-secondary">{formatDate(recruitment.activityDate)}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-[17px] text-ios-text-primary">집합 장소</span>
                <span className="text-[17px] text-ios-text-secondary">{recruitment.meetingPlace}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-[17px] text-ios-text-primary">모집 인원</span>
                <span className="text-[17px] font-semibold text-ios-blue">{recruitment.requiredPeople}명</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
           <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">활동 내용</h2>
           <Card>
             <p className="text-[17px] text-ios-text-primary leading-relaxed whitespace-pre-line">
               {recruitment.content}
             </p>
           </Card>
        </div>

        {recruitment.additionalNote && (
          <div>
            <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">추가 안내사항</h2>
            <Card>
              <p className="text-[17px] text-ios-orange leading-relaxed">
                {recruitment.additionalNote}
              </p>
            </Card>
          </div>
        )}

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">제공 도구</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-1">
            {recruitment.tools.map((tool, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
                <span className="text-[13px] text-ios-text-secondary mb-1">{tool.type}</span>
                <span className="text-[20px] font-bold text-ios-text-primary">{tool.count}개</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-ios-text-secondary text-center mt-2 px-4">
            * 모든 도구는 현장에서 무료로 제공됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4 mb-8 px-1">
          {recruitment.analysisId && (
            <Button variant="secondary" onClick={handleViewAnalysis} fullWidth size="large">
              원본 분석 결과 보기
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete} fullWidth size="large">
            구인글 삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
