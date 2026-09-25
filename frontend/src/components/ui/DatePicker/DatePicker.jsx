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
  const calendarRef = useRef(null);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate || new Date());
  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current && calendarRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const calendarHeight = calendarRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      
      if (spaceBelow < calendarHeight + 20 && spaceAbove > calendarHeight + 20) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

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

  const goToToday = () => setCurrentMonth(new Date());
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate()
      && currentMonth.getMonth() === today.getMonth()
      && currentMonth.getFullYear() === today.getFullYear();
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span>{selectedDate && !Number.isNaN(selectedDate.getTime()) ? selectedDate.toLocaleDateString() : 'Select date'}</span>
        <Calendar size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div 
          ref={calendarRef}
          className={`${styles.calendar} ${styles[`calendar--${position}`]}`} 
          role="dialog" 
          aria-label={label || 'Choose date'}
        >
          <div className={styles.header}>
            <button type="button" className={styles.navButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={16} /></button>
            <div className={styles.monthYear}>
              <button type="button" className={styles.yearButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))} aria-label="Previous year"><ChevronLeft size={14} /></button>
              <strong>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</strong>
              <button type="button" className={styles.yearButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))} aria-label="Next year"><ChevronRight size={14} /></button>
            </div>
            <button type="button" className={styles.navButton} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={16} /></button>
          </div>
          <div className={styles.daysHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day} className={styles.dayName}>{day}</span>)}
          </div>
          <div className={styles.days}>
            {Array.from({ length: firstDay }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const disabled = minimumDate && date < minimumDate;
              const selected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return <button key={day} type="button" disabled={disabled} className={`${styles.day} ${selected ? styles.selected : ''} ${isToday(day) ? styles.today : ''}`} onClick={() => handleDateClick(day)}>{day}</button>;
            })}
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.todayButton} onClick={goToToday}>Today</button>
          </div>
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
