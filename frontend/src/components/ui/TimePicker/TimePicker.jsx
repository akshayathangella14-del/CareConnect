import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import styles from './TimePicker.module.css';

const toDisplay = (value) => {
  const [rawHours = '12', rawMinutes = '00'] = (value || '').split(':');
  const numericHours = Number(rawHours) || 0;
  return {
    hours: numericHours % 12 || 12,
    minutes: rawMinutes.padStart(2, '0'),
    period: numericHours >= 12 ? 'PM' : 'AM',
  };
};

export function TimePicker({ label, value, onChange, error, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const display = toDisplay(value);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const updateTime = (hours, minutes, period) => {
    let actualHours = Number(hours) % 12;
    if (period === 'PM') actualHours += 12;
    onChange(`${String(actualHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const adjustHours = (delta) => updateTime((display.hours - 1 + delta + 12) % 12 + 1, display.minutes, display.period);
  const adjustMinutes = (delta) => updateTime(display.hours, (Number(display.minutes) + delta + 60) % 60, display.period);
  const togglePeriod = () => updateTime(display.hours, display.minutes, display.period === 'AM' ? 'PM' : 'AM');

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span>{value ? `${display.hours}:${display.minutes} ${display.period}` : 'Select time'}</span>
        <Clock size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label={label || 'Choose time'}>
          <div className={styles.controls}>
            <div className={styles.unit}><button type="button" onClick={() => adjustHours(1)}>+</button><strong>{display.hours}</strong><button type="button" onClick={() => adjustHours(-1)}>-</button></div>
            <strong>:</strong>
            <div className={styles.unit}><button type="button" onClick={() => adjustMinutes(5)}>+</button><strong>{display.minutes}</strong><button type="button" onClick={() => adjustMinutes(-5)}>-</button></div>
            <button type="button" className={styles.period} onClick={togglePeriod}>{display.period}</button>
          </div>
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
