import { FileText, Sparkles, BadgeCheck, CalendarCheck, Star } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import useInView from '@/hooks/useInView';
import styles from './HowItWorks.module.css';

const STEPS = [
  { title: 'Describe your problem', text: 'Tell us what is broken in everyday language — photos welcome.', icon: FileText, img: '/images/hero/happy-customer.jpg' },
  { title: 'AI analyzes and matches', text: 'We extract category, skills, and urgency, then rank verified pros.', icon: Sparkles, img: '/images/hero/technician-working.jpg' },
  { title: 'Get quotes from verified pros', text: 'Compare itemized ScopeGuard quotes with no hidden extras.', icon: BadgeCheck, img: '/images/team/technician-1.jpg' },
  { title: 'Book and track service', text: 'Schedule, track arrival, and follow milestones in real time.', icon: CalendarCheck, img: '/images/team/technician-2.jpg' },
  { title: 'Complete and review', text: 'Photo evidence, digital sign-off, and a review that helps neighbours.', icon: Star, img: '/images/testimonials/customer-1.jpg' },
];

export default function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" className={styles.section} ref={ref}>
      <p className={styles.kicker}>How it works</p>
      <h2>Five steps from “something broke” to done</h2>
      <div className={`${styles.flow} ${inView ? styles.visible : ''}`}>
        {STEPS.map((step, index) => (
          <article key={step.title} className={styles.step} style={{ '--delay': `${index * 90}ms` }}>
            <div className={styles.media}>
              <SafeImage src={step.img} fallbackSrc={step.img.replace('.jpg', '.svg')} alt="" />
              <span className={styles.icon}><step.icon size={18} /></span>
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
