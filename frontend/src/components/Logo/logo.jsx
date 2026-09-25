import styles from './logo.module.css';
import { Sparkles, Home, Shield } from 'lucide-react';

/**
 * Animated Logo Component
 * Combines home services, trust (shield), and AI/magic (sparkles)
 */
export default function Logo({ size = 'md', animated = true, variant = 'default' }) {
  return (
    <div className={`${styles.logoContainer} ${styles[`size-${size}`]} ${variant === 'light' ? styles.light : ''}`}>
      <div className={`${styles.iconWrapper} ${animated ? styles.animated : ''}`}>
        <div className={styles.iconBackground}></div>
        <Home className={styles.homeIcon} />
        <Shield className={styles.shieldIcon} />
        <Sparkles className={styles.sparklesIcon} />
      </div>
      <div className={styles.textWrapper}>
        <span className={styles.textCare}>Care</span>
        <span className={styles.textConnect}>Connect</span>
      </div>
    </div>
  );
}
