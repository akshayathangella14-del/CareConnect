import styles from './Skeleton.module.css';

/**
 * Skeleton — Loading placeholder for CareConnect.
 *
 * @param {'text'|'heading'|'circle'|'rect'|'card'} variant
 * @param {string|number} width — Custom width
 * @param {string|number} height — Custom height
 */
function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
  ...props
}) {
  const classNames = [
    styles.skeleton,
    styles[`skeleton--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle = {
    ...style,
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      className={classNames}
      style={customStyle}
      aria-hidden="true"
      role="presentation"
      {...props}
    />
  );
}

export default Skeleton;
