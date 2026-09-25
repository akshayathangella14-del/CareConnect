import styles from './logo.module.css';

/**
 * Animated Logo Component
 * Combines home services, trust (shield), and AI/magic (sparkles)
 */
export default function Logo({ size = 'md', animated = true, variant = 'default' }) {
  return (
    <div className={`${styles.logoContainer} ${styles[`size-${size}`]} ${variant === 'light' ? styles.light : ''}`}>
      <div className={`${styles.iconWrapper} ${animated ? styles.animated : ''}`}>
        <img src="/favicon.svg" alt="" className={styles.logoMark} />
      </div>
      <div className={styles.textWrapper}>
        <span className={styles.textCare}>Care</span>
        <span className={styles.textConnect}>Connect</span>
      </div>
    </div>
  );
}
