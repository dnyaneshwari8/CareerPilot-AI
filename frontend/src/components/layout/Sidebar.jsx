import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiUser,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/dashboard/upload', icon: FiUpload, label: 'Upload Resume' },
  { to: '/dashboard/resume', icon: FiFileText, label: 'My Resume' },
  { to: '/dashboard/profile', icon: FiUser, label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`;

  return (
    <aside
      className={`glass-strong fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/6 transition-transform duration-300 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/6 p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
            CP
          </div>
          <span className="font-semibold text-white">CareerPilot</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'} className={linkClass} onClick={onClose}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/6 p-4">
        <div className="mb-3 truncate rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
