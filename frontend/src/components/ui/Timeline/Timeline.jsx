import styles from './Timeline.module.css';

/**
 * Timeline Component
 * For displaying sequential events (e.g., ServiceTrace)
 */
export function Timeline({ events, className = '' }) {
  if (!events || events.length === 0) return null;

  return (
    <div className={`${styles.timeline} ${className}`}>
      {events.map((event, index) => (
        <div key={event.id || index} className={styles.item}>
          <div className={styles.indicator}>
            <div className={`${styles.dot} ${event.isActive ? styles['dot--active'] : ''}`} />
            {index !== events.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <h4 className={styles.title}>{event.title}</h4>
              {event.time && <span className={styles.time}>{event.time}</span>}
            </div>
            {event.description && <p className={styles.description}>{event.description}</p>}
            {event.children && <div className={styles.children}>{event.children}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
