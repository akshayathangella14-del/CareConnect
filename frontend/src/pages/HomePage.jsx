import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components';
import { selectIsAuthenticated } from '@/features/auth';
import HeroSection from '@/components/Hero/HeroSection';
import ServiceCategories from '@/components/ServiceCategories/ServiceCategories';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import StatsBand from '@/components/Stats/StatsBand';
import Testimonials from '@/components/Testimonials/Testimonials';
import SiteFooter from '@/components/Footer/SiteFooter';
import SafeImage from '@/components/media/SafeImage';
import styles from './HomePage.module.css';

function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className={styles.home}>
      <HeroSection
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.dispatchEvent(new Event('careconnect:open-login'))}
      />
      <ServiceCategories />
      <HowItWorks />
      <StatsBand />

      <section id="professionals" className={styles.pros}>
        <div>
          <p className={styles.kicker}>Professionals</p>
          <h2>Background-checked crews, not random listings</h2>
          <p>
            Every CareConnect professional completes identity, skill, and quality checks before they
            can quote. You see ratings, specialities, and live availability — not a mystery vendor.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Join as a professional
            </Button>
          </Link>
        </div>
        <div className={styles.prosPhotos}>
          <SafeImage src="/images/team/technician-1.jpg" fallbackSrc="/images/team/technician-1.svg" alt="Verified AC technician" />
          <SafeImage src="/images/team/technician-2.jpg" fallbackSrc="/images/team/technician-2.svg" alt="Verified plumber" />
        </div>
      </section>

      <Testimonials />

      <section className={styles.cta}>
        <h2>Ready for a home that just works?</h2>
        <p>Book a verified pro in minutes. Transparent quotes. Photo-backed completion.</p>
        <div className={styles.ctaActions}>
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} className="animate-pulse-glow">
              Book a service
            </Button>
          </Link>
          <span>4.8/5 from 50K+ completed jobs</span>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default HomePage;
