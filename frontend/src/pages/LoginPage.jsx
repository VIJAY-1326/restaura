import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl grad-violet-pink flex items-center justify-center text-white mx-auto shadow-glow-violet">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lightText dark:text-darkText">
            Welcome to Restaura
          </h1>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            Sign in to access your culinary orders and dining preferences.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-lightElevated dark:bg-darkSurface border border-black/5 dark:border-white/5 space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary block">
            Demo Access One-Click Fill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer@restaura.com', 'Customer@12345')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-lightSurface dark:bg-darkCard text-[11px] font-semibold text-brandViolet border border-black/5 dark:border-white/5 hover:bg-brandViolet/10"
            >
              Demo Patron
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@restaura.com', 'Admin@12345')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-lightSurface dark:bg-darkCard text-[11px] font-semibold text-brandPink border border-black/5 dark:border-white/5 hover:bg-brandPink/10"
            >
              Executive Admin
            </button>
          </div>
        </div>

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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-brandViolet hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Don't have a Restaura account?{' '}
          <Link to="/register" className="text-brandViolet font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
