import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useListTestimonialsQuery } from '@/features/testimonials';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const { data: testimonials = [], isLoading, isError } = useListTestimonialsQuery();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section id="stories" className={styles.section}>
        <p className={styles.kicker}>Stories</p>
        <h2>Loading customer stories…</h2>
      </section>
    );
  }

  if (isError || testimonials.length === 0) {
    return (
      <section id="stories" className={styles.section}>
        <p className={styles.kicker}>Stories</p>
        <h2>Customer reviews will appear here once they’re submitted.</h2>
      </section>
    );
  }

  const story = testimonials[index % testimonials.length];

  return (
    <section id="stories" className={styles.section}>
      <p className={styles.kicker}>Stories</p>
      <h2>Homes that already trust CareConnect</h2>
      <div className={styles.layout}>
        <article className={styles.featured}>
          <blockquote>
            “{story.comment || 'Great experience with CareConnect.'}”
            <footer>
              <div className={styles.avatar} style={{ display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #c8f0ff, #d0e6ff)', color: '#123b63', fontWeight: 700 }}>
                {(story.customer?.name || 'Customer').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong>{story.customer?.name || 'Verified customer'}</strong>
                <span>{story.customer?.city || 'Verified customer'} · {story.booking?.serviceRequest ? 'Completed service' : 'CareConnect service'}</span>
                <span className={styles.stars} aria-label={`${story.rating || 5} star rating`}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </span>
              </div>
            </footer>
          </blockquote>
          <div className={styles.controls}>
            <button type="button" aria-label="Previous story" onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft />
            </button>
            <button type="button" aria-label="Next story" onClick={() => setIndex((i) => (i + 1) % testimonials.length)}>
              <ChevronRight />
            </button>
          </div>
        </article>
        <div className={styles.grid}>
          {testimonials.map((item, i) => (
            <button
              key={item._id || i}
              type="button"
              className={`${styles.mini} ${i === index ? styles.active : ''}`}
              onClick={() => setIndex(i)}
            >
              <div className={styles.avatar} style={{ display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #c8f0ff, #d0e6ff)', color: '#123b63', fontWeight: 700 }}>
                {(item.customer?.name || 'C').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong>{item.customer?.name || 'Verified customer'}</strong>
                <p>{item.comment || 'Great experience with CareConnect.'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
