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
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, width: 320 });

  const updatePopupPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const height = Math.min(380, window.innerHeight - 24);
    const width = Math.min(320, window.innerWidth - 24);
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
      <button type="button" className={`${styles.input} ${error ? styles.inputError : ''}`} onClick={toggleOpen} aria-expanded={isOpen}>
        <span>{selectedDate && !Number.isNaN(selectedDate.getTime()) ? selectedDate.toLocaleDateString() : 'Select date'}</span>
        <Calendar size={18} className={styles.icon} />
      </button>
      {isOpen && (
        <div 
          ref={calendarRef}
          className={styles.calendar}
          style={{ top: popupPosition.top, left: popupPosition.left, width: popupPosition.width }}
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
