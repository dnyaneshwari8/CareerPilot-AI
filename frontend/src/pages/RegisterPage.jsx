import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { validateEmail, validatePassword } from '../utils/validation';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else {
      const pwErrors = validatePassword(form.password);
      if (pwErrors.length) errs.password = pwErrors.join(', ');
    }
    if (!form.confirm_password) errs.confirm_password = 'Please confirm your password';
    else if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object') {
        const msgs = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`);
        toast.error(msgs.join(' '));
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-indigo-600/15 blur-[100px]" />
      </div>
      <div className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
              CP
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Start your career journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} placeholder="John Doe" />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />
          <Input label="Confirm Password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} error={errors.confirm_password} placeholder="••••••••" />
          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
