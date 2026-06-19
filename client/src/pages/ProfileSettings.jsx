import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Center,
  Field,
  Heading,
  Input,
  Loader,
  Text,
  VStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';

export default function ProfileSettings() {
  const [profile, setProfile] = useState({ username: '', phone: '', avatar: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError('');

    try {
      const { data } = await axiosInstance.get('/api/users/me');
      setProfile({
        username: data.username ?? '',
        phone: data.phone ?? '',
        avatar: data.avatar ?? '',
      });
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to load profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfileField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    setProfileSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profile.username.trim()) {
      setProfileError('Username is required');
      return;
    }

    setProfileSubmitting(true);

    try {
      const { data } = await axiosInstance.put('/api/users/me', {
        username: profile.username.trim(),
        phone: profile.phone.trim(),
        avatar: profile.avatar.trim(),
      });
      setProfile({
        username: data.username ?? '',
        phone: data.phone ?? '',
        avatar: data.avatar ?? '',
      });
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const updatePasswordField = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    setPasswordSuccess('');
    setPasswordErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.oldPassword) errors.oldPassword = 'Old password is required';
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
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
      setPasswordSuccess('Password updated successfully');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <Center py={16}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <VStack gap={8} align="stretch">
      <Heading size="lg">Profile Settings</Heading>

      <Card.Root>
        <Card.Body>
          <VStack gap={4} align="stretch" as="form" onSubmit={handleProfileSubmit}>
            <Heading size="md">Update profile</Heading>

            {profileError && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Description>{profileError}</Alert.Description>
              </Alert.Root>
            )}

            {profileSuccess && (
              <Alert.Root status="success">
                <Alert.Indicator />
                <Alert.Description>{profileSuccess}</Alert.Description>
              </Alert.Root>
            )}

            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input value={profile.username} onChange={updateProfileField('username')} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Phone</Field.Label>
              <Input value={profile.phone} onChange={updateProfileField('phone')} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Avatar URL</Field.Label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={profile.avatar}
                onChange={updateProfileField('avatar')}
              />
            </Field.Root>

            <Button type="submit" loading={profileSubmitting} colorPalette="blue" width="fit-content">
              Save profile
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <VStack gap={4} align="stretch" as="form" onSubmit={handlePasswordSubmit}>
            <Heading size="md">Change password</Heading>

            {passwordError && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Description>{passwordError}</Alert.Description>
              </Alert.Root>
            )}

            {passwordSuccess && (
              <Alert.Root status="success">
                <Alert.Indicator />
                <Alert.Description>{passwordSuccess}</Alert.Description>
              </Alert.Root>
            )}

            <Field.Root invalid={!!passwordErrors.oldPassword}>
              <Field.Label>Old password</Field.Label>
              <Input
                type="password"
                value={passwordForm.oldPassword}
                onChange={updatePasswordField('oldPassword')}
              />
              {passwordErrors.oldPassword && (
                <Field.ErrorText>{passwordErrors.oldPassword}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!passwordErrors.newPassword}>
              <Field.Label>New password</Field.Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={updatePasswordField('newPassword')}
              />
              {passwordErrors.newPassword && (
                <Field.ErrorText>{passwordErrors.newPassword}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!passwordErrors.confirmNewPassword}>
              <Field.Label>Confirm new password</Field.Label>
              <Input
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={updatePasswordField('confirmNewPassword')}
              />
              {passwordErrors.confirmNewPassword && (
                <Field.ErrorText>{passwordErrors.confirmNewPassword}</Field.ErrorText>
              )}
            </Field.Root>

            <Button type="submit" loading={passwordSubmitting} colorPalette="blue" width="fit-content">
              Update password
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}
