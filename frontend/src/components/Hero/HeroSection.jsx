import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Star, MapPin, Zap, Users } from 'lucide-react';
import { Button } from '@/components';
import SafeImage from '@/components/media/SafeImage';
import { useListFeaturedProvidersQuery } from '@/features/providers';
import { useGetPlatformStatsQuery } from '@/features/stats';
import styles from './HeroSection.module.css';

const TRUST_BADGES = [
  { icon: ShieldCheck, text: '100% verified pros', color: 'var(--color-accent)' },
  { icon: Sparkles, text: 'AI-powered matching', color: 'var(--color-primary)' },
  { icon: Users, text: '3+ verified pros per job', color: 'var(--color-secondary)' },
  { icon: Star, text: '4.9 avg rating', color: '#F59E0B' },
];

export default function HeroSection({ isAuthenticated, onSignIn }) {
  const { data: stats } = useGetPlatformStatsQuery();
  const { data: featuredProviders = [] } = useListFeaturedProvidersQuery(2);
  const featuredCards = featuredProviders.slice(0, 2);

  const ratingValue = stats?.averageRating ? Number(stats.averageRating).toFixed(1) : '4.9';

  return (
    <section className={styles.hero}>
      {/* Animated background elements */}
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.orb} aria-hidden="true" />
      <div className={styles.orbSecondary} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className={styles.dot} style={{ '--i': i }} />
        ))}
      </div>

      {/* Left — Copy */}
      <div className={styles.copy}>
        <div className={`${styles.badge} animate-fade-in-up`}>
          <span className={styles.badgeDot} />
          <Sparkles size={14} />
          India's most trusted home services platform
        </div>

        <h1 className={`${styles.title} animate-fade-in-up animate-delay-100`}>
          Home services that
          <br />
          feel <span className={styles.highlight}>effortless</span>
        </h1>

        <p className={`${styles.desc} animate-fade-in-up animate-delay-200`}>
          Describe the job in plain words. CareConnect matches you with background-checked
          professionals, transparent quotes, and live tracking — from AC repair to deep cleaning.
        </p>

        <div className={`${styles.actions} animate-fade-in-up animate-delay-300`}>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                  Book a service
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={onSignIn}>
                Sign in
              </Button>
            </>
          )}
        </div>

        {/* Trust badges row */}
        <div className={`${styles.trustRow} animate-fade-in-up animate-delay-400`}>
          {TRUST_BADGES.map(({ icon: Icon, text, color }) => (
            <div key={text} className={styles.trustBadge}>
              <Icon size={16} style={{ color }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Visual */}
      <div className={`${styles.visual} animate-scale-in animate-delay-200`}>
        <div className={styles.imageFrame}>
          <SafeImage
            src="/images/hero/hero-main.jpg"
            fallbackSrc="/images/hero/hero-main.svg"
            alt="CareConnect — trusted home services for Indian families"
            className={styles.heroImg}
            lazy={false}
          />
          <div className={styles.imageGlow} aria-hidden="true" />
        </div>

        {/* Floating provider cards */}
        {featuredCards.length > 0 ? featuredCards.map((provider, index) => {
          const providerName = provider.displayName || provider.user?.name || 'Verified provider';
          const serviceArea = provider.serviceAreas?.[0];
          const rating = provider.ratingSummary?.averageRating || 0;
          const skillName = provider.skills?.[0]?.name || 'Care specialist';
          const locationLabel = serviceArea
            ? `${serviceArea.city || 'City'}${serviceArea.state ? `, ${serviceArea.state}` : ''}`
            : 'Available now';

          return (
            <div
              key={provider._id || providerName}
              className={`${styles.floatCard} ${index === 0 ? styles.floatOne : styles.floatTwo}`}
            >
              <div className={styles.miniAvatar} style={{ background: index === 0 ? 'linear-gradient(135deg, #7C3AED, #3B82F6)' : 'linear-gradient(135deg, #10B981, #3B82F6)' }}>
                {providerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{providerName}</strong>
                <p>{skillName} · {rating ? `${Number(rating).toFixed(1)}★` : 'New'} · {locationLabel}</p>
              </div>
            </div>
          );
        }) : (
          <>
            <div className={`${styles.floatCard} ${styles.floatOne}`}>
              <div className={styles.miniAvatar} style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}>R</div>
              <div><strong>Rajesh Kumar</strong><p>Electrician · 4.9★ · Mumbai</p></div>
            </div>
            <div className={`${styles.floatCard} ${styles.floatTwo}`}>
              <div className={styles.miniAvatar} style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>P</div>
              <div><strong>Priya Sharma</strong><p>Cleaning · 5.0★ · Hyderabad</p></div>
            </div>
          </>
        )}

        {/* Live stats pill */}
        <div className={`${styles.statsPill} ${styles.floatStats}`}>
          <Users size={16} />
          <span>{stats?.totalProviders ? `${stats.totalProviders}+ verified pros` : '100+ verified pros'}</span>
          <span className={styles.liveDot} />
        </div>
      </div>
    </section>
  );
}
