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
      <div className={styles.statIcon} style={{ background: item.gradient }}>
        <item.icon size={24} color="#fff" />
      </div>
      <strong>{display}{item.suffix}</strong>
      <span>{item.label}</span>
    </div>
  );
}

export default function StatsBand() {
  const [ref, inView] = useInView();
  const { data: stats, isLoading } = useGetPlatformStatsQuery();

  const items = [
    { label: 'Happy homes served', target: Math.max(stats?.totalRequests || 0, 150), suffix: '+', icon: Home, gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)' },
    { label: 'Active bookings', target: Math.max(stats?.activeBookings || 0, 12), suffix: '+', icon: Briefcase, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
    { label: 'Average rating', target: stats?.averageRating || 4.9, suffix: '/5', decimals: 1, icon: Star, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { label: 'Verified professionals', target: Math.max(stats?.totalProviders || 0, 50), suffix: '+', icon: BadgeCheck, gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
  ];

  if (isLoading) {
    return (
      <section className={styles.band} ref={ref}>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.stat} style={{ opacity: 0.65 }}>
              <div className={styles.statIcon} style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: 24, height: 24 }} />
              </div>
              <strong style={{ width: '60%', height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: 999, display: 'block' }} />
              <span style={{ width: '50%', height: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 999, display: 'block' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.band} ref={ref}>
      <div className={styles.bgPattern} aria-hidden="true" />
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>Trusted across 40+ Indian cities · Verified crews · ScopeGuard pricing · AI matching</span>
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
