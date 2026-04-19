import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/',          label: 'Dashboard',  icon: '🏠' },
  { to: '/scheduler', label: 'Scheduler',  icon: '📅' },
  { to: '/report',    label: 'Reports',    icon: '📄' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="font-bold text-xl text-blue-600">
              Meeting Manager
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
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
