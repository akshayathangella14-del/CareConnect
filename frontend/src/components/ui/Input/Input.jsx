import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Input — Text input field for CareConnect forms.
 *
 * @param {string} label — Visible label text
 * @param {string} error — Error message (triggers error state)
 * @param {string} helperText — Assistive hint text
 * @param {boolean} required — Marks field as required
 * @param {React.ReactNode} leftIcon — Icon inside left of input
 * @param {React.ReactNode} rightIcon — Icon inside right of input
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    required = false,
    leftIcon,
    rightIcon,
    rightAction,
    id,
    className = '',
    disabled = false,
    readOnly = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const inputClassNames = [
    styles['input-field'],
    error ? styles['input-field--error'] : '',
    leftIcon ? styles['input-field--has-left-icon'] : '',
    rightIcon ? styles['input-field--has-right-icon'] : '',
    rightAction ? styles['input-field--has-right-icon'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles['input-wrapper']} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`${styles['input-label']} ${required ? styles['input-label--required'] : ''}`}
        >
          {label}
        </label>
      )}
      <div className={styles['input-container']}>
        {leftIcon && (
          <span className={`${styles['input-icon']} ${styles['input-icon--left']}`} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClassNames}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          required={required}
          {...props}
        />
        {rightIcon && (
          <span className={`${styles['input-icon']} ${styles['input-icon--right']}`} aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {rightAction && (
          <span className={`${styles['input-icon']} ${styles['input-icon--right']} ${styles['input-icon--action']}`}>
            {rightAction}
          </span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles['input-error-message']} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className={styles['input-helper']}>
          {helperText}
        </span>
      )}
    </div>
  );
});

export default Input;
