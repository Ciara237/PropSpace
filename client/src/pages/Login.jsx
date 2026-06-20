import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/auth/login', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'The email or password you entered is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md">
      <Navbar />
      <main className="relative z-10 w-full max-w-[440px] mx-auto flex-grow flex flex-col justify-center px-margin-mobile pt-24 pb-margin-desktop">
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2 font-bold">
            Welcome Back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your listings</p>
        </div>
        <section className="login-card bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl px-4 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                placeholder="alex.rivers@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-error font-label-md text-[12px]">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <span className="font-label-md text-[12px] text-secondary font-semibold">Forgot Password?</span>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl pl-4 pr-12 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="text-error font-label-md text-[12px]">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            {apiError && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3 border border-error/10">
                <span className="material-symbols-outlined text-error">error</span>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md">Invalid credentials</p>
                  <p className="font-body-md text-[14px] opacity-80">{apiError}</p>
                </div>
              </div>
            )}
          </form>
          <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link className="font-label-md text-label-md text-primary hover:text-secondary transition-colors ml-1 font-bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
