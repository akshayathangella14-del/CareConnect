import { useState } from 'react';
import styles from './SafeImage.module.css';

function extensionVariants(src) {
  if (!src) return [];
  const withoutQuery = src.split('?')[0];
  const variants = [src];
  if (withoutQuery.endsWith('.jpg')) {
    variants.push(src.replace(/\.jpg(\?.*)?$/, '.webp$1'));
    variants.push(src.replace(/\.jpg(\?.*)?$/, '.svg$1'));
  }
  if (withoutQuery.endsWith('.webp')) {
    variants.push(src.replace(/\.webp(\?.*)?$/, '.jpg$1'));
    variants.push(src.replace(/\.webp(\?.*)?$/, '.svg$1'));
  }
  return variants;
}

export default function SafeImage({
  src,
  fallbackSrc,
  alt = '',
  className = '',
  lazy = true,
  ...props
}) {
  const [attempt, setAttempt] = useState(0);
  const candidates = [...extensionVariants(src), fallbackSrc].filter(Boolean);
  const current = candidates[Math.min(attempt, candidates.length - 1)];
  const exhausted = attempt >= candidates.length;

  if (exhausted || !current) {
    return (
      <div className={`${styles.fallback} ${className}`} role="img" aria-label={alt}>
        <span>{alt || 'Image'}</span>
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      className={className}
      onError={() => setAttempt((value) => value + 1)}
      {...props}
    />
  );
}
