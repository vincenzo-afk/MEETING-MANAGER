import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          label: 'Dashboard',  icon: '🏠' },
  { to: '/scheduler', label: 'Scheduler',  icon: '📅' },
  { to: '/report',    label: 'Reports',    icon: '📄' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-base shadow-lg shadow-brand-600/40">
              📋
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              MeetingManager
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600/30 text-brand-300 border border-brand-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
