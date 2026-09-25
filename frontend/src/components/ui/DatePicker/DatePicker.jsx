import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.css';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function DatePicker({ label, value, onChange, error, required = false, min }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate || new Date());

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const minimumDate = min ? new Date(`${min}T00:00:00`) : null;

  const handleDateClick = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minimumDate && selected < minimumDate) return;
    const nextValue = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span>{selectedDate && !Number.isNaN(selectedDate.getTime()) ? selectedDate.toLocaleDateString() : 'Select date'}</span>
        <Calendar size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div className={styles.calendar} role="dialog" aria-label={label || 'Choose date'}>
          <div className={styles.header}>
            <button type="button" className={styles.navButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={16} /></button>
            <strong>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</strong>
            <button type="button" className={styles.navButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={16} /></button>
          </div>
          <div className={styles.days}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day} className={styles.dayName}>{day}</span>)}
            {Array.from({ length: firstDay }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const disabled = minimumDate && date < minimumDate;
              const selected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return <button key={day} type="button" disabled={disabled} className={`${styles.day} ${selected ? styles.selected : ''}`} onClick={() => handleDateClick(day)}>{day}</button>;
            })}
          </div>
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
