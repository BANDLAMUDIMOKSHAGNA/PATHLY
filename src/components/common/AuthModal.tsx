import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Shield, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, AdminUser } from '../../types';
import { PathlyLogo } from './PathlyLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setCurrentUser, setIsAdminMode, setUserView } = useApp();
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('admin@kitsguntur.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Campus Administrator');
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthView('login');
      setError(null);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleFillDemoAdmin = () => {
    setEmail('admin@kitsguntur.ac.in');
    setPassword('password123');
    setError(null);
  };

  const handleGoToFullAuth = () => {
    setIsAuthModalOpen(false);
    setUserView('auth');
    window.history.pushState({}, '', '/auth');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    // Authenticate user as administrator
    const isAdmin =
      email.toLowerCase().includes('admin') ||
      password.toLowerCase().includes('admin') ||
      email === 'admin@pathly.io';

    const role: UserRole = isAdmin ? 'Super Admin' : 'Editor';

    const authenticatedUser: AdminUser = {
      id: 'usr-admin-1',
      name: isAdmin ? 'Campus Administrator' : name || email.split('@')[0],
      email: email,
      role: role,
      status: 'Active',
      lastActive: 'Just now',
      avatar: '',
      assignedCollege: 'All Institutions',
    };

    setCurrentUser(authenticatedUser);
    setIsAdminMode(true);
    setIsAuthModalOpen(false);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setResetSuccess(true);
  };

  return (
    <div
      id="auth-modal-backdrop"
      onClick={() => setIsAuthModalOpen(false)}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Pathly Admin Portal</div>
              <div className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Institution Access</div>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Quick Demo Credentials Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Demo Admin Credentials</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                admin@kitsguntur.ac.in · password123
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Autofill
              </button>
              <button
                type="button"
                onClick={handleGoToFullAuth}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Full Portal
              </button>
            </div>
          </div>

          {/* Login Form */}
          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Sign In</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sign in with admin credentials to access the indoor mapping console.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500"
                    placeholder="admin@pathly.io"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Admin Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setAuthView('forgot');
                    }}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500 font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember admin session</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {authView === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your registered institutional email to receive a password reset token.
                </p>
              </div>

              {resetSuccess ? (
                <div className="bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 p-4 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
                  <div className="text-sm font-bold text-teal-900 dark:text-teal-200">Check your inbox</div>
                  <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                    We have dispatched password recovery instructions to <strong>{email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResetSuccess(false);
                      setAuthView('login');
                    }}
                    className="mt-2 text-xs font-bold text-teal-800 dark:text-teal-300 underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500"
                        placeholder="name@university.edu"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all"
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Register Form */}
          {authView === 'register' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create an Account</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Join Pathly to save custom destinations and contribute indoor feedback.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500"
                    placeholder="Dr. Sarah Chen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
