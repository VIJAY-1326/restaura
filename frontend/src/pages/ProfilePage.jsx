import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Phone, Mail, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [isAuthenticated, navigate, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    try {
      setSavingProfile(true);
      const res = await authApi.updateProfile(profileData);
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileSuccess('Profile updated successfully');
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Account Settings</span>
        <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
          My Connoisseur Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
            <div className="w-12 h-12 rounded-2xl grad-navy-violet text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-lightText dark:text-darkText">{user?.name}</h2>
              <span className="text-xs text-brandViolet font-semibold capitalize">{user?.role} Patron</span>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-3 rounded-xl grad-navy-violet text-white font-bold text-xs shadow-md hover:opacity-95"
            >
              {savingProfile ? 'Saving Changes...' : 'Update Profile Details'}
            </button>
          </form>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-4">
            <Lock className="w-5 h-5 text-brandViolet" />
            <h2 className="font-serif font-bold text-base text-lightText dark:text-darkText">
              Change Security Password
            </h2>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                New Password (Minimum 6 Characters)
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-3 rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 font-bold text-xs"
            >
              {savingPassword ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
