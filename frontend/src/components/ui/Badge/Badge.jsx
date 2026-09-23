import styles from './Badge.module.css';

/**
 * Badge — Semantic status indicator for CareConnect.
 *
 * @param {'primary'|'success'|'warning'|'error'|'info'|'neutral'} variant
 * @param {boolean} dot — Show small dot indicator before text
 */
function Badge({
  variant = 'neutral',
  dot = false,
  children,
  className = '',
  ...props
}) {
  return (
    <span
      className={`${styles.badge} ${styles[`badge--${variant}`]} ${className}`}
      {...props}
    >
      {dot && <span className={styles.badge__dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;
