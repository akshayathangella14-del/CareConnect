import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Shield,
  Users,
  Wrench,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components';
import { selectIsAuthenticated } from '@/features/auth';
import styles from './HomePage.module.css';

/**
 * HomePage — CareConnect platform landing.
 * Communicates the 5 Core Pillars:
 * 1. Problem (Home needs attention)
 * 2. Intelligence (AI Request Understanding)
 * 3. Trust (Verified Professionals)
 * 4. Transparency (ScopeGuard & Clear Quotes)
 * 5. Traceability (ServiceTrac Lifecycle Tracking)
 */
function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.home__hero}>
        <div className={styles['home__hero-badge']}>
          <Sparkles size={14} />
          <span>Intelligent Home Operations</span>
        </div>
        <h1 className={styles['home__hero-title']}>
          Expert care for your home, <span>powered by AI</span>
        </h1>
        <p className={styles['home__hero-desc']}>
          Tell us what needs fixing. Our AI analyzes your request, identifies required skills,
          and instantly matches you with background-verified professionals with transparent pricing.
        </p>

        <div className={styles['home__hero-actions']}>
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
                  Book a Service
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Trust Badges Bar */}
        <div className={styles['home__hero-stats']}>
          <div className={styles['home__hero-stat']}>
            <ShieldCheck size={18} className={styles['home__hero-stat-icon']} />
            <span>100% Verified Providers</span>
          </div>
          <div className={styles['home__hero-stat-divider']} />
          <div className={styles['home__hero-stat']}>
            <Sparkles size={18} className={styles['home__hero-stat-icon']} />
            <span>Instant AI Scope Analysis</span>
          </div>
          <div className={styles['home__hero-stat-divider']} />
          <div className={styles['home__hero-stat']}>
            <Star size={18} className={styles['home__hero-stat-icon']} />
            <span>ScopeGuard Protection</span>
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section className={styles.home__section}>
        <div className={styles['home__section-header']}>
          <span className={styles['home__section-kicker']}>How CareConnect Works</span>
          <h2 className={styles['home__section-title']}>A smarter way to manage your home</h2>
          <p className={styles['home__section-subtitle']}>
            From the moment something breaks to verified completion, every step is intelligent, transparent, and protected.
          </p>
        </div>

        <div className={styles.home__pillars}>
          {pillars.map((pillar, index) => (
            <Card key={pillar.title} variant="default" padding="none" className={styles['home__pillar-card']}>
              <div className={styles['home__pillar-body']}>
                <div className={styles['home__pillar-header']}>
                  <div className={`${styles['home__pillar-icon']} ${styles[`home__pillar-icon--${pillar.color}`]}`}>
                    <pillar.icon size={22} />
                  </div>
                  <span className={styles['home__pillar-step']}>0{index + 1}</span>
                </div>
                <h3 className={styles['home__pillar-title']}>{pillar.title}</h3>
                <p className={styles['home__pillar-desc']}>{pillar.description}</p>
                <div className={styles['home__pillar-footer']}>
                  <Badge variant={pillar.badgeVariant} dot>
                    {pillar.badgeText}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.home__cta}>
        <div className={styles['home__cta-content']}>
          <div className={styles['home__cta-badge']}>
            <Wrench size={14} />
            <span>Join 1,000+ Homeowners & Pros</span>
          </div>
          <h2 className={styles['home__cta-title']}>Ready to get your home serviced?</h2>
          <p className={styles['home__cta-desc']}>
            Create your account in seconds as a customer or service professional.
          </p>
          <div className={styles['home__cta-actions']}>
            <Link to="/register">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
                Get Started Now
              </Button>
            </Link>
            <Link to="/design-system">
              <Button variant="ghost" size="lg" style={{ color: '#FFFFFF' }}>
                View Design System
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const pillars = [
  {
    title: '1. Home Need Arises',
    description:
      'Plumbing leak, electrical outage, deep cleaning, or appliance repair — describe the problem in your own words.',
    icon: Wrench,
    badgeVariant: 'neutral',
    badgeText: 'Home Need',
    color: 'neutral',
  },
  {
    title: '2. AI Request Understanding',
    description:
      'CareConnect AI extracts category, required skills, and urgency automatically, recommending missing details.',
    icon: Sparkles,
    badgeVariant: 'violet',
    badgeText: 'Gemini AI',
    color: 'violet',
  },
  {
    title: '3. Verified Matching',
    description:
      'Only background-checked and credential-verified service professionals with matching skills receive your job.',
    icon: Shield,
    badgeVariant: 'success',
    badgeText: 'Trust & Safety',
    color: 'success',
  },
  {
    title: '4. ScopeGuard Transparency',
    description:
      'Receive itemized quotes with clear milestone pricing. Scope changes require explicit approval with zero hidden fees.',
    icon: FileText,
    badgeVariant: 'accent',
    badgeText: 'ScopeGuard',
    color: 'accent',
  },
  {
    title: '5. ServiceTrac Lifecycle',
    description:
      'Follow every phase from dispatch to completion with photo evidence, digital sign-off, and guaranteed satisfaction.',
    icon: Activity,
    badgeVariant: 'info',
    badgeText: 'ServiceTrac',
    color: 'info',
  },
  {
    title: 'Built for 5 Platform Roles',
    description:
      'Specialized operational workflows for Customers, Service Providers, Operations Managers, Support Agents, and Admins.',
    icon: Users,
    badgeVariant: 'primary',
    badgeText: 'Multi-Role',
    color: 'primary',
  },
];

export default HomePage;
