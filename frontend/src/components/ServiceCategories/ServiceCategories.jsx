import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import { useListCategoriesQuery } from '@/features/categories';
import styles from './ServiceCategories.module.css';

const categoryImageMap = {
  plumbing: '/images/categories/plumbing.jpg',
  'ac-repair': '/images/categories/ac-repair.jpg',
  'refrigerator-repair': '/images/categories/refrigerator-repair.jpg',
  electrical: '/images/categories/electrical.jpg',
  cleaning: '/images/categories/cleaning.jpg',
  painting: '/images/categories/painting.jpg',
  carpenter: '/images/categories/carpenter.jpg',
  'pest-control': '/images/categories/pest-control.jpg',
};

export default function ServiceCategories() {
  const scroller = useRef(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
  const { data: categories = [], isLoading, isError } = useListCategoriesQuery();

  useEffect(() => {
    if (!query || !scroller.current || categories.length === 0) return;
    const match = categories.find((c) => c.name?.toLowerCase().includes(query));
    if (!match) return;
    const card = scroller.current.querySelector(`[data-slug="${match.slug}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [query, categories]);

  const scrollBy = (dir) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section id="services" className={styles.section}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>Services</p>
            <h2>Loading live service categories...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (isError || categories.length === 0) {
    return (
      <section id="services" className={styles.section}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>Services</p>
            <h2>Service categories are being refreshed</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={styles.kicker}>Services</p>
          <h2>Book the help your home needs</h2>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous services"><ChevronLeft /></button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next services"><ChevronRight /></button>
        </div>
      </div>
      <div className={styles.track} ref={scroller}>
        {categories.map((cat) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
          const image = cat.image || categoryImageMap[slug] || '/images/categories/plumbing.jpg';
          const priceText = cat.basePrice ? `From ₹${cat.basePrice}` : 'Flexible pricing';

          return (
            <article
              key={cat._id || slug}
              data-slug={slug}
              className={`${styles.card} ${query && cat.name?.toLowerCase().includes(query) ? styles.highlight : ''}`}
            >
              <div className={styles.imageWrap}>
                <SafeImage src={image} fallbackSrc={image.replace('.jpg', '.svg')} alt={`${cat.name} service`} />
              </div>
              <div className={styles.body}>
                <h3>{cat.name}</h3>
                <p>{cat.description || 'Tailored service for your home.'}</p>
                <div className={styles.meta}>
                  <span>{priceText}</span>
                  <Link to="/register">Book now</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
