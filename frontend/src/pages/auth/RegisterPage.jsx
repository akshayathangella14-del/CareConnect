import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, AlertCircle, User, Briefcase, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components';
import { apiSlice } from '@/api/apiSlice';
import {
  useRegisterMutation,
  setCredentials,
  extractAuthSession,
  flattenFieldErrors,
  getAuthErrorMessage,
} from '@/features/auth';
import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';

/**
 * RegisterPage — CareConnect user registration.
 *
 * Uses backend: POST /api/v1/auth/register
 * Body: { name, email, password, phone?, role }
 * Public roles: CUSTOMER, SERVICE_PROVIDER
 */
function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const selectRole = (role) => {
    setForm((prev) => ({ ...prev, role }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      newErrors.password = 'Password must contain at least one letter and one number.';
    }
    if (form.phone && form.phone.length > 30) {
      newErrors.phone = 'Phone must be 30 characters or fewer.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const body = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };
      if (form.phone.trim()) {
        body.phone = form.phone.trim();
      }

      const result = await register(body).unwrap();

      const { token, user } = extractAuthSession(result);

      if (!token || !user) {
        setApiError('Registration succeeded but the server response was incomplete.');
        return;
      }

      dispatch(apiSlice.util.resetApiState());
      dispatch(setCredentials({ token, user }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const details = flattenFieldErrors(
        err?.data?.error?.details || err?.data?.details || err?.data?.errors
      );
      if (Object.keys(details).length > 0) {
        setErrors((prev) => ({ ...prev, ...details }));
      }
      setApiError(getAuthErrorMessage(err, 'Registration failed. Please verify your information.'));
    }
  };

  return (
    <AuthLayout>
      <div className={styles['auth__form-header']}>
        <h2 className={styles['auth__form-title']}>Create your account</h2>
        <p className={styles['auth__form-subtitle']}>
          Join the trusted marketplace for home services and repairs
        </p>
      </div>

      <form className={styles.auth__form} onSubmit={handleSubmit} noValidate>
        {apiError && (
          <div className={styles['auth__api-error']} role="alert">
            <AlertCircle size={18} className={styles['auth__api-error-icon']} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-small)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--letter-spacing-wide)',
              marginBottom: 'var(--space-2)',
            }}
          >
            I want to
          </label>
          <div className={styles['auth__role-selector']}>
            <button
              type="button"
              className={`${styles['auth__role-option']} ${form.role === 'CUSTOMER' ? styles['auth__role-option--selected'] : ''}`}
              onClick={() => selectRole('CUSTOMER')}
              aria-pressed={form.role === 'CUSTOMER'}
            >
              <span className={styles['auth__role-option-icon']}>
                <User size={20} />
              </span>
              <div className={styles['auth__role-option-text']}>
                <span className={styles['auth__role-option-label']}>Book Services</span>
                <span className={styles['auth__role-option-desc']}>Homeowner / Tenant</span>
              </div>
            </button>
            <button
              type="button"
              className={`${styles['auth__role-option']} ${form.role === 'SERVICE_PROVIDER' ? styles['auth__role-option--selected'] : ''}`}
              onClick={() => selectRole('SERVICE_PROVIDER')}
              aria-pressed={form.role === 'SERVICE_PROVIDER'}
            >
              <span className={styles['auth__role-option-icon']}>
                <Briefcase size={20} />
              </span>
              <div className={styles['auth__role-option-text']}>
                <span className={styles['auth__role-option-label']}>Offer Services</span>
                <span className={styles['auth__role-option-desc']}>Professional Provider</span>
              </div>
            </button>
          </div>
        </div>

        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Alex Morgan"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          required
        />

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
          id="register-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters, letter + number"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
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

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          helperText="Optional — for appointment updates"
          autoComplete="tel"
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
          Create Account
        </Button>
      </form>

      <div className={styles['auth__form-footer']}>
        Already have an account?{' '}
        <Link to="/login">Sign in here</Link>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
