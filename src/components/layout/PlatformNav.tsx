import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell, LayoutDashboard, GraduationCap } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';

interface PlatformNavProps {
  links: { label: string; to: string }[];
  notifications?: { count: number };
}

export default function PlatformNav({ links, notifications }: PlatformNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg' : 'bg-navy-950'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex-shrink-0">
            <Logo variant="light" />
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive = location.pathname === link.to ||
                (link.to !== '/admin' && link.to !== '/dashboard' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-teal-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {notifications && notifications.count > 0 && (
            <Link
              to="/admin/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                {notifications.count > 9 ? '9+' : notifications.count}
              </span>
            </Link>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xs font-bold text-white">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-white leading-tight">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-[10px] text-gray-400 capitalize leading-tight">{profile?.role}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-950 lg:hidden">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
