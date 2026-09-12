import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authStore, SignUpFormData, AuthUser } from '../data/authStore';
import { UserRole } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

interface AuthPageProps {
  initialTab?: 'signin' | 'signup';
  redirectMessage?: string | null;
  onSuccess?: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'signin',
  redirectMessage: externalMessage,
  onSuccess,
}) => {
  const { setUserView, setIsAdminMode, setCurrentUser, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);

  // Notice/alert from redirected route
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInShowPassword, setSignInShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up States
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState<string | null>(null);

  // Social login loading
  const [socialLoadingProvider, setSocialLoadingProvider] = useState<'google' | 'microsoft' | null>(null);

  // Forgot Password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    // Check if there was an admin redirect message in URL or sessionStorage
    const sessionMsg = sessionStorage.getItem('pathly_auth_redirect_msg');
    if (sessionMsg) {
      setRedirectNotice(sessionMsg);
      sessionStorage.removeItem('pathly_auth_redirect_msg');
    } else if (externalMessage) {
      setRedirectNotice(externalMessage);
    }
  }, [externalMessage]);

  const handleFillDemoAdmin = () => {
    setActiveTab('signin');
    setSignInEmail('admin@kitsguntur.ac.in');
    setSignInPassword('password123');
    setSignInError(null);
  };

  const handleFillDemoStudent = () => {
    setActiveTab('signin');
    setSignInEmail('student@kitsguntur.ac.in');
    setSignInPassword('password123');
    setSignInError(null);
  };

  // Sign In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInEmail.trim())) {
      setSignInError('Please enter a valid email address format.');
      return;
    }

    if (!signInPassword) {
      setSignInError('Please enter your password.');
      return;
    }

    setIsSignInLoading(true);
    try {
      const res = await authStore.login(signInEmail, signInPassword);
      if (res.success && res.user) {
        setCurrentUser(res.user as any);

        if (onSuccess) {
          onSuccess(res.user);
          return;
        }

        // Route to admin if admin role, otherwise to campus map/home
        if (authStore.isUserAdmin(res.user)) {
          setIsAdminMode(true);
          window.history.pushState({}, '', '/admin');
        } else {
          setIsAdminMode(false);
          setUserView('home');
          window.history.pushState({}, '', '/');
        }
      } else {
        setSignInError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setSignInError('An unexpected network error occurred. Please try again.');
    } finally {
      setIsSignInLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccessMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setSignUpError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail.trim())) {
      setSignUpError('Please enter a valid college or organization email address.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setSignUpError('Passwords do not match. Please re-enter your confirmation password.');
      return;
    }

    if (!agreeTerms) {
      setSignUpError('You must agree to the Campus Terms of Service and Privacy Policy to register.');
      return;
    }

    setIsSignUpLoading(true);
    try {
      const payload: SignUpFormData = {
        fullName: fullName.trim(),
        email: signUpEmail.trim(),
        role: role,
        password: signUpPassword,
        confirmPassword,
        agreeTerms,
      };

      const res = await authStore.signup(payload);
      if (res.success && res.user) {
        setSignUpSuccessMessage(`Welcome to IndoorNav, ${res.user.name}! Your account has been registered.`);
        setCurrentUser(res.user as any);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess(res.user!);
            return;
          }

          if (authStore.isUserAdmin(res.user)) {
            setIsAdminMode(true);
            window.history.pushState({}, '', '/admin');
          } else {
            setIsAdminMode(false);
            setUserView('home');
            window.history.pushState({}, '', '/');
          }
        }, 800);
      } else {
        setSignUpError(res.error || 'Registration could not be completed.');
      }
    } catch {
      setSignUpError('Unable to connect to registration service. Please retry.');
    } finally {
      setIsSignUpLoading(false);
    }
  };

  // Social Login Mock Handler
  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setSocialLoadingProvider(provider);
    setSignInError(null);
    setSignUpError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockName = provider === 'google' ? 'Google Campus Member' : 'Microsoft Edu Scholar';
    const mockEmail = provider === 'google' ? 'scholar@gmail.com' : 'scholar@kitsguntur.ac.in';

    const socialUser: AuthUser = {
      id: `usr-oauth-${Date.now()}`,
      name: mockName,
      email: mockEmail,
      role: 'Student',
      avatar:
        provider === 'google'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      lastActive: 'Just now',
      college: 'KITS Guntur Campus',
    };

    localStorage.setItem('pathly_current_user', JSON.stringify(socialUser));
    localStorage.setItem('pathly_is_authenticated', 'true');
    setCurrentUser(socialUser as any);
    setSocialLoadingProvider(null);

    if (onSuccess) {
      onSuccess(socialUser);
    } else {
      setIsAdminMode(false);
      setUserView('home');
      window.history.pushState({}, '', '/');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
  };

  return (
    <div
      id="auth-page-container"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="w-full max-w-md my-6">
        {/* Top Back Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setUserView('home');
              window.history.pushState({}, '', '/');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Map</span>
          </button>

          <Badge variant="outline" className="text-[11px] font-mono border-slate-300 dark:border-slate-700">
            KITS Guntur IndoorNav
          </Badge>
        </div>

        {/* Redirect Notice Banner */}
        {redirectNotice && (
          <div
            id="auth-redirect-notice"
            className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-xs animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Restricted Access</div>
              <p className="leading-relaxed">{redirectNotice}</p>
            </div>
          </div>
        )}

        {/* Pre-seeded Demo Credentials Card */}
        <div className="mb-4 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
              <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Pre-seeded Demo Admin Account</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              admin@kitsguntur.ac.in · password123
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFillDemoAdmin}
            className="text-xs h-7 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 border-teal-300 dark:border-teal-700"
          >
            Autofill
          </Button>
        </div>

        {/* Main Auth Card */}
        <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 mb-3">
              <Building className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join IndoorNav'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === 'signin'
                ? 'Sign in to access indoor routing, saved venues, and administrative facilities.'
                : 'Create your institutional profile to explore 2D campus maps and route through blocks.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            {/* Tabbed Toggle: Sign In vs Create Account */}
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 grid grid-cols-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setSignInError(null);
                  setSignUpError(null);
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setSignInError(null);
                  setSignUpError(null);
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Mock Logins */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoadingProvider !== null}
                  className="h-10 text-xs font-semibold justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {socialLoadingProvider === 'google' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="truncate">Google</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin('microsoft')}
                  disabled={socialLoadingProvider !== null}
                  className="h-10 text-xs font-semibold justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {socialLoadingProvider === 'microsoft' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                      </svg>
                      <span className="truncate">Microsoft Edu</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="relative flex items-center justify-center text-xs">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="bg-white dark:bg-slate-900 px-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-medium shrink-0">
                  Or with campus email
                </span>
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            {/* ===================== SIGN IN VIEW ===================== */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                {signInError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{signInError}</span>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <Input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="admin@kitsguntur.ac.in"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <Input
                      type={signInShowPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSignInShowPassword(!signInShowPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {signInShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSignInLoading}
                  className="w-full h-11 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2"
                >
                  {isSignInLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* ===================== SIGN UP VIEW ===================== */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                {signUpError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {signUpSuccessMessage && (
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
                    <span>{signUpSuccessMessage}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* College / Organization Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    College / Organization Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <Input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="name@kitsguntur.ac.in"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Role at Campus
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
                    >
                      <option value="Student">Student (Classroom & Lab Navigation)</option>
                      <option value="Faculty">Faculty (Department & Cabin Access)</option>
                      <option value="Staff">Staff (Operations & Maintenance)</option>
                      <option value="Campus Administrator">Campus Administrator (Map & Node Editing)</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <Input
                        type={signUpShowPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="pl-10 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <Input
                        type={signUpShowPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="pl-10 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <button
                    type="button"
                    onClick={() => setSignUpShowPassword(!signUpShowPassword)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {signUpShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{signUpShowPassword ? 'Hide passwords' : 'Show passwords'}</span>
                  </button>
                </div>

                {/* Terms and Conditions Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-tight">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span>
                      I agree to the <span className="font-semibold text-teal-600 dark:text-teal-400">Terms and Conditions</span> and{' '}
                      <span className="font-semibold text-teal-600 dark:text-teal-400">Privacy Policy</span> of KITS IndoorNav.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSignUpLoading}
                  className="w-full h-11 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 mt-2"
                >
                  {isSignUpLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating institutional profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer info note */}
        <p className="mt-4 text-center text-[11px] text-slate-500 dark:text-slate-500">
          Campus Wayfinding & Facilities Management System · Secure Session Storage
        </p>
      </div>

      {/* Forgot Password Dialog */}
      {isForgotOpen && (
        <div
          id="forgot-password-modal"
          onClick={() => setIsForgotOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your institutional email and we will dispatch a reset link.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
                <div className="text-xs font-bold text-teal-900 dark:text-teal-200">Reset instructions sent!</div>
                <p className="text-[11px] text-teal-700 dark:text-teal-300 leading-relaxed">
                  We've dispatched recovery steps to <strong>{forgotEmail}</strong>. Check your inbox.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsForgotOpen(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-2 text-xs"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Registered Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@kitsguntur.ac.in"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsForgotOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
