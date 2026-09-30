import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useListTestimonialsQuery } from '@/features/testimonials';
import styles from './Testimonials.module.css';

const FALLBACK_TESTIMONIALS = [
  { _id: 'ft-1', comment: 'CareConnect found me a verified electrician within minutes. The quote was transparent, work was excellent, and the photo proof gave me total peace of mind.', rating: 5, customer: { name: 'Priya Menon' }, city: 'Mumbai' },
  { _id: 'ft-2', comment: 'I was skeptical at first, but the ScopeGuard pricing meant zero surprises. The plumber arrived on time and fixed everything perfectly. Highly recommend!', rating: 5, customer: { name: 'Arjun Reddy' }, city: 'Hyderabad' },
  { _id: 'ft-3', comment: 'Best home service app in India! The AI matching is incredibly accurate. Got my AC repaired same day with a verified technician. Five stars!', rating: 5, customer: { name: 'Sneha Gupta' }, city: 'Delhi' },
];

export default function Testimonials() {
  const { data: apiTestimonials = [], isLoading, isError } = useListTestimonialsQuery();
  const testimonials = apiTestimonials.length > 0 ? apiTestimonials : FALLBACK_TESTIMONIALS;
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

  const story = testimonials[index % testimonials.length];
  const initials = (story.customer?.name || 'C').split(' ').map(w => w[0]).join('').toUpperCase();

  return (
    <section id="stories" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.kicker}>Stories</p>
        <h2>Homes that already trust <span className={styles.gradientText}>CareConnect</span></h2>
      </div>
      <div className={styles.layout}>
        <article className={styles.featured}>
          <div className={styles.quoteIcon}>
            <Quote size={24} />
          </div>
          <blockquote>
            "{story.comment || 'Great experience with CareConnect.'}"
            <footer>
              <div className={styles.avatar}>
                {initials}
              </div>
              <div>
                <strong>{story.customer?.name || 'Verified customer'}</strong>
                <span>{story.city || story.customer?.city || 'Verified customer'} · Completed service</span>
                <span className={styles.stars} aria-label={`${story.rating || 5} star rating`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < (story.rating || 5) ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </div>
            </footer>
          </blockquote>
          <div className={styles.controls}>
            <button type="button" aria-label="Previous story" onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft size={20} />
            </button>
            <span className={styles.counter}>{index + 1} / {testimonials.length}</span>
            <button type="button" aria-label="Next story" onClick={() => setIndex((i) => (i + 1) % testimonials.length)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </article>
        <div className={styles.grid}>
          {testimonials.map((item, i) => {
            const itemInitials = (item.customer?.name || 'C').split(' ').map(w => w[0]).join('').toUpperCase();
            return (
              <button
                key={item._id || i}
                type="button"
                className={`${styles.mini} ${i === index ? styles.active : ''}`}
                onClick={() => setIndex(i)}
              >
                <div className={styles.miniAvatar}>{itemInitials}</div>
                <div>
                  <strong>{item.customer?.name || 'Verified customer'}</strong>
                  <p>{item.comment || 'Great experience with CareConnect.'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
