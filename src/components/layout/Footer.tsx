import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const footerNav = [
  { label: 'Home', to: '/' },
  { label: 'Mission', to: '/mission' },
  { label: 'Programs', to: '/programs' },
  { label: 'Projects', to: '/projects' },
  { label: 'For Schools', to: '/schools' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Login', to: '/login' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-6 max-w-md text-lg font-bold leading-snug text-white">
              FROM CONSUMERS TO MAKERS.
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
              Preparing minds to build the future. Alyntis is a mission-driven technology and
              learning platform focused on creating the next generation of builders, innovators
              and problem-solvers.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Robotics', 'AI', 'IoT', 'Electronics', 'Drones'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNav.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">
              Get Started
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/request-demo"
                  className="text-sm font-semibold text-white transition-colors hover:text-teal-400"
                >
                  Request a Demo
                </Link>
              </li>
              <li>
                <Link
                  to="/schools"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Contact Alyntis
                </Link>
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-gray-500">Privacy Policy</p>
              <p className="text-xs text-gray-500">Terms of Use</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; 2026 Alyntis. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Preparing Minds to Build the Future.
          </p>
        </div>
      </div>
    </footer>
  );
}
