export default function Loading({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div 
        className={`rounded-full border-toss-grey-200 border-t-toss-blue animate-spin ${sizeClasses[size] || sizeClasses.medium}`}
      ></div>
      <p className="text-toss-grey-600 text-sm font-medium">로딩 중...</p>
    </div>
  );
}
