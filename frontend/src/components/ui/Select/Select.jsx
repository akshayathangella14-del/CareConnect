import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

/**
 * Select — Custom styled select component.
 */
export const Select = forwardRef(
  ({ label, error, helperText, className = '', id, options = [], placeholder, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={generatedId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          <select
            ref={ref}
            id={generatedId}
            className={`${styles.select} ${error ? styles['select--error'] : ''}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.length > 0 ? (
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No options available
              </option>
            )}
          </select>
          <div className={styles.iconWrapper} aria-hidden="true">
            <ChevronDown size={18} />
          </div>
        </div>

        {error && (
          <span id={`${generatedId}-error`} className={styles.error}>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${generatedId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
