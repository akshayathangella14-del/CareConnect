import React from 'react';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

/**
 * EmptyState — Placeholder for empty views in CareConnect.
 *
 * @param {React.ReactNode} icon — Custom icon (defaults to Inbox)
 * @param {string} title — Heading text
 * @param {string} description — Supporting text
 * @param {React.ReactNode} action — Optional CTA (e.g., Button)
 */
function EmptyState({
  icon,
  title = 'No items found',
  description,
  action,
  className = '',
  ...props
}) {
  return (
    <div className={`${styles['empty-state']} ${className}`} {...props}>
      <div className={styles['empty-state__icon']} aria-hidden="true">
        {icon ? (
          typeof icon === 'function' ? React.createElement(icon, { size: 28 }) : icon
        ) : (
          <Inbox size={28} />
        )}
      </div>
      <h3 className={styles['empty-state__title']}>{title}</h3>
      {description && (
        <p className={styles['empty-state__description']}>{description}</p>
      )}
      {action && (
        <div className={styles['empty-state__action']}>{action}</div>
      )}
    </div>
  );
}

export default EmptyState;
