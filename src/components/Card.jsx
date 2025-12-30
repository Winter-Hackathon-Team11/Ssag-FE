export default function Card({ children, className = '', onClick }) {
  // iOS "Inset Grouped" style
  // - White background
  // - Rounded corners (approx 10-12px)
  // - No shadow or very subtle shadow, relies on contrast against Grouped Background
  return (
    <div 
      className={`bg-white rounded-[10px] overflow-hidden ${onClick ? 'active:bg-ios-gray6 transition-colors cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
