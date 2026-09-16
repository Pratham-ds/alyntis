import { Navigate, useParams } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  // Public project detail pages are gated — redirect to the projects teaser
  // Actual project content lives at /dashboard/projects/:slug for authenticated students
  return <Navigate to="/projects" replace />;
}
