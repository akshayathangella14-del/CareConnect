import { Home, Briefcase, Star, BadgeCheck } from 'lucide-react';
import useInView from '@/hooks/useInView';
import useCountUp from '@/hooks/useCountUp';
import { useGetPlatformStatsQuery } from '@/features/stats';
import styles from './StatsBand.module.css';

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
  const { data: stats, isLoading } = useGetPlatformStatsQuery();

  const items = [
    { label: 'Happy homes', target: stats?.totalRequests || 0, suffix: '+', icon: Home },
    { label: 'Jobs in progress', target: stats?.activeBookings || 0, suffix: '', icon: Briefcase },
    { label: 'Average rating', target: stats?.averageRating || 0, suffix: '/5', decimals: 1, icon: Star },
    { label: 'Verified professionals', target: stats?.totalProviders || 0, suffix: '+', icon: BadgeCheck },
  ];

  if (isLoading) {
    return (
      <section className={styles.band} ref={ref}>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.stat} style={{ opacity: 0.65 }}>
              <div style={{ width: 32, height: 32, borderRadius: 12, background: 'rgba(255,255,255,0.1)' }} />
              <strong style={{ width: '60%', height: 20, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }} />
              <span style={{ width: '50%', height: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

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
        {items.map((item) => (
          <Stat key={item.label} item={item} enabled={inView} />
        ))}
      </div>
    </section>
  );
}
