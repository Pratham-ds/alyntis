interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy-900';
  const accentColor = variant === 'light' ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 36 36" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
            stroke="url(#logo-gradient)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 11L24.5 14.75V22.25L18 26L11.5 22.25V14.75L18 11Z"
            fill="url(#logo-gradient)"
          />
          <circle cx="18" cy="18.5" r="2.5" fill={variant === 'light' ? '#0a1628' : '#fff'} />
          <defs>
            <linearGradient id="logo-gradient" x1="5" y1="3" x2="31" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14b8a6" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={`text-xl font-bold tracking-tight ${textColor}`}>
        ALYNT<span className={accentColor}>IS</span>
      </span>
    </div>
  );
}
