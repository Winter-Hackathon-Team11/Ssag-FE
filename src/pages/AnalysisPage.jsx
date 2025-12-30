import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../mocks/mockData';
import { mapAnalysisResultToUI } from '../service';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null); // Reset result on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = await mockService.analyzeImage(selectedImage);
      const uiData = mapAnalysisResultToUI(mockResult);
      setResult(uiData);
    } catch (error) {
      alert('분석 실패: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="mb-4 pt-2 px-1">
        <h1 className="text-[34px] font-bold text-ios-text-primary tracking-tight leading-main">분석</h1>
      </div>

      {!selectedImage ? (
        <div className="h-[calc(100vh-180px)] flex flex-col justify-center items-center">
          <Card className="w-full max-w-sm mx-auto !p-8 flex flex-col items-center justify-center gap-6 text-center border-2 border-dashed border-ios-gray3 bg-transparent shadow-none hover:bg-ios-gray6/30 transition-colors">
            <div className="w-20 h-20 bg-ios-blue/10 rounded-full flex items-center justify-center text-ios-blue">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-semibold text-ios-text-primary mb-2">사진 선택하기</h3>
              <p className="text-[15px] text-ios-text-secondary">
                쓰레기가 있는 현장 사진을 올려주세요<br/>AI가 자동으로 분석해드립니다
              </p>
            </div>
            <label className="w-full">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <span className="flex items-center justify-center w-full px-4 py-3.5 bg-ios-blue text-white rounded-[14px] font-semibold text-[17px] active:opacity-80 transition-opacity cursor-pointer">
                앨범에서 선택
              </span>
            </label>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-10">
          <Card className="!p-0 overflow-hidden relative">
             <img src={selectedImage} alt="Analysis Target" className="w-full h-auto max-h-[400px] object-contain bg-black" />
             {!analyzing && !result && (
               <button 
                 onClick={handleReset}
                 className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white"
               >
                 ✕
               </button>
             )}
          </Card>

          {analyzing ? (
             <div className="py-10">
               <Loading />
               <p className="text-center text-ios-text-secondary mt-4 font-medium">AI가 이미지를 분석하고 있습니다...</p>
             </div>
          ) : !result ? (
            <div className="px-1">
              <Button onClick={handleAnalyze} size="large" fullWidth className="shadow-sm">
                분석 시작하기
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h2 className="text-[13px] font-semibold text-ios-text-secondary uppercase px-4 mb-1.5">분석 결과</h2>
                <Card className="!p-0">
                   <div className="p-4 flex items-center justify-between border-b border-ios-separator/20">
                     <span className="text-[17px] font-semibold text-ios-text-primary">{result.location}</span>
                     <span className="text-[13px] font-medium px-2 py-0.5 bg-ios-gray5 text-ios-text-secondary rounded">
                       {result.areaType}
                     </span>
                   </div>
                   
                   <div className="p-4 grid grid-cols-3 divide-x divide-ios-separator/20">
                      <div className="flex flex-col items-center gap-1">
                         <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">총 쓰레기</span>
                         <span className="text-[20px] font-bold text-ios-blue">{result.trashSummary.total}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">권장 인원</span>
                         <span className="text-[20px] font-bold text-ios-green">{result.resources.people}명</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <span className="text-[11px] text-ios-text-secondary uppercase font-semibold">예상 시간</span>
                         <span className="text-[20px] font-bold text-ios-orange">{result.resources.estimatedTime}분</span>
                      </div>
                   </div>
                </Card>
              </div>

               <div className="grid grid-cols-2 gap-3">
                 <Button onClick={() => navigate(`/recruitment/create/${result.id}`)} variant="primary" size="medium">
                    구인글 작성
                 </Button>
                 <Button onClick={() => navigate(`/analysis/${result.id}`)} variant="secondary" size="medium">
                    상세 보기
                 </Button>
               </div>
               
               <Button onClick={handleReset} variant="text" size="medium">
                  다른 사진 분석하기
               </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
