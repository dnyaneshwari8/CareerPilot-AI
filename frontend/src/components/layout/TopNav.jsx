import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function TopNav({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/6 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu size={22} />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10" aria-label="Notifications">
          <FiBell size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user?.full_name}</p>
            <p className="text-xs text-slate-500">Member</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
