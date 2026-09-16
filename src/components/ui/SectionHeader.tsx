interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  variant?: 'dark' | 'light';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  variant = 'dark',
  className = '',
}: SectionHeaderProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy-900';
  const subtitleColor = variant === 'light' ? 'text-gray-300' : 'text-gray-600';
  const eyebrowColor = variant === 'light' ? 'text-teal-400' : 'text-teal-600';

  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <div
          className={`mb-4 text-sm font-bold uppercase tracking-widest ${eyebrowColor} ${
            align === 'center' ? 'flex items-center justify-center gap-2' : ''
          }`}
        >
          {align === 'center' && (
            <>
              <span className="h-px w-8 bg-teal-500" />
              {eyebrow}
              <span className="h-px w-8 bg-teal-500" />
            </>
          )}
          {align !== 'center' && eyebrow}
        </div>
      )}
      <h2 className={`text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${textColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
