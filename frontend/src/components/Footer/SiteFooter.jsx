import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Heart, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components';
import styles from './SiteFooter.module.css';

const SERVICES = [
  { name: 'AC Repair', href: '/#services' },
  { name: 'Plumbing', href: '/#services' },
  { name: 'Electrical', href: '/#services' },
  { name: 'Cleaning', href: '/#services' },
  { name: 'Painting', href: '/#services' },
  { name: 'Pest Control', href: '/#services' },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} aria-hidden="true" />
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Logo size="sm" animated={false} variant="light" />
          <p className={styles.blurb}>
            India's most trusted home services platform. Verified professionals, transparent quotes,
            and AI-powered matching for 40+ cities.
          </p>
          <div className={styles.social}>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <Twitter size={18} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook size={18} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          {SERVICES.map(({ name, href }) => (
            <a key={name} href={href}>{name}</a>
          ))}
        </div>
        <div>
          <h4>Company</h4>
          <a href="/#how-it-works">How it works</a>
          <a href="/#professionals">Professionals</a>
          <Link to="/register">Join as a pro <ArrowUpRight size={12} /></Link>
          <Link to="/login">Sign in</Link>
        </div>
        <div>
          <h4>Support</h4>
          <a href="mailto:help@careconnect.app">Help centre</a>
          <Link to="/register">Book a service</Link>
          <span>Privacy policy</span>
          <span>Terms of service</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} CareConnect. All rights reserved.
        </p>
        <p className={styles.madeWith}>
          Made with <Heart size={14} fill="#EC4899" color="#EC4899" /> in India
        </p>
      </div>
    </footer>
  );
}
