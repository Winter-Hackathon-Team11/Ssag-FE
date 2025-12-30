import { useNavigate } from 'react-router-dom';

export default function RecruitmentCard({ recruitment }) {
  const navigate = useNavigate();

  const isRecruiting = recruitment.status === 'recruiting';

  const handleClick = () => {
    navigate(`/recruitment/${recruitment.recruitment_id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace('.', '');
  };

  const calculateEstimatedTime = () => {
    const tools = recruitment.recommended_tools;
    const totalItems = Object.values(tools).reduce((sum, val) => sum + val, 0);
    return Math.max(30, Math.min(120, totalItems * 8));
  };

  return (
    <div
      className="bg-[var(--background)] rounded-xl overflow-hidden cursor-pointer active:opacity-90 transition-opacity relative"
      onClick={handleClick}
    >
      {/* 이미지 */}
      <div className="h-[100px] relative rounded-xl overflow-hidden">
        <img
          src={recruitment.image_url}
          alt={recruitment.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isRecruiting ? 'bg-black/25' : 'bg-black/50'}`} />

        {/* 모집 종료 텍스트 */}
        {!isRecruiting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-semibold text-white tracking-tight">
              모집 종료된 공고입니다.
            </p>
          </div>
        )}

        {/* 날짜 배지 */}
        <div className="absolute top-2 right-2 px-1 py-0.5 rounded-md bg-white/60 backdrop-blur-sm border border-white/60">
          <p className="text-xs font-normal text-black">
            {formatDate(recruitment.activity_date)}
          </p>
        </div>
      </div>

      {/* 정보 */}
      <div className="flex flex-col gap-1 pt-1">
        <h3 className="text-lg font-semibold text-[var(--text-article)] leading-snug tracking-tight">
          {recruitment.title}
        </h3>
        <p className="text-sm text-[var(--text-support)]">
          {recruitment.meeting_place}
        </p>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-sm text-[var(--text-support)]">
            <span>{recruitment.current_applicants}/{recruitment.required_people}명</span>
            <span>·</span>
            <span>{calculateEstimatedTime()}분 소요 예상</span>
          </div>

          <button
            className={`px-2 py-1.5 rounded-lg text-sm font-normal transition-colors ${
              isRecruiting
                ? 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]'
                : 'bg-[var(--text-disabled)] text-white cursor-default'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isRecruiting) {
                alert('참가 신청이 완료되었습니다!');
              }
            }}
            disabled={!isRecruiting}
          >
            {isRecruiting ? '참가하기 →' : '참가 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
