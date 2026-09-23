import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import styles from './Alert.module.css';

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

/**
 * Alert — Semantic notification banner for CareConnect.
 *
 * @param {'info'|'success'|'warning'|'error'} variant
 * @param {string} title — Optional bold title
 * @param {boolean} dismissible — Show dismiss button
 * @param {function} onDismiss — Called when dismiss clicked
 */
function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) {
  const IconComponent = iconMap[variant];

  return (
    <div
      className={`${styles.alert} ${styles[`alert--${variant}`]} ${className}`}
      role="alert"
      {...props}
    >
      <span className={styles.alert__icon} aria-hidden="true">
        <IconComponent size={18} />
      </span>
      <div className={styles.alert__content}>
        {title && <span className={styles.alert__title}>{title}</span>}
        {children && <span className={styles.alert__description}>{children}</span>}
      </div>
      {dismissible && onDismiss && (
        <button
          className={styles.alert__dismiss}
          onClick={onDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
