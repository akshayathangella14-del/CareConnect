import { forwardRef } from 'react';
import styles from './Textarea.module.css';

/**
 * Textarea — Multi-line text input for CareConnect forms.
 *
 * @param {string} label — Visible label text
 * @param {string} error — Error message (triggers error state)
 * @param {string} helperText — Assistive hint text
 * @param {boolean} required — Marks field as required
 * @param {number} maxLength — Character limit (shows counter)
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    required = false,
    maxLength,
    value,
    id,
    className = '',
    disabled = false,
    readOnly = false,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const fieldClassNames = [
    styles['textarea-field'],
    error ? styles['textarea-field--error'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles['textarea-wrapper']} ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`${styles['textarea-label']} ${required ? styles['textarea-label--required'] : ''}`}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={fieldClassNames}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        required={required}
        {...props}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {error && (
            <span id={`${textareaId}-error`} className={styles['textarea-error-message']} role="alert">
              {error}
            </span>
          )}
          {!error && helperText && (
            <span id={`${textareaId}-helper`} className={styles['textarea-helper']}>
              {helperText}
            </span>
          )}
        </div>
        {maxLength && value !== undefined && (
          <span className={styles['textarea-char-count']}>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

export default Textarea;
