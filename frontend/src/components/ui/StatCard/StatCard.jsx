import { Card } from '@/components/ui/Card';
import styles from './StatCard.module.css';

/**
 * StatCard Component
 * Displays a single metric or statistic with an optional icon and trend.
 */
export function StatCard({ title, value, icon: Icon, trend, trendLabel, variant = 'default', className = '' }) {
  return (
    <Card variant="default" className={`${styles.statCard} ${styles[`statCard--${variant}`]} ${className}`}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.value}>{value}</div>
          
          {(trend || trendLabel) && (
            <div className={styles.trendContainer}>
              {trend && (
                <span className={`${styles.trend} ${trend > 0 ? styles['trend--up'] : trend < 0 ? styles['trend--down'] : styles['trend--neutral']}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
              {trendLabel && <span className={styles.trendLabel}>{trendLabel}</span>}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`${styles.iconWrapper} ${styles[`iconWrapper--${variant}`]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
}
