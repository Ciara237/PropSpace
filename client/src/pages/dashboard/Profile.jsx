import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import useAuth from '../../hooks/useAuth';

const DEFAULT_AVATAR = 'https://placehold.co/100x100?text=Avatar';

function Notification({ type, message, onClose }) {
  const isSuccess = type === 'success';
  const className = isSuccess
    ? 'flex items-center gap-3 bg-deep-green/10 border-deep-green text-deep-green border p-4 rounded-lg shadow-sm'
    : 'flex items-center gap-3 bg-terracotta/10 border-terracotta text-terracotta border p-4 rounded-lg shadow-sm';

  return (
    <div className={className}>
      <span className="material-symbols-outlined">{isSuccess ? 'check_circle' : 'error'}</span>
      <p className="font-label-md text-label-md flex-1">{message}</p>
      <button type="button" onClick={onClose} className="opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, error, show, onToggle }) {
  return (
    <div className="space-y-2">
      <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          className="password-input w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md placeholder:text-on-surface-variant/40 outline-none transition-all"
          placeholder="••••••••"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          onClick={onToggle}
        >
          <span className="material-symbols-outlined text-[20px]">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
      {error && <p className="text-error font-label-md text-[12px]">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState({ username: '', phone: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const { data } = await axiosInstance.get('/api/users/me');
        if (!isMounted) return;

        const nextProfile = {
          username: data.username ?? '',
          phone: data.phone ?? '',
          avatar: data.avatar ?? '',
        };
        setProfile(nextProfile);
        updateUser(data);
      } catch (err) {
        if (!isMounted) return;

        setNotification({
          type: 'error',
          message: err.response?.data?.message || 'Failed to load profile. Please try again.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [updateUser]);

  const avatarPreview = profile.avatar || DEFAULT_AVATAR;

  const validateProfile = () => {
    const next = {};
    if (!profile.username.trim() || profile.username.trim().length < 3) {
      next.username = 'Username must be at least 3 characters';
    }
    return next;
  };

  const validatePassword = () => {
    const next = {};
    if (!passwordForm.oldPassword) next.oldPassword = 'Current password is required';
    if (!passwordForm.newPassword) next.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 6) next.newPassword = 'Password must be at least 6 characters';
    if (!passwordForm.confirmNewPassword) next.confirmNewPassword = 'Please confirm your new password';
    else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      next.confirmNewPassword = 'Passwords do not match';
    }
    return next;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setProfileErrors(validationErrors);
      return;
    }
    setProfileErrors({});
    setProfileSubmitting(true);
    try {
      const { data } = await axiosInstance.put('/api/users/me', {
        username: profile.username.trim(),
        phone: profile.phone.trim(),
        avatar: profile.avatar.trim(),
      });
      const nextProfile = {
        username: data.username ?? '',
        phone: data.phone ?? '',
        avatar: data.avatar ?? '',
      };
      setProfile(nextProfile);
      updateUser(data);
      setNotification({ type: 'success', message: 'Your profile settings have been successfully updated.' });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'An error occurred while updating your information. Please check your inputs.',
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    setPasswordErrors({});
    setPasswordSubmitting(true);
    try {
      await axiosInstance.put('/api/users/me/password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setNotification({ type: 'success', message: 'Your password has been successfully updated.' });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'An error occurred while updating your password. Please check your inputs.',
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <Navbar />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} userProfile={profile} />

      <main className="md:ml-64 pt-24 min-h-screen px-margin-mobile md:px-margin-desktop pb-32 max-w-5xl mx-auto w-full flex-grow">
        {notification && (
          <div className="mb-6">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-on-surface-variant">Loading profile...</p>
          </div>
        ) : (
          <>
            <header className="mb-10">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
                Profile Settings
              </h1>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
                Manage your personal information, contact details, and security credentials to ensure your PropSpace
                experience is seamless and secure.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
              <section className="lg:col-span-2 space-y-6">
                <div className="luxury-card p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="material-symbols-outlined text-secondary p-2 bg-secondary-container/20 rounded-lg">
                      person
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary">Personal Information</h2>
                  </div>

                  <form className="space-y-8" onSubmit={handleProfileSubmit}>
                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-outline-variant/30">
                      <div className="relative w-[120px] h-[120px] group">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface-container shadow-lg">
                          <img
                            className="w-full h-full object-cover"
                            src={avatarPreview}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_AVATAR;
                            }}
                            alt={profile.username || 'Avatar'}
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="font-headline-md text-[18px] text-primary">Profile Picture</h3>
                        <p className="text-body-md text-[14px] text-on-surface-variant mb-4">
                          Enter an avatar URL below to update your profile picture.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="username">
                          Username
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                            alternate_email
                          </span>
                          <input
                            id="username"
                            className="w-full pl-12 pr-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none transition-all"
                            placeholder="Enter username"
                            type="text"
                            value={profile.username}
                            onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                          />
                        </div>
                        {profileErrors.username && (
                          <p className="text-error font-label-md text-[12px]">{profileErrors.username}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="phone">
                          Phone Number
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                            call
                          </span>
                          <input
                            id="phone"
                            className="w-full pl-12 pr-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none transition-all"
                            placeholder="+237 6XX XXX XXX"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="avatar">
                          Avatar URL (External)
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                            link
                          </span>
                          <input
                            id="avatar"
                            className="w-full pl-12 pr-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none transition-all"
                            placeholder="https://image-service.com/your-avatar.jpg"
                            type="url"
                            value={profile.avatar}
                            onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={profileSubmitting}
                        className="bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 shadow-md flex items-center gap-2 disabled:opacity-70"
                      >
                        <span>{profileSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="space-y-6">
                <div className="luxury-card p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="material-symbols-outlined text-secondary p-2 bg-secondary-container/20 rounded-lg">
                      lock
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary">Security</h2>
                  </div>

                  <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                    <PasswordField
                      id="oldPassword"
                      label="Current Password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
                      error={passwordErrors.oldPassword}
                      show={showPassword.old}
                      onToggle={() => setShowPassword((s) => ({ ...s, old: !s.old }))}
                    />
                    <PasswordField
                      id="newPassword"
                      label="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      error={passwordErrors.newPassword}
                      show={showPassword.new}
                      onToggle={() => setShowPassword((s) => ({ ...s, new: !s.new }))}
                    />
                    <PasswordField
                      id="confirmNewPassword"
                      label="Confirm New Password"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                      error={passwordErrors.confirmNewPassword}
                      show={showPassword.confirm}
                      onToggle={() => setShowPassword((s) => ({ ...s, confirm: !s.confirm }))}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={passwordSubmitting}
                        className="w-full border-2 border-primary text-primary font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:bg-primary hover:text-on-primary active:scale-95 transition-all disabled:opacity-70"
                      >
                        {passwordSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>

                    <div className="p-4 bg-surface-container-low rounded border border-outline-variant/10">
                      <h5 className="font-label-md text-label-md text-primary mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        Password Requirements
                      </h5>
                      <ul className="space-y-1 text-body-md text-[12px] text-on-surface-variant">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          At least 6 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          One uppercase letter recommended
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          One number or special character recommended
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer className="md:ml-64 md:w-[calc(100%-16rem)]" />

      <button
        type="button"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-transform"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>
    </div>
  );
}
