import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const fillIcon = { fontVariationSettings: "'FILL' 1" };

function NavLink({ to, children, active }) {
  const base = active
    ? 'text-secondary font-bold border-b-2 border-secondary transition-colors font-body-md'
    : 'text-on-surface-variant hover:text-secondary transition-colors font-body-md';

  return (
    <Link to={to} className={base}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-full">
        <Link
          to="/"
          className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-secondary" style={fillIcon}>
            location_city
          </span>
          <span>PropSpace</span>
        </Link>

        {user ? (
          <>
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/properties" active={path.startsWith('/properties')}>
                Properties
              </NavLink>
              <NavLink to="/dashboard" active={path.startsWith('/dashboard')}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="border-2 border-primary text-primary font-label-md text-label-md uppercase px-6 py-2 rounded-xl hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
              >
                Logout
              </button>
            </div>
            <button
              type="button"
              onClick={logout}
              className="md:hidden border-2 border-primary text-primary font-label-md text-label-md uppercase px-4 py-2 rounded-xl hover:bg-primary hover:text-on-primary active:scale-95"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/properties" active={path === '/properties'}>
                Properties
              </NavLink>
              <NavLink to="/login" active={path === '/login'}>
                Login
              </NavLink>
              <NavLink to="/register" active={path === '/register'}>
                Register
              </NavLink>
            </div>
            <Link
              to="/login"
              className="md:hidden text-on-surface-variant hover:text-secondary font-label-md text-label-md"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
