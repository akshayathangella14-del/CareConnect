import { Home, Briefcase, Star, BadgeCheck } from 'lucide-react';
import useInView from '@/hooks/useInView';
import useCountUp from '@/hooks/useCountUp';
import styles from './StatsBand.module.css';

const STATS = [
  { label: 'Happy homes', target: 10, suffix: 'L+', icon: Home },
  { label: 'Jobs completed', target: 50, suffix: 'K+', icon: Briefcase },
  { label: 'Average rating', target: 4.8, suffix: '/5', decimals: 1, icon: Star },
  { label: 'Verified professionals', target: 5000, suffix: '+', icon: BadgeCheck },
];

function Stat({ item, enabled }) {
  const value = useCountUp(item.target, enabled, 1600);
  const display = item.decimals
    ? value.toFixed(item.decimals)
    : Math.round(value).toLocaleString('en-IN');

  return (
    <div className={styles.stat}>
      <item.icon size={28} />
      <strong>{display}{item.suffix}</strong>
      <span>{item.label}</span>
    </div>
  );
}

export default function StatsBand() {
  const [ref, inView] = useInView();

  return (
    <section className={styles.band} ref={ref}>
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>Trusted across 40+ Indian cities · Verified crews · ScopeGuard pricing</span>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        {STATS.map((item) => (
          <Stat key={item.label} item={item} enabled={inView} />
        ))}
      </div>
    </section>
  );
}
