import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const DEFAULT_AVATAR = 'https://placehold.co/100x100?text=Avatar';

function NavItem({ to, icon, label, active }) {
  const className = active
    ? 'bg-secondary-container text-on-secondary-container rounded-lg mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-label-md'
    : 'text-on-tertiary/70 hover:text-on-tertiary hover:bg-on-tertiary/10 rounded-lg mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-label-md transition-all';

  return (
    <Link to={to} className={className}>
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </Link>
  );
}

export default function Sidebar({ mobileOpen, onClose, userProfile }) {
  const { user, logout, updateUser } = useAuth();
  const { pathname } = useLocation();
  const [currentUser, setCurrentUser] = useState(userProfile || null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrentUser() {
      try {
        const { data } = await axiosInstance.get('/api/users/me');
        if (isMounted) {
          setCurrentUser(data);
          updateUser(data);
        }
      } catch {
        /* sidebar falls back to auth/default profile data */
      }
    }

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [updateUser]);

  const sidebarUser = userProfile || currentUser || user || {};
  const displayName = sidebarUser.username || 'Member';
  const avatar = sidebarUser.avatar || DEFAULT_AVATAR;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 z-[56] md:z-30 bg-tertiary-container text-on-tertiary flex flex-col py-6 shadow-xl overflow-y-auto pt-24 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest flex-shrink-0 border border-white/10">
            <img
              className="w-full h-full object-cover"
              src={avatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
              alt={displayName}
            />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-headline-md text-[16px] font-bold truncate text-on-tertiary">
              {displayName}
            </h4>
            <p className="text-on-tertiary/70 font-body-md text-[12px]">Premium Member</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          <NavItem
            to="/dashboard/listings"
            icon="home_work"
            label="My Listings"
            active={
              pathname.startsWith('/dashboard/listings') ||
              pathname.startsWith('/dashboard/edit')
            }
          />
          <NavItem
            to="/dashboard/create"
            icon="add_circle"
            label="Create Listing"
            active={pathname === '/dashboard/create'}
          />
          <NavItem
            to="/dashboard/profile"
            icon="settings"
            label="Profile Settings"
            active={pathname.includes('/dashboard/profile')}
          />
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-on-tertiary/10">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 text-on-tertiary/70 hover:text-on-tertiary hover:bg-on-tertiary/10 rounded-lg px-4 py-3 transition-all w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
