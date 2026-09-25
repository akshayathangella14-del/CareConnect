import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components';
import SafeImage from '@/components/media/SafeImage';
import styles from './HeroSection.module.css';

export default function HeroSection({ isAuthenticated, onSignIn }) {
  return (
    <section className={styles.hero}>
      <div className={styles.orb} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={styles.dot} style={{ '--i': i }} />
        ))}
      </div>

      <div className={styles.copy}>
        <div className={`${styles.badge} animate-fade-in-up`}>
          <Sparkles size={14} />
          Verified care for Indian homes
        </div>
        <h1 className={`${styles.title} animate-fade-in-up animate-delay-100`}>
          Home services that feel <span>effortless</span>
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
        <div className={`${styles.trust} animate-fade-in-up animate-delay-400`}>
          <span><ShieldCheck size={16} /> 100% verified pros</span>
          <span><Sparkles size={16} /> AI job matching</span>
          <span><Star size={16} /> 4.8 average rating</span>
        </div>
      </div>

      <div className={`${styles.visual} animate-scale-in animate-delay-200`}>
        <SafeImage
          src="/images/hero/hero-main.jpg"
          fallbackSrc="/images/hero/hero-main.svg"
          alt="Technician servicing a modern Indian living room"
          className={styles.heroImg}
          lazy={false}
        />
        <div className={`${styles.floatCard} ${styles.floatOne} animate-float`}>
          <SafeImage
            src="/images/team/technician-1.jpg"
            fallbackSrc="/images/team/technician-1.svg"
            alt="Verified technician"
            className={styles.mini}
          />
          <div>
            <strong>Arjun Patel</strong>
            <p>AC specialist · 12 min away</p>
          </div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatTwo} animate-float`}>
          <SafeImage
            src="/images/hero/happy-customer.jpg"
            fallbackSrc="/images/hero/happy-customer.svg"
            alt="Happy customer"
            className={styles.mini}
          />
          <div>
            <strong>Job completed</strong>
            <p>ScopeGuard protected</p>
          </div>
        </div>
      </div>
    </section>
  );
}
