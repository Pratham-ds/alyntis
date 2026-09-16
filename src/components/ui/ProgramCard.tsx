import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Program } from '@/data/programs';

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
      <div className="relative h-52 overflow-hidden">
        <img
          src={program.image}
          alt={program.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{program.name}</h3>
          <p className="mt-1 text-sm text-gray-200">{program.tagline}</p>
        </div>
        <div className="absolute top-3 right-3">
          {program.status === 'Coming Soon' ? (
            <Badge variant="warning">Coming Soon</Badge>
          ) : (
            <Badge variant="teal">Available</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-gray-600">{program.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {program.topics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
            >
              <Check className="h-3 w-3 text-teal-500" />
              {topic}
            </span>
          ))}
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link
            to="/projects"
            className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
          >
            View related projects →
          </Link>
        </div>
      </div>
    </div>
  );
}
