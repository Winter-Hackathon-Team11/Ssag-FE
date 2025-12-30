import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { mapAnalysisResultToUI } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
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
      const result = await mockService.getAnalysisDetail(Number(id));
      const uiData = mapAnalysisResultToUI(result);
      setAnalysis(uiData);
    } catch (error) {
      alert('분석 결과 조회 실패: ' + error.message);
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="mb-2 px-1">
        <Button variant="text" onClick={() => navigate('/history')} className="!px-0 !py-2 text-[17px] text-ios-blue hover:opacity-60">
           <span className="flex items-center gap-1">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L2 10L11 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            이력
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="px-2">
           <h1 className="text-[28px] font-bold text-ios-text-primary leading-tight mb-2">분석 상세</h1>
           <p className="text-[15px] text-ios-text-secondary">{formatDate(analysis.createdAt)}</p>
        </div>

        <Card className="!p-0 overflow-hidden">
          <img src={analysis.imageUrl} alt={analysis.location} className="w-full h-auto object-cover max-h-[350px]" />
        </Card>

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">위치 정보</h2>
          <Card className="!p-0">
             <div className="flex justify-between items-center p-4">
                <span className="text-[17px] text-ios-text-primary font-semibold">{analysis.location}</span>
                <span className="text-[15px] text-ios-text-secondary bg-ios-gray6 px-2 py-1 rounded">{analysis.areaType}</span>
             </div>
          </Card>
        </div>

        <div>
           <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">분석 요약</h2>
           <Card className="!p-0">
              <div className="p-4 grid grid-cols-3 divide-x divide-ios-separator/20">
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">총 쓰레기</span>
                      <span className="text-[20px] font-bold text-ios-blue">{analysis.trashSummary.total}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">권장 인원</span>
                      <span className="text-[20px] font-bold text-ios-green">{analysis.resources.people}명</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">예상 시간</span>
                      <span className="text-[20px] font-bold text-ios-orange">{analysis.resources.estimatedTime}분</span>
                  </div>
              </div>
           </Card>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">쓰레기 상세</h2>
          <Card className="!p-0">
            <ul className="divide-y divide-ios-separator/20">
              {analysis.trashSummary.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-4">
                  <span className="text-[17px] text-ios-text-primary">{item.type}</span>
                  <span className="text-[17px] text-ios-text-secondary">{item.count}개</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">필요 도구</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-1">
             {analysis.resources.tools.map((tool, index) => (
               <div key={index} className="bg-white p-3 rounded-xl flex flex-col items-center shadow-sm">
                 <span className="text-[13px] text-ios-text-secondary mb-1">{tool.type}</span>
                 <span className="text-[17px] font-bold text-ios-text-primary">{tool.count}개</span>
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4 mb-8 px-1">
           <Button
              variant="primary"
              size="large"
              onClick={() => navigate(`/recruitment/create/${id}`)}
              fullWidth
              className="shadow-sm"
            >
              구인글 작성하기
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/recruitment')}
              fullWidth
            >
              구인글 목록 보기
            </Button>
        </div>
      </div>
    </div>
  );
}
