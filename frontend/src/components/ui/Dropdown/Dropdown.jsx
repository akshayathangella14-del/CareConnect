import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Dropdown.module.css';

export function Dropdown({ label, options = [], value, onChange, placeholder = 'Select an option', error, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.button} ${error ? styles.buttonError : ''}`} onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={18} className={isOpen ? styles.open : ''} />
      </button>
      {isOpen && (
        <div className={styles.menu} role="listbox">
          {options.length ? options.map((option) => (
            <button key={option.value} type="button" className={`${styles.option} ${option.value === value ? styles.selected : ''}`} onClick={() => { onChange(option.value); setIsOpen(false); }}>
              {option.label}
            </button>
          )) : <div className={styles.empty}>No options available</div>}
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
