import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { mapHistoriesToUI } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistories();
  }, []);

  const loadHistories = async () => {
    setLoading(true);
    try {
      const response = await mockService.getAnalysisHistory();
      const uiData = mapHistoriesToUI(response.histories);
      setHistories(uiData);
    } catch (error) {
      alert('이력 조회 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* iOS Large Title */}
      <div className="mb-4 pt-2 px-1">
        <h1 className="text-[34px] font-bold text-ios-text-primary tracking-tight leading-main">분석 이력</h1>
      </div>

      <div className="flex gap-3 mb-6 px-1">
        <Button variant="primary" onClick={() => navigate('/')} fullWidth className="shadow-sm">
          새 분석하기
        </Button>
      </div>

      {histories.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-ios-text-secondary mb-6 font-medium">아직 분석 이력이 없습니다.</p>
          <Button onClick={() => navigate('/')} variant="text">첫 분석 시작하기</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-[-8px]">최근 항목</h2>
          {histories.map((history) => (
            <Card
              key={history.id}
              className="!p-0 active:scale-[0.98] transition-transform duration-200"
              onClick={() => navigate(`/analysis/${history.id}`)}
            >
              <div className="flex">
                <div className="w-24 h-24 bg-ios-gray6 flex-shrink-0">
                  <img 
                    src={history.imageUrl} 
                    alt={history.location} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-[17px] text-ios-text-primary truncate pr-2">{history.location}</h3>
                    <span className="text-[13px] text-ios-text-secondary whitespace-nowrap">{formatDate(history.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                     <span className="text-[13px] text-ios-text-secondary">총 쓰레기</span>
                     <span className="text-[15px] font-semibold text-ios-blue">{history.trashCount}개</span>
                  </div>

                  <div className="flex overflow-hidden gap-1.5">
                    {history.trashTypes.slice(0, 3).map((type, index) => (
                      <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-ios-gray6 text-ios-gray text-[11px] font-medium">
                        {type}
                      </span>
                    ))}
                    {history.trashTypes.length > 3 && (
                      <span className="text-[11px] text-ios-gray self-center">+{history.trashTypes.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center pr-3 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-ios-gray3">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
