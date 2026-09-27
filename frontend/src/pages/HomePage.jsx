import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Award, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components';
import { selectIsAuthenticated } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import HeroSection from '@/components/Hero/HeroSection';
import ServiceCategories from '@/components/ServiceCategories/ServiceCategories';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import StatsBand from '@/components/Stats/StatsBand';
import Testimonials from '@/components/Testimonials/Testimonials';
import SiteFooter from '@/components/Footer/SiteFooter';
import styles from './HomePage.module.css';

const PRO_BENEFITS = [
  { icon: ShieldCheck, title: 'Verified identity', desc: 'Aadhaar & background checks before onboarding' },
  { icon: Award, title: 'Skill certified', desc: 'Trade tests and customer feedback loops' },
  { icon: Clock, title: 'Live availability', desc: 'Real-time calendars — no guessing game' },
  { icon: CheckCircle, title: 'Transparent ratings', desc: 'Honest reviews from real, verified customers' },
];

function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: stats } = useGetPlatformStatsQuery();

  const ratingText = stats?.averageRating != null ? Number(stats.averageRating).toFixed(1) : '5.0';
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
      <section id="professionals" className={styles.pros}>
        <div className={styles.prosContent}>
          <p className={styles.kicker}>Professionals</p>
          <h2>Background-checked crews, not random listings</h2>
          <p className={styles.prosDesc}>
            Every CareConnect professional completes identity, skill, and quality checks before they
            can quote. You see ratings, specialities, and live availability — not a mystery vendor.
          </p>
          <div className={styles.prosGrid}>
            {PRO_BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.proBenefit}>
                <div className={styles.proBenefitIcon}>
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
        <div className={styles.prosVisual}>
          <div className={styles.prosImageStack}>
            <img src="/images/categories/electrical.jpg" alt="Verified electrician at work" className={styles.prosImg1} />
            <img src="/images/categories/plumbing.jpg" alt="Verified plumber at work" className={styles.prosImg2} />
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Final CTA */}
      <section className={styles.cta}>
        <h2>Ready for a home that just works?</h2>
        <p>Book a verified pro in minutes. Transparent quotes. Photo-backed completion.</p>
        <div className={styles.ctaActions}>
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} className="animate-pulse-glow">
              Book a service
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
