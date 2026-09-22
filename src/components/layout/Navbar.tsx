import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, Rocket, LockKeyhole } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Solutions', to: '/schools' },
  { label: 'Programs', to: '/programs' },
  { label: 'Projects', to: '/projects' },
  { label: 'Astro Labs', to: '/space', icon: Rocket, comingSoon: true },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const dashboardLink = profile?.role === 'admin' ? '/admin' : '/dashboard';
  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md shadow-navy-900/5' : 'bg-white/90 backdrop-blur-sm'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex-shrink-0" aria-label="Alyntis home"><Logo variant="dark" /></Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = !link.comingSoon && (location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to)));

            if (link.comingSoon) {
              return (
                <button
                  key={link.to}
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Astro Labs — Coming Soon"
                  className="relative flex cursor-not-allowed items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-navy-400 opacity-80"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{link.label}</span>
                  <span className="ml-0.5 inline-flex items-center gap-1 rounded-full bg-navy-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-navy-500">
                    <LockKeyhole className="h-2.5 w-2.5" />
                    Coming Soon
                  </span>
                </button>
              );
            }

            return <Link key={link.to} to={link.to} className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-navy-700 hover:text-teal-600'}`}>{Icon && <Icon className="h-3.5 w-3.5" />}{link.label}{isActive && <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-teal-500" />}</Link>;
          })}
        </div>
        <div className="hidden items-center gap-3 lg:flex">{session && profile ? <><Link to={dashboardLink} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-teal-600"><LayoutDashboard className="h-4 w-4" />{profile.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</Link><button onClick={handleSignOut} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-teal-600"><LogOut className="h-4 w-4" />Sign Out</button></> : <><Link to="/login" className="text-sm font-semibold text-navy-700 hover:text-teal-600">Login</Link><Button to="/request-demo" size="sm">Partner With Us <ArrowRight className="h-4 w-4" /></Button></>}</div>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </nav>
      {mobileOpen && <div className="border-t border-gray-100 bg-white lg:hidden"><div className="space-y-1 px-4 py-4 sm:px-6">{navLinks.map((link) => {
        const Icon = link.icon;

        if (link.comingSoon) {
          return (
            <button
              key={link.to}
              type="button"
              disabled
              aria-disabled="true"
              title="Astro Labs — Coming Soon"
              className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-navy-400 opacity-80"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{link.label}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-navy-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-navy-500">
                <LockKeyhole className="h-2.5 w-2.5" />
                Coming Soon
              </span>
            </button>
          );
        }

        return <Link key={link.to} to={link.to} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${location.pathname === link.to ? 'bg-teal-50 text-teal-600' : 'text-navy-700 hover:bg-gray-50'}`}>{Icon && <Icon className="h-4 w-4" />}{link.label}</Link>;
      })}<div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">{session && profile ? <><Link to={dashboardLink} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy-700 hover:bg-gray-50"><LayoutDashboard className="h-4 w-4" />{profile.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</Link><button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy-700 hover:bg-gray-50"><LogOut className="h-4 w-4" />Sign Out</button></> : <><Link to="/login" className="block rounded-lg px-4 py-3 text-sm font-semibold text-navy-700 hover:text-teal-600">Login</Link><Button to="/request-demo" size="md" fullWidth>Partner With Us <ArrowRight className="h-4 w-4" /></Button></>}</div></div></div>}
    </header>
  );
}
