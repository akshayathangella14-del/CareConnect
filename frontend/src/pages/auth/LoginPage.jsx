import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';
import LoginForm from '@/components/auth/LoginForm';

function LoginPage() {
  return (
    <AuthLayout>
      <div className={styles['auth__form-header']}>
        <h2 className={styles['auth__form-title']}>Welcome back</h2>
        <p className={styles['auth__form-subtitle']}>
          Sign in to manage bookings, quotes, and verified home services.
        </p>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
