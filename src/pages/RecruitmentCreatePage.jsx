import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { createRecruitmentRequest } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function RecruitmentCreatePage() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    activityDate: '',
    meetingPlace: '',
    additionalNote: '',
  });

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const result = await mockService.getAnalysisDetail(Number(analysisId));
      setAnalysis(result);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        activityDate: tomorrow.toISOString().split('T')[0],
      }));
    } catch (error) {
      alert('분석 결과 조회 실패: ' + error.message);
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.activityDate || !formData.meetingPlace) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const requestData = createRecruitmentRequest(
        formData.activityDate,
        formData.meetingPlace,
        formData.additionalNote
      );

      await mockService.createRecruitmentFromAnalysis(
        Number(analysisId),
        requestData
      );

      alert('구인글이 생성되었습니다!');
      navigate('/recruitment');
    } catch (error) {
      alert('구인글 생성 실패: ' + error.message);
    } finally {
      setSubmitting(false);
    }
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
        <Button variant="text" onClick={() => navigate(`/analysis/${analysisId}`)} className="!px-0 !py-2 text-[17px] text-ios-blue hover:opacity-60">
           <span className="flex items-center gap-1">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L2 10L11 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            취소
          </span>
        </Button>
      </div>

      <div className="mb-6 px-1">
        <h1 className="text-[34px] font-bold text-ios-text-primary tracking-tight leading-main">구인글 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
           <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">상세 내용</h2>
           <Card className="!p-0">
             <div className="divide-y divide-ios-separator/20">
               <div className="flex items-center p-0 pl-4">
                 <label htmlFor="activityDate" className="text-[17px] text-ios-text-primary w-24 flex-shrink-0">날짜</label>
                 <input
                   type="date"
                   id="activityDate"
                   name="activityDate"
                   value={formData.activityDate}
                   onChange={handleChange}
                   required
                   disabled={submitting}
                   className="flex-1 py-3.5 pr-4 bg-transparent text-[17px] text-ios-text-primary text-right outline-none disabled:opacity-50"
                 />
               </div>
               
               <div className="flex items-center p-0 pl-4">
                 <label htmlFor="meetingPlace" className="text-[17px] text-ios-text-primary w-24 flex-shrink-0">장소</label>
                 <input
                   type="text"
                   id="meetingPlace"
                   name="meetingPlace"
                   value={formData.meetingPlace}
                   onChange={handleChange}
                   placeholder="만날 장소 입력"
                   required
                   disabled={submitting}
                   className="flex-1 py-3.5 pr-4 bg-transparent text-[17px] text-ios-text-primary text-right outline-none placeholder:text-ios-gray3 disabled:opacity-50"
                 />
               </div>
             </div>
           </Card>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">추가 메모 (선택)</h2>
          <Card className="!p-0">
            <textarea
              id="additionalNote"
              name="additionalNote"
              value={formData.additionalNote}
              onChange={handleChange}
              placeholder="참여자들에게 전달할 내용이 있다면 적어주세요."
              rows="4"
              disabled={submitting}
              className="w-full p-4 bg-transparent text-[17px] text-ios-text-primary outline-none placeholder:text-ios-gray3 resize-none disabled:opacity-50"
            />
          </Card>
        </div>

        <div className="mt-2 px-1">
          <Button type="submit" variant="primary" size="large" disabled={submitting} fullWidth className="shadow-sm">
            {submitting ? '생성 중...' : '완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
