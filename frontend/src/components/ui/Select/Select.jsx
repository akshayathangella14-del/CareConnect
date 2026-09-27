import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Select.module.css';

/**
 * Select — Custom styled select component (non-native dropdown).
 * Same API as before: options, value, onChange, label, error, helperText, placeholder.
 *
 * `options` should be an array of { value, label } objects.
 * `onChange` receives a synthetic-like event with `e.target.value`.
 */
export const Select = forwardRef(
  ({ label, error, helperText, className = '', id, options = [], placeholder, value, onChange, disabled, required, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const generatedId = id || `sel-${Math.random().toString(36).substr(2, 9)}`;
    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen]);

    const handleSelect = (optionValue) => {
      // Mimic native onChange: pass a synthetic event with target.value
      if (onChange) {
        onChange({ target: { value: optionValue, name: props.name || '' } });
      }
      setIsOpen(false);
    };

    return (
      <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
        {label && (
          <label htmlFor={generatedId} className={styles.label}>
            {label}{required && <span style={{ color: 'var(--color-error)' }}> *</span>}
          </label>
        )}
        <div className={styles.inputContainer}>
          <button
            type="button"
            ref={ref}
            id={generatedId}
            className={`${styles.select} ${error ? styles['select--error'] : ''} ${disabled ? styles['select--disabled'] : ''}`}
            onClick={() => !disabled && setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={!!error}
            aria-describedby={
              error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined
            }
            disabled={disabled}
          >
            <span className={selectedOption ? styles.selectValueChosen : styles.selectValuePlaceholder}>
              {selectedOption ? selectedOption.label : (placeholder || 'Select an option')}
            </span>
            <ChevronDown
              size={18}
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {isOpen && (
            <div className={styles.menu} role="listbox">
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={String(option.value) === String(value)}
                    className={`${styles.menuItem} ${String(option.value) === String(value) ? styles.menuItemSelected : ''}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    {String(option.value) === String(value) && <Check size={14} />}
                  </button>
                ))
              ) : (
                <div className={styles.menuEmpty}>No options available</div>
              )}
            </div>
          )}
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
