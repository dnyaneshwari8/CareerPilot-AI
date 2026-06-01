import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { resumeService } from '../services/resumeService';
import { CardSkeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/format';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeService
      .getStats()
      .then(({ data }) => setStats(data))
      .catch(() => setStats({ total_uploads: 0, latest_resume: null, account_status: 'active' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Uploads',
      value: stats?.total_uploads ?? 0,
      icon: FiUpload,
      color: 'from-indigo-500 to-indigo-600',
      link: '/dashboard/upload',
    },
    {
      title: 'Latest Resume',
      value: stats?.latest_resume?.original_filename || 'No uploads yet',
      icon: FiFileText,
      color: 'from-violet-500 to-violet-600',
      link: stats?.latest_resume ? '/dashboard/resume' : '/dashboard/upload',
      subtitle: stats?.latest_resume ? formatDate(stats.latest_resume.uploaded_at) : null,
    },
    {
      title: 'Account Status',
      value: stats?.account_status === 'active' ? 'Active' : 'Inactive',
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      link: '/dashboard/profile',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-slate-400">Welcome back! Here&apos;s your career overview.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, color, link, subtitle }) => (
          <Link key={title} to={link} className="card group hover:border-indigo-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="mt-2 text-xl font-semibold text-white truncate max-w-[200px]">{value}</p>
                {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/dashboard/upload" className="btn-primary">Upload Resume</Link>
          <Link to="/dashboard/resume" className="btn-secondary">View Resumes</Link>
        </div>
      </div>
    </div>
  );
}
