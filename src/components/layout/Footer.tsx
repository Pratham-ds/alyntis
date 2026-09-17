import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const footerNav = [
  { label: 'Home', to: '/' },
  { label: 'Solutions', to: '/schools' },
  { label: 'Programs', to: '/programs' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Login', to: '/login' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_.7fr_.9fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-md text-lg font-bold text-white">FROM CONSUMERS TO MAKERS.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">Alyntis helps schools prepare students for the future through practical learning in Robotics, AI, IoT, Embedded Systems, Drone Technology and emerging technologies.</p>
            <div className="mt-5 flex flex-wrap gap-2">{['Robotics', 'AI & ML', 'IoT', 'Embedded Systems', 'Drones'].map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">{tag}</span>)}</div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">Navigation</h3>
            <ul className="mt-4 space-y-2.5">{footerNav.map((link) => <li key={link.to}><Link to={link.to} className="group flex items-center gap-1 text-sm text-gray-400 hover:text-white">{link.label}<ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" /></Link></li>)}</ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">For Schools</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/request-demo" className="text-sm font-semibold text-white hover:text-teal-400">Partner With Alyntis</Link></li>
              <li><Link to="/schools" className="text-sm text-gray-400 hover:text-white">School Solutions</Link></li>
              <li><Link to="/programs" className="text-sm text-gray-400 hover:text-white">Explore Programs</Link></li>
              <li><Link to="/projects" className="text-sm text-gray-400 hover:text-white">Project Library</Link></li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Business &amp; General Enquiries</p>
              <a href="mailto:info@alyntis.in" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal-400"><Mail className="h-4 w-4 text-teal-400" />info@alyntis.in</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">&copy; 2026 Alyntis. All rights reserved.</p>
          <p className="text-xs text-gray-500">Preparing Minds to Build the Future.</p>
        </div>
      </div>
    </footer>
  );
}
