import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { formatDate } from '../utils/format';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import { validatePassword } from '../utils/validation';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '' });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const openEdit = () => {
    setEditForm({ full_name: user?.full_name || '' });
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editForm.full_name.trim()) {
      setErrors({ full_name: 'Name is required' });
      return;
    }
    setSaving(true);
    try {
      await updateProfile(editForm);
      toast.success('Profile updated');
      setEditOpen(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.current_password) errs.current_password = 'Required';
    const pwErrs = validatePassword(passwordForm.new_password);
    if (pwErrs.length) errs.new_password = pwErrs.join(', ');
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      errs.confirm_password = 'Passwords do not match';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success('Password updated');
      setPasswordOpen(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const msg = err.response?.data?.current_password?.[0] || 'Password change failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <div className="card">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Profile</h1>
        <p className="mt-1 text-slate-400">Manage your account settings</p>
      </div>

      <div className="card">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white shadow-xl shadow-indigo-500/20">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-white">{user?.full_name}</h2>
            <p className="mt-1 text-slate-400">{user?.email}</p>
            <p className="mt-2 text-sm text-slate-500">
              Joined {formatDate(user?.created_at)}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Button variant="secondary" onClick={openEdit}>
                <FiEdit2 />
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
                <FiLock />
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSave} className="space-y-4">
          <Input
            label="Full Name"
            name="full_name"
            value={editForm.full_name}
            onChange={(e) => setEditForm({ full_name: e.target.value })}
            error={errors.full_name}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)} title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            value={passwordForm.current_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
            error={errors.current_password}
          />
          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={passwordForm.new_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            error={errors.new_password}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={passwordForm.confirm_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
            error={errors.confirm_password}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setPasswordOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
