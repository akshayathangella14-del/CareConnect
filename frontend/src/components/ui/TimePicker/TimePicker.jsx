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
  const popoverRef = useRef(null);
  const display = toDisplay(value);
  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current && popoverRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const popoverHeight = popoverRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      
      if (spaceBelow < popoverHeight + 20 && spaceAbove > popoverHeight + 20) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

  const updateTime = (hours, minutes, period) => {
    let actualHours = Number(hours) % 12;
    if (period === 'PM') actualHours += 12;
    onChange(`${String(actualHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const handleHoursChange = (e) => {
    updateTime(e.target.value, display.minutes, display.period);
  };

  const handleMinutesChange = (e) => {
    updateTime(display.hours, e.target.value, display.period);
  };

  const handlePeriodChange = (period) => {
    updateTime(display.hours, display.minutes, period);
  };

  const hoursOptions = Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
  const minutesOptions = Array.from({ length: 12 }, (_, index) => ({ value: String(index * 5).padStart(2, '0'), label: String(index * 5).padStart(2, '0') }));

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span>{value ? `${display.hours}:${display.minutes} ${display.period}` : 'Select time'}</span>
        <Clock size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div 
          ref={popoverRef}
          className={`${styles.popover} ${styles[`popover--${position}`]}`} 
          role="dialog" 
          aria-label={label || 'Choose time'}
        >
          <div className={styles.controls}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Hour</label>
              <select
                className={styles.select}
                value={display.hours.toString()}
                onChange={handleHoursChange}
              >
                {hoursOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Minute</label>
              <select
                className={styles.select}
                value={display.minutes}
                onChange={handleMinutesChange}
              >
                {minutesOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.periodGroup}>
              <button
                type="button"
                className={`${styles.periodButton} ${display.period === 'AM' ? styles.periodActive : ''}`}
                onClick={() => handlePeriodChange('AM')}
              >
                AM
              </button>
              <button
                type="button"
                className={`${styles.periodButton} ${display.period === 'PM' ? styles.periodActive : ''}`}
                onClick={() => handlePeriodChange('PM')}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
