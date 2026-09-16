import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="text-gray-400 transition-colors hover:text-teal-400">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-white">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-4 w-4 text-gray-600" />}
        </div>
      ))}
    </nav>
  );
}
