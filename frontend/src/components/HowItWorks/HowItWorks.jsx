import { FileText, Sparkles, BadgeCheck, CalendarCheck, Star } from 'lucide-react';
import useInView from '@/hooks/useInView';
import styles from './HowItWorks.module.css';

const STEPS = [
  { title: 'Describe your problem', text: 'Tell us what\'s broken in everyday language — photos welcome.', icon: FileText, emoji: '📝' },
  { title: 'AI analyzes & matches', text: 'We extract category, skills, and urgency, then rank verified pros near you.', icon: Sparkles, emoji: '🤖' },
  { title: 'Compare transparent quotes', text: 'Compare itemized ScopeGuard quotes with no hidden extras or surprise charges.', icon: BadgeCheck, emoji: '📋' },
  { title: 'Book & track live', text: 'Schedule your slot, track provider arrival, and follow milestones in real time.', icon: CalendarCheck, emoji: '📍' },
  { title: 'Verify & review', text: 'Photo evidence, digital sign-off, and an honest review that helps your neighbours.', icon: Star, emoji: '⭐' },
];

export default function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" className={styles.section} ref={ref}>
      <p className={styles.kicker}>How it works</p>
      <h2>Five steps from "something broke" to done</h2>
      <div className={`${styles.flow} ${inView ? styles.visible : ''}`}>
        {STEPS.map((step, index) => (
          <article key={step.title} className={styles.step} style={{ '--delay': `${index * 120}ms` }}>
            <div className={styles.media}>
              <span className={styles.emoji}>{step.emoji}</span>
              <span className={styles.iconBadge}><step.icon size={18} /></span>
            </div>
            <span className={styles.num}>0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
