import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Logo } from '@/components';
import SafeImage from '@/components/media/SafeImage';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.pattern} aria-hidden="true">
        <SafeImage src="/images/hero/hero-main.jpg" fallbackSrc="/images/hero/hero-main.svg" alt="" />
      </div>
      <div className={styles.grid}>
        <div>
          <Logo size="sm" animated={false} variant="light" />
          <p className={styles.blurb}>
            CareConnect is the intelligent marketplace for home services — verified professionals,
            transparent quotes, and tracked work for Indian households.
          </p>
          <div className={styles.social}>
            <a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://twitter.com" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://facebook.com" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <a href="/#services">AC Repair</a>
          <a href="/#services">Plumbing</a>
          <a href="/#services">Electrical</a>
          <a href="/#services">Cleaning</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="/#how-it-works">How it works</a>
          <a href="/#professionals">Professionals</a>
          <Link to="/register">Join as a pro</Link>
          <Link to="/login">Sign in</Link>
        </div>
        <div>
          <h4>Support</h4>
          <a href="mailto:help@careconnect.app">Help centre</a>
          <Link to="/register">Book a service</Link>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} CareConnect. All rights reserved.</p>
    </footer>
  );
}
