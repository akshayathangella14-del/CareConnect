import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import { useListCategoriesQuery } from '@/features/categories';
import styles from './ServiceCategories.module.css';

const categoryImageMap = {
  plumbing: '/images/categories/plumbing.jpg',
  'ac-repair': '/images/categories/ac-repair.jpg',
  'appliance-repair': '/images/categories/ac-repair.jpg',
  'refrigerator-repair': '/images/categories/refrigerator-repair.jpg',
  electrical: '/images/categories/electrical.jpg',
  cleaning: '/images/categories/cleaning.jpg',
  painting: '/images/categories/paining.jpg',
  carpenter: '/images/categories/carpenter.jpg',
  'pest-control': '/images/categories/pest-control.jpg',
};

const FALLBACK_CATEGORIES = [
  { _id: 'fallback-1', name: 'AC Repair', slug: 'ac-repair', description: 'Expert air conditioning service', basePrice: 499 },
  { _id: 'fallback-2', name: 'Cleaning', slug: 'cleaning', description: 'Deep home cleaning services', basePrice: 999 },
  { _id: 'fallback-3', name: 'Electrical', slug: 'electrical', description: 'Electrical repairs & wiring', basePrice: 199 },
  { _id: 'fallback-4', name: 'Plumbing', slug: 'plumbing', description: 'Plumbing and water works', basePrice: 299 },
  { _id: 'fallback-5', name: 'Painting', slug: 'painting', description: 'Home painting & touchups', basePrice: 1499 },
  { _id: 'fallback-6', name: 'Carpenter', slug: 'carpenter', description: 'Furniture & wood works', basePrice: 349 },
  { _id: 'fallback-7', name: 'Pest Control', slug: 'pest-control', description: 'Complete pest management', basePrice: 799 },
  { _id: 'fallback-8', name: 'Refrigerator', slug: 'refrigerator-repair', description: 'Fridge & appliance repair', basePrice: 399 },
];

export default function ServiceCategories() {
  const scroller = useRef(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
  const { data: apiCategories = [], isLoading, isError } = useListCategoriesQuery();
  
  // Guarantee 8 categories display perfectly on the homepage even if DB is empty
  const categories = apiCategories.length >= 8 ? apiCategories : FALLBACK_CATEGORIES;

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
                <SafeImage src={image} fallbackSrc={image} alt={`${cat.name} service`} />
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
