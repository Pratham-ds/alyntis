import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import Badge from '@/components/ui/Badge';

const difficultyColors: Record<string, string> = {
  Beginner: 'text-green-700 bg-green-50 border-green-200',
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  Advanced: 'text-red-700 bg-red-50 border-red-200',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyColors[project.difficulty]}`}>
            {project.difficulty}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="light">{project.technology}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy-900">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{project.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{project.classLevel}</span>
            <span>·</span>
            <span>{project.estimatedTime}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-teal-500 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
