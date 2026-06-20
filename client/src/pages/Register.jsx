import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length > 5) strength++;
  if (password.length > 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  const idx = Math.min(strength, 4);
  const colors = ['bg-error', 'bg-error', 'bg-secondary', 'bg-secondary-container', 'bg-secondary-container'];
  const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const widths = ['20%', '40%', '60%', '80%', '100%'];
  return { width: widths[idx], color: colors[idx], label: labels[idx] };
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const next = {};
    if (!username.trim() || username.trim().length < 3) next.username = 'Please enter your full name.';
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Please enter a valid email address.';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.';
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
      const { data } = await axiosInstance.post('/api/auth/register', {
        username: username.trim(),
        email: email.trim(),
        password,
      });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-primary font-body-md min-h-screen flex flex-col heritage-overlay">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-margin-mobile pt-24 pb-margin-desktop">
        <div className="w-full max-w-[480px] bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
              Create Your Account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join our community of premium property seekers.
            </p>
          </div>
          <form className="px-8 pb-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-primary" htmlFor="username">Full Name</label>
              <div className="relative">
                <input
                  id="username"
                  className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl px-4 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                  placeholder="Alex Rivers"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">person</span>
              </div>
              {errors.username && <p className="text-error font-label-md text-[12px]">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-primary" htmlFor="email">Email Address</label>
              <div className="relative">
                <input
                  id="email"
                  className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl px-4 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                  placeholder="alex@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
              </div>
              {errors.email && <p className="text-error font-label-md text-[12px]">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-primary" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl px-4 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                  placeholder="••••••••"
                  type={showPassword.password ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary" onClick={() => togglePassword('password')}>
                  <span className="material-symbols-outlined text-[20px]">{showPassword.password ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-3">
                <div className={`strength-bar h-full ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className="text-on-surface-variant font-label-md text-[12px]">Strength: {strength.label}</p>
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-primary" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  className="w-full border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl px-4 py-3 font-body-md placeholder:text-on-surface-variant/40 outline-none"
                  placeholder="••••••••"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary" onClick={() => togglePassword('confirm')}>
                  <span className="material-symbols-outlined text-[20px]">{showPassword.confirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-error font-label-md text-[12px]">{errors.confirmPassword}</p>}
            </div>
            {apiError && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/10 font-body-md text-sm">
                {apiError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <div className="pt-2 text-center">
              <p className="font-body-md text-label-md text-on-surface-variant">
                Already have an account?{' '}
                <Link className="text-secondary font-bold hover:underline" to="/login">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
