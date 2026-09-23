import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Wrench, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components';
import { apiSlice } from '@/api/apiSlice';
import {
  useLoginMutation,
  setCredentials,
  extractAuthSession,
  getAuthErrorMessage,
} from '@/features/auth';
import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';

/**
 * LoginPage — CareConnect authentication entry point.
 *
 * Uses backend: POST /api/v1/auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }).unwrap();

      const { token, user } = extractAuthSession(result);

      if (!token || !user) {
        setApiError('Login succeeded but the server response was incomplete.');
        return;
      }

      dispatch(apiSlice.util.resetApiState());
      dispatch(setCredentials({ token, user }));
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(getAuthErrorMessage(err, 'Login failed. Please check your credentials.'));
    }
  };

  return (
    <AuthLayout>
      {/* Mobile Logo */}
      <div className={styles['auth__form-mobile-logo']}>
        <span className={styles['auth__form-mobile-logo-icon']}>
          <Wrench size={20} />
        </span>
        <span className={styles['auth__form-mobile-logo-text']}>CareConnect</span>
      </div>

      <div className={styles['auth__form-header']}>
        <h2 className={styles['auth__form-title']}>Welcome back</h2>
        <p className={styles['auth__form-subtitle']}>
          Sign in to your CareConnect account to manage your services
        </p>
      </div>

      <form className={styles.auth__form} onSubmit={handleSubmit} noValidate>
        {apiError && (
          <div className={styles['auth__api-error']} role="alert">
            <AlertCircle size={18} className={styles['auth__api-error-icon']} />
            <span>{apiError}</span>
          </div>
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          rightIcon={!isLoading && <ArrowRight size={18} />}
        >
          Sign In
        </Button>
      </form>

      <div className={styles['auth__form-footer']}>
        Don&apos;t have an account yet?{' '}
        <Link to="/register">Create an account</Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
