import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Container,
  Field,
  Heading,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
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
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Card.Root>
        <Card.Body>
          <VStack gap={6} align="stretch">
            <Heading size="lg">Log in</Heading>

            {apiError && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Description>{apiError}</Alert.Description>
              </Alert.Root>
            )}

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Field.Root invalid={!!errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">
                  Log in
                </Button>
              </VStack>
            </form>

            <Text>
              Don&apos;t have an account?{' '}
              <Link asChild colorPalette="blue">
                <RouterLink to="/register">Register</RouterLink>
              </Link>
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
