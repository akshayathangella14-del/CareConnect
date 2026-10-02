import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useListReviewsQuery } from '@/features/reviews/reviewApi';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const { data: reviews = [], isLoading } = useListReviewsQuery();
  const [index, setIndex] = useState(0);
  
  const publishedReviews = reviews.filter(r => r.status === 'PUBLISHED' && r.comment && r.comment.length > 10).slice(0, 5);

  useEffect(() => {
    if (!publishedReviews.length) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % publishedReviews.length), 7000);
    return () => clearInterval(id);
  }, [publishedReviews.length]);

  if (isLoading) {
    return (
      <section id="stories" className={styles.section}>
        <p className={styles.kicker}>Stories</p>
        <h2>Loading customer stories…</h2>
      </section>
    );
  }

  if (publishedReviews.length === 0) {
    return null; // Don't show the section if there are no real published reviews
  }

  const story = publishedReviews[index % publishedReviews.length];
  const customerName = story.customer?.name || 'Verified customer';
  const initials = customerName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

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
            "{story.comment}"
            <footer>
              <div className={styles.avatar}>
                {initials}
              </div>
              <div>
                <strong>{customerName}</strong>
                <span>{story.customer?.address?.city || 'Verified Customer'} · Completed service</span>
                <span className={styles.stars} aria-label={`${story.rating || 5} star rating`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < (story.rating || 5) ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </div>
            </footer>
          </blockquote>
          <div className={styles.controls}>
            <button type="button" aria-label="Previous story" onClick={() => setIndex((i) => (i - 1 + publishedReviews.length) % publishedReviews.length)}>
              <ChevronLeft size={20} />
            </button>
            <span className={styles.counter}>{index + 1} / {publishedReviews.length}</span>
            <button type="button" aria-label="Next story" onClick={() => setIndex((i) => (i + 1) % publishedReviews.length)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </article>
        <div className={styles.grid}>
          {publishedReviews.map((item, i) => {
            const itemName = item.customer?.name || 'Verified customer';
            const itemInitials = itemName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            return (
              <button
                key={item._id || i}
                type="button"
                className={`${styles.mini} ${i === index ? styles.active : ''}`}
                onClick={() => setIndex(i)}
              >
                <div className={styles.miniAvatar}>{itemInitials}</div>
                <div>
                  <strong>{itemName}</strong>
                  <p>{item.comment.length > 60 ? item.comment.substring(0, 60) + '...' : item.comment}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
