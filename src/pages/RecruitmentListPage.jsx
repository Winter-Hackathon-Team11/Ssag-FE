import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { mapRecruitmentsToUI } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function RecruitmentListPage() {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruitments();
  }, []);

  const loadRecruitments = async () => {
    setLoading(true);
    try {
      const response = await mockService.getRecruitmentList();
      const uiData = mapRecruitmentsToUI(response.recruitments);
      setRecruitments(uiData);
    } catch (error) {
      alert('구인글 목록 조회 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
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
      <div className="mb-4 pt-2 px-1">
        <h1 className="text-[34px] font-bold text-ios-text-primary tracking-tight leading-main">모집</h1>
      </div>

      <div className="flex gap-3 mb-6 px-1">
        <Button variant="primary" onClick={() => navigate('/')} fullWidth className="shadow-sm">
          새 분석하기
        </Button>
      </div>

      {recruitments.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-ios-text-secondary mb-6 font-medium">등록된 구인글이 없습니다.</p>
          <Button onClick={() => navigate('/history')} variant="text">
            분석 이력에서 구인글 작성
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-[-8px]">모집 중인 활동</h2>
          {recruitments.map((recruitment) => (
            <Card
              key={recruitment.id}
              className="active:scale-[0.98] transition-transform duration-200 !p-0"
              onClick={() => navigate(`/recruitment/${recruitment.id}`)}
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-[17px] font-semibold text-ios-text-primary leading-snug line-clamp-2 pr-2">
                    {recruitment.title}
                  </h3>
                  <span className="bg-ios-green/10 text-ios-green px-2.5 py-1 rounded-full text-[13px] font-semibold whitespace-nowrap">
                    {recruitment.requiredPeople}명
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[15px] text-ios-text-secondary">
                    <span className="flex-shrink-0 w-5 text-center">📅</span>
                    <span>{formatDate(recruitment.activityDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-ios-text-secondary">
                    <span className="flex-shrink-0 w-5 text-center">📍</span>
                    <span className="line-clamp-1">{recruitment.meetingPlace}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-ios-separator/20 flex justify-between items-center">
                   <span className="text-[13px] text-ios-text-tertiary">
                     자세히 보기
                   </span>
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-ios-gray3">
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
