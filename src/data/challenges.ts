import {
  Sprout,
  Droplets,
  Recycle,
  Wind,
  ShieldCheck,
  Car,
  Accessibility,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Challenge {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

export const challenges: Challenge[] = [
  { slug: 'smart-agriculture', title: 'Smart Agriculture', description: 'Build technology-driven solutions to improve farming efficiency, crop monitoring and yield optimization.', icon: Sprout, category: 'Agriculture' },
  { slug: 'water-conservation', title: 'Water Conservation', description: 'Design systems that monitor, manage and reduce water waste in homes, schools and communities.', icon: Droplets, category: 'Environment' },
  { slug: 'waste-management', title: 'Waste Management', description: 'Create smart solutions for waste segregation, monitoring and efficient disposal systems.', icon: Recycle, category: 'Environment' },
  { slug: 'environmental-monitoring', title: 'Environmental Monitoring', description: 'Build sensor networks to track air quality, pollution and environmental health in real time.', icon: Wind, category: 'Environment' },
  { slug: 'safety', title: 'Safety', description: 'Develop technology solutions that enhance personal, public and workplace safety.', icon: ShieldCheck, category: 'Safety' },
  { slug: 'smart-transportation', title: 'Smart Transportation', description: 'Design intelligent transport systems that improve traffic flow, parking and commute efficiency.', icon: Car, category: 'Transportation' },
  { slug: 'assistive-technology', title: 'Assistive Technology', description: 'Create technology that helps people with disabilities navigate, communicate and live independently.', icon: Accessibility, category: 'Health' },
  { slug: 'smart-cities', title: 'Smart Cities', description: 'Build solutions for urban challenges — energy, lighting, waste, parking and city infrastructure.', icon: Building2, category: 'Urban' },
];
