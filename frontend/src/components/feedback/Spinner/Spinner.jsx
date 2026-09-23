import { Loader2 } from 'lucide-react';
import styles from './Spinner.module.css';

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
};

/**
 * Spinner — Loading indicator for CareConnect.
 *
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {string} label — Accessible label and optional visible text
 * @param {boolean} showLabel — Show label text below spinner
 */
function Spinner({
  size = 'md',
  label = 'Loading...',
  showLabel = false,
  className = '',
  ...props
}) {
  if (showLabel) {
    return (
      <div className={styles['spinner-container']} role="status" {...props}>
        <span className={`${styles.spinner} ${styles[`spinner--${size}`]} ${className}`}>
          <Loader2 size={sizeMap[size]} />
        </span>
        <span className={styles['spinner-label']}>{label}</span>
      </div>
    );
  }

  return (
    <span
      className={`${styles.spinner} ${styles[`spinner--${size}`]} ${className}`}
      role="status"
      aria-label={label}
      {...props}
    >
      <Loader2 size={sizeMap[size]} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
