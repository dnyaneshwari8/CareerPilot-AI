import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { validateEmail } from '../utils/validation';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      if (form.remember) {
        localStorage.setItem('remember_email', form.email);
      }
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>
      <div className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
              CP
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your CareerPilot account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500/30"
              />
              Remember me
            </label>
            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300" onClick={() => toast('Password reset coming in Phase 2', { icon: '🔐' })}>
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
