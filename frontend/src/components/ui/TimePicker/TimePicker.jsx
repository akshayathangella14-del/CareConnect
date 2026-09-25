import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { Dropdown } from '../Dropdown/Dropdown';
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
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, width: 320 });

  const updatePopupPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const height = 230;
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    const top = window.innerHeight - rect.bottom < height + 12 && rect.top > height + 12
      ? rect.top - height - 8
      : Math.min(rect.bottom + 8, window.innerHeight - height - 12);
    setPopupPosition({ top: Math.max(12, top), left, width });
  };

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    updatePopupPosition();
    window.addEventListener('resize', updatePopupPosition);
    window.addEventListener('scroll', updatePopupPosition, true);
    return () => {
      window.removeEventListener('resize', updatePopupPosition);
      window.removeEventListener('scroll', updatePopupPosition, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) updatePopupPosition();
    setIsOpen((open) => !open);
  };

  const updateTime = (hours, minutes, period) => {
    let actualHours = Number(hours) % 12;
    if (period === 'PM') actualHours += 12;
    onChange(`${String(actualHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const hoursOptions = Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
  const minutesOptions = Array.from({ length: 12 }, (_, index) => ({ value: String(index * 5).padStart(2, '0'), label: String(index * 5).padStart(2, '0') }));

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={toggleOpen} aria-expanded={isOpen}>
        <span>{value ? `${display.hours}:${display.minutes} ${display.period}` : 'Select time'}</span>
        <Clock size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div 
          ref={popoverRef}
          className={styles.popover}
          style={{ top: popupPosition.top, left: popupPosition.left, width: popupPosition.width }}
          role="dialog" 
          aria-label={label || 'Choose time'}
        >
          <div className={styles.controls}>
            <Dropdown label="Hour" options={hoursOptions} value={String(display.hours)} onChange={(hours) => updateTime(hours, display.minutes, display.period)} />
            <div className={styles.separator}>:</div>
            <Dropdown label="Minute" options={minutesOptions} value={display.minutes} onChange={(minutes) => updateTime(display.hours, minutes, display.period)} />
            <div className={styles.periodGroup}>
              <button
                type="button"
                className={`${styles.periodButton} ${display.period === 'AM' ? styles.periodActive : ''}`}
                onClick={() => updateTime(display.hours, display.minutes, 'AM')}
              >
                AM
              </button>
              <button
                type="button"
                className={`${styles.periodButton} ${display.period === 'PM' ? styles.periodActive : ''}`}
                onClick={() => updateTime(display.hours, display.minutes, 'PM')}
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
