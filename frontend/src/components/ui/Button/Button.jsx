import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

/**
 * Button — Primary CTA component for CareConnect.
 *
 * @param {'primary'|'secondary'|'ghost'|'destructive'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading — Shows spinner, disables interaction
 * @param {boolean} fullWidth — Stretches to fill container
 * @param {React.ReactNode} icon — Icon before label (backward compatible)
 * @param {React.ReactNode} leftIcon — Icon before label
 * @param {React.ReactNode} rightIcon — Icon after label
 * @param {boolean} iconOnly — For icon-only buttons (provide aria-label)
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    icon, // For backward compatibility - maps to leftIcon
    children,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  // Handle backward compatibility for icon prop
  const actualLeftIcon = icon || leftIcon;
  
  const classNames = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    loading ? styles['btn--loading'] : '',
    fullWidth ? styles['btn--full-width'] : '',
    iconOnly ? styles['btn--icon-only'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles.btn__spinner} aria-hidden="true">
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="spin-animation" />
        </span>
      )}
      <span className={styles.btn__content}>
        {actualLeftIcon && <span className={styles.btn__icon} aria-hidden="true">{actualLeftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.btn__icon} aria-hidden="true">{rightIcon}</span>}
      </span>
    </button>
  );
});

export default Button;
