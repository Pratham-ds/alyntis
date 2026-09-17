import { Building2, BrainCircuit, Cpu, GraduationCap } from 'lucide-react';

const highlights = [
  { icon: Building2, value: 'School-ready', label: 'Structured programs' },
  { icon: GraduationCap, value: 'Classes 1–12', label: 'Age-appropriate learning' },
  { icon: Cpu, value: '6+ technologies', label: 'Build with real tools' },
  { icon: BrainCircuit, value: 'Project-based', label: 'Learn by building' },
];

export default function HomepageTrustBar() {
  return (
    <section className="border-b border-gray-100 bg-white py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {highlights.map(({ icon: Icon, value, label }) => (
          <div key={value} className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <Icon className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
