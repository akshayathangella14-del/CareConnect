import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Award, Clock, CheckCircle, Zap, Heart } from 'lucide-react';
import { Button } from '@/components';
import { selectIsAuthenticated } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import useInView from '@/hooks/useInView';
import HeroSection from '@/components/Hero/HeroSection';
import ServiceCategories from '@/components/ServiceCategories/ServiceCategories';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import StatsBand from '@/components/Stats/StatsBand';
import Testimonials from '@/components/Testimonials/Testimonials';
import SiteFooter from '@/components/Footer/SiteFooter';
import styles from './HomePage.module.css';

const PRO_BENEFITS = [
  { icon: ShieldCheck, title: 'Verified identity', desc: 'Aadhaar & background checks before onboarding', color: '#7C3AED' },
  { icon: Award, title: 'Skill certified', desc: 'Trade tests and customer feedback loops', color: '#3B82F6' },
  { icon: Clock, title: 'Live availability', desc: 'Real-time calendars — no guessing game', color: '#10B981' },
  { icon: CheckCircle, title: 'Transparent ratings', desc: 'Honest reviews from real, verified customers', color: '#F59E0B' },
];

const WHY_CHOOSE = [
  { icon: Zap, title: 'Lightning fast matching', desc: 'AI matches you with the best pro within 60 seconds' },
  { icon: ShieldCheck, title: 'ScopeGuard™ pricing', desc: 'Itemized quotes with price lock — no surprises ever' },
  { icon: Heart, title: 'Satisfaction guaranteed', desc: 'Free re-service if the work doesn\'t meet standards' },
];

function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: stats } = useGetPlatformStatsQuery();
  const [prosRef, prosInView] = useInView();
  const [whyRef, whyInView] = useInView();

  const ratingText = stats?.averageRating != null ? Number(stats.averageRating).toFixed(1) : '4.9';
  const completedJobs = stats?.completedBookings ?? 0;

  return (
    <div className={styles.home}>
      <HeroSection
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.dispatchEvent(new Event('careconnect:open-login'))}
      />
      <ServiceCategories />
      <HowItWorks />
      <StatsBand />

      {/* Professionals Section */}
      <section id="professionals" className={styles.pros} ref={prosRef}>
        <div className={`${styles.prosContent} ${prosInView ? styles.fadeInLeft : ''}`}>
          <p className={styles.kicker}>Professionals</p>
          <h2>Background-checked crews, <span className={styles.gradientText}>not random listings</span></h2>
          <p className={styles.prosDesc}>
            Every CareConnect professional completes identity, skill, and quality checks before they
            can quote. You see ratings, specialities, and live availability — not a mystery vendor.
          </p>
          <div className={styles.prosGrid}>
            {PRO_BENEFITS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={styles.proBenefit}>
                <div className={styles.proBenefitIcon} style={{ background: `${color}15`, color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Join as a professional
            </Button>
          </Link>
        </div>
        <div className={`${styles.prosVisual} ${prosInView ? styles.fadeInRight : ''}`}>
          <div className={styles.prosImageStack}>
            <img src="/images/categories/electrical.jpg" alt="Verified electrician at work" className={styles.prosImg1} loading="lazy" />
            <img src="/images/categories/plumbing.jpg" alt="Verified plumber at work" className={styles.prosImg2} loading="lazy" />
            <div className={styles.prosStatChip}>
              <strong>4.9★</strong>
              <span>avg. rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CareConnect */}
      <section className={styles.whySection} ref={whyRef}>
        <div className={styles.whyHeader}>
          <p className={styles.kicker}>Why CareConnect</p>
          <h2>The smartest way to get things <span className={styles.gradientText}>fixed</span></h2>
        </div>
        <div className={`${styles.whyGrid} ${whyInView ? styles.fadeInUp : ''}`}>
          {WHY_CHOOSE.map(({ icon: Icon, title, desc }, index) => (
            <div key={title} className={styles.whyCard} style={{ '--delay': `${index * 120}ms` }}>
              <div className={styles.whyIcon}>
                <Icon size={28} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* Final CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaOrbs} aria-hidden="true" />
        <h2>Ready for a home that just works?</h2>
        <p>Book a verified pro in minutes. Transparent quotes. Photo-backed completion. No surprises.</p>
        <div className={styles.ctaActions}>
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} className="animate-pulse-glow">
              Book a service now
            </Button>
          </Link>
          <span>
            {stats
              ? `${ratingText}/5 from ${Number(completedJobs).toLocaleString()} completed jobs`
              : 'Trusted by thousands of Indian homes'}
          </span>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default HomePage;
