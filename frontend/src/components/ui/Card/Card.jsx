import styles from './Card.module.css';

/**
 * Card — Content container for CareConnect.
 *
 * @param {'default'|'outlined'|'elevated'} variant
 * @param {'none'|'sm'|'md'|'lg'} padding
 * @param {boolean} interactive — Adds hover effects and cursor
 */
function Card({
  variant = 'default',
  padding = 'none',
  interactive = false,
  children,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const classNames = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--padding-${padding}`],
    interactive ? styles['card--interactive'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={classNames}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card.Header — Top section with title and optional actions.
 */
function CardHeader({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`${styles.card__header} ${className}`}>
      <div className={styles['card__header-content']}>
        {title && <h3 className={styles.card__title}>{title}</h3>}
        {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Card.Body — Main content area.
 */
function CardBody({ children, className = '' }) {
  return (
    <div className={`${styles.card__body} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card.Footer — Bottom section for actions.
 */
function CardFooter({ children, className = '' }) {
  return (
    <div className={`${styles.card__footer} ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
