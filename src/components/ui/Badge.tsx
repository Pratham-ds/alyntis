interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'teal' | 'navy' | 'light' | 'warning';
  className?: string;
}

const variantClasses = {
  default: 'bg-teal-50 text-teal-700 border-teal-200',
  teal: 'bg-teal-500 text-white border-teal-500',
  navy: 'bg-navy-900 text-white border-navy-900',
  light: 'bg-white/10 text-white border-white/20 backdrop-blur-sm',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
