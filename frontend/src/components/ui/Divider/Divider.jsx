import styles from './Divider.module.css';

/**
 * Divider — Visual separator for CareConnect.
 *
 * @param {'horizontal'|'vertical'} orientation
 * @param {'sm'|'md'|'lg'} spacing
 * @param {string} label — Optional label text for labeled dividers
 */
function Divider({
  orientation = 'horizontal',
  spacing,
  label,
  className = '',
  ...props
}) {
  if (label) {
    return (
      <div
        className={`${styles['divider-with-label']} ${spacing ? styles[`divider--spacing-${spacing}`] : ''} ${className}`}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      >
        <span className={styles['divider-with-label__line']} />
        <span className={styles['divider-with-label__text']}>{label}</span>
        <span className={styles['divider-with-label__line']} />
      </div>
    );
  }

  const classNames = [
    styles.divider,
    styles[`divider--${orientation}`],
    spacing ? styles[`divider--spacing-${spacing}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <hr
      className={classNames}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
}

export default Divider;
