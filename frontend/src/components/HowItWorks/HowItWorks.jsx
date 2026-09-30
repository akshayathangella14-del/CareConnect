import { FileText, Sparkles, BadgeCheck, CalendarCheck, Star } from 'lucide-react';
import useInView from '@/hooks/useInView';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    title: 'Describe your problem',
    text: 'Tell us what needs fixing in everyday language — attach photos for faster matching.',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    emoji: '📝',
  },
  {
    title: 'AI analyzes & matches',
    text: 'Our AI extracts category, skills & urgency, then ranks verified pros near you instantly.',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    emoji: '🤖',
  },
  {
    title: 'Compare transparent quotes',
    text: 'Receive itemized ScopeGuard™ quotes with zero hidden fees — compare side by side.',
    icon: BadgeCheck,
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    emoji: '📋',
  },
  {
    title: 'Book & track live',
    text: 'Schedule your slot, track provider arrival in real-time, and follow every milestone.',
    icon: CalendarCheck,
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    emoji: '📍',
  },
  {
    title: 'Verify & review',
    text: 'Photo evidence, digital sign-off, and an honest review that helps your neighbours.',
    icon: Star,
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    emoji: '⭐',
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" className={styles.section} ref={ref}>
      <div className={styles.header}>
        <p className={styles.kicker}>How it works</p>
        <h2>Five steps from "something broke" to <span className={styles.gradientText}>done</span></h2>
        <p className={styles.subtitle}>Our AI-powered platform handles the heavy lifting so you don't have to.</p>
      </div>
      
      <div className={styles.timeline}>
        <div className={styles.timelineLine} aria-hidden="true" />
        <div className={`${styles.flow} ${inView ? styles.visible : ''}`}>
          {STEPS.map((step, index) => (
            <article key={step.title} className={styles.step} style={{ '--delay': `${index * 140}ms` }}>
              <div className={styles.stepNumber} style={{ background: step.gradient }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon} style={{ background: step.gradient }}>
                  <step.icon size={22} color="#fff" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
