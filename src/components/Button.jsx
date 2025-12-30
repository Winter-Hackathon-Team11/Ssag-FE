export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  // iOS Button specific base - using system font stack and smoother transitions
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-opacity active:opacity-60 duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    // Standard iOS Filled Button (Blue default)
    primary: 'bg-ios-blue text-white rounded-[14px]',
    // iOS Tinted/Gray Button
    secondary: 'bg-ios-gray5 text-ios-blue rounded-[14px]',
    // iOS Human Interface Guidelines - Destructive Action
    danger: 'bg-ios-red text-white rounded-[14px]',
    // iOS Success Action
    success: 'bg-ios-green text-white rounded-[14px]',
    // iOS Outline / Bordered Button
    outline: 'bg-transparent border border-ios-blue text-ios-blue rounded-[14px]',
    // iOS Plain Button (Text Only)
    text: 'bg-transparent text-ios-blue hover:bg-ios-gray6/50 rounded-lg',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-[15px]',
    medium: 'px-4 py-3 text-[17px]', // Standard iOS body size
    large: 'px-5 py-3.5 text-[17px]', // Large usually just means more padding but same font size or slightly larger
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  // Fallback to primary if variant doesn't exist (safety)
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.medium;

  const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
