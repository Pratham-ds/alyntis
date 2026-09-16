import logoImage from '@/assets/alyntis-logo.png';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImage}
        alt="Alyntis"
        className="h-12 w-auto max-w-[180px] object-contain"
      />
    </div>
  );
}
