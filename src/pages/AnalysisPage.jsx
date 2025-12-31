import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { addMyRecruitment, saveLastAnalysis, getLastAnalysis, clearLastAnalysis } from '../utils/localStorage';
import Loading from '../components/Loading';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [isCameraMode, setIsCameraMode] = useState(true);
  const [stream, setStream] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    note: '',
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 페이지 로드 시 마지막 분석 결과 복원
  useEffect(() => {
    const lastAnalysis = getLastAnalysis();
    if (lastAnalysis) {
      setResult(lastAnalysis);
      setIsCameraMode(false);
      // 이미지 URL을 selectedImage로 설정
      if (lastAnalysis.image_url) {
        setSelectedImage(lastAnalysis.image_url);
      }
    }
  }, []);

  // 카메라 시작
  useEffect(() => {
    if (isCameraMode && !selectedImage && !result) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraMode, selectedImage, result]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      alert('카메라에 접근할 수 없습니다. 갤러리에서 사진을 선택해주세요.');
      setIsCameraMode(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // 사진 촬영
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          stopCamera();
        };
        reader.readAsDataURL(file);
      }, 'image/jpeg', 0.95);
    }
  };

  // 갤러리에서 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
        setShowForm(false);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setAnalyzing(true);
    try {
      const analysisResult = await apiService.analyzeImage(imageFile);
      setResult(analysisResult);
      // 분석 결과를 로컬스토리지에 저장
      saveLastAnalysis(analysisResult);
    } catch (error) {
      alert('분석 실패: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setShowForm(false);
    setFormData({ date: '', location: '', note: '' });
    setIsCameraMode(true);
    // 로컬스토리지에서 마지막 분석 결과 삭제
    clearLastAnalysis();
  };

  const handleCreateRecruitment = () => {
    if (!result) return;
    setShowForm(true);
  };

  const handleGeneratePost = async () => {
    if (!formData.date || !formData.location) {
      alert('활동 날짜와 접선 장소를 입력해주세요.');
      return;
    }

    setCreatingPost(true);
    try {
      const recruitment = await apiService.createRecruitmentFromAnalysis(result.analysis_id, {
        activity_date: formData.date,
        meeting_place: formData.location,
        additional_note: formData.note || null,
      });

      // 공고 자동 게시
      try {
        await apiService.publishRecruitment(recruitment.recruitment_id);
      } catch (publishError) {
        console.warn('공고 게시 실패:', publishError);
        // 게시 실패해도 공고는 생성되었으므로 계속 진행
      }

      // 로컬스토리지에 내가 생성한 공고로 저장
      addMyRecruitment(recruitment.recruitment_id);

      // 분석 결과는 더 이상 필요 없으므로 삭제
      clearLastAnalysis();

      alert('공고가 생성 및 게시되었습니다!');
      navigate(`/recruitment/${recruitment.recruitment_id}`);
    } catch (error) {
      alert('공고 생성 실패: ' + error.message);
    } finally {
      setCreatingPost(false);
    }
  };

  // 백엔드는 한글 키로 반환 - 그대로 사용
  const trashDetails = result ? result.trash_summary : null;

  return (
    <div className="relative max-w-2xl mx-auto h-screen">
      {/* 카메라 뷰 또는 분석 화면 */}
      {!selectedImage && !result && !analyzing && (
        <div className="absolute inset-0 bg-black">
          {/* 카메라 비디오 스트림 */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* 헤더 */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-1 pb-3 bg-gradient-to-b from-black/50 to-transparent">
            <h1 className="text-[28px] font-semibold text-white tracking-tight leading-snug">
              분석
            </h1>
          </div>

          {/* 하단 촬영 버튼 */}
          <div className="absolute bottom-[78px] left-0 right-0 z-10 pb-8 pt-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center justify-center gap-12">
              {/* 갤러리 버튼 */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-lg border-2 border-white/80 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
              </label>

              {/* 촬영 버튼 */}
              <button
                onClick={handleCapture}
                className="w-[72px] h-[72px] rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white" />
              </button>

              {/* 빈 공간 (대칭을 위해) */}
              <div className="w-12 h-12" />
            </div>
          </div>
        </div>
      )}

      {/* 이미지 선택 후 화면 */}
      {(selectedImage || result || analyzing) && (
        <div className="px-4 py-0">
          {/* 헤더 */}
          <div className="mb-3 pt-1 px-1 flex items-center justify-between">
            <h1 className="text-[28px] font-semibold text-[var(--text-headline)] tracking-tight leading-snug">
              분석
            </h1>
            {result && !showForm && (
              <button className="w-6 h-6 flex items-center justify-center text-[var(--text-article)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button>
            )}
            {showForm && (
              <button onClick={() => setShowForm(false)} className="text-[var(--text-article)] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <span className="text-sm font-medium">분석</span>
              </button>
            )}
          </div>

          {/* 선택된 이미지 표시 */}
          {selectedImage && !analyzing && !result && (
            <div className="bg-white rounded-xl overflow-hidden mb-4 h-[192px] relative">
              <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* 분석 결과가 있을 때 이미지 */}
          {result && (
            <div className="bg-white rounded-xl overflow-hidden mb-4 h-[192px]">
              <img src={selectedImage} alt="Analyzed" className="w-full h-full object-cover" />
            </div>
          )}

          {/* 분석 로딩 */}
          {analyzing && (
            <div className="py-10">
              <Loading />
              <p className="text-center text-[var(--text-support)] mt-4 text-sm">AI가 이미지를 분석하고 있습니다...</p>
            </div>
          )}

          {/* 분석 시작 버튼 */}
          {selectedImage && !analyzing && !result && (
            <button
              onClick={handleAnalyze}
              className="w-full py-3.5 bg-[var(--primary-500)] text-white rounded-lg font-semibold text-base hover:bg-[var(--primary-600)] transition-colors"
            >
              분석 시작하기
            </button>
          )}

          {/* 분석 결과 */}
          {result && !showForm && (
            <div className="space-y-4 pb-6">
              {/* 분석 결과 섹션 */}
              <div>
                <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
                  분석 결과
                </h2>
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="border-b border-[var(--background-border)] p-4">
                    {Object.entries(trashDetails).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-1">
                        <span className="text-sm text-[var(--text-article)]">
                          {key}
                        </span>
                        <span className="text-sm text-[var(--text-article)]">{value}개</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 자원 추천 섹션 */}
              <div>
                <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
                  자원 추천
                </h2>
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="border-b border-[var(--background-border)] p-4">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-[var(--text-article)]">사람</span>
                      <span className="text-sm text-[var(--text-article)]">{result.recommended_resources.people}명</span>
                    </div>
                    {Object.entries(result.recommended_resources.tools).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-1">
                        <span className="text-sm text-[var(--text-article)]">
                          {key}
                        </span>
                        <span className="text-sm text-[var(--text-article)]">{value}개</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 예상 소요 시간 */}
              <div>
                <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
                  예상 소요 시간
                </h2>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-[22px] font-semibold text-[var(--text-article)]">{result.recommended_resources.estimated_time_min}분</p>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full bg-white border-t border-[var(--background-border)] px-4 py-3 flex gap-3 max-w-[480px] z-40">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 border-[1.5px] border-[var(--primary-600)] text-[var(--primary-500)] rounded-lg font-bold text-sm hover:bg-[var(--primary-50)] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateRecruitment}
                  className="flex-1 py-2 px-4 bg-[var(--primary-500)] border-[1.5px] border-[var(--primary-600)] text-white rounded-lg font-bold text-sm hover:bg-[var(--primary-600)] transition-colors"
                >
                  공고 만들기
                </button>
              </div>
            </div>
          )}

          {/* 공고 생성 폼 */}
          {showForm && result && (
            <div className="space-y-4 pb-24">
              <h2 className="text-[22px] font-semibold text-black tracking-tight leading-snug mb-3">
                구인 글 생성
              </h2>

              {/* 로딩 상태 */}
              {creatingPost && (
                <div className="py-10">
                  <Loading />
                  <p className="text-center text-[var(--text-support)] mt-4 text-sm">AI가 공고를 생성하고 있습니다...</p>
                </div>
              )}

              <div className={`space-y-4 ${creatingPost ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* 활동 날짜 */}
                <div>
                  <label className="block text-xs font-normal text-[var(--text-article)] mb-2">활동 날짜</label>
                  <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="flex-1 outline-none text-sm"
                      placeholder="0000.00.00"
                    />
                  </div>
                </div>

                {/* 접선 장소 */}
                <div>
                  <label className="block text-xs font-normal text-[var(--text-article)] mb-2">접선 장소</label>
                  <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="flex-1 outline-none text-sm"
                      placeholder="광안리 해수욕장 제 1 주차장"
                    />
                  </div>
                </div>

                {/* 추가 노트 */}
                <div>
                  <label className="block text-xs font-normal text-[var(--text-article)] mb-2">추가 노트</label>
                  <div className="bg-white border border-[var(--background-border)] rounded-lg p-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-support)] mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="flex-1 outline-none text-sm resize-none"
                      placeholder="장갑 및 개인 물은 지참 바랍니다."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full bg-white border-t border-[var(--background-border)] px-4 py-3 flex gap-3 max-w-[480px] z-40">
                <button
                  onClick={() => setShowForm(false)}
                  disabled={creatingPost}
                  className={`flex-1 py-2 px-4 border-[1.5px] border-[var(--primary-600)] rounded-lg font-bold text-sm transition-colors ${
                    creatingPost
                      ? 'text-[var(--text-disabled)] border-[var(--netural-200)] cursor-not-allowed'
                      : 'text-[var(--primary-500)] hover:bg-[var(--primary-50)]'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleGeneratePost}
                  disabled={creatingPost}
                  className={`flex-1 py-2 px-4 border-[1.5px] rounded-lg font-bold text-sm transition-colors ${
                    creatingPost
                      ? 'bg-[var(--netural-200)] border-[var(--netural-200)] text-[var(--text-disabled)] cursor-not-allowed'
                      : 'bg-[var(--primary-500)] border-[var(--primary-600)] text-white hover:bg-[var(--primary-600)]'
                  }`}
                >
                  AI로 공고 만들기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
