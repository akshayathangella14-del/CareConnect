import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import styles from './Testimonials.module.css';

const STORIES = [
  {
    name: 'Meera Iyer',
    city: 'Bengaluru',
    service: 'AC Repair',
    quote: 'The technician arrived on time, explained the leak, and the ScopeGuard quote never changed.',
    photo: '/images/testimonials/customer-1.jpg',
    before: '/images/hero/technician-working.jpg',
    after: '/images/hero/happy-customer.jpg',
  },
  {
    name: 'Rohit Sharma',
    city: 'Pune',
    service: 'Plumbing',
    quote: 'I described a leaking mixer in my own words. Matching was instant and the work was photo-verified.',
    photo: '/images/testimonials/customer-2.jpg',
    before: '/images/categories/plumbing.jpg',
    after: '/images/categories/cleaning.jpg',
  },
  {
    name: 'Ananya Das',
    city: 'Kolkata',
    service: 'Deep Cleaning',
    quote: 'Transparent pricing, polite crew, and my living room looked festival-ready the same evening.',
    photo: '/images/testimonials/customer-3.jpg',
    before: '/images/categories/painting.jpg',
    after: '/images/hero/hero-main.jpg',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [slider, setSlider] = useState(58);
  const story = STORIES[index];

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % STORIES.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="stories" className={styles.section}>
      <p className={styles.kicker}>Stories</p>
      <h2>Homes that already trust CareConnect</h2>
      <div className={styles.layout}>
        <article className={styles.featured}>
          <div className={styles.compare}>
            <SafeImage src={story.after} fallbackSrc={story.after.replace('.jpg', '.svg')} alt="After service" className={styles.after} />
            <div className={styles.beforeMask} style={{ width: `${slider}%` }}>
              <SafeImage src={story.before} fallbackSrc={story.before.replace('.jpg', '.svg')} alt="Before service" className={styles.before} />
            </div>
            <input
              type="range"
              min="8"
              max="92"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className={styles.range}
              aria-label="Before and after slider"
            />
          </div>
          <blockquote>
            “{story.quote}”
            <footer>
              <SafeImage src={story.photo} fallbackSrc={story.photo.replace('.jpg', '.svg')} alt={story.name} className={styles.avatar} />
              <div>
                <strong>{story.name}</strong>
                <span>{story.city} · {story.service}</span>
                <span className={styles.stars} aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </span>
              </div>
            </footer>
          </blockquote>
          <div className={styles.controls}>
            <button type="button" aria-label="Previous story" onClick={() => setIndex((i) => (i - 1 + STORIES.length) % STORIES.length)}>
              <ChevronLeft />
            </button>
            <button type="button" aria-label="Next story" onClick={() => setIndex((i) => (i + 1) % STORIES.length)}>
              <ChevronRight />
            </button>
          </div>
        </article>
        <div className={styles.grid}>
          {STORIES.map((item, i) => (
            <button
              key={item.name}
              type="button"
              className={`${styles.mini} ${i === index ? styles.active : ''}`}
              onClick={() => setIndex(i)}
            >
              <SafeImage src={item.photo} fallbackSrc={item.photo.replace('.jpg', '.svg')} alt="" />
              <div>
                <strong>{item.name}</strong>
                <p>{item.quote}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
