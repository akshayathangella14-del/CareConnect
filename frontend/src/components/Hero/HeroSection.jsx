import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Star, MapPin, Search } from 'lucide-react';
import { Button } from '@/components';
import { useGetPlatformStatsQuery } from '@/features/stats';
import SafeImage from '@/components/media/SafeImage';
import styles from './HeroSection.module.css';

const QUICK_SERVICES = ['AC Repair', 'Plumbing', 'Electrician', 'Deep Cleaning', 'Painting', 'Carpenter'];

const TRUST_BADGES = [
  { icon: ShieldCheck, text: 'Verified experts' },
  { icon: Sparkles, text: 'AI matching' },
  { icon: MapPin, text: '40+ cities' },
  { icon: Star, text: '4.9★ rating' },
];

export default function HeroSection({ isAuthenticated, onSignIn }) {
  const { data: stats } = useGetPlatformStatsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}#services`);
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickService = (service) => {
    navigate(`/?q=${encodeURIComponent(service)}#services`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.orb} aria-hidden="true" />
      <div className={styles.orbSecondary} aria-hidden="true" />

      {/* Left — Copy */}
      <div className={styles.copy}>
        <div className={`${styles.badge} animate-fade-in-up`}>
          <span className={styles.liveDot} />
          India's #1 home services platform
        </div>

        <h1 className={`${styles.title} animate-fade-in-up animate-delay-100`}>
          Expert home services <br />
          at your <span className={styles.highlight}>doorstep</span>
        </h1>

        <p className={`${styles.desc} animate-fade-in-up animate-delay-200`}>
          From AC repair to deep cleaning — book trusted, background-verified professionals
          with upfront pricing and real-time tracking.
        </p>

        {/* Search Bar — Urban Company style */}
        <form className={`${styles.searchBar} animate-fade-in-up animate-delay-300`} onSubmit={handleSearch}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for AC repair, plumber, electrician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>Search</button>
        </form>

        {/* Quick Service Tags */}
        <div className={`${styles.quickServices} animate-fade-in-up animate-delay-400`}>
          <span className={styles.quickLabel}>Popular:</span>
          {QUICK_SERVICES.map((service) => (
            <button
              key={service}
              type="button"
              className={styles.quickTag}
              onClick={() => handleQuickService(service)}
            >
              {service}
            </button>
          ))}
        </div>

        {/* Trust row */}
        <div className={`${styles.trustRow} animate-fade-in-up animate-delay-400`}>
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className={styles.trustBadge}>
              <Icon size={14} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Visual */}
      <div className={`${styles.visual} animate-scale-in animate-delay-200`}>
        <SafeImage
          src="/images/hero/hero-main.jpg"
          fallbackSrc="/images/hero/hero-main.svg"
          alt="CareConnect — trusted home services for Indian families"
          className={styles.heroImg}
          lazy={false}
        />

        {/* Floating stat cards */}
        <div className={`${styles.floatCard} ${styles.floatOne}`}>
          <div className={styles.miniAvatar} style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}>R</div>
          <div><strong>Rajesh Kumar</strong><p>Electrician · 4.9★ · Mumbai</p></div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatTwo}`}>
          <div className={styles.miniAvatar} style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>P</div>
          <div><strong>Priya Sharma</strong><p>Cleaning Pro · 5.0★ · Hyderabad</p></div>
        </div>
      </div>
    </section>
  );
}
