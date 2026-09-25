import { Logo } from '@/components';
import styles from './Auth.module.css';

function AuthLayout({ children }) {
  return (
    <div className={styles.auth}>
      <div className={styles['auth__form-panel']}>
        <div className={styles['auth__form-container']}>
          <div className={styles['auth__form-mobile-logo']}>
            <Logo size="sm" animated />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
