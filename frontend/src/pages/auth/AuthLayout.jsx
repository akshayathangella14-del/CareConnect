import { Wrench, Shield, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import styles from './Auth.module.css';

/**
 * AuthLayout — Shared layout for Login and Register pages.
 * Desktop: Deep Indigo branded panel with core product pillars.
 * Right: Clean, centered, accessible form container.
 */
function AuthLayout({ children }) {
  return (
    <div className={styles.auth}>
      {/* Brand Panel — visible on desktop */}
      <div className={styles.auth__brand}>
        <div className={styles['auth__brand-content']}>
          <div className={styles['auth__brand-logo']}>
            <span className={styles['auth__brand-logo-icon']}>
              <Wrench size={22} />
            </span>
            <span className={styles['auth__brand-logo-text']}>CareConnect</span>
          </div>

          <div className={styles['auth__brand-badge']}>
            <Sparkles size={13} />
            AI-Powered Operations
          </div>

          <h1 className={styles['auth__brand-heading']}>
            Home services made <span>smart & simple</span>
          </h1>
          <p className={styles['auth__brand-desc']}>
            From minor fixes to major renovations — experience intelligent matching,
            transparent quotes, and verified professionals for every home need.
          </p>

          <div className={styles['auth__brand-features']}>
            <div className={styles['auth__brand-feature']}>
              <span className={styles['auth__brand-feature-icon']}>
                <Sparkles size={16} />
              </span>
              <div>
                <strong>Intelligent Request Understanding</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>AI identifies category, skills, and urgency instantly</div>
              </div>
            </div>
            <div className={styles['auth__brand-feature']}>
              <span className={styles['auth__brand-feature-icon']}>
                <Shield size={16} />
              </span>
              <div>
                <strong>Vetted & Verified Professionals</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Strict identity verification and skill checks</div>
              </div>
            </div>
            <div className={styles['auth__brand-feature']}>
              <span className={styles['auth__brand-feature-icon']}>
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>Transparent Pricing & ScopeGuard</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>No hidden fees, tracked progress, guaranteed work</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['auth__brand-footer']}>
          CareConnect Platform &copy; {new Date().getFullYear()} &bull; Professional Home Operations
        </div>
      </div>

      {/* Form Panel */}
      <div className={styles['auth__form-panel']}>
        <div className={styles['auth__form-container']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
