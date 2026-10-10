import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { authApi } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');

    try {
      setLoading(true);
      const res = await authApi.forgotPassword({ email });
      if (res.data.success) {
        setMessage(res.data.message);
        if (res.data.resetToken) {
          setResetToken(res.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl grad-navy-violet flex items-center justify-center text-white mx-auto shadow-glow-violet">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lightText dark:text-darkText">
            Reset Password
          </h1>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            Enter your registered email to generate a secure credential recovery token.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs space-y-3 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
            {resetToken && (
              <div className="p-3 rounded-xl bg-lightSurface dark:bg-darkSurface border border-black/5 dark:border-white/5 space-y-2 text-lightText dark:text-darkText">
                <span className="text-[10px] uppercase font-bold text-brandViolet block">Direct Recovery Link (Test Environment):</span>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="block text-xs font-bold text-brandViolet break-all hover:underline"
                >
                  Click here to proceed with reset token
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@restaura.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Generating Token...' : 'Generate Reset Token'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brandViolet hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
